
// Wait for DOM and EmailJS to load
document.addEventListener("DOMContentLoaded", function() {
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
          formMessage.textContent = "Email service is temporarily unavailable. Please email me directly at dawoodchohaan46@gmail.com";
          formMessage.className = "form-message form-message-error";
          formMessage.style.display = "block";
        }
      }
    }
  }

  // Setup contact form
  function setupContactForm() {
    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const formMessage = document.getElementById("formMessage");

    if (contactForm && typeof emailjs !== "undefined") {
      contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        formMessage.style.display = "none";
        
        try {
          await emailjs.sendForm(
            "service_wct97t8",
            "template_32wz4nf",
            contactForm,
            "q2GWXMUir3i7mUxXW"
          );
          formMessage.textContent = "Message sent successfully! I'll get back to you soon.";
          formMessage.className = "form-message form-message-success";
          formMessage.style.display = "block";
          contactForm.reset();
          
          setTimeout(() => {
            formMessage.style.display = "none";
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
          
          formMessage.textContent = errorMsg;
          formMessage.className = "form-message form-message-error";
          formMessage.style.display = "block";
          console.error("EmailJS Error:", error);
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Message";
        }
      });
    }
  }

  initEmailJS();
  const backToTopBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
