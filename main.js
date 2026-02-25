// ====== ESPERAR A QUE EL DOM ESTÉ LISTO ======
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ====== 1. MENÚ HAMBURGUESA ======
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const header = document.querySelector('header');
  
  if (hamburgerBtn) {
    // Crear menú móvil
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    // Clonar enlaces del menú principal
    const mainNav = document.querySelector('.main-nav');
    if (mainNav) {
      const navLinks = mainNav.querySelectorAll('.nav__link');
      navLinks.forEach(link => {
        const mobileLink = document.createElement('a');
        mobileLink.href = link.href;
        mobileLink.textContent = link.textContent;
        mobileLink.className = 'mobile-menu__link';
        if (link.classList.contains('active')) {
          mobileLink.classList.add('active');
        }
        if (link.classList.contains('nav__cta')) {
          mobileLink.classList.add('mobile-menu__cta');
        }
        mobileMenu.appendChild(mobileLink);
      });
    }
    
    document.body.appendChild(mobileMenu);
    
    // Abrir/cerrar menú
    hamburgerBtn.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
      this.setAttribute('aria-expanded', expanded);
      this.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      
      // Prevenir scroll del body cuando el menú está abierto
      if (expanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // Cerrar menú al hacer clic en un enlace
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', function() {
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    
    // Cerrar al hacer clic fuera
    document.addEventListener('click', function(event) {
      if (!hamburgerBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ====== 2. MODAL DE ACCESIBILIDAD ======
  const modal = document.getElementById('accesibilidadModal');
  const accesibilidadLink = document.getElementById('accesibilidadLink');
  
  if (modal && accesibilidadLink) {
    const overlay = modal.querySelector('.modal__overlay');
    const closeBtn = modal.querySelector('.modal__close');
    
    // Abrir modal
    accesibilidadLink.addEventListener('click', function(e) {
      e.preventDefault();
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
    
    // Función para cerrar modal
    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    
    // Cerrar con botón X
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
    
    // Cerrar al hacer clic en overlay
    if (overlay) {
      overlay.addEventListener('click', closeModal);
    }
    
    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ====== 3. MODO ALTO CONTRASTE ======
  const contrastToggle = document.getElementById('contrastToggle');
  
  if (contrastToggle) {
    // Verificar preferencia guardada
    const savedContrast = localStorage.getItem('highContrast');
    if (savedContrast === 'true') {
      document.body.classList.add('high-contrast');
    }
    
    contrastToggle.addEventListener('click', function(e) {
      e.preventDefault();
      document.body.classList.toggle('high-contrast');
      
      // Guardar preferencia
      const isHighContrast = document.body.classList.contains('high-contrast');
      localStorage.setItem('highContrast', isHighContrast);
    });
  }

  // ====== 4. TOOLTIP DE WHATSAPP ======
  const whatsappTooltip = document.getElementById('whatsappTooltip');
  
  if (whatsappTooltip) {
    // Verificar si ya se mostró antes
    const tooltipShown = localStorage.getItem('whatsappTooltipShown');
    
    if (!tooltipShown) {
      // Mostrar tooltip por 5 segundos
      setTimeout(() => {
        whatsappTooltip.classList.add('hidden');
      }, 5000);
      
      // Guardar que ya se mostró
      localStorage.setItem('whatsappTooltipShown', 'true');
    } else {
      whatsappTooltip.classList.add('hidden');
    }
    
    // Ocultar al hacer clic en el botón
    const whatsappBtn = document.querySelector('.chat-fab__btn');
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', () => {
        whatsappTooltip.classList.add('hidden');
      });
    }
  }

  // ====== 5. MENSAJE DE BIENVENIDA TEMPORAL ======
  const welcomeMessage = document.createElement('div');
  welcomeMessage.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--azul);
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 1000;
    font-family: var(--f-body);
    border-left: 4px solid var(--naranja);
    transition: opacity 0.5s;
  `;
  welcomeMessage.innerHTML = '<strong>✨ Rediseño accesible</strong><br>Este sitio cumple con normas WCAG 2.1';
  
  // Solo mostrar si es la primera visita
  const welcomeShown = sessionStorage.getItem('welcomeShown');
  if (!welcomeShown) {
    document.body.appendChild(welcomeMessage);
    sessionStorage.setItem('welcomeShown', 'true');
    
    setTimeout(() => {
      welcomeMessage.style.opacity = '0';
      setTimeout(() => {
        if (welcomeMessage.parentNode) {
          welcomeMessage.remove();
        }
      }, 500);
    }, 5000);
  }

  // ====== 6. CONTADOR DE VISITAS SIMPLE ======
  const footerCopy = document.querySelector('.footer__copy');
  if (footerCopy) {
    let visitCount = localStorage.getItem('visitCount');
    if (!visitCount) {
      visitCount = 1;
    } else {
      visitCount = parseInt(visitCount) + 1;
    }
    localStorage.setItem('visitCount', visitCount);
    
    // Añadir contador al footer (discreto)
    const visitSpan = document.createElement('span');
    visitSpan.style.cssText = `
      display: inline-block;
      margin-left: 10px;
      font-size: 10px;
      color: rgba(255,255,255,0.3);
    `;
    visitSpan.textContent = `| Visitas: ${visitCount}`;
    footerCopy.appendChild(visitSpan);
  }

  // ====== 7. FOCUS VISIBLE PARA ACCESIBILIDAD ======
  // Mejorar la navegación por teclado
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  
  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });

  // ====== 8. ANIMACIÓN SUAVE AL HACER CLIC EN ENLACES INTERNOS ======
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});