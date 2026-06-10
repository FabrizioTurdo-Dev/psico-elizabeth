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
      const targetPosition = target.offsetTop - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ====== VIDEO HERO CONTROLS (CON SONIDO EN SCROLL) ====== 
const heroVideo = document.getElementById('hero-video');
const videoPlayBtn = document.getElementById('video-play-btn');

console.log('🎥 Video:', heroVideo ? '✓ Encontrado' : '❌ No encontrado');
console.log('🔘 Botón:', videoPlayBtn ? '✓ Encontrado' : '❌ No encontrado');

if (heroVideo && videoPlayBtn) {
  // Observer para detectar cuando el video entra/sale del viewport
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Video visible en pantalla → REPRODUCIR CON SONIDO
        console.log('📹 Video visible → reproduciendo con sonido');
        
        const playPromise = heroVideo.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('✓ Sonido activado');
              videoPlayBtn.textContent = '⏸';
              heroVideo.muted = false;
            })
            .catch(() => {
              console.log('⚠️ Autoplay con sonido bloqueado');
              heroVideo.muted = true;
              heroVideo.play();
            });
        }
      } else {
        // Video fuera de pantalla → PAUSAR Y SILENCIAR
        console.log('🔇 Video fuera de pantalla');
        heroVideo.pause();
        heroVideo.muted = true;
        videoPlayBtn.textContent = '▶';
      }
    });
  }, {
    threshold: 0.5
  });
  
  videoObserver.observe(heroVideo);
  
  // ====== CLICK EN BOTÓN PLAY ====== 
  videoPlayBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🖱️ Click en botón. Estado:', heroVideo.paused ? 'pausado' : 'reproduciéndose');
    
    if (heroVideo.paused) {
      const playPromise = heroVideo.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            heroVideo.muted = false;
            videoPlayBtn.textContent = '⏸';
            console.log('▶️ Video iniciado');
          })
          .catch((error) => {
            console.log('⚠️ Error al reproducir:', error);
            heroVideo.muted = true;
            heroVideo.play();
            videoPlayBtn.textContent = '🔇';
          });
      }
    } else {
      heroVideo.pause();
      videoPlayBtn.textContent = '▶';
      console.log('⏸️ Video pausado');
    }
  });
  
  // Escuchar eventos del video
  heroVideo.addEventListener('pause', () => {
    videoPlayBtn.textContent = '▶';
  });
  
  heroVideo.addEventListener('play', () => {
    videoPlayBtn.textContent = heroVideo.muted ? '🔇' : '⏸';
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
        const mensaje = `*Hola Elizabeth* 👋

Soy *${data.name}*

📞 *Mi teléfono:* ${data.phone}

🎯 *Te contacto por:* ${data.topic}

${data.message ? `📝 *Comentarios adicionales:*\n${data.message}\n` : ''}${data.entrevista === 'si' ? '⏰ *Sí, me gustaría una entrevista previa de 5 min*' : '⏰ *No necesito entrevista previa'}

¡Gracias!`;
        
        const urlWhatsApp = `https://wa.me/${WHATSAPP_CONFIG.numero}?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsApp, '_blank');
        
        showAlert('✓ Tu mensaje fue preparado en WhatsApp', 'success');
        contactForm.reset();
        
        button.disabled = false;
        button.textContent = originalText;
      }, 500);
      
    } catch (error) {
      console.error('Error:', error);
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
    max-width: 300px;
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
scrollTopBtn.innerHTML = '↑';
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
console.log('✓ Script v2.0 cargado correctamente');