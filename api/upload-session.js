const { requireAdmin } = require('./_lib/auth');
const { driveClient, findOrCreateFolder, getAccessToken, rootFolderId } = require('./_lib/drive');

const FOLDERS = { pdf: 'lecciones', image: 'imagenes', audio: 'audios', video: 'videos' };

// Inicia una sesión de subida reanudable ("resumable") directo contra la API de Google Drive.
// El navegador sube el archivo real a la URL que devuelve este endpoint, SIN pasar por Vercel,
// así que el límite de 4.5MB de las funciones de Vercel nunca aplica a los bytes del archivo.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  if (!requireAdmin(req, res)) return;

  try {
    const { filename, mimeType, type } = req.body || {};
    const folderName = FOLDERS[type];
    if (!filename || !folderName) return res.status(400).json({ error: 'Datos de archivo inválidos.' });

    const drive = driveClient();
    const folderId = await findOrCreateFolder(drive, folderName, rootFolderId());
    const accessToken = await getAccessToken();

    const initResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
        ...(mimeType ? { 'X-Upload-Content-Type': mimeType } : {})
      },
      body: JSON.stringify({ name: filename, parents: [folderId] })
    });

    if (!initResponse.ok) {
      const text = await initResponse.text().catch(() => '');
      throw new Error(`Google Drive rechazó la sesión de subida (${initResponse.status}). ${text}`);
    }

    const uploadUrl = initResponse.headers.get('location');
    if (!uploadUrl) throw new Error('Google Drive no devolvió una URL de subida.');

    return res.status(200).json({ uploadUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'No se pudo iniciar la subida a Google Drive.' });
  }
};
