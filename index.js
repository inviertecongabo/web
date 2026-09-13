document.addEventListener('DOMContentLoaded', () => {
    // --- Menú Móvil Hamburger ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // --- Navegación Activa al hacer Scroll ---
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Detecta qué sección ocupa la mayor parte de la pantalla
            if (window.scrollY >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
        
        // Agregar sombra o blur adicional al header al hacer scroll
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
            header.style.backgroundColor = 'rgba(10, 14, 23, 0.9)';
        } else {
            header.style.boxShadow = 'none';
            header.style.backgroundColor = 'rgba(10, 14, 23, 0.75)';
        }
    });

    // --- Filtrado de Categorías de Videos ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const videoCards = document.querySelectorAll('.video-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase activa de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Añadir clase activa al botón presionado
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            videoCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory.includes(filterValue)) {
                    // Animación de entrada
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    // Animación de salida
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // Coincide con la duración de la transición
                }
            });
        });
    });

    // --- Registro Real al Boletín con Web3Forms ---
    const subscribeForm = document.getElementById('subscribeForm');
    const formMessage = document.getElementById('formMessage');

    if (subscribeForm && formMessage) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = subscribeForm.querySelector('input[type="email"]');
            const submitButton = subscribeForm.querySelector('button');
            const emailValue = emailInput.value.trim();

            if (!emailValue) return;

            // Mostrar estado de carga
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            formMessage.textContent = '';
            formMessage.className = 'form-message';

            // Petición real a la API de Web3Forms
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: '325cfa7a-cff8-4928-9bfc-b3f24c2653e1',
                    email: emailValue,
                    from_name: 'Web de Invierte con Gabo',
                    subject: '¡Nuevo Suscriptor en tu Web!'
                })
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status === 200) {
                    // Registro exitoso
                    formMessage.textContent = '¡Listo! Te has unido a la comunidad con éxito.';
                    formMessage.classList.add('success');
                    emailInput.value = '';
                } else {
                    // Servidor responde con error
                    formMessage.textContent = json.message || 'Ocurrió un error. Intenta de nuevo.';
                    formMessage.classList.add('error');
                }
            })
            .catch(error => {
                // Error de red
                console.error(error);
                formMessage.textContent = 'Error de conexión. Revisa tu red e intenta de nuevo.';
                formMessage.classList.add('error');
            })
            .then(() => {
                // Restaurar botón y ocultar mensaje a los 5 segundos
                submitButton.disabled = false;
                submitButton.textContent = 'Unirme a la lista';
                
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.className = 'form-message';
                }, 5000);
            });
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Quitar las clases después de que termine la animación (800ms)
                // para que no interfieran con los efectos :hover de las tarjetas
                setTimeout(() => {
                    entry.target.classList.remove('reveal', 'active');
                }, 800);
                
                observer.unobserve(entry.target); // Solo animar la primera vez
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Interacción Acordeón FAQ ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Cerrar todos los demás ítems para mantener la vista limpia
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Si el item no estaba abierto, abrirlo
                if (!isOpen) {
                    item.classList.add('active');
                }
            });
        }
    });
});



const gatedTriggers = document.querySelectorAll('.gated-trigger');
const gatedModal = document.getElementById('gatedModal');
const gatedModalClose = document.getElementById('gatedModalClose');

if (gatedModal) {
    gatedTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            gatedModal.classList.add('active');
        });
    });
    if (gatedModalClose) {
        gatedModalClose.addEventListener('click', () => {
            gatedModal.classList.remove('active');
        });
    }
    // Cerrar al hacer clic fuera
    gatedModal.addEventListener('click', (e) => {
        if (e.target === gatedModal) {
            gatedModal.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const gatedTriggers = document.querySelectorAll('.gated-trigger');
    const gatedModal = document.getElementById('gatedModal');
    const gatedModalClose = document.getElementById('gatedModalClose');

    if (gatedModal) {
        gatedTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                gatedModal.classList.add('active');
            });
        });
        if (gatedModalClose) {
            gatedModalClose.addEventListener('click', () => {
                gatedModal.classList.remove('active');
            });
        }
        gatedModal.addEventListener('click', (e) => {
            if (e.target === gatedModal) {
                gatedModal.classList.remove('active');
            }
        });
    }
});

// Hook Slider & Quiz Logic
document.addEventListener('DOMContentLoaded', () => {
    // --- Quiz Logic ---
    const quizOptions = document.querySelectorAll('.quiz-btn');
    const quizContainer = document.getElementById('quizOptions');
    const quizReveal = document.getElementById('quizReveal');
    const correctOption = document.getElementById('correctOption');

    if (quizOptions.length > 0) {
        quizOptions.forEach(btn => {
            btn.addEventListener('click', () => {
                if(quizContainer.classList.contains('answered')) return;

                // Lock options
                quizContainer.classList.add('answered');

                // Highlight the correct answer (C = time)
                correctOption.classList.add('reveal-correct');

                // Hide placeholder, show answer
                const placeholder = document.getElementById('quizPlaceholder');
                if (placeholder) placeholder.classList.add('hidden');

                quizReveal.classList.remove('quiz-reveal-hidden');
                quizReveal.classList.add('quiz-reveal-visible');
            });
        });
    }

    // --- Slider Logic ---
    const track  = document.getElementById('toolsSlidesTrack');
    const hookCta = document.getElementById('hookCta');
    const hookBack = document.getElementById('hookBack');

    if (!track || !hookCta) return;

    hookCta.addEventListener('click', () => {
        track.style.transform = 'translateX(-100%)';
    });

    if (hookBack) {
        hookBack.addEventListener('click', () => {
            track.style.transform = 'translateX(0)';
        });
    }
});
