// Ultra Advanced JavaScript for Spectacular Website Animations

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all enhanced components
    initPreloader();
    initNavigation();
    initAdvancedAnimations();
    initCounters();
    initPortfolio();
    initContactForm();
    initThemeToggle();
    initScrollEffects();
    initParticleSystem();
    initMagneticEffects();
    initAdvancedInteractions();
    
    // Initialize professional enhancements
    initCustomCursor();
    initProfessionalScrollAnimations();
    
});

// Enhanced Preloader Management
// Professional Fast Preloader
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    if (!preloader) return;
    
    // Hide preloader quickly for professional feel
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            
            setTimeout(() => {
                preloader.style.display = 'none';
                // Trigger smooth entrance animations
                triggerProfessionalEntrance();
            }, 300);
        }, 200); // Very fast preloader - 200ms only
    });
    
    // Also hide on DOMContentLoaded for even faster loading
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (preloader && !preloader.classList.contains('fade-out')) {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                    triggerProfessionalEntrance();
                }, 300);
            }
        }, 100); // Super fast - 100ms
    });
}

// Professional entrance animations
function triggerProfessionalEntrance() {
    // Add loaded class to enable animations
    document.body.classList.add('page-loaded');
    
    // Smooth fade-in for main sections
    const mainSections = document.querySelectorAll('section, .hero-section');
    mainSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Animate navigation
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.opacity = '0';
        navbar.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            navbar.style.transition = 'all 0.5s ease';
            navbar.style.opacity = '1';
            navbar.style.transform = 'translateY(0)';
        }, 50);
    }
}

// Optimize performance by disabling heavy animations initially
document.addEventListener('DOMContentLoaded', () => {
    // Disable heavy animations until page is fully loaded
    const heavyAnimations = document.querySelectorAll('.floating-card, .liquid-shape, .particles-container');
    heavyAnimations.forEach(element => {
        element.style.animationPlayState = 'paused';
    });
});

// Enable all animations after page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('page-loaded');
        
        // Re-enable heavy animations
        const heavyAnimations = document.querySelectorAll('.floating-card, .liquid-shape, .particles-container');
        heavyAnimations.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }, 500);
});

// Enhanced Navigation Management
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle with advanced animation
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate menu items
        if (navMenu.classList.contains('active')) {
            navLinks.forEach((link, index) => {
                link.style.animation = `slideInLeft 0.5s ease-out ${index * 0.1}s forwards`;
            });
        }
    });
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
        
        // Add magnetic hover effect
        addMagneticEffect(link);
    });
    
    // Enhanced navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scrolling with easing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 100;
                smoothScrollTo(offsetTop, 1000);
            }
        });
    });
}

// Custom smooth scroll with easing
function smoothScrollTo(targetY, duration) {
    const startY = window.pageYOffset;
    const difference = targetY - startY;
    const startTime = performance.now();
    
    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startY + (difference * ease));
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Advanced Animation Observer with Multiple Effects
function initAdvancedAnimations() {
    const observerOptions = {
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: '0px 0px -10% 0px'
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animation || 'fadeInUp';
                const delay = element.dataset.delay || 0;
                
                setTimeout(() => {
                    element.classList.add('animate-in');
                    applyAnimation(element, animationType);
                }, delay);
                
                // Special handling for different elements
                if (element.classList.contains('service-card')) {
                    animateServiceCard(element);
                } else if (element.classList.contains('stat-item')) {
                    animateStatItem(element);
                } else if (element.classList.contains('portfolio-item')) {
                    animatePortfolioItem(element);
                }
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(`
        .service-card, .feature-item, .portfolio-item, .contact-item,
        .stat-item, .about-visual, .section-header, .hero-visual
    `);
    
    animatableElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.dataset.delay = index * 100;
        animationObserver.observe(el);
    });
}

// Apply different animation types
function applyAnimation(element, type) {
    const animations = {
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
        slideInLeft: 'slideInLeft 0.8s ease-out forwards',
        slideInRight: 'slideInRight 0.8s ease-out forwards',
        scaleIn: 'scaleIn 0.6s ease-out forwards',
        rotateIn: 'rotateIn 0.8s ease-out forwards',
        bounceIn: 'bounceIn 1s ease-out forwards'
    };
    
    element.style.animation = animations[type] || animations.fadeInUp;
}

// Animate service cards with stagger effect
function animateServiceCard(card) {
    const icon = card.querySelector('.service-icon');
    const title = card.querySelector('h3');
    const features = card.querySelectorAll('.service-features li');
    
    setTimeout(() => {
        if (icon) icon.style.animation = 'iconBounce 0.6s ease-out forwards';
    }, 200);
    
    setTimeout(() => {
        if (title) title.style.animation = 'titleSlide 0.8s ease-out forwards';
    }, 400);
    
    features.forEach((feature, index) => {
        setTimeout(() => {
            feature.style.animation = 'featureSlide 0.6s ease-out forwards';
        }, 600 + (index * 100));
    });
}

// Animate statistics with counting effect
function animateStatItem(statItem) {
    const number = statItem.querySelector('.stat-number');
    if (number) {
        animateCounter(number);
    }
}

// Animate portfolio items with 3D effect
function animatePortfolioItem(item) {
    item.style.animation = 'portfolio3DIn 1s ease-out forwards';
}

// Enhanced Animated Counters with Smooth Easing
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                // Check if already animated
                if (!element.classList.contains('counted')) {
                    element.classList.add('counted');
                    animateCounterAdvanced(element);
                    counterObserver.unobserve(element);
                }
            }
        });
    }, {
        threshold: 0.5, // Trigger when 50% of element is visible
        rootMargin: '0px'
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounterAdvanced(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000; // 2 seconds animation
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuart(progress);
        
        // Start from 1 and count up to target
        const current = Math.floor(1 + (eased * (target - 1)));
        
        // Add + suffix for all numbers (no % symbol)
        element.textContent = current + '+';
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Final value with + suffix
            element.textContent = target + '+';
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

// Initialize Particle System
function initParticleSystem() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;
    
    // Add more dynamic particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'dynamic-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: var(--primary-color);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.6 + 0.2};
            animation: dynamicFloat ${Math.random() * 20 + 15}s linear infinite;
            animation-delay: ${Math.random() * -20}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Magnetic Effects for Interactive Elements
function initMagneticEffects() {
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary, .cta-nav-btn, .service-card');
    
    magneticElements.forEach(addMagneticEffect);
}

function addMagneticEffect(element) {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.15;
        const moveY = y * 0.15;
        
        element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0, 0) scale(1)';
    });
}

// Advanced Interactions
function initAdvancedInteractions() {
    // Parallax effect for hero elements
    initParallaxEffects();
    
    // Mouse trail effect
    initMouseTrail();
    
    // Cursor enhancement
    initCustomCursor();
    
    // Section transitions
    initSectionTransitions();
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.liquid-shape, .floating-card');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.05 + (index * 0.02);
            const yPos = -(scrolled * speed);
            element.style.transform += ` translateY(${yPos}px)`;
        });
    });
}

// Mouse Trail Effect
function initMouseTrail() {
    const trail = [];
    const trailLength = 10;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.cssText = `
            position: fixed;
            width: ${8 - i * 0.5}px;
            height: ${8 - i * 0.5}px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - i * 0.1};
            transition: transform 0.1s ease-out;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    document.addEventListener('mousemove', (e) => {
        trail.forEach((dot, index) => {
            setTimeout(() => {
                dot.style.left = e.clientX - dot.offsetWidth / 2 + 'px';
                dot.style.top = e.clientY - dot.offsetHeight / 2 + 'px';
            }, index * 50);
        });
    });
}

// Enhanced Portfolio Filter System (keeping existing)
function initPortfolio() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter with animation
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    b.style.transform = 'scale(1)';
                }, 100);
            });
            
            btn.classList.add('active');
            btn.style.transform = 'scale(1.05)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);
            
            const filter = btn.dataset.filter;
            
            // Filter portfolio items with stagger animation
            portfolioItems.forEach((item, index) => {
                setTimeout(() => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1) rotateY(0deg)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8) rotateY(90deg)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }, index * 50);
            });
        });
    });
}

// Contact Form Management
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateForm(data)) {
                submitForm(data);
            }
        });
        
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }
}

function validateForm(data) {
    let isValid = true;
    
    // Check required fields
    const required = ['name', 'email', 'service', 'message'];
    required.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Validate email
    if (data.email && !isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

function validateField(input) {
    const value = input.value.trim();
    const name = input.name;
    
    clearFieldError(input);
    
    if (input.required && !value) {
        showFieldError(name, 'This field is required');
        return false;
    }
    
    if (name === 'email' && value && !isValidEmail(value)) {
        showFieldError(name, 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    const group = field?.closest('.form-group');
    
    if (group) {
        group.classList.add('error');
        
        // Remove existing error message
        const existingError = group.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        group.appendChild(errorDiv);
    }
}

function clearFieldError(input) {
    const group = input.closest('.form-group');
    if (group) {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitForm(data) {
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showSuccessMessage();
        document.querySelector('.contact-form').reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function showSuccessMessage() {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>Thank you! Your message has been sent successfully.</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Theme Toggle
function initThemeToggle() {
    // Always set dark theme
    document.body.classList.add('dark-theme');
}

// Scroll Effects
function initScrollEffects() {
    // Parallax effect for hero background
    const heroShapes = document.querySelectorAll('.liquid-shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        heroShapes.forEach((shape, index) => {
            const rate = scrolled * -0.1 * (index + 1);
            shape.style.transform = `translateY(${rate}px)`;
        });
    });
    
    // Progress bar on scroll
    createScrollProgressBar();
}

function createScrollProgressBar() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    const progressFill = progressBar.querySelector('.scroll-progress-fill');
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        
        progressFill.style.width = scrolled + '%';
    });
}

// Utility Functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Add CSS for notifications and progress bar
const additionalStyles = `
.success-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    transform: translateX(400px);
    transition: transform 0.3s ease;
    z-index: 10000;
}

.success-notification.show {
    transform: translateX(0);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.notification-content i {
    font-size: 1.2rem;
}

.scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: rgba(0, 0, 0, 0.1);
    z-index: 1001;
}

.scroll-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
    width: 0%;
    transition: width 0.1s ease;
}

.form-group.error input,
.form-group.error textarea,
.form-group.error select {
    border-color: #e74c3c;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.error-message {
    color: #e74c3c;
    font-size: 0.9rem;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.error-message::before {
    content: '⚠';
}

/* Dark mode styles */
body.dark-mode {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --bg-tertiary: #404040;
    --text-primary: #ffffff;
    --text-secondary: #cccccc;
    --text-muted: #999999;
}

body.dark-mode .navbar {
    background: rgba(26, 26, 26, 0.95);
}

body.dark-mode .service-card,
body.dark-mode .contact-form-container,
body.dark-mode .portfolio-overlay {
    background: var(--bg-secondary);
}

body.dark-mode .service-card:not(.featured) h3,
body.dark-mode .service-card:not(.featured) p,
body.dark-mode .feature-content h4,
body.dark-mode .feature-content p {
    color: var(--text-primary);
}

@media (max-width: 768px) {
    .success-notification {
        right: 10px;
        left: 10px;
        transform: translateY(-100px);
    }
    
    .success-notification.show {
        transform: translateY(0);
    }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Performance optimization
const observerConfig = {
    rootMargin: '50px',
    threshold: 0.1
};

// Lazy load images when implemented
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    }, observerConfig);
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if images are present
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Ultra-Professional Cursor System (DISABLED)
function initCustomCursor() {
    // Cursor animations disabled - using standard browser cursor
    return;
}

// ============================================
// PROFESSIONAL SCROLL ANIMATIONS SYSTEM
// ============================================

// Initialize Professional Scroll System
function initProfessionalScrollAnimations() {
    createScrollIndicator();
    initScrollProgressBar();
    initScrollRevealAnimations();
    initSmoothScrolling();
    initParallaxEffects();
}

// Create Professional Scroll Indicator
function createScrollIndicator() {
    const sections = document.querySelectorAll('section');
    if (sections.length === 0) return;
    
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    
    sections.forEach((section, index) => {
        const dot = document.createElement('div');
        dot.className = 'scroll-dot';
        dot.dataset.section = index;
        
        // Add click handler for smooth scroll
        dot.addEventListener('click', () => {
            const targetSection = sections[index];
            const offsetTop = targetSection.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
        
        scrollIndicator.appendChild(dot);
    });
    
    document.body.appendChild(scrollIndicator);
    
    // Update active dot on scroll
    window.addEventListener('scroll', () => {
        updateActiveScrollDot(sections);
    });
}

// Update Active Scroll Dot
function updateActiveScrollDot(sections) {
    const scrollPosition = window.pageYOffset + window.innerHeight / 2;
    const dots = document.querySelectorAll('.scroll-dot');
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) {
                dots[index].classList.add('active');
            }
        }
    });
}

// Initialize Professional Scroll Progress Bar
function initScrollProgressBar() {
    let progressBar = document.querySelector('.scroll-progress');
    
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
    }
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize Scroll Reveal Animations
function initScrollRevealAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animate || 'scroll-animate';
                
                // Add appropriate animation class
                element.classList.add('animate-in');
                
                // Special handling for staggered animations
                if (element.classList.contains('stagger-children')) {
                    const children = element.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 100);
                    });
                }
                
                revealObserver.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll(`
        .scroll-animate, .scroll-animate-left, .scroll-animate-right, 
        .scroll-animate-scale, .reveal-section, .service-card, 
        .portfolio-item, .contact-item, .stat-item
    `);
    
    animateElements.forEach(el => {
        revealObserver.observe(el);
    });
}

// Enhanced Smooth Scrolling
function initSmoothScrolling() {
    // Custom smooth scroll function
    function smoothScrollTo(targetY, duration = 1000) {
        const startY = window.pageYOffset;
        const difference = targetY - startY;
        const startTime = performance.now();
        
        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = easeInOutCubic(progress);
            
            window.scrollTo(0, startY + (difference * ease));
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        
        requestAnimationFrame(step);
    }
    
    // Enhanced easing function
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    // Apply to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                smoothScrollTo(offsetTop, 800);
            }
        });
    });
}

// Enhanced Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.liquid-shape, .floating-card, .parallax-element');
    
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.02 + (index * 0.01);
            const yPos = -(scrolled * speed);
            const rotation = scrolled * 0.02;
            
            element.style.transform = `translateY(${yPos}px) rotateZ(${rotation}deg)`;
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// Initialize all scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add scroll animation classes to existing elements
    addScrollAnimationClasses();
    
    // Initialize the professional scroll system
    initProfessionalScrollAnimations();
});

// Add scroll animation classes to elements
function addScrollAnimationClasses() {
    // Add classes to sections for reveal animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('reveal-section');
    });
    
    // Add classes to various elements
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.classList.add('scroll-animate');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        item.classList.add('scroll-animate-scale');
        item.style.animationDelay = `${index * 0.1}s`;
    });
    
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        const animationType = index % 2 === 0 ? 'scroll-animate-left' : 'scroll-animate-right';
        item.classList.add(animationType);
        item.style.animationDelay = `${index * 0.2}s`;
    });
}

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('SW Registered'))
            .catch(() => console.log('SW Registration Failed'));
    });
}