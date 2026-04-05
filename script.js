document.addEventListener("DOMContentLoaded", function () {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.getAttribute("data-filter") || "all";
      document.querySelectorAll("[data-category]").forEach((card) => {
        const cat = card.getAttribute("data-category");
        if (filter === "all" || cat === filter) {
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
