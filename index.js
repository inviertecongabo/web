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

    // --- Simulación de Suscripción al Boletín ---
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

            // Simulación de petición de red (1.5 segundos)
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Unirme a la lista';
                
                // Respuesta exitosa simulada
                formMessage.textContent = '¡Bienvenido, Gabo te enviará contenido pronto!';
                formMessage.classList.add('success');
                emailInput.value = '';
                
                // Quitar mensaje después de 5 segundos
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.className = 'form-message';
                }, 5000);

            }, 1500);
        });
    }
});
