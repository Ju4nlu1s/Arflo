// CleanTech Industrial - JavaScript functionality

// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const contactForm = document.getElementById('contact-form');
const contactModal = document.getElementById('contact-modal');
const productInput = document.getElementById('product');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeContactModal();
    initializeContactForm();
    initializeAnimations();
    initializeHeaderEffects();
    
    console.log('CleanTech Industrial website loaded successfully');
});

// Navigation functionality
function initializeNavigation() {
    // Mobile Navigation Toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navMenu.classList.remove('active');
            
            // Smooth scrolling for navigation links
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = 80;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Add visual feedback
                link.style.backgroundColor = 'var(--color-industrial-light-blue)';
                setTimeout(() => {
                    link.style.backgroundColor = '';
                }, 300);
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navToggle && navMenu && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', updateActiveNavLink);
}

// Contact Modal Functions
function initializeContactModal() {
    // Make functions global for onclick handlers
    window.openContactModal = function(productName) {
        if (contactModal) {
            contactModal.classList.remove('hidden');
            if (productInput) {
                productInput.value = productName || '';
            }
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeContactModal = function() {
        if (contactModal) {
            contactModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    };

    window.scrollToContact = function() {
        window.closeContactModal();
        const contactSection = document.getElementById('contacto');
        if (contactSection) {
            const headerHeight = 80;
            const targetPosition = contactSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Focus on the first input field after scrolling
            setTimeout(() => {
                const nameField = document.getElementById('name');
                if (nameField) {
                    nameField.focus();
                }
            }, 500);
        }
    };

    // Close modal when clicking outside of it
    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                window.closeContactModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal && !contactModal.classList.contains('hidden')) {
            window.closeContactModal();
        }
    });
}

// Form handling
function initializeContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name')?.trim() || '';
        const email = formData.get('email')?.trim() || '';
        const phone = formData.get('phone')?.trim() || '';
        const message = formData.get('message')?.trim() || '';
        const product = formData.get('product') || '';
        
        // Validation
        const errors = validateForm({ name, email, phone, message });
        
        if (errors.length > 0) {
            showAlert('Error de Validación', errors.join('\n'), 'error');
            return;
        }
        
        // Submit form
        submitForm({ name, email, phone, message, product });
    });
}

// Form validation
function validateForm({ name, email, phone, message }) {
    const errors = [];
    
    if (!name) {
        errors.push('• El nombre es requerido');
    }
    
    if (!email) {
        errors.push('• El email es requerido');
    } else if (!isValidEmail(email)) {
        errors.push('• El formato del email no es válido');
    }
    
    if (!phone) {
        errors.push('• El teléfono es requerido');
    } else if (!isValidPhone(phone)) {
        errors.push('• El formato del teléfono no es válido');
    }
    
    if (!message) {
        errors.push('• El mensaje es requerido');
    }
    
    return errors;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation (Chilean format)
function isValidPhone(phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^(\+56)?[0-9]{8,9}$/;
    return phoneRegex.test(cleanPhone);
}

// Form submission
function submitForm(data) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        contactForm.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showAlert(
            '¡Mensaje Enviado Exitosamente!', 
            'Gracias por contactarnos.\nNos pondremos en contacto con usted a la brevedad.\nRecibirá una confirmación en su email.', 
            'success'
        );
        
        console.log('Formulario enviado:', data);
    }, 1500);
}

// Enhanced Alert system
function showAlert(title, message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = 'custom-alert';
    
    const colors = {
        success: { bg: '#10b981', text: '#065f46', border: '#10b981' },
        error: { bg: '#ef4444', text: '#991b1b', border: '#ef4444' },
        info: { bg: '#3b82f6', text: '#1e40af', border: '#3b82f6' }
    };
    
    const colorSet = colors[type] || colors.info;
    
    alert.innerHTML = `
        <div class="alert-content">
            <div class="alert-header">
                <h4 class="alert-title">${title}</h4>
                <button class="alert-close" onclick="this.closest('.custom-alert').remove()">&times;</button>
            </div>
            <p class="alert-message">${message}</p>
        </div>
    `;
    
    // Styles
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 420px;
        width: 90%;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        border-left: 5px solid ${colorSet.border};
        z-index: 3000;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    const content = alert.querySelector('.alert-content');
    content.style.cssText = 'padding: 24px;';
    
    const header = alert.querySelector('.alert-header');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;';
    
    const titleEl = alert.querySelector('.alert-title');
    titleEl.style.cssText = `
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: ${colorSet.text};
        line-height: 1.3;
    `;
    
    const messageEl = alert.querySelector('.alert-message');
    messageEl.style.cssText = `
        margin: 0;
        font-size: 15px;
        color: #4b5563;
        white-space: pre-line;
        line-height: 1.5;
    `;
    
    const closeBtn = alert.querySelector('.alert-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 24px;
        color: #9ca3af;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        margin-left: 16px;
        transition: color 0.2s;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.color = '#6b7280';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.color = '#9ca3af';
    });
    
    // Add to document
    document.body.appendChild(alert);
    
    // Trigger animation
    setTimeout(() => {
        alert.style.transform = 'translateX(0)';
        alert.style.opacity = '1';
    }, 10);
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.style.transform = 'translateX(100%)';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 400);
        }
    }, 6000);
}

// Header scroll effects
function initializeHeaderEffects() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollY = 0;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'white';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Active navigation highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    const navLinks = document.querySelectorAll('.nav__link');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('nav-active'));
            if (navLink) {
                navLink.classList.add('nav-active');
            }
        }
    });
}

// Animation initialization
function initializeAnimations() {
    // Add CSS for navigation active state
    const style = document.createElement('style');
    style.textContent = `
        .nav__link.nav-active {
            background-color: var(--color-industrial-light-blue) !important;
            color: var(--color-industrial-blue) !important;
        }
        
        .nav__link:hover {
            background-color: var(--color-industrial-light-blue);
            color: var(--color-industrial-blue);
        }
    `;
    document.head.appendChild(style);
    
    // Intersection Observer for card animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Set up card animations
    setTimeout(() => {
        const cards = document.querySelectorAll('.product-card, .equipment-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }, 100);

    // Add keyboard navigation for cards
    const allCards = document.querySelectorAll('.product-card, .equipment-card');
    allCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const button = card.querySelector('button');
                if (button) {
                    button.click();
                }
            }
        });
    });
}