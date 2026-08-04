const crypto = require('crypto');

const COOKIE_NAME = 'bootcamp_admin';

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}.`);
  return value;
}

function sign(value) {
  return crypto.createHmac('sha256', requiredEnv('SESSION_SECRET')).update(value).digest('base64url');
}

function createSession() {
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp: Date.now() + 1000 * 60 * 60 * 12 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map(v => v.trim()).filter(Boolean).map(v => {
    const i = v.indexOf('=');
    return [v.slice(0, i), decodeURIComponent(v.slice(i + 1))];
  }));
}

function isAdmin(req) {
  try {
    const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
    if (!token) return false;
    const [payload, signature] = token.split('.');
    if (!payload || !signature || !crypto.timingSafeEqual(Buffer.from(sign(payload)), Buffer.from(signature))) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.role === 'admin' && data.exp > Date.now();
  } catch { return false; }
}

function setSession(res) {
  const secure = process.env.VERCEL ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${createSession()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200${secure}`);
}

function clearSession(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

function requireAdmin(req, res) {
  if (isAdmin(req)) return true;
  res.status(401).json({ error: 'No autorizado.' });
  return false;
}

module.exports = { clearSession, isAdmin, requiredEnv, requireAdmin, setSession };
