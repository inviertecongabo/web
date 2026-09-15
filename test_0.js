
        // Lógica de Tabs
        const tabs = document.querySelectorAll('.legal-tab');
        const sections = document.querySelectorAll('.legal-section');

        function activateTab(targetId) {
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            const tabToActivate = document.querySelector(`.legal-tab[data-target="${targetId}"]`);
            const sectionToActivate = document.getElementById(targetId);
            
            if(tabToActivate && sectionToActivate) {
                tabToActivate.classList.add('active');
                sectionToActivate.classList.add('active');
            }
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                activateTab(tab.getAttribute('data-target'));
                const url = new URL(window.location);
                let tabName = tab.getAttribute('data-target').replace('-sec','');
                url.searchParams.set('tab', tabName);
                window.history.pushState({}, '', url);
            });
        });

        // Leer parámetro de URL al cargar
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if(tabParam) {
            activateTab(tabParam + '-sec');
        }

        // Lógica del Acordeón FAQ
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    item.classList.toggle('active');
                });
            }
        });
    