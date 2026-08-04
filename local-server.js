// Servidor local ligero para probar la página y las funciones de /api sin iniciar sesión en Vercel.
const http = require('http');
const fs = require('fs');
const path = require('path');

loadEnv(path.join(__dirname, '.env.local'));

const handlers = {
  '/api/auth/login': require('./api/auth/login'),
  '/api/auth/logout': require('./api/auth/logout'),
  '/api/auth/me': require('./api/auth/me'),
  '/api/course': require('./api/course'),
  '/api/upload': require('./api/upload'),
  '/api/image': require('./api/image')
};

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf('=');
    if (separator > 0) process.env[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
}

function addResponseHelpers(res) {
  res.status = code => { res.statusCode = code; return res; };
  res.json = value => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(value));
  };
  return res;
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (!['POST', 'PUT', 'PATCH'].includes(req.method) || !req.headers['content-type']?.includes('application/json')) return resolve();
    let raw = '';
    req.setEncoding('utf8');
    req.on('data', chunk => raw += chunk);
    req.on('end', () => { try { req.body = raw ? JSON.parse(raw) : {}; resolve(); } catch (error) { reject(error); } });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  addResponseHelpers(res);
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const handler = handlers[pathname];
  if (handler) {
    try {
      await parseJsonBody(req);
      return await handler(req, res);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || 'Error local del servidor.' });
    }
  }
  if (pathname === '/' || pathname === '/bootcamp-platform.html') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return fs.createReadStream(path.join(__dirname, 'bootcamp-platform.html')).pipe(res);
  }
  return res.status(404).json({ error: 'No encontrado.' });
});

const port = Number(process.env.PORT || 3000);
server.listen(port, () => console.log(`Bootcamp disponible en http://localhost:${port}`));
