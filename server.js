const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const fsSync = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const nodemailer = require("nodemailer");

const rootDir = __dirname;
const dataDir = path.join(rootDir, "data");
const bookingsFile = path.join(dataDir, "bookings.jsonl");
const paymentsFile = path.join(dataDir, "payments.jsonl");
const productsFile = path.join(rootDir, "products.json");
const maxPhotoCount = 5;
const maxPhotoBytes = 15 * 1024 * 1024;
const maxRequestBytes = 18 * 1024 * 1024;
const allowedPhotoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const loadDotEnv = () => {
  const envPath = path.join(rootDir, ".env");
  if (!fsSync.existsSync(envPath)) return;

  const lines = fsSync.readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  });
};

loadDotEnv();

const config = {
  port: Number(process.env.PORT || 4173),
  siteBaseUrl: process.env.SITE_BASE_URL || "http://localhost:4173",
  fromEmail: process.env.FROM_EMAIL || "",
  resendApiKey: process.env.RESEND_API_KEY || "",
  gmailUser: process.env.GMAIL_USER || "",
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD || "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  stripeCurrency: (process.env.BOOKING_CURRENCY || "nzd").toLowerCase(),
  recipients: {
    mechanical: process.env.MECHANICAL_EMAIL || "info@surroundauto.co.nz",
    paint: process.env.PAINT_EMAIL || "Panel@surroundauto.co.nz",
  },
};

const serviceLabels = {
  mechanical: "Mechanical repairs",
  paint: "Panel & paint work",
};

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
};

const readRawBody = (req, maxBytes = 1_000_000) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        req.destroy();
        reject(new Error("Request body is too large"));
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

const readBody = async (req, maxBytes) => (await readRawBody(req, maxBytes)).toString("utf8");

const safeText = (value, maxLength = 2000) => String(value || "").trim().slice(0, maxLength);
const safeErrorMessage = (error) =>
  safeText(error.response || error.message || "Email provider rejected the message", 240);
const safeFileName = (value) => {
  const fileName = path.basename(String(value || "vehicle-photo").replaceAll("\\", "/"));
  return fileName.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 120) || "vehicle-photo";
};

const makeBookingId = () => {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `SA-${date}-${suffix}`;
};

const appendJsonLine = async (filePath, payload) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.appendFile(filePath, `${JSON.stringify(payload)}\n`, "utf8");
};

const loadProducts = async () => {
  const raw = await fs.readFile(productsFile, "utf8");
  return JSON.parse(raw);
};

const parseMultipartForm = async (req) => {
  const contentType = req.headers["content-type"] || "";
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) {
    const error = new Error("Missing multipart boundary");
    error.statusCode = 400;
    throw error;
  }

  const boundary = Buffer.from(`--${boundaryMatch[1] || boundaryMatch[2]}`);
  const body = await readRawBody(req, maxRequestBytes);
  const fields = {};
  const files = [];
  let cursor = 0;

  while (cursor < body.length) {
    const boundaryIndex = body.indexOf(boundary, cursor);
    if (boundaryIndex === -1) break;

    const nextByte = body[boundaryIndex + boundary.length];
    const afterBoundary = boundaryIndex + boundary.length;
    if (nextByte === 45 && body[afterBoundary + 1] === 45) break;

    let partStart = afterBoundary;
    if (body[partStart] === 13 && body[partStart + 1] === 10) partStart += 2;

    const headerEnd = body.indexOf(Buffer.from("\r\n\r\n"), partStart);
    if (headerEnd === -1) break;

    const headerText = body.slice(partStart, headerEnd).toString("utf8");
    const partEnd = body.indexOf(boundary, headerEnd + 4);
    if (partEnd === -1) break;

    let content = body.slice(headerEnd + 4, partEnd);
    if (content.length >= 2 && content[content.length - 2] === 13 && content[content.length - 1] === 10) {
      content = content.slice(0, -2);
    }

    const disposition = headerText.match(/content-disposition:\s*form-data;([^\r\n]*)/i)?.[1] || "";
    const name = disposition.match(/name="([^"]+)"/i)?.[1] || "";
    const fileName = disposition.match(/filename="([^"]*)"/i)?.[1] || "";
    const mimeType = headerText.match(/content-type:\s*([^\r\n]+)/i)?.[1]?.trim() || "application/octet-stream";

    if (name && fileName) {
      files.push({
        fieldName: name,
        fileName: safeFileName(fileName),
        mimeType,
        content,
      });
    } else if (name) {
      fields[name] = content.toString("utf8");
    }

    cursor = partEnd;
  }

  return { fields, files };
};

const normalizeBookingPayload = (payload) => ({
  ...payload,
  serviceKey: payload.serviceKey || payload.serviceType,
  preferredDate: payload.preferredDate || payload.date,
});

const validatePhotoAttachments = (files) => {
  const photos = files.filter((file) => file.fieldName === "photos" && file.content.length > 0);
  const totalBytes = photos.reduce((sum, file) => sum + file.content.length, 0);

  if (photos.length > maxPhotoCount) {
    const error = new Error(`Please upload no more than ${maxPhotoCount} photos`);
    error.statusCode = 400;
    throw error;
  }

  if (totalBytes > maxPhotoBytes) {
    const error = new Error("Photo uploads must be 15MB total or less");
    error.statusCode = 400;
    throw error;
  }

  const invalid = photos.find((file) => !allowedPhotoTypes.has(file.mimeType));
  if (invalid) {
    const error = new Error("Only JPG, PNG and WebP photos are supported");
    error.statusCode = 400;
    throw error;
  }

  return photos;
};

const validateBooking = (payload) => {
  const normalizedPayload = normalizeBookingPayload(payload);
  const serviceKey = normalizedPayload.serviceKey === "paint" ? "paint" : "mechanical";
  const booking = {
    id: makeBookingId(),
    createdAt: new Date().toISOString(),
    serviceKey,
    serviceLabel: serviceLabels[serviceKey],
    recipientEmail: config.recipients[serviceKey],
    name: safeText(normalizedPayload.name, 120),
    phone: safeText(normalizedPayload.phone, 80),
    email: safeText(normalizedPayload.email, 160),
    preferredDate: safeText(normalizedPayload.preferredDate, 40),
    vehicle: safeText(normalizedPayload.vehicle, 180),
    plate: safeText(normalizedPayload.plate, 40),
    details: safeText(normalizedPayload.details, 4000),
    language: normalizedPayload.language === "zh" ? "zh" : "en",
    attachments: [],
  };

  const missingFields = [];
  ["name", "phone", "preferredDate", "vehicle", "details"].forEach((field) => {
    if (!booking[field]) missingFields.push(field);
  });

  if (missingFields.length) {
    const error = new Error(`Missing required fields: ${missingFields.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }

  return booking;
};

const escapeHtml = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatBookingHtml = (booking) => `
  <h2>New Surround Auto booking</h2>
  <p><strong>Booking ID:</strong> ${escapeHtml(booking.id)}</p>
  <p><strong>Service:</strong> ${escapeHtml(booking.serviceLabel)}</p>
  <p><strong>Name:</strong> ${escapeHtml(booking.name)}</p>
  <p><strong>Phone:</strong> ${escapeHtml(booking.phone)}</p>
  <p><strong>Email:</strong> ${escapeHtml(booking.email || "Not provided")}</p>
  <p><strong>Preferred date:</strong> ${escapeHtml(booking.preferredDate)}</p>
  <p><strong>Vehicle:</strong> ${escapeHtml(booking.vehicle)}</p>
  <p><strong>Plate:</strong> ${escapeHtml(booking.plate || "Not provided")}</p>
  <p><strong>Photos:</strong> ${
    booking.attachments.length
      ? booking.attachments.map((file) => escapeHtml(file.fileName)).join(", ")
      : "Not provided"
  }</p>
  <p><strong>Details:</strong></p>
  <p>${escapeHtml(booking.details).replaceAll("\n", "<br>")}</p>
`;

const formatBookingText = (booking) => {
  const photoNames = booking.attachments.map((file) => file.fileName).join(", ") || "Not provided";
  return [
    "New Surround Auto booking",
    `Booking ID: ${booking.id}`,
    `Service: ${booking.serviceLabel}`,
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email || "Not provided"}`,
    `Preferred date: ${booking.preferredDate}`,
    `Vehicle: ${booking.vehicle}`,
    `Plate: ${booking.plate || "Not provided"}`,
    `Photos: ${photoNames}`,
    "",
    "Details:",
    booking.details,
  ].join("\n");
};

const formatResendAttachments = (booking) =>
  booking.attachments.map((file) => ({
    filename: file.fileName,
    content: file.content.toString("base64"),
    content_type: file.mimeType,
  }));

const formatNodemailerAttachments = (booking) =>
  booking.attachments.map((file) => ({
    filename: file.fileName,
    content: file.content,
    contentType: file.mimeType,
  }));

const sendBookingEmail = async (booking) => {
  if (config.resendApiKey) {
    if (!config.fromEmail) {
      throw new Error("Resend is configured but FROM_EMAIL is missing");
    }

    const emailPayload = {
      from: config.fromEmail,
      to: [booking.recipientEmail],
      reply_to: booking.email || undefined,
      subject: `Surround Auto booking ${booking.id} - ${booking.serviceLabel}`,
      html: formatBookingHtml(booking),
      text: formatBookingText(booking),
    };

    if (booking.attachments.length) {
      emailPayload.attachments = formatResendAttachments(booking);
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Email provider error: ${details}`);
    }

    return "sent";
  }

  if (!config.gmailUser || !config.gmailAppPassword) return "not_configured";

  const message = {
    from: config.fromEmail || config.gmailUser,
    to: booking.recipientEmail,
    replyTo: booking.email || undefined,
    subject: `Surround Auto booking ${booking.id} - ${booking.serviceLabel}`,
    html: formatBookingHtml(booking),
    text: formatBookingText(booking),
    attachments: formatNodemailerAttachments(booking),
  };

  const createGmailTransport = (port, secure) =>
    nodemailer.createTransport({
      host: "smtp.gmail.com",
      port,
      secure,
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
      auth: {
        user: config.gmailUser,
        pass: config.gmailAppPassword,
      },
    });

  try {
    await createGmailTransport(587, false).sendMail(message);
  } catch (error) {
    if (error.code !== "ETIMEDOUT" && error.code !== "ESOCKET") throw error;
    await createGmailTransport(465, true).sendMail(message);
  }

  return "sent";
};

const createStripeCheckout = async (product, quantity, language) => {
  if (!config.stripeSecretKey) return { status: "not_configured" };

  const productName = language === "zh" ? product.nameZh : product.name;
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("payment_method_types[0]", "card");
  params.set("line_items[0][price_data][currency]", config.stripeCurrency);
  params.set("line_items[0][price_data][product_data][name]", productName);
  params.set("line_items[0][price_data][product_data][description]", product.description);
  params.set("line_items[0][price_data][unit_amount]", String(product.unitAmountCents));
  params.set("line_items[0][quantity]", String(quantity));
  params.set("metadata[product_id]", product.id);
  params.set("metadata[product_name]", product.name);
  params.set("metadata[quantity]", String(quantity));
  params.set("success_url", `${config.siteBaseUrl}/?payment=success&product=${encodeURIComponent(product.id)}`);
  params.set("cancel_url", `${config.siteBaseUrl}/?payment=cancelled&product=${encodeURIComponent(product.id)}`);

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || "Stripe checkout failed");
  }

  await appendJsonLine(paymentsFile, {
    createdAt: new Date().toISOString(),
    kind: "checkout_created",
    productId: product.id,
    quantity,
    checkoutSessionId: payload.id,
    checkoutUrl: payload.url,
  });

  return {
    status: "ready",
    checkoutUrl: payload.url,
    checkoutSessionId: payload.id,
  };
};

const handleBooking = async (req, res) => {
  try {
    const contentType = req.headers["content-type"] || "";
    const parsedRequest = contentType.startsWith("multipart/form-data")
      ? await parseMultipartForm(req)
      : { fields: JSON.parse((await readBody(req)) || "{}"), files: [] };
    const payload = parsedRequest.fields;
    const booking = validateBooking(payload);
    const photoAttachments = validatePhotoAttachments(parsedRequest.files);
    booking.attachments = photoAttachments;

    let emailStatus = "not_configured";
    try {
      emailStatus = await sendBookingEmail(booking);
    } catch (error) {
      emailStatus = "failed";
      booking.emailError = safeErrorMessage(error);
      console.error("Booking email failed", {
        bookingId: booking.id,
        recipientEmail: booking.recipientEmail,
        message: booking.emailError,
        code: error.code,
        command: error.command,
        response: error.response,
      });
    }

    await appendJsonLine(bookingsFile, {
      ...booking,
      attachments: photoAttachments.map((file) => ({
        fileName: file.fileName,
        mimeType: file.mimeType,
        size: file.content.length,
      })),
      emailStatus,
    });

    sendJson(res, 200, {
      ok: true,
      bookingId: booking.id,
      recipientEmail: booking.recipientEmail,
      emailStatus,
      emailError: booking.emailError || "",
    });
  } catch (error) {
    sendJson(res, error.statusCode || 500, {
      ok: false,
      error: error.message || "Booking request failed",
    });
  }
};

const handleShopCatalog = async (res) => {
  try {
    const items = await loadProducts();
    sendJson(res, 200, { ok: true, items });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || "Catalog load failed" });
  }
};

const handleShopCheckout = async (req, res) => {
  try {
    const rawBody = await readBody(req);
    const payload = rawBody ? JSON.parse(rawBody) : {};
    const items = await loadProducts();
    const product = items.find((item) => item.id === payload.productId);

    if (!product) {
      const error = new Error("Unknown product");
      error.statusCode = 404;
      throw error;
    }

    const quantity = Math.max(Number(product.minQuantity || 1), Number(payload.quantity || product.defaultQuantity || 1));
    const payment = await createStripeCheckout(product, quantity, payload.language === "zh" ? "zh" : "en");

    sendJson(res, 200, {
      ok: true,
      productId: product.id,
      quantity,
      ...payment,
    });
  } catch (error) {
    sendJson(res, error.statusCode || 500, {
      ok: false,
      error: error.message || "Checkout failed",
    });
  }
};

const verifyStripeSignature = (rawBody, signatureHeader) => {
  if (!config.stripeWebhookSecret || !signatureHeader) return false;
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key, value];
    }),
  );

  if (!parts.t || !parts.v1) return false;

  const signedPayload = `${parts.t}.${rawBody}`;
  const expected = crypto.createHmac("sha256", config.stripeWebhookSecret).update(signedPayload, "utf8").digest("hex");

  if (expected.length !== parts.v1.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
};

const handleStripeWebhook = async (req, res) => {
  const rawBody = await readBody(req);

  if (!verifyStripeSignature(rawBody, req.headers["stripe-signature"])) {
    return sendJson(res, 400, { ok: false, error: "Invalid Stripe signature" });
  }

  const event = JSON.parse(rawBody);
  await appendJsonLine(paymentsFile, {
    receivedAt: new Date().toISOString(),
    kind: "webhook",
    type: event.type,
    id: event.id,
    productId: event.data?.object?.metadata?.product_id || "",
    bookingId: event.data?.object?.metadata?.booking_id || "",
    checkoutSessionId: event.data?.object?.id || "",
    amountTotal: event.data?.object?.amount_total || 0,
    currency: event.data?.object?.currency || "",
    paymentStatus: event.data?.object?.payment_status || "",
  });

  sendJson(res, 200, { ok: true });
};

const serveStatic = async (req, res) => {
  const requestUrl = new URL(req.url, config.siteBaseUrl);
  const cleanPath = decodeURIComponent(requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname);
  const filePath = path.normalize(path.join(rootDir, cleanPath));

  if (!filePath.startsWith(rootDir)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  try {
    const file = await fs.readFile(filePath);
    res.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
    });
    res.end(file);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
};

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/bookings") return handleBooking(req, res);
  if (req.method === "GET" && req.url === "/api/shop-catalog") return handleShopCatalog(res);
  if (req.method === "POST" && req.url === "/api/shop-checkout") return handleShopCheckout(req, res);
  if (req.method === "POST" && req.url === "/api/stripe-webhook") return handleStripeWebhook(req, res);
  if (req.method === "GET" || req.method === "HEAD") return serveStatic(req, res);

  sendJson(res, 405, { ok: false, error: "Method not allowed" });
});

server.listen(config.port, () => {
  console.log(`Surround Auto booking server running at http://localhost:${config.port}`);
});
