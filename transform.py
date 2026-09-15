import re

with open('legal.html', 'r', encoding='utf-8') as f:
    content = f.read()

def convert_to_accordion(match):
    section_id = match.group(1)
    title = match.group(2)
    updated = match.group(3)
    body = match.group(4)
    
    # Extract all h3 and p pairs
    items_html = ""
    # We will split by <h3> and then extract the title and the content
    parts = body.split('<h3>')
    
    # parts[0] might be empty or contain whitespace
    for part in parts[1:]:
        if '</h3>' not in part:
            continue
        h3_title, p_content = part.split('</h3>', 1)
        h3_title = h3_title.strip()
        p_content = p_content.strip()
        
        # Build faq-item
        item = f'''
                    <div class="faq-item">
                        <button class="faq-question">
                            <span>{h3_title}</span>
                            <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                        <div class="faq-answer">
                            {p_content}
                        </div>
                    </div>'''
        items_html += item
    
    new_section = f'''id="{section_id}" class="legal-section legal-content">
                <h2>{title}</h2>
                <p>{updated}</p>
                <div class="faq-accordion">{items_html}
                </div>
            </div>'''
    return new_section

# We need a regex that captures the section ID, title, date, and then the rest of the body up to the closing div of the section.
# Since the body contains <h3> and <p>, we can use a non-greedy match up to '</div>'
pattern = r'id="([^"]+)" class="legal-section legal-content">\s*<h2>(.*?)</h2>\s*<p>(.*?)</p>\s*(.*?)\s*</div>'

# We'll run this separately on each of the 3 sections to avoid matching across sections.
for sec_id in ['terms-sec', 'privacy-sec', 'cookies-sec']:
    # extract the section
    start_idx = content.find(f'id="{sec_id}"')
    end_idx = content.find('</div>', start_idx) + 6
    sec_content = content[start_idx:end_idx]
    
    new_sec_content = re.sub(pattern, convert_to_accordion, sec_content, flags=re.DOTALL)
    
    content = content[:start_idx] + new_sec_content + content[end_idx:]

with open('legal.html', 'w', encoding='utf-8') as f:
    f.write(content)

