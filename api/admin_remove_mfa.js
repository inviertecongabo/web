const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://uyrcsfsqzkywrgrjkvbr.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ADMIN_EMAIL = "aibersonmontilla22@gmail.com";

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No autorizado.' });
    }
    const token = authHeader.split(' ')[1];

    try {
        const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
        const { data: { user }, error: authError } = await sb.auth.getUser(token);

        if (authError || !user || user.email !== ADMIN_EMAIL) {
            return res.status(403).json({ error: 'Acceso denegado.' });
        }

        const { target_user_id } = req.body;
        if (!target_user_id) {
            return res.status(400).json({ error: 'Falta target_user_id' });
        }

        const { data: targetUser, error: userErr } = await sb.auth.admin.getUserById(target_user_id);
        if (userErr || !targetUser.user) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        const factors = targetUser.user.factors || [];
        
        let removed = 0;
        for (const factor of factors) {
            // Delete factor using admin api
            await sb.auth.admin.mfa.deleteFactor({
                id: target_user_id,
                factorId: factor.id
            });
            removed++;
        }

        return res.status(200).json({ success: true, removed });
    } catch (err) {
        console.error("Admin remove MFA error:", err);
        return res.status(500).json({ error: 'Error interno: ' + err.message });
    }
}
