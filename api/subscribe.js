export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: 'El correo electrónico es obligatorio' });
  }

  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMDJiYzY5YmMzMmRhY2JmMWZlMzgxZTE1Yzg2YzRlNWYyNmJmNmJiNDUzMTBmM2Q3ODc4MWQ1ZDJmYzFjZTM0MTczYzQ2NWYzODAxZmI2YmQiLCJpYXQiOjE3ODk0ODUyMjAuODYzMjc0LCJuYmYiOjE3ODk0ODUyMjAuODYzMjc2LCJleHAiOjQ5NDUxNTg4MjAuODU1MTIxLCJzdWIiOiIyNjU2MzA3Iiwic2NvcGVzIjpbXX0.EUgSmq5JtSULios92JH6SqiZRe9rGSQNgZ6WOU1KZnpHKsT8XJEyzJPqvu6oZ0FkexvMfi10YrKlQBmq0zUBx1kF3ssDmQsu5lKP-gVdhxHomtNSEngXVcSFeJ-hOhqqk3m1hYDuA0fN2alRVCrAkccHJc-2N3G_-i5mxJuhAWBZmnPLNn9R_jn103uN9tLTDd2_DzbjuhBnl7EsLMOvMY0OxcaHBVff2txc4NyWO-bkAN40NuQSv2cutMyWEhg3GEdTM4Bgzsz_y64L7hcDWeVRcdWM_i2OgpZq2A2vPWGBXP2NBfYqFFsJdegz4EhDB4w5L9EM2bJoxoKrU28ggzj_KF_wkTFh4SkSX3ekQINN0LhJ8OIByASite37FaoAxN0huLTRadOuXdcIbd9CAQSPptV_PqIbsZkkMElIkSOfzIAIPIOgcdzAmohi_BMDVGAfxOCmDvXBhyhGj265L6TEDsT4-ddsmcfF_xRJ3l9ZJozF28JEDMTYVMgwTSU6M8fFzo_SBUpjiAXYUh2_72RtCLm2ry7o0cj1weHfnhWI-IsrCMIad_q7T5VjWbRgRBDEXbdcoJsopKxLASE_U0-6nTYbfwlMC-QUSDG55GjbXhPWxzqmmWfkTGYqzdcxah_NvCr1ro5kgzgf-27armfUCzhF5UOOx-wgJoqndIs';

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        email: email,
        status: 'active'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (data && data.message) {
        return res.status(200).json({ success: true, message: '¡Ya estás suscrito a nuestro boletín!' });
      }
      return res.status(400).json({ error: 'No se pudo procesar la suscripción' });
    }

    return res.status(200).json({ success: true, message: '¡Bienvenido! Te has unido exitosamente al boletín.' });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
