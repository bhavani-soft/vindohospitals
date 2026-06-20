/**
 * Vinod Multi Speciality Hospital - Animation & Interactivity Controller
 * Integrates GSAP ScrollTrigger, Lenis Smooth Scroll, theme switcher, FAQ accordions, and booking validation.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Theme Toggle System
    // ----------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const getPreferredTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) return storedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        // Dispatch custom event for particle system integration
        window.dispatchEvent(new Event('theme-changed'));
    };

    // Initialize theme
    setTheme(getPreferredTheme());

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(nextTheme);
        });
    }

    // ----------------------------------------------------------------------
    // 2. Lenis Smooth Scroll Setup
    // ----------------------------------------------------------------------
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like ease
            smoothWheel: true,
            wheelMultiplier: 1
        });

        // Integrate Lenis frames into standard animation tick
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // ----------------------------------------------------------------------
    // 3. GSAP Animations & ScrollTrigger
    // ----------------------------------------------------------------------
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        if (lenis) {
            lenis.on('scroll', ScrollTrigger.update);
        }

        // --- Navbar Scroll Styling ---
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            ScrollTrigger.create({
                start: '50px top',
                onEnter: () => navbar.classList.add('navbar-scrolled'),
                onLeaveBack: () => navbar.classList.remove('navbar-scrolled')
            });
        }

        // --- Hero Animation (On Load) ---
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        
        if (document.querySelector('.navbar')) {
            heroTl.from('.navbar', {
                y: -100,
                opacity: 0,
                duration: 1
            });
        }
        
        if (document.querySelector('.hero-content')) {
            heroTl.from('.hero-content span', {
                y: 30,
                opacity: 0,
                duration: 0.8
            }, '-=0.5')
            .from('.hero-title', {
                y: 40,
                opacity: 0,
                duration: 1
            }, '-=0.6')
            .from('.hero-description', {
                y: 30,
                opacity: 0,
                duration: 0.8
            }, '-=0.6')
            .from('.hero-actions', {
                y: 30,
                opacity: 0,
                duration: 0.8
            }, '-=0.6');
        }
        
        if (document.querySelector('.hero-main-card')) {
            heroTl.from('.hero-main-card', {
                scale: 0.95,
                opacity: 0,
                duration: 1.2
            }, '-=1.0');
        }
        
        if (document.querySelector('.hero-floating-status')) {
            heroTl.from('.hero-floating-status', {
                x: 50,
                opacity: 0,
                duration: 0.8
            }, '-=0.8');
        }

        // --- About Details Section Reveal ---
        if (document.querySelector('#about-details')) {
            gsap.from('#about-details .about-content > *', {
                x: -30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#about-details',
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                }
            });

            gsap.from('#about-details .about-feature-card', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#about-details .about-features-grid',
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                }
            });
        }

        // --- Instagram Updates Scroll Reveal ---
        if (document.querySelector('#about-instagram')) {
            gsap.from('#about-instagram .instagram-card', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#about-instagram .instagram-grid',
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                }
            });
        }

        // --- Services Grid Scroll Reveal ---
        if (document.querySelector('#services .dept-card')) {
            gsap.from('#services .dept-card', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#services .dept-grid',
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                }
            });
        }

        // --- Facilities Section Reveal ---
        if (document.querySelector('#facilities .facility-card')) {
            gsap.from('#facilities .facility-card', {
                scale: 0.95,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#facilities .facilities-grid',
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                }
            });
        }

        // --- Booking Section Reveal ---
        if (document.querySelector('#booking')) {
            gsap.from('#booking .booking-text > *', {
                x: -30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#booking',
                    start: 'top 95%'
                }
            });

            gsap.from('#booking .booking-card', {
                x: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#booking',
                    start: 'top 95%'
                }
            });
        }

        // --- Testimonials Grid Scroll Reveal ---
        if (document.querySelector('#testimonials .dept-card')) {
            gsap.from('#testimonials .dept-card', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#testimonials .dept-grid',
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                }
            });
        }

        // --- FAQ Accordions Reveal ---
        if (document.querySelector('#faq .faq-item')) {
            gsap.from('#faq .faq-item', {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#faq .faq-accordion',
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                }
            });
        }
    }

    // ----------------------------------------------------------------------
    // 4. FAQ Accordion Interactivity
    // ----------------------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const content = item.querySelector('.faq-content');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-content').style.maxHeight = null;
            });
            
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // ----------------------------------------------------------------------
    // 5. Booking Form Validation & Success Display
    // ----------------------------------------------------------------------
    const bookingForm = document.getElementById('appointment-form');
    const successOverlay = document.getElementById('form-success-overlay');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    if (bookingForm && successOverlay) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate Name
            const nameInput = document.getElementById('booking-name');
            const nameGroup = nameInput.parentElement;
            if (nameInput.value.trim() === '') {
                nameGroup.classList.add('error');
                isValid = false;
            } else {
                nameGroup.classList.remove('error');
            }

            // Validate Email
            const emailInput = document.getElementById('booking-email');
            const emailGroup = emailInput.parentElement;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailGroup.classList.add('error');
                isValid = false;
            } else {
                emailGroup.classList.remove('error');
            }

            // Validate Phone
            const phoneInput = document.getElementById('booking-phone');
            const phoneGroup = phoneInput.parentElement;
            const phoneRegex = /^[0-9+\s\-()]{10,15}$/;
            if (!phoneRegex.test(phoneInput.value.trim())) {
                phoneGroup.classList.add('error');
                isValid = false;
            } else {
                phoneGroup.classList.remove('error');
            }

            // Validate Department & Doctor Selection
            const deptSelect = document.getElementById('booking-dept');
            const deptGroup = deptSelect.parentElement;
            if (deptSelect.value === '') {
                deptGroup.classList.add('error');
                isValid = false;
            } else {
                deptGroup.classList.remove('error');
            }

            const docSelect = document.getElementById('booking-doctor');
            const docGroup = docSelect.parentElement;
            if (docSelect.value === '') {
                docGroup.classList.add('error');
                isValid = false;
            } else {
                docGroup.classList.remove('error');
            }

            // Validate Date
            const dateInput = document.getElementById('booking-date');
            const dateGroup = dateInput.parentElement;
            if (dateInput.value === '') {
                dateGroup.classList.add('error');
                isValid = false;
            } else {
                dateGroup.classList.remove('error');
            }

            if (isValid) {
                // Compile details for the success overlay
                document.getElementById('summary-doc').innerText = deptSelect.options[deptSelect.selectedIndex].text;
                document.getElementById('summary-date').innerText = dateInput.value;
                document.getElementById('summary-phone').innerText = phoneInput.value;

                // Animate overlay entrance
                successOverlay.classList.add('active');
                gsap.fromTo(successOverlay, 
                    { opacity: 0 }, 
                    { opacity: 1, duration: 0.5, ease: 'power2.out' }
                );

                // Animate checkmark
                gsap.fromTo('.success-icon-container', 
                    { scale: 0.5, rotate: -45 }, 
                    { scale: 1, rotate: 0, duration: 0.6, delay: 0.1, ease: 'back.out(1.7)' }
                );
            }
        });

        // Close Success Screen
        if (closeSuccessBtn) {
            closeSuccessBtn.addEventListener('click', () => {
                // Fade out overlay
                gsap.to(successOverlay, {
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.in',
                    onComplete: () => {
                        successOverlay.classList.remove('active');
                        bookingForm.reset();
                    }
                });
            });
        }
    // ----------------------------------------------------------------------
    // 6. Mobile Navigation Menu
    // ----------------------------------------------------------------------
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    const openMobileMenu = () => {
        if (mobileNavOverlay) {
            mobileNavOverlay.classList.add('active');
            document.body.classList.add('mobile-menu-open');
            // Re-initialize Lucide icons for the mobile menu overlay
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    };

    const closeMobileMenu = () => {
        if (mobileNavOverlay) {
            mobileNavOverlay.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
        }
    };

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', openMobileMenu);
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    // Close on clicking a navigation link (auto-scroll)
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close on clicking the backdrop (outside the panel)
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', (e) => {
            // Only close if clicking the backdrop (not the panel itself)
            if (e.target === mobileNavOverlay || e.target === mobileNavOverlay.querySelector('::before')) {
                closeMobileMenu();
            }
        });

        // More robust: close if click is NOT inside the panel
        mobileNavOverlay.addEventListener('mousedown', (e) => {
            const panel = mobileNavOverlay.querySelector('.mobile-nav-panel');
            if (panel && !panel.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNavOverlay && mobileNavOverlay.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Disable Lenis smooth scroll on touch devices for better performance
    if (lenis && 'ontouchstart' in window) {
        lenis.destroy();
    }
});
