const { IncomingForm } = require('formidable');
const fs = require('fs');
const { driveClient, findOrCreateFolder, rootFolderId } = require('./_lib/drive');
const { requireAdmin } = require('./_lib/auth');

const FOLDERS = { pdf: 'lecciones', image: 'imagenes', audio: 'audios' };
module.exports.config = { api: { bodyParser: false } };

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  if (!requireAdmin(req, res)) return;
  try {
    const [fields, files] = await new IncomingForm({ maxFileSize: 100 * 1024 * 1024, multiples: false }).parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const type = Array.isArray(fields.type) ? fields.type[0] : fields.type;
    if (!file || !FOLDERS[type]) return res.status(400).json({ error: 'Archivo o tipo inválido.' });
    const drive = driveClient();
    const folderId = await findOrCreateFolder(drive, FOLDERS[type], rootFolderId());
    const uploaded = await drive.files.create({
      requestBody: { name: file.originalFilename || 'archivo', parents: [folderId] },
      media: { mimeType: file.mimetype || 'application/octet-stream', body: fs.createReadStream(file.filepath) },
      fields: 'id,webContentLink,webViewLink'
    });
    await drive.permissions.create({ fileId: uploaded.data.id, requestBody: { role: 'reader', type: 'anyone' } });
    const directUrl = `https://drive.google.com/uc?export=view&id=${uploaded.data.id}`;
    return res.status(201).json({ id: uploaded.data.id, url: directUrl, directUrl, webContentLink: uploaded.data.webContentLink, webViewLink: uploaded.data.webViewLink });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'No se pudo subir el archivo.' });
  }
};
