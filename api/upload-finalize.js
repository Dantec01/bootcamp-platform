const { requireAdmin } = require('./_lib/auth');
const { driveClient } = require('./_lib/drive');

// Una vez que el navegador terminó de subir el archivo directo a Drive, este endpoint
// le da permiso de "cualquiera con el enlace puede ver" y devuelve la URL final.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  if (!requireAdmin(req, res)) return;

  try {
    const { fileId } = req.body || {};
    if (!fileId) return res.status(400).json({ error: 'Falta el id del archivo.' });

    const drive = driveClient();
    await drive.permissions.create({ fileId, requestBody: { role: 'reader', type: 'anyone' } });

    return res.status(200).json({ id: fileId, url: `https://drive.google.com/uc?export=view&id=${fileId}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'No se pudo finalizar la subida.' });
  }
};
