const { requireAdmin } = require('./_lib/auth');
const { driveClient, findOrCreateFolder, getAccessToken, rootFolderId } = require('./_lib/drive');

const FOLDERS = { pdf: 'lecciones', image: 'imagenes', audio: 'audios', video: 'videos' };

// La API de Drive no soporta bien CORS cuando la sesión de subida se crea desde un servidor:
// el archivo termina subiéndose igual, pero el navegador no puede leer la respuesta y lo marca
// como error de red. Por eso aquí solo preparamos lo que el navegador necesita (token + carpeta)
// para que sea el propio navegador quien cree la sesión de subida directo con Google, con su
// Origin real presente en la petición.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  if (!requireAdmin(req, res)) return;

  try {
    const { type } = req.body || {};
    const folderName = FOLDERS[type];
    if (!folderName) return res.status(400).json({ error: 'Tipo de archivo inválido.' });

    const drive = driveClient();
    const folderId = await findOrCreateFolder(drive, folderName, rootFolderId());
    const accessToken = await getAccessToken();

    return res.status(200).json({ accessToken, folderId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'No se pudo preparar la subida a Google Drive.' });
  }
};