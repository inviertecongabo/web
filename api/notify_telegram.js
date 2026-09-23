module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return res.status(200).json({ success: true, message: 'Telegram not configured' });
    }

    const { email, method, plan, reference, amount, payment_id } = req.body;

    if (!email || !method) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    const message = `🚨 <b>Nuevo Pago Pendiente</b> 🚨\n\n` +
                    `📧 <b>Cliente:</b> ${email}\n` +
                    `💳 <b>Método:</b> ${method.toUpperCase()}\n` +
                    `💰 <b>Monto:</b> ${amount} USDT (${plan})\n` +
                    `🔖 <b>Referencia:</b> <code>${reference}</code>\n\n` +
                    `Revisa tu Panel de Administrador o aprueba usando los botones debajo.`;

    const bodyPayload = {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
    };

    if (payment_id) {
        bodyPayload.reply_markup = {
            inline_keyboard: [
                [
                    { text: "✅ Aprobar", callback_data: `approve_${payment_id}` },
                    { text: "❌ Rechazar", callback_data: `reject_${payment_id}` }
                ]
            ]
        };
    }

    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const tgRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyPayload)
        });

        if (!tgRes.ok) {
            console.error('Telegram API error:', await tgRes.text());
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Telegram API fetch error:', error);
        return res.status(500).json({ error: 'Error sending notification' });
    }
}
