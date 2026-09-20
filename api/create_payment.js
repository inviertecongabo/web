export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan_type, amount, user_id, user_email, payment_id } = req.body;

  if (!plan_type || !amount || !user_id || !payment_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const payload = {
      price_amount: amount,
      price_currency: 'usd',
      pay_currency: 'usdt', // Suggests USDT by default
      order_id: payment_id,
      order_description: `GaboBot Membership - ${plan_type}`,
      ipn_callback_url: 'https://www.inviertecongabo.com/api/nowpayments_webhook',
      success_url: 'https://www.inviertecongabo.com/dashboard',
      cancel_url: 'https://www.inviertecongabo.com/dashboard'
    };

    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('NOWPayments error:', data);
      return res.status(500).json({ error: 'Failed to create payment invoice', details: data });
    }

    return res.status(200).json({ invoice_url: data.invoice_url });

  } catch (error) {
    console.error('Create payment error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}