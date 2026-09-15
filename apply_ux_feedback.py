import re

with open('login.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update .auth-footer a styles
content = content.replace(
    '.auth-footer a { color: var(--accent); text-decoration: none; font-weight: 600; }',
    '.auth-footer a { color: var(--text-muted); text-decoration: none; font-weight: 600; transition: color 0.2s; }\n        .auth-footer a:hover { color: var(--accent); }'
)

# 2. Fix 'pagina' typo
content = content.replace(
    '<a href="/">&larr; Volver a la pagina principal</a>',
    '<a href="/">&larr; Volver a la página principal</a>'
)

# 3. Update JS Logic for Registration Success
# Find the exact else block for success
js_success_old = """            else { 
                clearMsg();
                const formContainer = document.getElementById('registerForm');
                formContainer.innerHTML = `
                    <div style="text-align: center; padding: 20px 10px; animation: fadeIn 0.5s ease forwards;">
                        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#00C087" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 20px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        <h3 style="color: var(--text-primary); font-size: 1.6rem; margin-bottom: 16px; font-family: var(--font-heading);">¡Ya casi estás listo, ${name.split(' ')[0]}!</h3>
                        <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 24px; font-size: 1.05rem;">
                            Te enviamos un enlace mágico a <strong>${email}</strong>.
                        </p>
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; margin-bottom: 24px;">
                            <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0; line-height: 1.5;">
                                ⚠️ <strong>Siguiente paso:</strong> Ve a tu correo (revisa la carpeta de Spam por si acaso) y haz clic en el enlace para activar tu cuenta.
                            </p>
                        </div>
                        <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" class="btn-auth" style="text-decoration: none; display: inline-block; background: var(--accent); color: #000;">
                            Abrir mi correo &rarr;
                        </a>
                    </div>
                `;
            }"""

js_success_new = """            else { 
                clearMsg();
                authTabsHeader.style.display = 'none'; // Hide tabs
                const formContainer = document.getElementById('registerForm');
                
                let firstName = name.split(' ')[0];
                firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
                
                formContainer.innerHTML = `
                    <div style="text-align: center; padding: 20px 10px; animation: fadeIn 0.5s ease forwards;">
                        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 20px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        <h3 style="color: var(--text-primary); font-size: 1.6rem; margin-bottom: 16px; font-family: var(--font-heading);">¡Ya casi estás listo, ${firstName}!</h3>
                        <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 24px; font-size: 1.05rem;">
                            Te enviamos un enlace de confirmación a <strong>${email}</strong>.
                        </p>
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; margin-bottom: 24px;">
                            <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0; line-height: 1.5;">
                                📩 <strong>Siguiente paso:</strong> Ve a tu correo (revisa la carpeta de Spam por si acaso) y haz clic en el enlace para activar tu cuenta.
                            </p>
                        </div>
                        <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" class="btn-auth" style="text-decoration: none; display: inline-block; background: var(--accent); color: #000;">
                            Abrir mi correo &rarr;
                        </a>
                    </div>
                `;
            }"""

if js_success_old in content:
    content = content.replace(js_success_old, js_success_new)
else:
    print("WARNING: JS success block not found. Regex or something is off.")

with open('login.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done replacing.")
