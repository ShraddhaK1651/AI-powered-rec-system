const express = require('express');
const router = express.Router();
const {
  askQuestion,
  getChatSessions,
  getSessionMessages,
  deleteSession,
} = require('../controllers/ragController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/ask', verifyToken, askQuestion);
router.get('/sessions', verifyToken, getChatSessions);
router.get('/sessions/:sessionId', verifyToken, getSessionMessages);
router.delete('/sessions/:sessionId', verifyToken, deleteSession);

module.exports = router;
