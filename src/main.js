document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initChrome() {
  const mark = document.querySelector("[data-chrome]");
  if (!mark) return;
  requestAnimationFrame(() => {
    mark.classList.add("is-in");
  });
}

function initDrift() {
  if (reduceMotion) return;
  const media = document.querySelector("[data-drift]");
  if (!media) return;
  requestAnimationFrame(() => {
    media.classList.add("is-drift");
  });
}

function initReveal() {
  const nodes = document.querySelectorAll(
    ".plate__grid, .gallery__head, .gallery__strip, .crew__copy, .gear__inner, .book__intro, .form",
  );

  if (reduceMotion || !("IntersectionObserver" in window)) {
    return;
  }

  nodes.forEach((node) => node.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
  );

  nodes.forEach((node) => observer.observe(node));
}

function initForm() {
  const form = document.getElementById("booking-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    const note = String(data.get("note") || "").trim();
    const route = String(data.get("route") || "altai");

    const nameInput = form.elements.namedItem("name");
    const contactInput = form.elements.namedItem("contact");
    if (nameInput instanceof HTMLElement) nameInput.removeAttribute("aria-invalid");
    if (contactInput instanceof HTMLElement) contactInput.removeAttribute("aria-invalid");

    if (!name || !contact) {
      status.textContent = "Укажите имя и контакт — так мы сможем ответить.";
      if (!name && nameInput instanceof HTMLElement) nameInput.setAttribute("aria-invalid", "true");
      if (!contact && contactInput instanceof HTMLElement) {
        contactInput.setAttribute("aria-invalid", "true");
      }
      return;
    }

    const routeLabel =
      route === "baikal" ? "Байкал · 5 дней" : route === "other" ? "подбор маршрута" : "Алтай · 8 дней";

    const message = [
      `Здравствуйте! Заявка с сайта Сибирия Топ.`,
      `Имя: ${name}`,
      `Контакт: ${contact}`,
      `Маршрут: ${routeLabel}`,
      note ? `Комментарий: ${note}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    status.textContent = "";
    const hint = document.createElement("span");
    hint.textContent = "Откройте чат VK и вставьте текст заявки — или ";
    const mail = document.createElement("a");
    mail.href = `mailto:syberia.top@bk.ru?subject=${encodeURIComponent("Заявка на выезд — Сибирия Топ")}&body=${encodeURIComponent(message)}`;
    mail.textContent = "напишите на почту";
    status.append(hint, mail, document.createTextNode("."));

    window.open("https://vk.me/syberia_top", "_blank", "noopener,noreferrer");

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(message).then(
        () => {
          hint.textContent = "Текст заявки скопирован. Вставьте в чат VK — или ";
        },
        () => {},
      );
    }

    form.reset();
  });
}

initChrome();
initDrift();
initReveal();
initForm();
