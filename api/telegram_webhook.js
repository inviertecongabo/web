const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method not allowed');

    const update = req.body;

    if (!update.callback_query) {
        return res.status(200).send('OK');
    }

    const callbackQuery = update.callback_query;
    const chatId = callbackQuery.from.id.toString();
    const action = callbackQuery.data;
    const messageId = callbackQuery.message.message_id;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const validChatId = process.env.TELEGRAM_CHAT_ID;

    // Security Verification
    if (chatId !== validChatId) {
        return res.status(200).send('OK');
    }

    const supabase = createClient(
        "https://uyrcsfsqzkywrgrjkvbr.supabase.co",
        process.env.SUPABASE_SERVICE_KEY
    );

    const sendTelegramRequest = async (method, payload) => {
        const url = `https://api.telegram.org/bot${botToken}/${method}`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    };

    if (action.startsWith('approve_')) {
        const paymentId = action.split('_')[1];
        
        // Approve payment
        const { data: pay } = await supabase.from('payments').update({ status: 'approved' }).eq('id', paymentId).select().single();
        
        if (pay) {
            // Edit message
            const newText = callbackQuery.message.text + "\n\n✅ <b>ESTADO: APROBADO POR GABO</b>";
            await sendTelegramRequest('editMessageText', {
                chat_id: chatId,
                message_id: messageId,
                text: newText,
                parse_mode: 'HTML'
            });

            // Trigger welcome email (using internal URL since we are in Vercel, or full URL)
            try {
                const proto = req.headers['x-forwarded-proto'] || 'https';
                const host = req.headers.host;
                const baseUrl = `${proto}://${host}`;
                await fetch(`${baseUrl}/api/payment_approved`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'UPDATE',
                        record: { user_email: pay.user_email, status: 'approved' },
                        old_record: { status: 'pending' }
                    })
                });
            } catch (err) {
                console.error("Error triggering email:", err);
            }
        }
    } 
    else if (action.startsWith('reject_')) {
        const paymentId = action.split('_')[1];
        
        // Show confirmation buttons
        await sendTelegramRequest('editMessageReplyMarkup', {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "⚠️ CONFIRMAR RECHAZO", callback_data: `confirmReject_${paymentId}` }
                    ],
                    [
                        { text: "🔙 Cancelar", callback_data: `cancelReject_${paymentId}` }
                    ]
                ]
            }
        });
    }
    else if (action.startsWith('cancelReject_')) {
        const paymentId = action.split('_')[1];
        
        // Revert to original buttons
        await sendTelegramRequest('editMessageReplyMarkup', {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "✅ Aprobar", callback_data: `approve_${paymentId}` },
                        { text: "❌ Rechazar", callback_data: `reject_${paymentId}` }
                    ]
                ]
            }
        });
    }
    else if (action.startsWith('confirmReject_')) {
        const paymentId = action.split('_')[1];
        
        // Reject payment
        await supabase.from('payments').update({ status: 'rejected' }).eq('id', paymentId);
        
        const newText = callbackQuery.message.text + "\n\n❌ <b>ESTADO: RECHAZADO</b>";
        await sendTelegramRequest('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: newText,
            parse_mode: 'HTML'
        });
    }

    // Always answer callback query to remove loading state
    await sendTelegramRequest('answerCallbackQuery', {
        callback_query_id: callbackQuery.id
    });

    return res.status(200).send('OK');
}
