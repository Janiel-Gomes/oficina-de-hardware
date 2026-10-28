const MAX_CSV_BYTES = 85000;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const appOrigin = process.env.APP_ORIGIN;
  if (!appOrigin || req.headers.origin !== appOrigin) {
    return res.status(403).json({ error: 'Origem não autorizada.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error('RESEND_API_KEY e RESEND_FROM_EMAIL precisam estar configuradas.');
    return res.status(503).json({ error: 'O envio automático ainda não está configurado.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (error) {
      return res.status(400).json({ error: 'Requisição inválida.' });
    }
  }

  const csv = body && body.csv;
  if (typeof csv !== 'string' || Buffer.byteLength(csv, 'utf8') > MAX_CSV_BYTES) {
    return res.status(400).json({ error: 'Relatório inválido ou muito grande.' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: ['janielgomes9@gmail.com'],
        subject: 'Resoluções da Oficina de Hardware',
        text: 'Segue em anexo o relatório das resoluções dos desafios da Oficina de Hardware.',
        attachments: [{
          filename: 'relatorio-oficina-hardware.csv',
          content: Buffer.from(csv, 'utf8').toString('base64')
        }]
      })
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('Falha no envio pelo Resend:', response.status, details);
      return res.status(502).json({ error: 'O serviço de e-mail não conseguiu enviar o relatório.' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Falha ao contatar o serviço de e-mail:', error);
    return res.status(502).json({ error: 'Não foi possível contatar o serviço de e-mail.' });
  }
};
