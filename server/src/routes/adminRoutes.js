const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const {
  uploadDocument,
  listDocuments,
  deleteDocument,
  getStats,
} = require('../controllers/adminController');

// All admin routes require valid JWT and 'admin' role
router.use(verifyToken, requireRole('admin'));

router.get('/stats', getStats);
router.get('/documents', listDocuments);
router.post('/documents/upload', upload.single('document'), uploadDocument);
router.delete('/documents/:docId', deleteDocument);

module.exports = router;
