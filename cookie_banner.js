(function() {
    // Si ya aceptó las cookies, no hacer nada
    if (localStorage.getItem('gabo_cookies_accepted')) return;

    // Crear el contenedor del banner
    const banner = document.createElement('div');
    banner.id = 'gabo-cookie-banner';
    
    // Estilos inyectados
    const style = document.createElement('style');
    style.innerHTML = `
        #gabo-cookie-banner {
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: rgba(15, 15, 18, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 16px 24px;
            border-radius: 100px;
            display: flex;
            align-items: center;
            gap: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(240, 185, 11, 0.1);
            z-index: 999999;
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            width: max-content;
            max-width: 90vw;
        }
        #gabo-cookie-banner.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        .gabo-cookie-text {
            color: rgba(255, 255, 255, 0.8);
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            margin: 0;
            line-height: 1.4;
        }
        .gabo-cookie-text strong {
            color: #F0B90B;
            font-weight: 500;
        }
        .gabo-cookie-btn {
            background: #F0B90B;
            color: #000;
            border: none;
            padding: 8px 20px;
            border-radius: 50px;
            font-family: 'Outfit', sans-serif;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .gabo-cookie-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(240, 185, 11, 0.3);
        }
        @media (max-width: 600px) {
            #gabo-cookie-banner {
                flex-direction: column;
                border-radius: 20px;
                padding: 20px;
                gap: 16px;
                text-align: center;
                bottom: 16px;
            }
            .gabo-cookie-btn {
                width: 100%;
            }
        }
    `;
    
    // HTML del banner
    banner.innerHTML = `
        <p class="gabo-cookie-text">
            🍪 Usamos <strong>cookies esenciales</strong> para mantener tu sesión segura. Cero rastreo publicitario.
        </p>
        <button class="gabo-cookie-btn" id="gabo-cookie-accept">Entendido</button>
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(banner);
    
    // Animar entrada después de 1 segundo
    setTimeout(() => {
        banner.classList.add('show');
    }, 1000);
    
    // Lógica del botón
    document.getElementById('gabo-cookie-accept').addEventListener('click', () => {
        localStorage.setItem('gabo_cookies_accepted', 'true');
        banner.style.transform = 'translateX(-50%) translateY(100px)';
        banner.style.opacity = '0';
        setTimeout(() => {
            banner.remove();
        }, 500);
    });
})();
