const { requiredEnv, setSession } = require('../_lib/auth');

module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  const supplied = String(req.body?.password || '');
  const expected = requiredEnv('ADMIN_PASSWORD');
  if (supplied.length !== expected.length || !require('crypto').timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
    return res.status(401).json({ error: 'Código incorrecto.' });
  }
  setSession(res);
  return res.status(200).json({ ok: true });
};
