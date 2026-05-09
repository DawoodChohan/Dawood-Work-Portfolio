document.addEventListener("DOMContentLoaded", function () {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  initRevealAnimations();
  initTypewriter();
  initHeroParallax();
  initProjectFilters();
  initProjectSliders();
  initProjectModal();

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

function initProjectSliders() {
  const sliders = Array.from(document.querySelectorAll("[data-slider]"));
  if (!sliders.length) return;
  const projectsSection = document.getElementById("projects");

  const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function getActiveIndex(slides, viewport) {
    const v = viewport.getBoundingClientRect();
    const center = v.left + v.width / 2;
    let bestIdx = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    slides.forEach((slide, idx) => {
      const r = slide.getBoundingClientRect();
      const slideCenter = r.left + r.width / 2;
      const dist = Math.abs(slideCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });
    return bestIdx;
  }

  function scrollToIndex(slides, idx) {
    const slide = slides[idx];
    if (!slide) return;
    slide.scrollIntoView({
      behavior: prefersReduce ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  sliders.forEach((root) => {
    const viewport = root.querySelector("[data-slider-viewport]");
    const prevBtn = root.querySelector("[data-slider-prev]");
    const nextBtn = root.querySelector("[data-slider-next]");
    const pagination = root.querySelector("[data-slider-pagination]");
    const track = viewport ? viewport.querySelector(".slider-track") : null;
    const slides = track ? Array.from(track.querySelectorAll("[data-slider-slide]")) : [];

    if (!viewport || !track || slides.length < 1 || !pagination) return;

    pagination.innerHTML = "";
    const pages = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "slider-page";
      b.textContent = String(i + 1);
      b.setAttribute("aria-label", `Go to project ${i + 1}`);
      b.addEventListener("click", () => scrollToIndex(slides, i));
      pagination.appendChild(b);
      return b;
    });

    let dots = null;
    if (pages.length > 3) {
      dots = document.createElement("span");
      dots.className = "slider-page-ellipsis";
      dots.textContent = "...";
      dots.setAttribute("aria-hidden", "true");
      pagination.appendChild(dots);
    }

    let active = 0;
    const isLoopMode = () => Boolean(projectsSection && projectsSection.classList.contains("projects-all-filter-mode"));

    function setActive(idx) {
      active = clamp(idx, 0, slides.length - 1);
      pages.forEach((p, i) => p.classList.toggle("is-active", i === active));
      if (pages.length > 3) {
        const chunkStart = Math.floor(active / 3) * 3;
        const chunkEnd = Math.min(chunkStart + 3, pages.length);
        pages.forEach((p, i) => {
          p.style.display = i >= chunkStart && i < chunkEnd ? "" : "none";
        });
        if (dots) {
          dots.style.display = chunkEnd < pages.length ? "" : "none";
        }
      }
      if (prevBtn) prevBtn.disabled = isLoopMode() ? false : active === 0;
      if (nextBtn) nextBtn.disabled = isLoopMode() ? false : active === slides.length - 1;
    }

    function syncActive() {
      setActive(getActiveIndex(slides, viewport));
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        const nextIdx = isLoopMode() ? (active - 1 + slides.length) % slides.length : clamp(active - 1, 0, slides.length - 1);
        scrollToIndex(slides, nextIdx);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const nextIdx = isLoopMode() ? (active + 1) % slides.length : clamp(active + 1, 0, slides.length - 1);
        scrollToIndex(slides, nextIdx);
      });
    }

    let raf = 0;
    track.addEventListener(
      "scroll",
      () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          syncActive();
        });
      },
      { passive: true }
    );

    window.addEventListener("resize", syncActive, { passive: true });
    setActive(0);
    syncActive();
  });
}

function initProjectModal() {
  const modal = document.getElementById("projectModal");
  const titleEl = document.getElementById("projectModalTitle");
  const textEl = document.getElementById("projectModalText");
  const linkEl = document.getElementById("projectModalLink");

  if (!modal || !titleEl || !textEl || !linkEl) return;

  let lastFocus = null;

  function open({ title, text, url }) {
    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    titleEl.textContent = title || "Project";
    textEl.textContent = text || "";

    if (url) {
      linkEl.hidden = false;
      linkEl.href = url;
      linkEl.setAttribute("aria-label", `View site for ${title || "project"}`);
    } else {
      linkEl.hidden = true;
      linkEl.href = "#";
      linkEl.removeAttribute("aria-label");
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const closeBtn = modal.querySelector("[data-close-modal]");
    if (closeBtn instanceof HTMLElement) closeBtn.focus();
  }

  function close() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll("[data-open-project]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const slide = btn.closest("[data-project-title]");
      if (!slide) return;
      open({
        title: slide.getAttribute("data-project-title") || "Project",
        text: slide.getAttribute("data-project-desc") || "",
        url: slide.getAttribute("data-project-url") || "",
      });
    });
  });

  modal.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.closest("[data-close-modal]")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      e.preventDefault();
      close();
    }
  });
}

function initProjectFilters() {
  const buttons = Array.from(document.querySelectorAll(".filter-btn"));
  const groups = Array.from(document.querySelectorAll(".project-group[data-project-group]"));
  const projectsSection = document.getElementById("projects");
  const groupsWrap = document.querySelector(".projects-groups");
  if (!buttons.length || !groups.length || !groupsWrap) return;

  function ensureAllProjectsGroup() {
    let allGroup = groupsWrap.querySelector('.project-group[data-project-group="all"]');
    if (allGroup) return allGroup;

    const sourceSlides = groups.flatMap((group) => Array.from(group.querySelectorAll("[data-slider-slide]")));
    if (!sourceSlides.length) return null;

    allGroup = document.createElement("section");
    allGroup.className = "project-group";
    allGroup.setAttribute("aria-label", "All projects");
    allGroup.setAttribute("data-project-group", "all");

    const head = document.createElement("div");
    head.className = "project-group-head";
    head.innerHTML =
      '<h3 class="project-group-title">All Projects</h3>' +
      '<div class="project-group-hint">Swipe / click numbers to explore</div>' +
      '<p class="project-group-note">Click any frame to view project details</p>';

    const slider = document.createElement("div");
    slider.className = "project-slider";
    slider.setAttribute("data-slider", "");
    slider.innerHTML =
      '<button type="button" class="slider-arrow slider-arrow-prev" data-slider-prev aria-label="Previous project"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 5 9 12l6.5 7 1.5-1.4L12 12l5-5.6z" /></svg></button>' +
      '<div class="slider-viewport" data-slider-viewport><div class="slider-track"></div></div>' +
      '<button type="button" class="slider-arrow slider-arrow-next" data-slider-next aria-label="Next project"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 19 15 12 8.5 5 7 6.4l5 5.6-5 5.6z" /></svg></button>' +
      '<div class="slider-pagination" data-slider-pagination aria-label="Project navigation"></div>';

    const track = slider.querySelector(".slider-track");
    if (track) {
      sourceSlides.forEach((slide) => {
        track.appendChild(slide.cloneNode(true));
      });
    }

    allGroup.appendChild(head);
    allGroup.appendChild(slider);
    groupsWrap.insertBefore(allGroup, groupsWrap.firstChild);
    return allGroup;
  }

  const allGroup = ensureAllProjectsGroup();

  function setActiveButton(filter) {
    buttons.forEach((b) => b.classList.toggle("is-active", (b.getAttribute("data-filter") || "").toLowerCase() === filter));
  }

  function showOnly(filter) {
    if (projectsSection) {
      projectsSection.classList.toggle("projects-all-filter-mode", filter === "all");
    }
    groups.forEach((g) => {
      const key = (g.getAttribute("data-project-group") || "").toLowerCase();
      const shouldShow = filter !== "all" && key === filter;
      g.hidden = !shouldShow;
      g.style.display = shouldShow ? "" : "none";
    });
    if (allGroup) {
      const showAllGroup = filter === "all";
      allGroup.hidden = !showAllGroup;
      allGroup.style.display = showAllGroup ? "" : "none";
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = (btn.getAttribute("data-filter") || "all").trim().toLowerCase();
      setActiveButton(filter);
   
      showOnly(filter);
  
      requestAnimationFrame(() => {
        const evt = new Event("resize");
        window.dispatchEvent(evt);
      });
    });
  });

  const initial = (buttons.find((b) => b.classList.contains("is-active"))?.getAttribute("data-filter") || "all").toLowerCase();
  setActiveButton(initial);
  showOnly(initial);
}

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
