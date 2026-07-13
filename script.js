const WA_NUMBER = "77059164337";
const INTAKE_API_URL = "https://furniture-orders-mvp.pages.dev/api/orders";

const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelectorAll(".nav a");

function syncHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  document.body.classList.toggle("menu-locked", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("menu-open");
    document.body.classList.remove("menu-locked");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (event) => {
  if (header.classList.contains("menu-open") && !header.contains(event.target)) {
    header.classList.remove("menu-open");
    document.body.classList.remove("menu-locked");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

const heroMedia = document.querySelector(".hero-media");
if (heroMedia) {
  window.addEventListener("load", () => heroMedia.classList.add("loaded"));
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const contactSection = document.getElementById("contact");
if (contactSection) {
  const contactObserver = new IntersectionObserver(
    ([entry]) => {
      document.body.classList.toggle("contact-active", entry.isIntersecting);
    },
    { threshold: 0.18 }
  );
  contactObserver.observe(contactSection);
}

const heroSection = document.querySelector(".hero");
if (heroSection) {
  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      document.body.classList.toggle("hero-active", entry.isIntersecting);
    },
    { threshold: 0.42 }
  );
  heroObserver.observe(heroSection);
}

function formatKzPhone(value) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (!digits.startsWith("7") && digits.length > 0) digits = "7" + digits;
  digits = digits.slice(0, 11);

  let formatted = "";
  if (digits.length > 0) formatted = "+" + digits.slice(0, 1);
  if (digits.length > 1) formatted += " (" + digits.slice(1, 4);
  if (digits.length >= 4) formatted += ")";
  if (digits.length > 4) formatted += " " + digits.slice(4, 7);
  if (digits.length > 7) formatted += "-" + digits.slice(7, 9);
  if (digits.length > 9) formatted += "-" + digits.slice(9, 11);
  return formatted;
}

function isValidPhone(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("7");
}

function openWhatsApp(message) {
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}

function compactLines(lines) {
  return lines.filter(Boolean).join("\n");
}

async function submitLeadToIntake({ name, phone, furnitureType, description }) {
  const payload = {
    name: name || "Клиент Salamat Mebel",
    phone,
    source: "salamat-mebel.kz",
    city: "Алматы",
    furnitureType: furnitureType || "",
    description: description || ""
  };

  try {
    const response = await fetch(INTAKE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Intake API request failed");
    }

    return { ok: true, orderId: result.orderId };
  } catch (error) {
    console.warn("Lead was not saved to intake API", error);
    return { ok: false };
  }
}

const leadForm = document.getElementById("leadForm");
const phoneInput = document.getElementById("phone");
const phoneError = document.getElementById("phoneError");
const submitBtn = document.getElementById("submitBtn");
const formSuccess = document.getElementById("formSuccess");
const serviceSelect = document.getElementById("service");
const styleSelect = document.getElementById("style");
const dimensionsInput = document.getElementById("dimensions");
const stageSelect = document.getElementById("stage");
const messageInput = document.getElementById("message");
const leadSummary = document.getElementById("leadSummary");
const briefProgress = document.querySelectorAll(".brief-progress span");
const quickForms = document.querySelectorAll("[data-quick-form]");
const floatingLeadToggle = document.getElementById("floatingLeadToggle");
const mobileLeadToggle = document.getElementById("mobileLeadToggle");
const floatingLeadPanel = document.getElementById("floatingLeadPanel");
const floatingLeadClose = document.getElementById("floatingLeadClose");
const floatingLeadForm = document.getElementById("floatingLeadForm");
const floatingLeadName = document.getElementById("floatingLeadName");
const floatingLeadPhone = document.getElementById("floatingLeadPhone");
const floatingLeadSubmit = document.getElementById("floatingLeadSubmit");
const floatingLeadStatus = document.getElementById("floatingLeadStatus");
const leadOpenButtons = document.querySelectorAll("[data-open-lead]");

const styleCards = document.querySelectorAll(".style-card");
const stylePreviewImage = document.getElementById("stylePreviewImage");
const stylePreviewTag = document.getElementById("stylePreviewTag");
const stylePreviewTitle = document.getElementById("stylePreviewTitle");
const stylePreviewText = document.getElementById("stylePreviewText");

function updateLeadSummary() {
  if (!leadSummary) return;
  const service = serviceSelect.value || "тип мебели не выбран";
  const style = styleSelect.value || "стиль подберем вместе";
  const dimensions = dimensionsInput.value.trim() || "размеры уточним";
  const stage = stageSelect.value || "стадия не указана";
  leadSummary.textContent = `${service}. ${style}. ${dimensions}. ${stage}.`;

  let activeStep = 0;
  if (dimensionsInput.value.trim() || stageSelect.value) activeStep = 1;
  if (isValidPhone(phoneInput.value)) activeStep = 2;

  briefProgress.forEach((step, index) => {
    step.classList.toggle("active", index === activeStep);
    step.classList.toggle("done", index < activeStep);
  });
}

function selectStyle(styleName) {
  if (!styleSelect) return;
  const selectedCard = [...styleCards].find((card) => card.dataset.style === styleName);
  styleSelect.value = styleName;
  styleCards.forEach((card) => card.classList.toggle("active", card.dataset.style === styleName));
  if (selectedCard) {
    stylePreviewImage.src = selectedCard.dataset.image;
    stylePreviewImage.alt = selectedCard.dataset.title;
    stylePreviewTag.textContent = selectedCard.dataset.style;
    stylePreviewTitle.textContent = selectedCard.dataset.title;
    stylePreviewText.textContent = selectedCard.dataset.text;
  }
  updateLeadSummary();
}

phoneInput.addEventListener("input", () => {
  phoneInput.value = formatKzPhone(phoneInput.value);
  phoneInput.classList.remove("error");
  phoneError.classList.remove("show");
  updateLeadSummary();
});

quickForms.forEach((form) => {
  const quickPhone = form.querySelector('input[name="phone"]');
  const quickSubmit = form.querySelector('button[type="submit"]');

  quickPhone.addEventListener("input", () => {
    quickPhone.value = formatKzPhone(quickPhone.value);
    quickPhone.classList.remove("error");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const phone = quickPhone.value.trim();

    if (!isValidPhone(phone)) {
      quickPhone.classList.add("error");
      quickPhone.focus();
      return;
    }

    quickSubmit.disabled = true;
    quickSubmit.textContent = "Сохраняем заявку...";
    const intakeResult = await submitLeadToIntake({
      name: "Клиент Salamat Mebel",
      phone,
      furnitureType: "Быстрый расчет",
      description: "Быстрый расчет с главной страницы. Клиент оставил телефон."
    });
    const whatsappMessage = compactLines([
      "Здравствуйте! Хочу рассчитать мебель в Salamat Mebel.",
      "",
      `Телефон: ${phone}`,
      "Расскажите подробнее о проекте в ответном сообщении."
    ]);

    quickSubmit.disabled = false;
    if (!intakeResult.ok) {
      quickSubmit.textContent = "Не сохранилось";
      window.setTimeout(() => {
        quickSubmit.textContent = "Рассчитать";
      }, 2200);
      return;
    }

    openWhatsApp(whatsappMessage);
    form.reset();
    quickSubmit.textContent = "Заявка сохранена";
    window.setTimeout(() => {
      quickSubmit.textContent = "Рассчитать";
    }, 1800);
  });
});

function openFloatingLead() {
  if (!floatingLeadPanel) return;
  if (typeof closeChat === "function") closeChat();
  floatingLeadPanel.classList.add("open");
  floatingLeadPanel.setAttribute("aria-hidden", "false");
  window.setTimeout(() => floatingLeadPhone?.focus(), 80);
}

function closeFloatingLead() {
  if (!floatingLeadPanel) return;
  floatingLeadPanel.classList.remove("open");
  floatingLeadPanel.setAttribute("aria-hidden", "true");
}

[floatingLeadToggle, mobileLeadToggle, ...leadOpenButtons].forEach((button) => {
  button?.addEventListener("click", openFloatingLead);
});

floatingLeadClose?.addEventListener("click", closeFloatingLead);

floatingLeadPhone?.addEventListener("input", () => {
  floatingLeadPhone.value = formatKzPhone(floatingLeadPhone.value);
  floatingLeadPhone.classList.remove("error");
  if (floatingLeadStatus) floatingLeadStatus.textContent = "";
});

floatingLeadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = floatingLeadName.value.trim() || "Клиент Salamat Mebel";
  const phone = floatingLeadPhone.value.trim();

  if (!isValidPhone(phone)) {
    floatingLeadPhone.classList.add("error");
    floatingLeadPhone.focus();
    if (floatingLeadStatus) floatingLeadStatus.textContent = "Проверьте номер телефона.";
    return;
  }

  floatingLeadSubmit.disabled = true;
  floatingLeadSubmit.textContent = "Сохраняем заявку...";
  if (floatingLeadStatus) floatingLeadStatus.textContent = "";

  const description = "Быстрая заявка из плавающей формы Salamat Mebel.";
  const intakeResult = await submitLeadToIntake({
    name,
    phone,
    furnitureType: "Быстрый WhatsApp-лид",
    description
  });

  if (!intakeResult.ok) {
    floatingLeadSubmit.disabled = false;
    floatingLeadSubmit.textContent = "Сохранить и открыть WhatsApp";
    if (floatingLeadStatus) {
      floatingLeadStatus.textContent = "Заявка не сохранилась. Проверьте интернет и отправьте еще раз.";
    }
    return;
  }

  const whatsappMessage = compactLines([
    "Здравствуйте! Хочу рассчитать мебель в Salamat Mebel.",
    "",
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    intakeResult.orderId ? `Заявка в системе: #${intakeResult.orderId}` : null,
    "Пишу после отправки заявки с сайта."
  ]);

  openWhatsApp(whatsappMessage);
  floatingLeadForm.reset();
  closeFloatingLead();
  floatingLeadSubmit.disabled = false;
  floatingLeadSubmit.textContent = "Сохранить и открыть WhatsApp";
});

[serviceSelect, styleSelect, dimensionsInput, stageSelect, messageInput].forEach((field) => {
  if (field) field.addEventListener("input", updateLeadSummary);
});

styleSelect.addEventListener("change", () => {
  if (styleSelect.value) selectStyle(styleSelect.value);
});

document.querySelectorAll(".option-chips button").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.closest(".option-chips").dataset.target);
    target.value = button.dataset.value;
    button.closest(".option-chips").querySelectorAll("button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    updateLeadSummary();
  });
});

styleCards.forEach((card) => {
  card.addEventListener("click", () => {
    selectStyle(card.dataset.style);
  });
});

updateLeadSummary();

leadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = phoneInput.value.trim();
  const service = serviceSelect.value;
  const style = styleSelect.value;
  const dimensions = dimensionsInput.value.trim();
  const stage = stageSelect.value;
  const message = messageInput.value.trim();

  if (!isValidPhone(phone)) {
    phoneInput.classList.add("error");
    phoneError.classList.add("show");
    phoneInput.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Сохраняем заявку...";
  const description = compactLines([
    style ? `Стиль: ${style}` : null,
    dimensions ? `Размеры/помещение: ${dimensions}` : null,
    stage ? `Стадия: ${stage}` : null,
    message ? `Комментарий: ${message}` : null
  ]);
  const intakeResult = await submitLeadToIntake({
    name,
    phone,
    furnitureType: service,
    description
  });
  const whatsappMessage = compactLines([
    "Здравствуйте! Заявка с сайта Salamat Mebel:",
    "",
    `Имя: ${name || "не указано"}`,
    `Телефон: ${phone}`,
    `Тип мебели: ${service || "не указан"}`,
    `Стиль: ${style || "не выбран"}`,
    `Размеры/помещение: ${dimensions || "не указано"}`,
    `Стадия: ${stage || "не указана"}`,
    `Комментарий: ${message || "нет"}`
  ]);

  if (!intakeResult.ok) {
    formSuccess.textContent = "Заявка не сохранилась в системе. Проверьте интернет и отправьте еще раз.";
    submitBtn.disabled = false;
    submitBtn.textContent = "Отправить заявку";
    return;
  }

  openWhatsApp(whatsappMessage);
  leadForm.reset();
  document.querySelectorAll(".option-chips button").forEach((button) => button.classList.remove("active"));
  selectStyle("Теплый премиум");
  updateLeadSummary();
  formSuccess.textContent = `Заявка сохранена в системе${intakeResult.orderId ? ` #${intakeResult.orderId}` : ""}. WhatsApp открыт для уточнения деталей.`;
  submitBtn.disabled = false;
  submitBtn.textContent = "Отправить заявку";
});

document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("click", () => {
    serviceSelect.value = card.dataset.service;
    document.querySelectorAll('.option-chips[data-target="service"] button').forEach((button) => {
      button.classList.toggle("active", button.dataset.value === card.dataset.service);
    });
    updateLeadSummary();
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  });
});

const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;

    portfolioItems.forEach((item) => {
      const shouldShow = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("hidden", !shouldShow);
    });
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
let lightboxReturnFocus = null;

function openLightbox(src, title) {
  lightboxReturnFocus = document.activeElement;
  lightboxImage.src = src;
  lightboxImage.alt = title;
  lightboxCaption.textContent = title;
  lightbox.classList.add("open");
  document.body.classList.add("lightbox-open");
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.classList.remove("lightbox-open");
  lightboxImage.src = "";
  if (lightboxReturnFocus) lightboxReturnFocus.focus();
}

portfolioItems.forEach((item) => {
  item.addEventListener("click", () => {
    openLightbox(item.dataset.src, item.dataset.title);
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    closeChat();
  }
});

const chatWidget = document.getElementById("chatWidget");
const chatToggle = document.getElementById("chatToggle");
const chatClose = document.getElementById("chatClose");
const chatMessages = document.getElementById("chatMessages");
const chatButtons = document.getElementById("chatButtons");
const chatPhoneRow = document.getElementById("chatPhoneRow");
const chatPhone = document.getElementById("chatPhone");
const chatPhoneSend = document.getElementById("chatPhoneSend");
const chatText = document.getElementById("chatText");
const chatTextSend = document.getElementById("chatTextSend");

const chatServices = [
  { name: "Кухня", question: "Какая кухня нужна?", options: ["Линейная", "Угловая", "С островом", "Пока не знаю"] },
  { name: "Шкаф", question: "Какой шкаф планируете?", options: ["Встроенный", "Распашной", "Шкаф-купе", "В нишу"] },
  { name: "Гардеробная", question: "Что важнее в гардеробной?", options: ["Больше полок", "Больше штанг", "Ящики", "Все вместе"] },
  { name: "Прихожая", question: "Что добавить в прихожую?", options: ["Сиденье", "Зеркало", "Обувницу", "Закрытый шкаф"] },
  { name: "Другое", question: "Опишите задачу коротко.", options: ["ТВ-зона", "Офис", "Комод", "Другое"] },
];

const faqAnswers = [
  { keys: ["срок", "долго", "когда", "быстро"], answer: "Срок зависит от сложности и материалов. После замера и согласования проекта можно назвать точнее." },
  { keys: ["замер", "выезд", "приед", "адрес"], answer: "Да, выезжаем на замер по Алматы. На месте смотрим размеры, стены, розетки, трубы и технику." },
  { keys: ["материал", "лдсп", "мдф", "эмаль", "фурнитур"], answer: "Материалы подбираем под бюджет и нагрузку: ЛДСП, МДФ, пленка, эмаль, стекло, подсветка и разная фурнитура." },
  { keys: ["гарант"], answer: "Гарантия обсуждается по проекту и зависит от материалов и фурнитуры. Перед сдачей проверяем фасады, зазоры и механизмы." },
  { keys: ["оплат", "каспи", "налич"], answer: "Оплату можно обсудить после расчета. Обычно проект делится на предоплату перед запуском и остаток после монтажа." },
];

let chatState = {
  service: null,
  detail: null,
  stage: null,
};

function bubble(text, who) {
  const element = document.createElement("div");
  element.className = `chat-bubble ${who}`;
  element.textContent = text;
  chatMessages.appendChild(element);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setChatButtons(labels, onClick) {
  chatButtons.innerHTML = "";
  chatPhoneRow.classList.remove("show");
  labels.forEach((label) => {
    const button = document.createElement("button");
    button.className = "chat-btn";
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", () => onClick(label));
    chatButtons.appendChild(button);
  });
}

function showChatPhone() {
  chatButtons.innerHTML = "";
  chatPhoneRow.classList.add("show");
  chatPhone.focus();
}

function startChat() {
  chatMessages.innerHTML = "";
  chatState = { service: null, detail: null, stage: null };
  bubble("Здравствуйте! Я помогу быстро оформить заявку.\nШаг 1 из 3: что хотите заказать?", "bot");
  setChatButtons(chatServices.map((service) => service.name), (label) => {
    const service = chatServices.find((item) => item.name === label);
    chatState.service = service.name;
    bubble(label, "user");
    setTimeout(() => {
      bubble(`Шаг 2 из 3: ${service.question}`, "bot");
      setChatButtons(service.options, (detail) => {
        chatState.detail = detail;
        bubble(detail, "user");
        setTimeout(() => {
          bubble("Какая сейчас стадия проекта?", "bot");
          setChatButtons(["Есть размеры", "Нужен замер", "Есть дизайн-проект", "Нужна консультация"], (stage) => {
            chatState.stage = stage;
            bubble(stage, "user");
            setTimeout(() => {
              bubble("Шаг 3 из 3: оставьте телефон, и мы откроем WhatsApp с готовой заявкой.", "bot");
              showChatPhone();
            }, 250);
          });
        }, 250);
      });
    }, 250);
  });
}

function openChat() {
  chatWidget.classList.add("open");
  chatWidget.setAttribute("aria-hidden", "false");
  chatToggle.setAttribute("aria-expanded", "true");
  chatToggle.style.display = "none";
  if (!chatMessages.children.length) startChat();
}

function closeChat() {
  chatWidget.classList.remove("open");
  chatWidget.setAttribute("aria-hidden", "true");
  chatToggle.setAttribute("aria-expanded", "false");
  chatToggle.style.display = "";
}

chatToggle.addEventListener("click", openChat);
chatClose.addEventListener("click", closeChat);

chatPhone.addEventListener("input", () => {
  chatPhone.value = formatKzPhone(chatPhone.value);
  chatPhone.style.outline = "";
});

async function sendChatLead() {
  const phone = chatPhone.value.trim();
  if (!isValidPhone(phone)) {
    chatPhone.style.outline = "2px solid var(--error)";
    return;
  }

  bubble(phone, "user");
  chatPhoneRow.classList.remove("show");
  const description = compactLines([
    chatState.detail ? `Детали: ${chatState.detail}` : null,
    chatState.stage ? `Стадия: ${chatState.stage}` : null,
    "Заявка с помощника Salamat Mebel."
  ]);
  const intakeResult = await submitLeadToIntake({
    name: "Клиент Salamat Mebel",
    phone,
    furnitureType: chatState.service,
    description
  });
  const message = compactLines([
    "Здравствуйте! Заявка с помощника Salamat Mebel:",
    "",
    `Тип мебели: ${chatState.service || "не указан"}`,
    `Детали: ${chatState.detail || "не указано"}`,
    `Стадия: ${chatState.stage || "не указана"}`,
    `Телефон: ${phone}`
  ]);

  if (!intakeResult.ok) {
    setTimeout(() => {
      bubble("Заявка не сохранилась в системе. Проверьте интернет и отправьте телефон еще раз.", "bot");
      showChatPhone();
    }, 250);
    return;
  }

  openWhatsApp(message);
  setTimeout(() => {
    bubble("Готово. Заявка сохранена, WhatsApp открыт для уточнения.", "bot");
    setChatButtons(["Новая заявка"], () => startChat());
  }, 250);
}

chatPhoneSend.addEventListener("click", sendChatLead);
chatPhone.addEventListener("keydown", (event) => {
  if (event.key === "Enter") sendChatLead();
});

function findFaqAnswer(text) {
  const normalized = text.toLowerCase();
  const found = faqAnswers.find((item) => item.keys.some((key) => normalized.includes(key)));
  return found ? found.answer : null;
}

function handleChatText() {
  const text = chatText.value.trim();
  if (!text) return;
  bubble(text, "user");
  chatText.value = "";

  setTimeout(() => {
    const answer = findFaqAnswer(text);
    if (answer) {
      bubble(answer, "bot");
    } else {
      bubble("Я передам вопрос мастеру. Оставьте телефон, и мы ответим в WhatsApp.", "bot");
      showChatPhone();
    }
  }, 250);
}

chatTextSend.addEventListener("click", handleChatText);
chatText.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleChatText();
});
