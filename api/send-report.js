const MAX_CSV_BYTES = 85000;
const TEACHER_EMAIL = 'janielgomes9@gmail.com';

function base64Lines(value) {
  return (Buffer.from(value, 'utf8').toString('base64').match(/.{1,76}/g) || []).join('\r\n');
}

function createRawEmail(csv) {
  const boundary = 'oficina-' + require('crypto').randomBytes(16).toString('hex');
  const mime = [
    'To: ' + TEACHER_EMAIL,
    'From: Janiel Gomes <' + TEACHER_EMAIL + '>',
    'Subject: =?UTF-8?B?' + Buffer.from('Resoluções da Oficina de Hardware', 'utf8').toString('base64') + '?=',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' + boundary + '"',
    '',
    '--' + boundary,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    base64Lines('Segue em anexo o relatório das resoluções dos desafios da Oficina de Hardware.'),
    '--' + boundary,
    'Content-Type: text/csv; name="relatorio-oficina-hardware.csv"',
    'Content-Disposition: attachment; filename="relatorio-oficina-hardware.csv"',
    'Content-Transfer-Encoding: base64',
    '',
    base64Lines(csv),
    '--' + boundary + '--',
    ''
  ].join('\r\n');

  return Buffer.from(mime, 'utf8').toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const appOrigin = process.env.APP_ORIGIN;
  if (!appOrigin || req.headers.origin !== appOrigin) {
    return res.status(403).json({ error: 'Origem não autorizada.' });
  }

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    console.error('As credenciais OAuth do Gmail precisam estar configuradas.');
    return res.status(503).json({ error: 'O envio pelo Gmail ainda não está configurado.' });
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
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token'
      })
    });

    if (!tokenResponse.ok) {
      console.error('O Google recusou a renovação OAuth do Gmail:', tokenResponse.status);
      return res.status(502).json({ error: 'A autorização do Gmail falhou. Confira as credenciais OAuth na Vercel.' });
    }

    const token = await tokenResponse.json();
    const sendResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token.access_token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw: createRawEmail(csv) })
    });

    if (!sendResponse.ok) {
      console.error('A API do Gmail recusou o envio:', sendResponse.status);
      return res.status(502).json({ error: 'O Gmail não conseguiu enviar. Confira o consentimento e o escopo gmail.send.' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Falha ao enviar o relatório pelo Gmail:', error);
    return res.status(502).json({ error: 'Não foi possível contatar a API do Gmail.' });
  }
};
