with open('legal.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update CSS
old_css = '.faq-item.active .faq-question { color: var(--accent); }'
new_css = '.faq-item.active .faq-question { color: var(--accent); }\n        .faq-item.active .faq-answer { max-height: 1000px; }'
content = content.replace(old_css, new_css)

# Update JS - remove inline style manipulation
import re

# find the script block
js_start = content.find('const faqItems = document.querySelectorAll(')
js_end = content.find('</script>', js_start)
old_js = content[js_start:js_end]

new_js = '''const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    item.classList.toggle('active');
                });
            }
        });
    '''
content = content[:js_start] + new_js + content[js_end:]

with open('legal.html', 'w', encoding='utf-8') as f:
    f.write(content)
