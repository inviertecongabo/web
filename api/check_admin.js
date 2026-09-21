import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://uyrcsfsqzkywrgrjkvbr.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ADMIN_EMAIL = "aibersonmontilla22@gmail.com";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Verificar token JWT del usuario desde el header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ authorized: false, error: 'No autorizado.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Validar el token usando el service role key del servidor
        const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
        const { data: { user }, error } = await sb.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ authorized: false, error: 'Sesión inválida.' });
        }

        // Verificar que sea el admin
        if (user.email !== ADMIN_EMAIL) {
            return res.status(403).json({ authorized: false, error: 'Acceso denegado.' });
        }

        return res.status(200).json({ authorized: true, email: user.email });
    } catch (err) {
        console.error("Admin check error:", err);
        return res.status(500).json({ authorized: false, error: 'Error interno.' });
    }
}
