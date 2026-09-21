const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://uyrcsfsqzkywrgrjkvbr.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Rate limiting: máximo 5 intentos por IP por minuto
const rateLimitMap = new Map();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 1000;

function checkRateLimit(ip) {
    const now = Date.now();
    const entry = rateLimitMap.get(ip) || { count: 0, start: now };
    
    if (now - entry.start > RATE_WINDOW_MS) {
        // Reiniciar ventana
        rateLimitMap.set(ip, { count: 1, start: now });
        return true;
    }
    
    if (entry.count >= RATE_LIMIT) {
        return false; // Bloqueado
    }
    
    entry.count++;
    rateLimitMap.set(ip, entry);
    return true;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // 1. Verificar que el usuario esté autenticado (solo usuarios logueados pueden usar esto)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ valid: false, error: 'Debes iniciar sesión para verificar tus llaves.' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
        const { data: { user }, error: authError } = await sb.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ valid: false, error: 'Sesión inválida. Recarga la página.' });
        }

        // 2. Rate limiting por usuario (no por IP)
        if (!checkRateLimit(user.id)) {
            return res.status(429).json({ valid: false, error: 'Demasiados intentos. Espera 1 minuto antes de intentar de nuevo.' });
        }

        const { apiKey, secretKey } = req.body;
        if (!apiKey || !secretKey) {
            return res.status(400).json({ error: 'API Key y Secret Key son requeridos.' });
        }

        // 3. Verificar con Binance
        const timestamp = Date.now();
        const queryString = `timestamp=${timestamp}`;
        const signature = crypto.createHmac('sha256', secretKey).update(queryString).digest('hex');
        const url = `https://api.binance.com/api/v3/account?${queryString}&signature=${signature}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'X-MBX-APIKEY': apiKey }
        });
        const data = await response.json();

        if (response.ok) {
            if (data.canWithdraw === true) {
                return res.status(400).json({ valid: false, error: 'POR TU SEGURIDAD: Tus llaves tienen permiso de "Retiro" (Withdrawal) activado. GaboBot no acepta llaves con ese permiso. Ve a Binance, edita la API Key, desmarca la casilla de Retiros e intenta de nuevo.' });
            }
            if (data.canTrade === false) {
                return res.status(400).json({ valid: false, error: 'Tus llaves son reales, pero te faltan permisos. Ve a Binance, edita la API Key y asegúrate de marcar las dos casillas obligatorias: "Enable Reading" y "Enable Spot & Margin Trading".' });
            }
            return res.status(200).json({ valid: true, message: 'Llaves verificadas correctamente.' });
        } else {
            return res.status(400).json({ valid: false, error: 'Llaves inválidas. Verifica que las hayas copiado correctamente desde Binance.' });
        }
    } catch (error) {
        console.error("verify_binance error:", error);
        return res.status(500).json({ valid: false, error: 'Error de conexión. Intenta de nuevo.' });
    }
}
