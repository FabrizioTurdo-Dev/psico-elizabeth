// ====== ⚙️ CONFIGURACIÓN WHATSAPP ====== 
const WHATSAPP_CONFIG = {
  numero: '5491150398569', // ← REEMPLAZA CON TU NÚMERO
};

// ====== MOBILE MENU TOGGLE ====== 
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// ====== SMOOTH SCROLL ====== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    const target = document.querySelector(href);
    
    if (target) {
      e.preventDefault();
      const navHeight = document.querySelector('.navbar')?.offsetHeight || 60;
      // getBoundingClientRect().top + window.scrollY nunca falla, sin importar el layout
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ====== KEYBOARD NAV ====== 
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('active')) {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
    navToggle.focus();
  }
});

// ====== VIDEO HERO CONTROLS ====== 
const heroVideo = document.getElementById('hero-video');
const videoPlayBtn = document.getElementById('video-play-btn');

if (heroVideo && videoPlayBtn) {
  heroVideo.muted = true;

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting && !heroVideo.paused) {
        heroVideo.pause();
        videoPlayBtn.textContent = '▶';
      }
    });
  }, { threshold: 0.3 });

  videoObserver.observe(heroVideo);

  videoPlayBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (heroVideo.paused) {
      heroVideo.play();
      heroVideo.muted = false;
      videoPlayBtn.textContent = '⏸';
    } else {
      heroVideo.pause();
      videoPlayBtn.textContent = '▶';
    }
  });
}

// ====== REVEAL ON SCROLL ====== 
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
});

reveals.forEach(el => revealObserver.observe(el));

// ====== CONTACT FORM HANDLER (WHATSAPP) ====== 
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      topic: formData.get('topic'),
      message: formData.get('message'),
      entrevista: formData.get('entrevista')
    };

    if (!validateForm(data)) {
      showAlert('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    try {
      const button = contactForm.querySelector('button[type="submit"]');
      const originalText = button.textContent;

      button.textContent = 'Abriendo WhatsApp...';
      button.disabled = true;

      setTimeout(() => {
        const mensaje = `*Hola Elizabeth* 👋\n\nSoy *${data.name}*\n\n📞 *Mi teléfono:* ${data.phone}\n\n🎯 *Te contacto por:* ${data.topic}\n\n${data.message ? `📝 *Comentarios adicionales:*\n${data.message}\n` : ''}${data.entrevista === 'si' ? '⏰ *Sí, me gustaría una entrevista previa de 5 min*' : '⏰ *No necesito entrevista previa'}\n\n¡Gracias!`;

        const urlWhatsApp = `https://wa.me/${WHATSAPP_CONFIG.numero}?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsApp, '_blank');

        showAlert('✓ Tu mensaje fue preparado en WhatsApp', 'success');
        contactForm.reset();

        button.disabled = false;
        button.textContent = originalText;
      }, 500);

    } catch (error) {
      showAlert('Error al abrir WhatsApp', 'error');
      const button = contactForm.querySelector('button[type="submit"]');
      button.disabled = false;
      button.textContent = 'Enviar consulta';
    }
  });
}

// ====== FORM VALIDATION ====== 
function validateForm(data) {
  if (!data.name || !data.phone || !data.topic) {
    return false;
  }
  const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
  if (!phoneRegex.test(data.phone)) {
    showAlert('Por favor ingresa un teléfono válido', 'error');
    return false;
  }
  return true;
}

// ====== ALERT HELPER ====== 
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert-toast alert-toast--${type}`;
  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.classList.add('alert-toast--out');
    setTimeout(() => alertDiv.remove(), 300);
  }, 4000);
}

// ====== SCROLL TO TOP BUTTON ====== 
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-top-btn';
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

console.log('✓ Script v2.1 optimizado cargado correctamente');