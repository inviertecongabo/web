const crypto = require('crypto');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { apiKey, secretKey } = req.body;
    if (!apiKey || !secretKey) return res.status(400).json({ error: 'API Key y Secret Key son requeridos.' });

    try {
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
        return res.status(500).json({ valid: false, error: 'Error de conexión con Binance. Intenta de nuevo.' });
    }
}
