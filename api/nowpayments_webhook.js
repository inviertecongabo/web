import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
  const signature = req.headers['x-nowpayments-sig'];

  if (!signature || !ipnSecret) {
    console.error('Missing signature or IPN secret');
    return res.status(400).json({ error: 'Missing signature' });
  }

  // Verify signature
  const sortedKeys = Object.keys(req.body).sort();
  const sortedObj = {};
  sortedKeys.forEach(key => sortedObj{key} = req.body[key]);
  const payloadString = JSON.stringify(sortedObj);

  const hmac = crypto.createHmac('sha512', ipnSecret).update(payloadString).digest('hex');

  if (hmac !== signature) {
    console.error('Invalid signature:', hmac, '!==', signature);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const paymentStatus = req.body.payment_status;
  const orderId = req.body.order_id;

  if (!paymentStatus || !orderId) {
    return res.status(400).json({ error: 'Missing data' });
  }

  console.log(`Received IPN? order=${orderId} status=${paymentStatus}`);

  if (paymentStatus === 'finished' || paymentStatus === 'confirmed') {
    // Update in Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabase
      .from('payments')
      .update({ status: 'approved' })
      .eq('id', orderId);

    if (error) {
      console.error('Supabase update error:', error);
      return res.status(500).json({ error: 'Db update failed' });
    }
  }

  return res.status(200).json({ ok: true });
}