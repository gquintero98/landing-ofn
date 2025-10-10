        // ===== COUNTDOWN FUNCTIONALITY (MODIFIED) =====
        let countdownInterval;

        function initializeCountdown() {
            // Verificar si ya existe un tiempo de finalización guardado
            let endTime = localStorage.getItem('countdownEndTime');

            console.log('LocalStorage endTime:', endTime); // Debug

            if (!endTime || endTime === 'null') {
                // Si no existe, crear uno nuevo (24 horas desde ahora)
                endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
                localStorage.setItem('countdownEndTime', endTime);
                console.log('Creado nuevo endTime:', new Date(endTime)); // Debug
            } else {
                endTime = parseInt(endTime);
                const now = new Date().getTime();

                console.log('EndTime existente:', new Date(endTime), 'Ahora:', new Date(now)); // Debug

                // Si el tiempo ya expiró (pasaron las 24 horas), crear un nuevo contador
                if (now >= endTime) {
                    endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
                    localStorage.setItem('countdownEndTime', endTime);
                    console.log('Tiempo expirado, reiniciando contador para 24h más:', new Date(endTime)); // Debug
                } else {
                    console.log('Usando endTime existente:', new Date(endTime)); // Debug
                }
            }

            startCountdown(endTime);
        }

        function startCountdown(endTime) {
            // Debug: verificar elementos HTML
            console.log('Elementos encontrados:', {
                hours: document.getElementById("hours"),
                minutes: document.getElementById("minutes"),
                seconds: document.getElementById("seconds")
            });

            countdownInterval = setInterval(function () {
                const now = new Date().getTime();
                const distance = endTime - now; // Tiempo restante hasta la fecha final

                // Debug: mostrar valores
                console.log('Debug countdown:', {
                    now: new Date(now),
                    endTime: new Date(endTime),
                    distance: distance,
                    hoursCalc: Math.floor(distance / (1000 * 60 * 60))
                });

                if (distance > 0) {
                    // Calcular horas, minutos y segundos restantes
                    const hours = Math.floor(distance / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    // Debug: mostrar valores calculados
                    console.log('Valores calculados:', { hours, minutes, seconds });

                    // Actualizar la pantalla
                    const hoursEl = document.getElementById("hours");
                    const minutesEl = document.getElementById("minutes");
                    const secondsEl = document.getElementById("seconds");

                    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
                    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
                    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

                    // Show urgent message when less than 1 hour remaining
                    if (hours === 0) {
                        document.getElementById('urgentMessage').style.display = 'block';
                    } else {
                        document.getElementById('urgentMessage').style.display = 'none';
                    }

                    // Add pulsing effect when less than 5 minutes
                    if (hours === 0 && minutes < 5) {
                        document.querySelector('.countdown-timer').style.animation = 'pulse-urgent 1s ease-in-out infinite';
                        document.querySelector('.countdown-title').style.color = '#ff4757';
                    } else {
                        document.querySelector('.countdown-timer').style.animation = '';
                        document.querySelector('.countdown-title').style.color = '';
                    }

                    // Ocultar mensaje de expirado
                    document.getElementById("expiredMessage").style.display = "none";
                    document.getElementById('countdown').style.display = 'flex';
                    document.querySelector('.coupon-section').style.opacity = '1';

                } else {
                    // ¡El contador llegó a 00:00:00! 
                    document.getElementById("hours").textContent = "00";
                    document.getElementById("minutes").textContent = "00";
                    document.getElementById("seconds").textContent = "00";

                    document.getElementById('countdown').style.display = 'none';
                    document.getElementById('expiredMessage').style.display = 'block';
                    document.querySelector('.coupon-section').style.opacity = '0.5';
                    document.getElementById('urgentMessage').style.display = 'none';

                    clearInterval(countdownInterval);

                    // Automáticamente reiniciar un nuevo ciclo de 24 horas después de 3 segundos
                    setTimeout(function () {
                        console.log('¡Reiniciando contador para un nuevo día de 24 horas!');
                        localStorage.removeItem('countdownEndTime');

                        // Resetear elementos visuales
                        document.getElementById('countdown').style.display = 'flex';
                        document.getElementById('expiredMessage').style.display = 'none';
                        document.querySelector('.coupon-section').style.opacity = '1';
                        document.querySelector('.countdown-timer').style.animation = '';
                        document.querySelector('.countdown-title').style.color = '';

                        // Iniciar nuevo contador
                        initializeCountdown();
                    }, 3000);
                }
            }, 1000);
        }

        function copyCoupon() {
            const couponCode = 'CEOFM';

            // Try to use the modern clipboard API
            if (navigator.clipboard) {
                navigator.clipboard.writeText(couponCode).then(function () {
                    showCopyFeedback();
                }).catch(function (err) {
                    // Fallback for older browsers
                    fallbackCopyToClipboard(couponCode);
                });
            } else {
                // Fallback for older browsers
                fallbackCopyToClipboard(couponCode);
            }
        }

        function fallbackCopyToClipboard(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                showCopyFeedback();
            } catch (err) {
                console.log('Unable to copy to clipboard');
            }

            document.body.removeChild(textArea);
        }

        function showCopyFeedback() {
            const button = document.querySelector('.coupon-code');
            const originalText = button.textContent;

            button.textContent = '¡COPIADO!';
            button.style.background = 'linear-gradient(135deg, #2ed573, #7bed9f)';

            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = 'linear-gradient(135deg, #38b2ff, #00d4ff)';
            }, 2000);
        }

        // ===== INITIALIZE COUNTDOWN ON PAGE LOAD =====
        document.addEventListener('DOMContentLoaded', function () {
            initializeCountdown();
        });

        // Limpiar el intervalo cuando la página se cierra
        window.addEventListener('beforeunload', function () {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        });

        // ===== REST OF YOUR EXISTING CODE (UNCHANGED) =====

        // Carousel functionality
        let currentSlide = 0;
        const totalSlides = 4;
        const carouselWrapper = document.getElementById('carouselWrapper');
        const indicators = document.querySelectorAll('.indicator');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        // Pricing carousel functionality
        let currentPricingSlide = 0;
        const totalPricingSlides = 2;
        const pricingCarouselWrapper = document.getElementById('pricingCarouselWrapper');
        const pricingIndicators = document.querySelectorAll('.pricing-indicator');
        const pricingPrevBtn = document.getElementById('pricingPrevBtn');
        const pricingNextBtn = document.getElementById('pricingNextBtn');

        function updateCarousel() {
            const translateX = -currentSlide * 100;
            carouselWrapper.style.transform = `translateX(${translateX}%)`;

            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        }

        function updatePricingCarousel() {
            const translateX = -currentPricingSlide * 100;
            pricingCarouselWrapper.style.transform = `translateX(${translateX}%)`;

            // Update indicators
            pricingIndicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentPricingSlide);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            updateCarousel();
        }

        function nextPricingSlide() {
            currentPricingSlide = (currentPricingSlide + 1) % totalPricingSlides;
            updatePricingCarousel();
        }

        function prevPricingSlide() {
            currentPricingSlide = (currentPricingSlide - 1 + totalPricingSlides) % totalPricingSlides;
            updatePricingCarousel();
        }

        function goToPricingSlide(slideIndex) {
            currentPricingSlide = slideIndex;
            updatePricingCarousel();
        }

        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });

        // Pricing carousel event listeners
        pricingNextBtn.addEventListener('click', nextPricingSlide);
        pricingPrevBtn.addEventListener('click', prevPricingSlide);

        pricingIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToPricingSlide(index));
        });

        // Auto-play carousel
        setInterval(nextSlide, 5000);

        // FAQ Toggle Functionality
        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', () => {
                const answer = button.nextElementSibling;
                const toggle = button.querySelector('.faq-toggle');

                if (answer.style.display === 'block') {
                    answer.style.display = 'none';
                    toggle.textContent = '+';
                } else {
                    document.querySelectorAll('.faq-answer').forEach(ans => {
                        ans.style.display = 'none';
                    });
                    document.querySelectorAll('.faq-toggle').forEach(tog => {
                        tog.textContent = '+';
                    });

                    answer.style.display = 'block';
                    toggle.textContent = '-';
                }
            });
        });

        // Smooth Scrolling
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

        // Add scroll animations
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

        document.querySelectorAll('.testimonial-card, .time-unit').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Modal functionality
        const modals = {
            terms: document.getElementById('termsModal'),
            privacy: document.getElementById('privacyModal'),
            contact: document.getElementById('contactModal')
        };

        const links = {
            terms: document.getElementById('termsLink'),
            privacy: document.getElementById('privacyLink'),
            contact: document.getElementById('contactLink')
        };

        // Open modal function
        function openModal(modalName) {
            if (modals[modalName]) {
                modals[modalName].style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        }

        // Close modal function
        function closeModal(modalName) {
            if (modals[modalName]) {
                modals[modalName].style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }

        // Event listeners for opening modals
        links.terms.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('terms');
        });

        links.privacy.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('privacy');
        });

        links.contact.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('contact');
        });

        // Event listeners for closing modals
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modalName = e.target.getAttribute('data-modal');
                const modal = document.getElementById(modalName);
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        });

        // Close modal when clicking outside of it
        Object.values(modals).forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                Object.values(modals).forEach(modal => {
                    if (modal.style.display === 'block') {
                        modal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }
                });
            }
        });

        // Add interactive effects for countdown
        document.querySelectorAll('.time-unit').forEach(unit => {
            unit.addEventListener('mouseenter', () => {
                unit.style.transform = 'translateY(-5px) scale(1.05)';
            });

            unit.addEventListener('mouseleave', () => {
                unit.style.transform = 'translateY(0) scale(1)';
            });
        });