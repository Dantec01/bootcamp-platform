const { driveClient } = require('./_lib/drive');

function driveFileId(value) {
  const m = String(value || '').match(/\/d\/([A-Za-z0-9_-]+)/) || String(value || '').match(/[?&]id=([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();

  const parsed = new URL(req.url, 'http://localhost');
  const id = parsed.searchParams.get('id') || driveFileId(parsed.searchParams.get('url'));
  if (!id) return res.status(400).json({ error: 'Falta el identificador de la imagen.' });

  try {
    const drive = driveClient();
    const response = await drive.files.get({ fileId: id, alt: 'media' }, { responseType: 'stream' });
    const contentType = response.headers['content-type'] || 'application/octet-stream';
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    response.data.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'No se pudo cargar la imagen.' });
  }
};
