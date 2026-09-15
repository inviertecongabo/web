with open('legal.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('answer.style.maxHeight = null', 'answer.style.maxHeight = "0px"')

with open('legal.html', 'w', encoding='utf-8') as f:
    f.write(content)
