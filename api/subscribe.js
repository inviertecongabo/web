export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: 'El correo electrónico es obligatorio' });
  }

  const token = process.env.MAILERLITE_API_TOKEN;

  if (!token) {
    console.error('MAILERLITE_API_TOKEN missing');
    return res.status(500).json({ error: 'Falta la configuración de MailerLite' });
  }

  try {
    // 1. Fetch groups to find "Suscriptores Web" ID
    let groupId = null;
    try {
      const groupsRes = await fetch('https://connect.mailerlite.com/api/groups', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (groupsRes.ok) {
        const groupsData = await groupsRes.json();
        const foundGroup = groupsData.data?.find(g => g.name.toLowerCase().includes('suscriptores'));
        if (foundGroup) {
          groupId = foundGroup.id;
        } else if (groupsData.data?.length > 0) {
          groupId = groupsData.data[0].id;
        }
      }
    } catch (e) {
      console.error('Error fetching groups:', e);
    }

    // 2. Add subscriber to MailerLite (with group if found)
    const payload = {
      email: email,
      status: 'active'
    };
    if (groupId) {
      payload.groups = [groupId];
    }

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MailerLite error:', data);
      return res.status(400).json({ error: data.message || 'No se pudo procesar la suscripción' });
    }

    return res.status(200).json({ success: true, message: '¡Bienvenido! Te has unido exitosamente al boletín.' });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
