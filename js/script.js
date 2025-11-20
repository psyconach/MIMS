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
            // 1. Abrir/Cerrar al hacer clic en el botón
            menuBtn.addEventListener('click', () => nav.classList.toggle('show'));

            // 2. CERRAR EL MENÚ al hacer clic en cualquier enlace (Overlay Logic)
            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    // Cierra después de un pequeño retraso para permitir el inicio del scroll
                    setTimeout(() => {
                        nav.classList.remove('show');
                    }, 50); 
                });
            });
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

        // --- Configuración de EmailJS ---
        const SERVICE_ID = 'default_service'; // ¡REEMPLAZAR!
        const TEMPLATE_ID = 'template_2h3yj4q'; // ¡REEMPLAZAR!
        // --------------------------------

        const emailInput = document.getElementById('email');
        const emailErrorMsg = document.getElementById('email-error-msg');
        const submitBtn = form.querySelector('button[type="submit"]');

        // Si tu botón no tiene el type="submit" dentro del form:
        // const submitBtn = document.getElementById('ID_DE_TU_BOTON'); 
        
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

            // 2. Preparar datos y deshabilitar botón (inicio del envío)
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;

            const formData = {
                name: form.name.value,
                company: form.company.value,
                email: emailValue, // Usamos el valor validado
                service: form.service.value
            };
            
            // 3. Envío Real a EmailJS (Reemplazo de la Simulación)
            emailjs.send(SERVICE_ID, TEMPLATE_ID, formData)
                .then(function(response) {
                    // Éxito
                    console.log('Correo enviado con éxito!', response.status, response.text);
                    alert('✅ ¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
                    form.reset();

                }, function(error) {
                    // Error
                    console.error('Error al enviar el correo:', error);
                    alert('❌ Ocurrió un error al enviar el mensaje. Inténtalo de nuevo.');
                    
                })
                .finally(() => {
                    // Esto se ejecuta al final, haya éxito o error.
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
};

// INICIALIZACIÓN DE LA APP
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicialización de EmailJS (antes de usar el formulario)
    emailjs.init('9k9iCSjBZCKpr85XX'); // ¡REEMPLAZAR!
    
    // 2. Inicialización del resto de la App
    UI.initMobileMenu();
    UI.initAnimations();
    ContactForm.init();
});