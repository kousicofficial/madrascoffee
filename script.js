document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // Sticky Navbar transparency effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
            navbar.style.height = '70px';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Intersection Observer for Slide-in Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.course-card, .lab-card, .alumni-card, .section-title, .about-content');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Handle "visible" class
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Mobile Flip Toggle for Program Cards
    document.querySelectorAll('.program-flip-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });

    // Smooth scroll for anchor links (if browser doesn't support scroll-behavior: smooth natively)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Modern Multi-Step Admission Form Handling
    const admissionForm = document.getElementById('admissionForm');
    const formSteps = document.querySelectorAll('.form-step');
    const stepNodes = document.querySelectorAll('.step-node');
    const progressBar = document.getElementById('progressBar');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    if (admissionForm) {
        let currentStep = 1;

        // --- Strict Phone Number Validation ---
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('keydown', (e) => {
                // Allow: backspace, delete, tab, escape, enter
                if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                    // Allow: Ctrl+A, Command+A
                    (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                    // Allow: home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 40)) {
                    return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });

            phoneInput.addEventListener('input', (e) => {
                // Remove any non-numeric characters (safety fallback for mobile/pasting)
                const start = phoneInput.selectionStart;
                const end = phoneInput.selectionEnd;
                const originalValue = phoneInput.value;
                const cleanedValue = originalValue.replace(/[^0-9]/g, '');

                if (originalValue !== cleanedValue) {
                    phoneInput.value = cleanedValue;
                    // Restore cursor position
                    phoneInput.setSelectionRange(start - (originalValue.length - cleanedValue.length), end - (originalValue.length - cleanedValue.length));
                }
            });

            phoneInput.addEventListener('paste', (e) => {
                const pasteData = (e.clipboardData || window.clipboardData).getData('text');
                if (!/^\d+$/.test(pasteData)) {
                    e.preventDefault();
                }
            });
        }

        const updateProgress = () => {
            const progress = ((currentStep - 1) / (formSteps.length - 1)) * 100;
            if (progressBar) progressBar.style.width = `${progress}%`;

            stepNodes.forEach((node, idx) => {
                const nodeStep = idx + 1;
                node.classList.remove('active', 'completed');
                if (nodeStep === currentStep) {
                    node.classList.add('active');
                } else if (nodeStep < currentStep) {
                    node.classList.add('completed');
                    node.innerHTML = '<i class="fa-solid fa-check"></i>';
                } else {
                    node.innerHTML = nodeStep;
                }
            });
        };

        const validateStep = (step) => {
            const activeStep = document.querySelector(`.form-step[data-step="${step}"]`);
            const inputs = activeStep.querySelectorAll('input[required], select[required]');
            let isValid = true;
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    isValid = false;
                    input.parentElement.parentElement.classList.add('error');
                    setTimeout(() => input.parentElement.parentElement.classList.remove('error'), 500);
                }
            });
            return isValid;
        };

        const checkTotalValidity = () => {
            if (admissionForm.checkValidity()) {
                submitBtn.disabled = false;
            } else {
                submitBtn.disabled = true;
            }
        };

        // Event Listeners for Next/Prev
        admissionForm.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-next')) {
                if (validateStep(currentStep)) {
                    currentStep++;
                    formSteps.forEach(step => step.classList.remove('active'));
                    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
                    updateProgress();
                    checkTotalValidity();
                }
            } else if (e.target.classList.contains('btn-prev')) {
                currentStep--;
                formSteps.forEach(step => step.classList.remove('active'));
                document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
                updateProgress();
            }
        });

        // Validation on input
        admissionForm.addEventListener('input', checkTotalValidity);

        // Ripple Effect
        admissionForm.addEventListener('mousedown', (e) => {
            if (e.target.closest('.btn-ripple')) {
                const btn = e.target.closest('.btn-ripple');
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');

                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                btn.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            }
        });

        // Form Submit with EmailJS
        admissionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtnFinal = admissionForm.querySelector('.btn-submit');
            submitBtnFinal.classList.add('loading');
            submitBtnFinal.disabled = true;

            // EmailJS Integration
            const serviceID = 'service_hqlvo6l';
            const templateID = 'template_hsems46';

            emailjs.sendForm(serviceID, templateID, admissionForm)
                .then(() => {
                    submitBtnFinal.classList.remove('loading');
                    admissionForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, (error) => {
                    alert("Oops! Something went wrong. Please try again later.");
                    console.error('EmailJS Error:', error);
                    submitBtnFinal.classList.remove('loading');
                    submitBtnFinal.disabled = false;
                });
        });
    }

    window.resetForm = () => {
        if (admissionForm && formSuccess) {
            admissionForm.reset();
            currentStep = 1;
            formSteps.forEach(step => step.classList.remove('active'));
            formSteps[0].classList.add('active');
            updateProgress();

            admissionForm.style.display = 'block';
            formSuccess.style.display = 'none';
            const sBtn = admissionForm.querySelector('.btn-submit');
            if (sBtn) sBtn.disabled = true;
        }
    };

    // --- Auto-Play Only Alumni Carousel ---
    const alumniTrack = document.querySelector('.alumni-track');
    const alumniWrapper = document.querySelector('.alumni-carousel-wrapper');

    if (alumniTrack && alumniWrapper) {
        let originalCards = Array.from(alumniTrack.children);
        const cardCount = originalCards.length;
        let currentIndex = 0;
        let isTransitioning = false;
        let autoPlayTimer;

        // Configuration based on screen size
        const getVisibleCardsCount = () => {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1200) return 2;
            return 3;
        };

        // Initialize Carousel
        const initCarousel = () => {
            const visibleCount = getVisibleCardsCount();
            alumniTrack.innerHTML = '';

            // Clone sets for infinite scrolling
            const endClones = originalCards.slice(0, visibleCount).map(c => c.cloneNode(true));
            const startClones = originalCards.slice(-visibleCount).map(c => c.cloneNode(true));

            startClones.forEach(c => alumniTrack.appendChild(c));
            originalCards.forEach(c => alumniTrack.appendChild(c));
            endClones.forEach(c => alumniTrack.appendChild(c));

            currentIndex = visibleCount;
            updatePosition(false);
            startAutoPlay();
        };

        const updatePosition = (animate = true) => {
            const cardWidth = alumniTrack.children[0].offsetWidth;
            const gap = 32; // match CSS gap
            const offset = currentIndex * (cardWidth + gap);

            alumniTrack.style.transition = animate ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
            alumniTrack.style.transform = `translateX(-${offset}px)`;
        };

        const moveSlide = (step) => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex += step;
            updatePosition();

            alumniTrack.addEventListener('transitionend', function handleEnd() {
                isTransitioning = false;
                const visibleCount = getVisibleCardsCount();

                // Infinite Loop Check
                if (currentIndex >= cardCount + visibleCount) {
                    currentIndex = visibleCount;
                    updatePosition(false);
                } else if (currentIndex < visibleCount) {
                    currentIndex = cardCount + visibleCount - 1;
                    updatePosition(false);
                }
                alumniTrack.removeEventListener('transitionend', handleEnd);
            });
        };

        const startAutoPlay = () => {
            stopAutoPlay();
            // Auto-play every 3.5 seconds - continuous, no pause
            autoPlayTimer = setInterval(() => moveSlide(1), 3500);
        };

        const stopAutoPlay = () => clearInterval(autoPlayTimer);

        // Responsive Resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(initCarousel, 250);
        });

        // First Load
        initCarousel();
    }
});
