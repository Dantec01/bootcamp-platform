const { readCourse, writeCourse } = require('./_lib/drive');
const { requireAdmin } = require('./_lib/auth');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const course = await readCourse();
      return res.status(200).json({ course });
    }
    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;
      const course = req.body?.course;
      if (!course || !Array.isArray(course.modules)) return res.status(400).json({ error: 'Estructura del curso inválida.' });
      await writeCourse(course);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Método no permitido.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'No se pudo acceder a Google Drive.' });
  }
};
