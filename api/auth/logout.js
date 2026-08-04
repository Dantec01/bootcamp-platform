const { clearSession } = require('../_lib/auth');
module.exports = (req, res) => { if (req.method !== 'POST') return res.status(405).end(); clearSession(res); return res.status(200).json({ ok: true }); };
