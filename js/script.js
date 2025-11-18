/**
 * MÓDULO DE UTILIDADES
 * Funciones puras que se pueden reutilizar
 */
const Utils = {
    // Valida formato de email con Regex estándar
    isValidEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },
    
    // Muestra error visual en un input específico
    showError: (inputElement, msgElement, message) => {
        inputElement.classList.add('input-error');
        if (msgElement) {
            msgElement.textContent = message;
            msgElement.style.display = 'block';
        }
    },

    // Limpia los errores visuales
    clearError: (inputElement, msgElement) => {
        inputElement.classList.remove('input-error');
        if (msgElement) {
            msgElement.style.display = 'none';
        }
    }
};

/**
 * MÓDULO DE INTERFAZ (UI)
 * Manejo del menú y animaciones
 */
const UI = {
    initAnimations: () => {
        const faders = document.querySelectorAll('.fade-in');
        const appearOptions = { threshold: 0.2 };
        
        const appearOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Dejar de observar una vez animado
            });
        }, appearOptions);

        faders.forEach(el => appearOnScroll.observe(el));
    },

    initMobileMenu: () => {
        const menuBtn = document.querySelector('.menu-btn');
        const nav = document.querySelector('.navbar');
        if (menuBtn && nav) {
            menuBtn.addEventListener('click', () => nav.classList.toggle('show'));
        }
    }
};

/**
 * MÓDULO DEL FORMULARIO
 * Lógica específica del formulario de contacto
 */
const ContactForm = {
    init: () => {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const emailInput = document.getElementById('email');
        const emailErrorMsg = document.getElementById('email-error-msg');
        const submitBtn = form.querySelector('button[type="submit"]');

        // Evento: Cuando el usuario escribe, quitamos el error si ya corrigió
        emailInput.addEventListener('input', () => {
            Utils.clearError(emailInput, emailErrorMsg);
        });

        // Evento: Envío del formulario
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Validación
            const emailValue = emailInput.value.trim();
            
            if (!Utils.isValidEmail(emailValue)) {
                Utils.showError(emailInput, emailErrorMsg, 'Por favor, ingresa un correo válido (ej: nombre@empresa.com)');
                return; // DETIENE EL ENVÍO
            }

            // 2. Simulación de Envío (Aquí conectarías EmailJS más adelante)
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;

            // Simulamos retardo de red de 2 segundos
            setTimeout(() => {
                console.log('Datos válidos enviados:', {
                    name: form.name.value,
                    email: emailValue,
                    company: form.company.value,
                    service: form.service.value
                });
                
                alert('¡Gracias! Hemos recibido tu solicitud correctamente.');
                form.reset();
                
                // Restaurar botón
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
};

// INICIALIZACIÓN DE LA APP
document.addEventListener('DOMContentLoaded', () => {
    UI.initMobileMenu();
    UI.initAnimations();
    ContactForm.init();
});