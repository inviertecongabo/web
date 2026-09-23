module.exports = async function handler(req, res) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return res.status(400).send('No token');
    
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const webhookUrl = `${proto}://${host}/api/telegram_webhook`;

    const url = `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
