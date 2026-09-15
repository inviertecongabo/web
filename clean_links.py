import glob

for file in glob.glob('*.html'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('href="index.html"', 'href="/"')
    content = content.replace('href="login.html"', 'href="/login"')
    content = content.replace('href="dashboard.html"', 'href="/dashboard"')
    
    # also handle query strings like legal.html?tab=faq
    content = content.replace('href="legal.html?', 'href="/legal?')
    content = content.replace('href="legal.html"', 'href="/legal"')
    
    content = content.replace('href="herramientas-info.html"', 'href="/herramientas-info"')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
