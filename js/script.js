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
        // IDs 
        const PUBLIC_KEY = '9k9iCSjBZCKpr85XX';
        const SERVICE_ID = 'service_9m3i3kd'; 
        
        // Templates
        const TEMPLATE_ID_COMPANY = 'template_2h3yj4q'; 
        const TEMPLATE_ID_AUTOREPLY = 'template_txft2bn'; 
        // --------------------------------

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

            // 2. Preparar datos y deshabilitar botón (inicio del envío)
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;

            const formData = {
                name: form.name.value,
                company: form.company.value,
                phone: form.phone.value,
                email: emailValue, // Usamos el valor validado
                service: form.service.value
            };
            
            // 3. Envío Real a EmailJS (Se envían dos correos en secuencia)
            
            // PRIMER ENVÍO: Notificación a la empresa
            emailjs.send(SERVICE_ID, TEMPLATE_ID_COMPANY, formData)
                .then(function(response) {
                    console.log('1. Correo a la Empresa enviado. Iniciando Auto-respuesta.');
                    
                    // SEGUNDO ENVÍO: Auto-respuesta al cliente (solo si el primero fue exitoso)
                    return emailjs.send(SERVICE_ID, TEMPLATE_ID_AUTOREPLY, formData);
                })
                .then(function(response) {
                    // Éxito en AMBOS envíos
                    console.log('2. Correo de Auto-respuesta enviado con éxito.');
                    alert('✅ ¡Mensaje enviado! Hemos recibido su solicitud y nos contactaremos en 24 horas.');
                    form.reset();
                })
                .catch(function(error) {
                    // Si falla cualquiera de los dos envíos, entra aquí.
                    console.error('Error al enviar uno o ambos correos:', error);
                    alert('❌ Ocurrió un error al enviar el mensaje. Inténtalo de nuevo.');
                })
                .finally(() => {
                    // Restaurar botón (se ejecuta al final, haya éxito o error)
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
};

// INICIALIZACIÓN DE LA APP
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa EmailJS (usando la clave pública)
    emailjs.init('9k9iCSjBZCKpr85XX');
    
    // Inicialización del resto de la App
    UI.initMobileMenu();
    UI.initAnimations();
    ContactForm.init();
});

// === FUNCIÓN PARA ABRIR LIGHTBOX ===
function openLightbox(imgElement) {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-image');
    
    // Usamos la misma ruta de la imagen clickeada
    modalImg.src = imgElement.src; 
    
    // Mostramos el modal
    modal.classList.add('active');
}

// === FUNCIÓN PARA CERRAR LIGHTBOX ===
function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    modal.classList.remove('active');
}