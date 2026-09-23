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
        const { data: { user }, error } = await sb.auth.getUser(token);

        if (error || !user || user.email !== ADMIN_EMAIL) {
            return res.status(403).json({ error: 'Acceso denegado.' });
        }

        // Fetch everything bypassing RLS
        const { data: users, error: errU } = await sb.from('profiles').select('*').order('created_at', { ascending: false });
        const { data: videos, error: errV } = await sb.from('educational_content').select('*').order('created_at', { ascending: false });
        const { data: payments, error: errP } = await sb.from('payments').select('*').order('created_at', { ascending: false });

        return res.status(200).json({
            users: users || [],
            videos: videos || [],
            payments: payments || []
        });
    } catch (err) {
        console.error("Admin data error:", err);
        return res.status(500).json({ error: 'Error interno.' });
    }
}
