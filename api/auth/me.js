const { isAdmin } = require('../_lib/auth');
module.exports = (req, res) => res.status(200).json({ isAdmin: isAdmin(req) });
