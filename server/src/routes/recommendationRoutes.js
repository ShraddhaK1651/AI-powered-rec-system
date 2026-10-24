const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  getSkillGap,
  saveRecommendation,
  getSavedRecommendations,
  removeSavedRecommendation,
} = require('../controllers/recommendationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getRecommendations);
router.post('/skill-gap', verifyToken, getSkillGap);
router.post('/save', verifyToken, saveRecommendation);
router.get('/saved', verifyToken, getSavedRecommendations);
router.delete('/saved/:id', verifyToken, removeSavedRecommendation);

module.exports = router;
