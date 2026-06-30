const translations = {
  en: {
    pageTitle: "Surround Auto | Repair, Booking & Shop",
    metaDescription: "Book Surround Auto services and create online Stripe payments for workshop items.",
    navShop: "Shop",
    navServices: "Services",
    navBooking: "Booking",
    navContact: "Contact",
    heroImageAlt: "Modern auto repair workshop and paint work area",
    heroEyebrow: "Book your next service",
    heroTitle: "Surround Auto Booking Centre",
    heroCopy:
      "Mechanical repairs, vehicle checks, body paint and refinishing work, with a separate online payment shop.",
    heroPrimary: "Book now",
    heroSecondary: "View services",
    quickOneTitle: "2 service streams",
    quickOneText: "Mechanical repairs / Panel & paint",
    quickTwoTitle: "Flexible online payment",
    quickTwoText: "Flexible online payment",
    quickThreeTitle: "Clear triage",
    quickThreeText: "Choose the right team for your vehicle issue",
    shopEyebrow: "Shop",
    shopTitle: "Online service payments",
    shopIntro:
      "Flexible online payment for inspections, servicing and workshop items.",
    shopQuantityLabel: "Quantity",
    shopBuyButton: "Pay with Stripe",
    shopLoading: "Loading shop items...",
    shopEmpty: "No shop items are configured yet.",
    shopLocalOnly: "Open the localhost booking site to use online payment.",
    shopCreating: "Creating checkout...",
    shopReady: "Stripe checkout is ready. Redirecting now.",
    shopNotConfigured: "Stripe is not configured yet for this item.",
    shopError: "Checkout could not be created right now.",
    servicesEyebrow: "Services",
    servicesTitle: "Choose the work you need",
    mechanicalTitle: "Mechanical repairs",
    mechanicalCopy:
      "For servicing, engine issues, brakes, suspension, diagnostics, pre-WOF checks and general repair bookings.",
    mechanicalButton: "Book mechanical repairs",
    paintTitle: "Panel & paint work",
    paintCopy:
      "For scratch repair, panel paint, bumper refinishing, body repairs and exterior refresh bookings.",
    paintButton: "Book panel & paint work",
    bookingEyebrow: "Appointment",
    bookingTitle: "Enter your booking details",
    bookingIntro:
      "Select a service type, then leave your vehicle and contact details. The system will route your request to the correct team.",
    bookingNoteTitle: "Helpful details",
    bookingNoteText: "Plate number, vehicle model, issue description and preferred date.",
    serviceTypeLabel: "Service type",
    mechanicalShort: "Mechanical repairs",
    paintShort: "Panel & paint",
    nameLabel: "Name",
    phoneLabel: "Phone",
    emailLabel: "Email",
    dateLabel: "Preferred date",
    vehicleLabel: "Vehicle",
    plateLabel: "Plate number",
    detailsLabel: "Issue details",
    namePlaceholder: "e.g. Chen",
    phonePlaceholder: "e.g. 021 000 0000",
    vehiclePlaceholder: "e.g. Toyota Aqua 2016",
    platePlaceholder: "e.g. ABC123",
    detailsPlaceholder: "Briefly describe the issue, damage location or work you want done",
    submitButton: "Submit booking",
    submittingButton: "Sending...",
    privacyNote:
      "Bookings are routed to the correct Surround Auto team when this site is opened through the booking server.",
    confirmationEyebrow: "Request received",
    confirmationTitle: "Booking summary",
    newBookingButton: "Start again",
    contactEyebrow: "Contact",
    contactPhone: "Phone: 021 000 0000",
    contactAddress: "Address: 17 Epsom Road, Sockburn, Christchurch",
    contactHours: "Hours: Mon-Sat 9:00-17:00",
    localOnly:
      "This page is open as a local file. Open the booking server URL to send emails.",
    savedNoEmail: ({ recipient }) =>
      `Saved locally. Configure the email provider to send this request to ${recipient}.`,
    emailSent: ({ recipient }) => `Sent to ${recipient}.`,
    emailFailed: ({ recipient }) =>
      `Saved locally, but email sending failed. Please check the server setup for ${recipient}.`,
    emailFailedWithReason: ({ recipient, reason }) =>
      `Saved locally, but email sending failed for ${recipient}. Reason: ${reason}`,
    submitFailed:
      "The booking could not be sent right now. Please try again or contact Surround Auto directly.",
    summary: ({ name, service, vehicle, date, phone, bookingId }) => {
      const prefix = bookingId ? `Booking ${bookingId}: ` : "";
      return `${prefix}${name}, your ${service} request has been recorded for ${vehicle} on ${date}. We will contact you at ${phone} to confirm the exact time.`;
    },
    services: {
      mechanical: "mechanical repairs",
      paint: "panel & paint work",
    },
  },
  zh: {
    pageTitle: "Surround Auto | 预约与支付",
    metaDescription: "Surround Auto 预约网页与在线 Stripe 支付商品区。",
    navShop: "购物",
    navServices: "服务",
    navBooking: "预约",
    navContact: "联系",
    heroImageAlt: "现代汽车维修车间和油漆工作区域",
    heroEyebrow: "预约你的下一次服务",
    heroTitle: "Surround Auto 汽车预约中心",
    heroCopy: "机械修理、车辆检查、车身油漆与补漆工作，另加独立的在线支付商品区。",
    heroPrimary: "立即预约",
    heroSecondary: "查看服务",
    quickOneTitle: "2 条服务线",
    quickOneText: "机械修理 / 喷漆钣金",
    quickTwoTitle: "灵活在线支付",
    quickTwoText: "灵活在线支付",
    quickThreeTitle: "清晰分流",
    quickThreeText: "按车辆问题安排合适工作",
    shopEyebrow: "购物",
    shopTitle: "在线服务支付",
    shopIntro: "用于检查、保养和其他车间项目的灵活在线支付。",
    shopQuantityLabel: "数量",
    shopBuyButton: "前往 Stripe 支付",
    shopLoading: "正在载入商品...",
    shopEmpty: "目前还没有配置商品。",
    shopLocalOnly: "请打开 localhost 版本网站使用在线支付。",
    shopCreating: "正在创建支付链接...",
    shopReady: "Stripe 支付链接已准备好，正在跳转。",
    shopNotConfigured: "这个商品的 Stripe 支付还没配置好。",
    shopError: "暂时无法创建支付链接。",
    servicesEyebrow: "服务",
    servicesTitle: "选择你需要的工作类型",
    mechanicalTitle: "机械修理",
    mechanicalCopy: "适合车辆保养、发动机异常、刹车、悬挂、诊断检查、WOF 前检查等维修预约。",
    mechanicalButton: "预约机械修理",
    paintTitle: "喷漆钣金",
    paintCopy: "适合刮痕修复、局部补漆、保险杠喷漆、车身面板修复、整车外观翻新等预约。",
    paintButton: "预约喷漆钣金",
    bookingEyebrow: "预约",
    bookingTitle: "填写预约信息",
    bookingIntro: "先选择服务类别，再留下车辆和联系方式。系统会把预约发送给对应团队。",
    bookingNoteTitle: "建议填写",
    bookingNoteText: "车牌、车型、问题描述、理想日期。",
    serviceTypeLabel: "服务类别",
    mechanicalShort: "机械修理",
    paintShort: "喷漆钣金",
    nameLabel: "姓名",
    phoneLabel: "电话",
    emailLabel: "邮箱",
    dateLabel: "预约日期",
    vehicleLabel: "车辆信息",
    plateLabel: "车牌",
    detailsLabel: "问题描述",
    namePlaceholder: "例如：Chen",
    phonePlaceholder: "例如：021 000 0000",
    vehiclePlaceholder: "例如：Toyota Aqua 2016",
    platePlaceholder: "例如：ABC123",
    detailsPlaceholder: "简单描述车辆问题、损伤位置或你想做的工作",
    submitButton: "提交预约",
    submittingButton: "正在发送...",
    privacyNote: "通过预约服务器打开网站后，预约会自动发送给 Surround Auto 对应团队。",
    confirmationEyebrow: "已收到请求",
    confirmationTitle: "预约摘要",
    newBookingButton: "重新填写",
    contactEyebrow: "联系",
    contactPhone: "电话：021 000 0000",
    contactAddress: "地址：17 Epsom Road, Sockburn, Christchurch",
    contactHours: "营业时间：Mon-Sat 9:00-17:00",
    localOnly: "当前是本地文件打开。请用预约服务器地址打开，才能发送邮件。",
    savedNoEmail: ({ recipient }) => `预约已本地保存。配置邮件服务后会发送到 ${recipient}。`,
    emailSent: ({ recipient }) => `预约已发送到 ${recipient}。`,
    emailFailed: ({ recipient }) => `预约已本地保存，但邮件发送失败。请检查 ${recipient} 的服务器设置。`,
    emailFailedWithReason: ({ recipient, reason }) =>
      `预约已本地保存，但邮件发送失败。原因：${reason}。请检查 ${recipient} 的邮件设置。`,
    submitFailed: "预约暂时无法发送。请重试，或直接联系 Surround Auto。",
    summary: ({ name, service, vehicle, date, phone, bookingId }) => {
      const prefix = bookingId ? `预约号 ${bookingId}：` : "";
      return `${prefix}${name}，你的${service}预约已记录：${vehicle}，期望日期 ${date}。我们会通过 ${phone} 联系你确认具体时间。`;
    },
    services: {
      mechanical: "机械修理",
      paint: "喷漆钣金",
    },
  },
};

const bookingForm = document.querySelector("#bookingForm");
const confirmation = document.querySelector("#confirmation");
const summaryText = document.querySelector("#summaryText");
const deliveryText = document.querySelector("#deliveryText");
const newBooking = document.querySelector("#newBooking");
const serviceButtons = document.querySelectorAll(".service-select");
const languageToggle = document.querySelector("#languageToggle");
const toggleOptions = document.querySelectorAll("[data-lang-label]");
const descriptionMeta = document.querySelector('meta[name="description"]');
const submitButton = bookingForm.querySelector(".submit-button");
const shopGrid = document.querySelector("#shopGrid");

let currentLanguage = "en";
let shopCatalog = [];

const getDictionary = () => translations[currentLanguage];

const buildSummary = (payload) => {
  const dictionary = getDictionary();
  return dictionary.summary({
    ...payload,
    service: dictionary.services[payload.serviceKey],
  });
};

const buildDeliveryMessage = (payload) => {
  const dictionary = getDictionary();
  const recipient =
    payload.recipientEmail || (payload.serviceKey === "paint" ? "Panel@surroundauto.co.nz" : "info@surroundauto.co.nz");

  if (payload.submitFailed) return dictionary.submitFailed;
  if (payload.localOnly) return dictionary.localOnly;
  if (payload.emailStatus === "sent") return dictionary.emailSent({ recipient });
  if (payload.emailStatus === "failed" && payload.emailError) {
    return dictionary.emailFailedWithReason({ recipient, reason: payload.emailError });
  }
  if (payload.emailStatus === "failed") return dictionary.emailFailed({ recipient });
  return dictionary.savedNoEmail({ recipient });
};

const updateConfirmation = () => {
  if (confirmation.hidden || !summaryText.dataset.summaryPayload) return;

  const payload = JSON.parse(summaryText.dataset.summaryPayload);
  summaryText.textContent = buildSummary(payload);
  deliveryText.textContent = buildDeliveryMessage(payload);
};

const renderShop = () => {
  const dictionary = getDictionary();

  if (!shopCatalog.length) {
    shopGrid.innerHTML = `<article class="shop-card"><p class="shop-description">${dictionary.shopEmpty}</p></article>`;
    return;
  }

  shopGrid.innerHTML = shopCatalog
    .map((item) => {
      const description = currentLanguage === "zh" ? item.descriptionZh : item.description;
      const name = currentLanguage === "zh" ? item.nameZh : item.name;

      return `
        <article class="shop-card" data-product-id="${item.id}">
          <div class="shop-card-head">
            <div>
              <span class="shop-chip">${item.category}</span>
              <h3>${name}</h3>
            </div>
            <p class="shop-price">
              ${currentLanguage === "zh" ? item.priceLabelZh || item.priceLabel : item.priceLabel}
              <span>${currentLanguage === "zh" ? item.noteZh || item.note : item.note}</span>
            </p>
          </div>
          <p class="shop-description">${description}</p>
          <div class="shop-controls">
            <div class="shop-quantity">
              <label for="qty-${item.id}">${dictionary.shopQuantityLabel}</label>
              <input
                id="qty-${item.id}"
                class="shop-qty-input"
                type="number"
                min="${item.minQuantity}"
                step="1"
                value="${item.defaultQuantity}"
              />
            </div>
            <button class="button primary shop-button" type="button" data-shop-buy="${item.id}">
              ${dictionary.shopBuyButton}
            </button>
          </div>
          <p class="shop-note">${currentLanguage === "zh" ? item.helperZh || item.helper : item.helper}</p>
          <p class="shop-status" id="shop-status-${item.id}"></p>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll("[data-shop-buy]").forEach((button) => {
    button.addEventListener("click", () => handleShopCheckout(button.dataset.shopBuy));
  });
};

const setLanguage = (language) => {
  currentLanguage = language;
  const dictionary = getDictionary();

  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.title = dictionary.pageTitle;
  descriptionMeta.setAttribute("content", dictionary.metaDescription);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = dictionary[element.dataset.i18n];
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    element.dataset.i18nAttr.split(",").forEach((pair) => {
      const [attribute, key] = pair.split(":");
      element.setAttribute(attribute.trim(), dictionary[key.trim()]);
    });
  });

  toggleOptions.forEach((option) => {
    option.classList.toggle("active", option.dataset.langLabel === language);
  });

  languageToggle.setAttribute("aria-pressed", String(language === "zh"));
  renderShop();
  updateConfirmation();
};

const setService = (service) => {
  const input = document.querySelector(`input[name="serviceType"][value="${service}"]`);
  if (input) input.checked = true;
  document.querySelector("#booking").scrollIntoView({ behavior: "smooth", block: "start" });
};

const getFormPayload = () => {
  const formData = new FormData(bookingForm);
  return {
    name: String(formData.get("name") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    preferredDate: String(formData.get("date") || "").trim(),
    vehicle: String(formData.get("vehicle") || "").trim(),
    plate: String(formData.get("plate") || "").trim(),
    details: String(formData.get("details") || "").trim(),
    serviceKey: String(formData.get("serviceType") || "mechanical"),
    language: currentLanguage,
  };
};

const showConfirmation = (payload) => {
  summaryText.dataset.summaryPayload = JSON.stringify(payload);
  summaryText.textContent = buildSummary(payload);
  deliveryText.textContent = buildDeliveryMessage(payload);
  confirmation.hidden = false;
  confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
};

const submitToServer = async (payload) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Booking request failed");
    return result;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const loadShopCatalog = async () => {
  const dictionary = getDictionary();
  shopGrid.innerHTML = `<article class="shop-card"><p class="shop-description">${dictionary.shopLoading}</p></article>`;

  if (window.location.protocol === "file:") {
    shopGrid.innerHTML = `<article class="shop-card"><p class="shop-description">${dictionary.shopLocalOnly}</p></article>`;
    return;
  }

  try {
    const response = await fetch("/api/shop-catalog");
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Catalog failed");
    shopCatalog = result.items || [];
    renderShop();
  } catch {
    shopGrid.innerHTML = `<article class="shop-card"><p class="shop-description">${dictionary.shopError}</p></article>`;
  }
};

const setShopStatus = (productId, message, isError = false) => {
  const target = document.querySelector(`#shop-status-${productId}`);
  if (!target) return;
  target.textContent = message;
  target.classList.toggle("error", isError);
};

const handleShopCheckout = async (productId) => {
  const dictionary = getDictionary();
  const button = document.querySelector(`[data-shop-buy="${productId}"]`);
  const qtyInput = document.querySelector(`#qty-${productId}`);
  const product = shopCatalog.find((item) => item.id === productId);
  if (!button || !qtyInput || !product) return;

  const quantity = Math.max(product.minQuantity, Number(qtyInput.value || product.defaultQuantity));
  qtyInput.value = String(quantity);

  if (window.location.protocol === "file:") {
    setShopStatus(productId, dictionary.shopLocalOnly, true);
    return;
  }

  button.disabled = true;
  setShopStatus(productId, dictionary.shopCreating, false);

  try {
    const response = await fetch("/api/shop-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        quantity,
        language: currentLanguage,
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Checkout failed");

    if (result.status === "ready" && result.checkoutUrl) {
      setShopStatus(productId, dictionary.shopReady, false);
      window.location.href = result.checkoutUrl;
      return;
    }

    setShopStatus(productId, dictionary.shopNotConfigured, true);
  } catch {
    setShopStatus(productId, dictionary.shopError, true);
  } finally {
    button.disabled = false;
  }
};

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => setService(button.dataset.service));
});

languageToggle.addEventListener("click", () => {
  setLanguage(currentLanguage === "en" ? "zh" : "en");
});

bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const dictionary = getDictionary();
  const payload = getFormPayload();
  const date = payload.preferredDate;

  submitButton.disabled = true;
  submitButton.textContent = dictionary.submittingButton;

  try {
    if (window.location.protocol === "file:") {
      showConfirmation({
        ...payload,
        date,
        localOnly: true,
        emailStatus: "not_configured",
      });
      return;
    }

    const result = await submitToServer(payload);
    showConfirmation({
      ...payload,
      date,
      bookingId: result.bookingId,
      recipientEmail: result.recipientEmail,
      emailStatus: result.emailStatus,
      emailError: result.emailError,
    });
  } catch {
    showConfirmation({
      ...payload,
      date,
      submitFailed: true,
      emailStatus: "failed",
    });
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = getDictionary().submitButton;
  }
});

newBooking.addEventListener("click", () => {
  confirmation.hidden = true;
  delete summaryText.dataset.summaryPayload;
  deliveryText.textContent = "";
  bookingForm.reset();
  document.querySelector("#booking").scrollIntoView({ behavior: "smooth", block: "start" });
});

setLanguage("en");
loadShopCatalog();
