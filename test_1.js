
        (async () => {
            const sb = supabase.createClient(
                'https://uyrcsfsqzkywrgrjkvbr.supabase.co',
                'sb_publishable_SBBWsktsWGJLNa0-2Y4_wQ_sPeHJnHa'
            );
            const { data } = await sb.auth.getSession();
            const loginBtn = document.getElementById('navLoginBtn');
            const registerBtn = document.getElementById('navRegisterBtn');
            const panelBtn = document.getElementById('navPanelBtn');
            
            if (data.session) {
                if (loginBtn) loginBtn.style.display = 'none';
                if (registerBtn) registerBtn.style.display = 'none';
                if (panelBtn) panelBtn.style.display = 'inline-flex';
            }
        })();
    