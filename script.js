document.addEventListener("DOMContentLoaded", function () {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  initRevealAnimations();
  initTypewriter();
  initHeroParallax();

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = (btn.getAttribute("data-filter") || "all").trim().toLowerCase();
      document.querySelectorAll("[data-category]").forEach((card) => {
        const cat = (card.getAttribute("data-category") || "").trim().toLowerCase();
        const categories = cat.split(/[,\s]+/).filter(Boolean);
        if (filter === "all" || categories.includes(filter)) {
          card.classList.remove("is-hidden");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });

  let retryCount = 0;
  const maxRetries = 50;

  function initEmailJS() {
    if (typeof emailjs !== "undefined") {
      emailjs.init("q2GWXMUir3i7mUxXW");
      setupContactForm();
    } else {
      retryCount++;
      if (retryCount < maxRetries) {
        setTimeout(initEmailJS, 100);
      } else {
        console.error("EmailJS library failed to load. Please check your internet connection or CDN access.");
        const formMessage = document.getElementById("formMessage");
        if (formMessage) {
          formMessage.textContent =
            "Email service is temporarily unavailable. Please email me directly at dawoodchohaan46@gmail.com";
          formMessage.className = "form-message form-message-error";
          formMessage.hidden = false;
        }
      }
    }
  }

  function setupContactForm() {
    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const formMessage = document.getElementById("formMessage");

    if (contactForm && typeof emailjs !== "undefined") {
      contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        if (formMessage) {
          formMessage.hidden = true;
        }

        try {
          await emailjs.sendForm("service_wct97t8", "template_32wz4nf", contactForm, "q2GWXMUir3i7mUxXW");
          if (formMessage) {
            formMessage.textContent = "Message sent successfully! I'll get back to you soon.";
            formMessage.className = "form-message form-message-success";
            formMessage.hidden = false;
          }
          contactForm.reset();

          setTimeout(() => {
            if (formMessage) {
              formMessage.hidden = true;
            }
          }, 5000);
        } catch (error) {
          let errorMsg = "Failed to send message. ";

          if (error.message && error.message.includes("Failed to fetch")) {
            errorMsg += "Network error: Cannot reach email service. ";
            errorMsg += "Please check your internet connection or try again later. ";
            errorMsg += "You can also email me directly at dawoodchohaan46@gmail.com";
          } else {
            errorMsg += "Please try again or email me directly at dawoodchohaan46@gmail.com";
          }

          if (formMessage) {
            formMessage.textContent = errorMsg;
            formMessage.className = "form-message form-message-error";
            formMessage.hidden = false;
          }
          console.error("EmailJS Error:", error);
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "<span>Send Message</span>";
        }
      });
    }
  }

  initEmailJS();

  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

function initRevealAnimations() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-reveal]").forEach((el) => {
    const kind = (el.getAttribute("data-reveal") || "up").trim().toLowerCase();
    const allowed = ["up", "down", "left", "right", "scale"];
    const variant = allowed.includes(kind) ? kind : "up";
    el.classList.add("reveal", `reveal--${variant}`);
  });

  document.querySelectorAll("[data-stagger]").forEach((container) => {
    const items = container.querySelectorAll("[data-reveal]");
    items.forEach((el, i) => {
      el.style.setProperty("--d", `${Math.min(i, 14) * 48}ms`);
    });
  });

  if (reduceMotion) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: "0px 0px -6% 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

function initHeroParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(max-width: 768px)").matches) return;

  const zone = document.querySelector(".hero-visual");
  if (!zone) return;

  const layers = Array.from(zone.querySelectorAll("[data-parallax]")).map((el) => ({
    el,
    mult: Number.parseFloat(el.getAttribute("data-parallax")) || 14,
  }));
  if (!layers.length) return;

  let rafId = 0;
  let mx = 0;
  let my = 0;

  function apply() {
    rafId = 0;
    const rect = zone.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const nx = (mx - rect.left) / rect.width - 0.5;
    const ny = (my - rect.top) / rect.height - 0.5;
    layers.forEach(({ el, mult }) => {
      el.style.setProperty("--rx", (nx * mult * 2).toFixed(2));
      el.style.setProperty("--ry", (ny * mult * 2).toFixed(2));
    });
  }

  zone.addEventListener(
    "mousemove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(apply);
    },
    { passive: true }
  );

  zone.addEventListener(
    "mouseleave",
    () => {
      layers.forEach(({ el }) => {
        el.style.setProperty("--rx", "0");
        el.style.setProperty("--ry", "0");
      });
    },
    { passive: true }
  );
}

function initTypewriter() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const els = Array.from(document.querySelectorAll("[data-typewriter]"));
  if (!els.length) return;

  
  const groups = new Map();
  for (const el of els) {
    const group = (el.getAttribute("data-type-group") || "").trim();
    if (!group) continue;
    const order = Number.parseInt(el.getAttribute("data-type-order") || "0", 10) || 0;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push({ el, order });
  }

  function buildChars(el, startIndex = 0) {
    const raw = (el.getAttribute("data-typewriter") ?? el.textContent ?? "").replace(/\s+$/g, "");
    const text = raw.length ? raw : "";

    const hadTrailingSpace = (el.getAttribute("data-typewriter") ?? el.textContent ?? "").endsWith(" ");
    const finalText = hadTrailingSpace ? `${text} ` : text;

    el.classList.add("tw");
    el.setAttribute("aria-label", finalText.trim());

    const frag = document.createDocumentFragment();
    let idx = startIndex;

    for (const ch of finalText) {
      const span = document.createElement("span");
      span.className = "tw-char";
      span.style.setProperty("--i", String(idx));
      span.textContent = ch === " " ? "\u00A0" : ch;
      frag.appendChild(span);
      idx += 1;
    }

    el.textContent = "";
    el.appendChild(frag);
    return idx - startIndex;
  }
  for (const [_, items] of groups.entries()) {
    items.sort((a, b) => a.order - b.order);
    let offset = 0;
    for (const { el } of items) {
      offset += buildChars(el, offset);
    }
  }

  for (const el of els) {
    const group = (el.getAttribute("data-type-group") || "").trim();
    if (group) continue;
    buildChars(el, 0);
  }

  if (reduceMotion) {
    document.querySelectorAll(".tw").forEach((el) => el.classList.add("tw-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("tw-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  document.querySelectorAll(".tw").forEach((el) => io.observe(el));
}
