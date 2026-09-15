import glob, re

def add_dimensions(match):
    svg_tag = match.group(0)
    if 'width=' not in svg_tag and 'height=' not in svg_tag:
        return svg_tag.replace('<svg ', '<svg width="24" height="24" ')
    return svg_tag

for file in glob.glob('*.html'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(r'<svg [^>]*>', add_dimensions, content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
