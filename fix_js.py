with open('legal.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_js = '''        // Lógica del Acordeón FAQ
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const isOpen = item.classList.contains('active');
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                        const answer = otherItem.querySelector('.faq-answer');
                        if(answer) answer.style.maxHeight = null;
                    });
                    if (!isOpen) {
                        item.classList.add('active');
                        const answer = item.querySelector('.faq-answer');
                        if(answer) answer.style.maxHeight = answer.scrollHeight + "px";
                    }
                });
            }
        });'''

new_js = '''        // Lógica de los Acordeones (FAQ, Términos, Privacidad, Cookies)
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const isOpen = item.classList.contains('active');
                    
                    if (isOpen) {
                        item.classList.remove('active');
                        const answer = item.querySelector('.faq-answer');
                        if(answer) answer.style.maxHeight = null;
                    } else {
                        item.classList.add('active');
                        const answer = item.querySelector('.faq-answer');
                        if(answer) answer.style.maxHeight = answer.scrollHeight + "px";
                    }
                });
            }
        });'''

if 'const isOpen = item.classList.contains(' in content:
    content = content.replace(old_js.replace('ó', ''), new_js)
    # in case encoding issues, let's just do a simpler replace
    
with open('legal.html', 'w', encoding='utf-8') as f:
    f.write(content)
