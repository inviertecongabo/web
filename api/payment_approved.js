export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body || {};

  if (payload.type !== 'UPDATE') {
    return res.status(200).json({ message: 'Not an update, ignored' });
  }

  const record = payload.record;
  const old_record = payload.old_record;

  if (!record || record.status !== 'approved' || old_record?.status === 'approved') {
    return res.status(200).json({ message: 'Status is not newly approved, ignored' });
  }

  const email = record.user_email;

  if (!email) {
    console.error('No user_email found in the record', record);
    return res.status(400).json({ error: 'No user_email in record' });
  }

  const token = process.env.RESEND_API_KEY;

  if (!token) {
    console.error('RESEND_API_KEY missing in environment variables');
    return res.status(500).json({ error: 'Falta la configuración de Resend' });
  }

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #09090B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E4E4E7;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #09090B; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #121215; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden; padding: 32px 28px;">
                    <!-- LOGO HEADER -->
                    <tr>
                        <td align="left" style="padding-bottom: 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
                            <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #FFFFFF;">
                                invierte<span style="color: #F0B90B;">con</span>gabo
                            </span>
                        </td>
                    </tr>
                    <!-- TITULO &amp; SUBTITULO -->
                    <tr>
                        <td style="padding-top: 24px; padding-bottom: 20px;">
                            <div style="display: inline-block; background: rgba(34, 197, 94, 0.12); color: #22C55E; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 20px; margin-bottom: 12px; border: 1px solid rgba(34, 197, 94, 0.2);">
                                Pago Aprobado
                            </div>
                            <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.3px;">
                                ¡Tu acceso a GaboBot está listo!
                            </h1>
                            <p style="margin: 8px 0 0 0; font-size: 14px; color: #A1A1AA; line-height: 1.5;">
                                Hemos verificado tu pago exitosamente. Ya puedes entrar a tu panel de control y activar la automatización de tus compras en Binance.
                            </p>
                        </td>
                    </tr>
                    <!-- DETALLES DE LA OPERACION -->
                    <tr>
                        <td style="padding: 16px 0;">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #18181C; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); padding: 16px 20px;">
                                <tr>
                                    <td style="padding: 10px 0; color: #71717A; font-size: 13px; font-weight: 500;">Estado</td>
                                    <td align="right" style="padding: 10px 0; color: #22C55E; font-size: 14px; font-weight: 600;">Verificado</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #71717A; font-size: 13px; font-weight: 500; border-top: 1px solid rgba(255, 255, 255, 0.04);">Servicio</td>
                                    <td align="right" style="padding: 10px 0; color: #FFFFFF; font-size: 14px; font-weight: 600; border-top: 1px solid rgba(255, 255, 255, 0.04);">GaboBot (Compras BTC)</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- BOTON CTA -->
                    <tr>
                        <td align="center" style="padding-top: 8px; padding-bottom: 24px;">
                            <a href="https://www.inviertecongabo.com/dashboard#tool-bot" style="display: block; width: 100%; box-sizing: border-box; background: #F0B90B; color: #000000; text-decoration: none; font-weight: 700; font-size: 14px; text-align: center; padding: 14px 24px; border-radius: 10px; transition: all 0.2s;">
                                Configurar GaboBot
                            </a>
                        </td>
                    </tr>
                    <!-- FOOTER -->
                    <tr>
                        <td align="center" style="padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.06);">
                            <p style="margin: 0; font-size: 12px; color: #52525B;">
                                Invierte con Gabo © 2026 — Automatización Inteligente
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

  try {
    const payloadReq = {
      from: 'GaboBot <gabobot@inviertecongabo.com>',
      to: [email],
      subject: '¡Pago Aprobado! Ya puedes usar GaboBot ✅',
      html: htmlContent
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payloadReq)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(400).json({ error: data.message || 'No se pudo enviar el correo' });
    }

    return res.status(200).json({ success: true, message: 'Correo de aprobación enviado exitosamente.' });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Error interno del servidor al enviar el correo' });
  }
}

