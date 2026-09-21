const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://uyrcsfsqzkywrgrjkvbr.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
// Clave de encriptación AES-256 (32 bytes) almacenada en variable de entorno
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 chars hex

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Verificar autenticación
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No autorizado.' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
        const { data: { user }, error: authError } = await sb.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ error: 'Sesión inválida.' });
        }

        const { apiKey, secretKey, amount, frequency, custom_days, purchase_time, bot_enabled } = req.body;

        if (!apiKey || !secretKey) {
            return res.status(400).json({ error: 'API Key y Secret Key son requeridos.' });
        }

        // Encriptar las llaves antes de guardar
        const encryptedApiKey = encrypt(apiKey);
        const encryptedSecretKey = encrypt(secretKey);

        // Construir bot_config con llaves encriptadas
        const existingMeta = user.user_metadata || {};
        const botConfig = {
            ...(existingMeta.bot_config || {}),
            ak: encryptedApiKey,
            sk: encryptedSecretKey,
            amount,
            frequency,
            encrypted: true // Flag para saber que están encriptadas
        };
        if (frequency === 'custom' && custom_days) botConfig.custom_days = custom_days;
        if (purchase_time) botConfig.purchase_time = purchase_time;
        if (bot_enabled !== undefined) botConfig.bot_enabled = bot_enabled;

        // Guardar en Supabase usando service key (más seguro)
        const { error: updateError } = await sb.auth.admin.updateUserById(user.id, {
            user_metadata: { ...existingMeta, bot_config: botConfig }
        });

        if (updateError) {
            return res.status(500).json({ error: 'Error al guardar configuración: ' + updateError.message });
        }

        return res.status(200).json({ success: true, message: 'Configuración guardada y encriptada correctamente.' });

    } catch (err) {
        console.error("save_bot_config error:", err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
}
