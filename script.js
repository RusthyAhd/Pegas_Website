// PEGAS WEBSITE - PROFESSIONAL LINKEDIN-STYLE
// Clean, minimal JavaScript with no heavy animations

document.addEventListener('DOMContentLoaded', function() {
    initPreloader();
    initNavigation();
    initCounters();
    initContactForm();
    initScrollEffects();
    initDivisionExpand();
    initITSolutions();
    initManufacturing();
    initDistribution();
    initTeam();
    initTeamFilters();
});

// Fast Preloader
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        }, 100);
    });
}

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
}

// Counter Animation (Simple)
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const animateCounters = () => {
        if (animated) return;
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count')) || 0;
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };
            
            updateCounter();
        });
        
        animated = true;
    };
    
    // Trigger when stats section is visible
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
}

// Portfolio Filters - Deprecated
function initPortfolio() {
    // Removed - replaced with Team section
}

// Team Section - Interactive Effects
function initTeam() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    if (!teamMembers.length) return;

    // Add entrance animation on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    teamMembers.forEach(member => {
        member.style.opacity = '0';
        member.style.transform = 'translateY(30px)';
        member.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(member);
    });

    // Add click event to show more details
    teamMembers.forEach(member => {
        member.addEventListener('click', function() {
            const name = this.querySelector('.member-name').textContent;
            const role = this.querySelector('.member-role').textContent;
            const bio = this.querySelector('.member-bio').textContent;
            
            const details = `
${name}
${role}

${bio}

Connect with ${name.split(' ')[0]} through their social media links above.
            `;
            
            // You can replace this with a custom modal if needed
            console.log(details);
        });
    });
}

// Contact Form
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Here you would normally send the data to a server
        console.log('Form data:', data);
        alert('Thank you for your message! We will get back to you soon.');
        form.reset();
    });
}

// Scroll Effects (Minimal)
function initScrollEffects() {
    // Add scroll-based fade-in for sections
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Theme Toggle (if needed)
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Scroll to top button (optional)
function initScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Division Expand/Collapse
function initDivisionExpand() {
    const divisionBlocks = document.querySelectorAll('.division-block');
    
    divisionBlocks.forEach(block => {
        // Click on division to expand
        block.addEventListener('click', (e) => {
            // Don't expand if clicking on links inside
            if (e.target.closest('a')) return;
            
            const isCollapsed = block.classList.contains('collapsed');
            
            // Collapse all other divisions
            divisionBlocks.forEach(otherBlock => {
                if (otherBlock !== block) {
                    otherBlock.classList.add('collapsed');
                }
            });
            
            // Toggle current division
            if (isCollapsed) {
                block.classList.remove('collapsed');
                // Smooth scroll to the division
                setTimeout(() => {
                    block.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            } else {
                block.classList.add('collapsed');
            }
        });
    });
    
    // Click outside to collapse all
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.division-block')) {
            divisionBlocks.forEach(block => {
                block.classList.add('collapsed');
            });
        }
    });
}

// IT Solutions Section with Liquid Popup
function initITSolutions() {
    const itContainer = document.querySelector('.it-solutions-container');
    const appCards = document.querySelectorAll('.it-app-card');
    const popup = document.getElementById('itAppPopup');
    const popupClose = popup?.querySelector('.popup-close');
    const popupOverlay = popup?.querySelector('.popup-overlay');
    
    if (!popup || !itContainer) return;

    // Toggle expand/collapse on IT Solutions container click
    itContainer.addEventListener('click', function(e) {
        // Don't toggle if clicking on app cards or their buttons
        if (e.target.closest('.it-app-card')) return;
        
        const isExpanded = itContainer.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse
            itContainer.classList.remove('expanded');
        } else {
            // Expand
            itContainer.classList.add('expanded');
            // Smooth scroll to show the expanded content
            setTimeout(() => {
                itContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    });

    // Click outside to collapse
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.it-solutions-container')) {
            itContainer.classList.remove('expanded');
        }
    });

    // Handle navigation link click
    const itNavLink = document.querySelector('a[href="#it-division"]');
    if (itNavLink) {
        itNavLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Scroll to IT Solutions card
            itContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Expand after a short delay
            setTimeout(() => {
                itContainer.classList.add('expanded');
            }, 500);
        });
    }

    // App data
    const appsData = {
        'salesrep-app': {
            icon: 'fa-user-tie',
            title: 'Part-time SalesRep App',
            subtitle: 'Flexible sales force management platform',
            features: [
                'Real-time Commission Tracking',
                'GPS-based Check-in/Check-out',
                'Performance Analytics Dashboard',
                'Product Catalog Management',
                'Customer Database Access',
                'Instant Notification System',
                'Weekly/Monthly Payment Reports',
                'Flexible Shift Scheduling'
            ],
            specs: [
                { label: 'Platform', value: 'iOS & Android' },
                { label: 'Technology', value: 'Flutter, Firebase' },
                { label: 'Payment', value: 'Integrated Wallet' },
                { label: 'Features', value: 'GPS, Push Notifications' }
            ]
        },
        'delivery-app': {
            icon: 'fa-motorcycle',
            title: 'Part-time Delivery Partner App',
            subtitle: 'Smart delivery network for flexible workers',
            features: [
                'AI-powered Route Optimization',
                'Real-time Order Tracking',
                'Instant Payout System',
                'Earnings Calculator',
                'Delivery History & Analytics',
                'In-app Navigation Support',
                'Customer Rating System',
                'Multi-order Management'
            ],
            specs: [
                { label: 'Platform', value: 'iOS & Android' },
                { label: 'Technology', value: 'React Native, Node.js' },
                { label: 'Maps', value: 'Google Maps API' },
                { label: 'Payment', value: 'Real-time Processing' }
            ]
        },
        'vending-app': {
            icon: 'fa-store-alt',
            title: 'Vending Machine App',
            subtitle: 'Smart vending machine control and monitoring',
            features: [
                'Remote Machine Monitoring',
                'Real-time Inventory Tracking',
                'Cashless Payment Integration',
                'Low Stock Alerts',
                'Sales Analytics Dashboard',
                'Temperature Control Monitoring',
                'Maintenance Scheduling',
                'Multi-location Management'
            ],
            specs: [
                { label: 'Platform', value: 'Web & Mobile App' },
                { label: 'Technology', value: 'IoT, React, MongoDB' },
                { label: 'Payment', value: 'NFC, QR Code, Cards' },
                { label: 'Connectivity', value: '4G/WiFi Enabled' }
            ]
        }
    };

    // Open popup with app data
    function openPopup(appType) {
        const appData = appsData[appType];
        if (!appData) return;

        // Set popup content
        const popupIcon = popup.querySelector('.popup-icon');
        const popupTitle = popup.querySelector('.popup-title');
        const popupSubtitle = popup.querySelector('.popup-subtitle');
        const popupFeaturesList = popup.querySelector('.popup-features-list');
        const popupSpecs = popup.querySelector('.popup-specs');

        // Update icon
        popupIcon.innerHTML = `<i class="fas ${appData.icon}"></i>`;
        
        // Update title and subtitle
        popupTitle.textContent = appData.title;
        popupSubtitle.textContent = appData.subtitle;

        // Update features list
        popupFeaturesList.innerHTML = appData.features
            .map(feature => `<li>${feature}</li>`)
            .join('');

        // Update specs
        popupSpecs.innerHTML = appData.specs
            .map(spec => `
                <div class="spec-item">
                    <div class="spec-label">${spec.label}</div>
                    <div class="spec-value">${spec.value}</div>
                </div>
            `)
            .join('');

        // Show popup with animation
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close popup
    function closePopup() {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Add click event to app cards
    appCards.forEach(card => {
        const learnMoreBtn = card.querySelector('.app-learn-more');
        const appType = card.getAttribute('data-app');

        // Click on button
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openPopup(appType);
            });
        }
    });

    // Close popup events
    if (popupClose) {
        popupClose.addEventListener('click', closePopup);
    }

    if (popupOverlay) {
        popupOverlay.addEventListener('click', closePopup);
    }

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            closePopup();
        }
    });

    // Watch demo button
    const watchVideoBtn = popup?.querySelector('.btn-watch-video');
    if (watchVideoBtn) {
        watchVideoBtn.addEventListener('click', () => {
            alert('Video demo coming soon! This would open a video player with the application demonstration.');
        });
    }

    // Request demo button
    const requestDemoBtn = popup?.querySelector('.popup-cta');
    if (requestDemoBtn) {
        requestDemoBtn.addEventListener('click', () => {
            closePopup();
            // Scroll to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // More information button
    const moreInfoBtn = popup?.querySelector('.popup-info');
    if (moreInfoBtn) {
        moreInfoBtn.addEventListener('click', () => {
            alert('For more detailed information, please contact our sales team or download our product brochure.');
        });
    }
}

// Manufacturing Section
function initManufacturing() {
    const manufacturingContainer = document.querySelector('.manufacturing-container');
    const productCards = document.querySelectorAll('.manufacturing-card');
    
    if (!manufacturingContainer) return;

    // Toggle expand/collapse on Manufacturing container click
    manufacturingContainer.addEventListener('click', function(e) {
        // Don't toggle if clicking on product cards or their buttons
        if (e.target.closest('.manufacturing-card')) return;
        
        const isExpanded = manufacturingContainer.classList.contains('expanded');
        
        // Close other expanded sections
        closeAllSections();
        
        if (isExpanded) {
            // Collapse
            manufacturingContainer.classList.remove('expanded');
        } else {
            // Expand
            manufacturingContainer.classList.add('expanded');
            // Smooth scroll to show the expanded content
            setTimeout(() => {
                manufacturingContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    });

    // Handle navigation link click
    const manufacturingNavLink = document.querySelector('a[href="#manufacturing"]');
    if (manufacturingNavLink) {
        manufacturingNavLink.addEventListener('click', function(e) {
            e.preventDefault();
            closeAllSections();
            // Scroll to Manufacturing card
            manufacturingContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Expand after a short delay
            setTimeout(() => {
                manufacturingContainer.classList.add('expanded');
            }, 500);
        });
    }

    // Product card click - show details
    productCards.forEach(card => {
        const learnMoreBtn = card.querySelector('.product-learn-more');
        const productType = card.getAttribute('data-product');

        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showProductDetails(productType);
            });
        }
    });
}

function showProductDetails(productType) {
    const productDetails = {
        'bottle-juice': {
            name: 'Bottle Juice',
            description: 'Premium fresh fruit juices packed in eco-friendly glass bottles. Made from 100% natural ingredients with no artificial preservatives, colors, or flavors.',
            details: [
                'Available in: Orange, Apple, Mango, Mixed Fruit',
                'Volume: 500ml, 1L glass bottles',
                'Shelf life: 6 months refrigerated',
                'Certification: ISO 22000, HACCP certified',
                'Ingredients: Pure fruit extract, Natural sugar, Vitamin C',
                'Storage: Keep refrigerated at 4°C'
            ]
        },
        'cup-juice': {
            name: 'Cup Juice',
            description: 'Convenient single-serve juice cups perfect for kids and on-the-go refreshment. Sealed for maximum freshness and portability.',
            details: [
                'Available in: Orange, Apple, Grape, Strawberry',
                'Volume: 200ml sealed cups',
                'Shelf life: 4 months',
                'Features: Easy-peel lid, BPA-free packaging',
                'Perfect for: School lunches, Picnics, Travel',
                'Storage: Room temperature until opened'
            ]
        },
        'soft-drinks': {
            name: 'Soft Drinks',
            description: 'Refreshing carbonated beverages made with premium ingredients and natural flavors. Perfect for any occasion.',
            details: [
                'Available in: Cola, Lemon-Lime, Orange, Ginger Ale',
                'Volume: 330ml cans, 500ml, 1.5L, 2L bottles',
                'Shelf life: 12 months',
                'Features: Crisp carbonation, Natural flavors',
                'Low calorie options available',
                'Storage: Cool, dry place'
            ]
        }
    };

    const product = productDetails[productType];
    if (product) {
        let detailsHTML = `
            <strong>${product.name}</strong>\n\n
            ${product.description}\n\n
            Key Details:\n
            ${product.details.map(detail => `• ${detail}`).join('\n')}
        `;
        alert(detailsHTML);
    }
}

// Distribution Section
function initDistribution() {
    const distributionContainer = document.querySelector('.distribution-container');
    const distributionCard = document.querySelector('.distribution-card');
    
    if (!distributionContainer) return;

    // Toggle expand/collapse on Distribution container click
    distributionContainer.addEventListener('click', function(e) {
        // Don't toggle if clicking on distribution card or its button
        if (e.target.closest('.distribution-card')) return;
        
        const isExpanded = distributionContainer.classList.contains('expanded');
        
        // Close other expanded sections
        closeAllSections();
        
        if (isExpanded) {
            // Collapse
            distributionContainer.classList.remove('expanded');
        } else {
            // Expand
            distributionContainer.classList.add('expanded');
            // Smooth scroll to show the expanded content
            setTimeout(() => {
                distributionContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    });

    // Handle navigation link click
    const distributionNavLink = document.querySelector('a[href="#distribution"]');
    if (distributionNavLink) {
        distributionNavLink.addEventListener('click', function(e) {
            e.preventDefault();
            closeAllSections();
            // Scroll to Distribution card
            distributionContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Expand after a short delay
            setTimeout(() => {
                distributionContainer.classList.add('expanded');
            }, 500);
        });
    }

    // Distribution card button
    if (distributionCard) {
        const learnMoreBtn = distributionCard.querySelector('.distribution-learn-more');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showDistributionDetails();
            });
        }
    }
}

function showDistributionDetails() {
    const details = `
Credit Based Distribution Operating System

Our advanced distribution platform provides:

✓ Credit Management Features:
  • Flexible credit terms (7-90 days)
  • Automated credit scoring
  • Real-time credit limit monitoring
  • Payment collection tracking
  • Credit history analytics

✓ Route Optimization:
  • AI-powered delivery planning
  • GPS-based vehicle tracking
  • Fuel efficiency optimization
  • Multi-stop route planning

✓ Inventory Management:
  • Real-time stock monitoring
  • Automated reorder points
  • Warehouse management
  • Expiry date alerts
  • Batch tracking

✓ Reporting & Analytics:
  • Sales performance dashboards
  • Territory analysis
  • Product movement reports
  • Debtor aging reports

Contact us to get started with our distribution system!
    `;
    alert(details);
}

// Helper function to close all expanded sections
function closeAllSections() {
    const sections = [
        '.it-solutions-container',
        '.manufacturing-container',
        '.distribution-container'
    ];
    
    sections.forEach(selector => {
        const section = document.querySelector(selector);
        if (section) {
            section.classList.remove('expanded');
        }
    });
}

// Click outside to collapse all
document.addEventListener('click', function(e) {
    if (!e.target.closest('.floating-card')) {
        closeAllSections();
    }
});

// Team filter functionality
function initTeamFilters() {
    const filterButtons = document.querySelectorAll('.team-filters .filter-btn');
    const teamMembers = document.querySelectorAll('.team-member');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            teamMembers.forEach(member => {
                const memberCategory = member.getAttribute('data-category');
                
                if (filterValue === 'all' || memberCategory === filterValue) {
                    member.style.display = 'block';
                    // Add fade in animation
                    member.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    member.style.display = 'none';
                }
            });
        });
    });
    
    // Set initial active button
    if (filterButtons.length > 0) {
        filterButtons[0].classList.add('active');
    }
}
