// ====== MOBILE MENU TOGGLE ======
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when link is clicked
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
      const navHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = target.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

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

// ====== CONTACT FORM HANDLER ======
const contactForm = document.getElementById('contact-form');
const whatsappNumber = '5491150398569';

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = {
      name: formData.get('name')?.trim(),
      phone: formData.get('phone')?.trim(),
      topic: formData.get('topic')?.trim(),
      message: formData.get('message')?.trim(),
      entrevista: formData.get('entrevista')
    };

    if (!validateForm(data)) {
      showAlert('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    const message = [
      'Hola Elizabeth, quiero hacer una consulta.',
      '',
      `Nombre: ${data.name}`,
      `Telefono / WhatsApp: ${data.phone}`,
      `Motivo: ${data.topic}`,
      `Entrevista previa de 5 minutos: ${formatInterview(data.entrevista)}`,
      `Mensaje: ${data.message || 'Sin mensaje adicional.'}`
    ].join('\n');

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener');
    showAlert('Te redirigimos a WhatsApp para enviar la consulta', 'success');
  });
}

// ====== FORM VALIDATION ======
function validateForm(data) {
  if (!data.name || !data.phone || !data.topic) {
    return false;
  }

  // Basic phone validation
  const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
  if (!phoneRegex.test(data.phone)) {
    showAlert('Por favor ingresa un telefono valido', 'error');
    return false;
  }

  return true;
}

function formatInterview(value) {
  if (value === 'si') return 'Si';
  if (value === 'no') return 'No';
  return 'No especifica';
}

// ====== ALERT HELPER ======
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? 'var(--sage-d)' : 'var(--taupe)'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.25rem;
    z-index: 1000;
    animation: slideIn 0.3s ease;
    font-size: 0.9rem;
  `;

  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => alertDiv.remove(), 300);
  }, 4000);
}

// ====== ANIMATIONS CSS ======
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
`;
document.head.appendChild(style);

// ====== RADIO BUTTON FIX ======
const radioLabels = document.querySelectorAll('.radio-label');

radioLabels.forEach(label => {
  const input = label.querySelector('input[type="radio"]');

  label.addEventListener('click', (e) => {
    if (e.target === input) return;

    const groupName = input.getAttribute('name');
    document.querySelectorAll(`.radio-label input[name="${groupName}"]`).forEach(radio => {
      radio.parentElement.style.background = 'white';
      radio.parentElement.style.color = 'var(--ink)';
    });

    input.checked = true;
    label.style.background = 'var(--sage-d)';
    label.style.color = 'white';
  });
});

// ====== SCROLL TO TOP BUTTON ======
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '&uarr;';
scrollTopBtn.style.cssText = `
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  background: var(--sage-d);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.style.opacity = '1';
    scrollTopBtn.style.visibility = 'visible';
  } else {
    scrollTopBtn.style.opacity = '0';
    scrollTopBtn.style.visibility = 'hidden';
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ====== LOG ======
console.log('Script v2.0 cargado correctamente');
