const express = require('express');
const router = express.Router();
const {
  getCourses,
  createCourse,
  getSkills,
  createSkill,
  getProjects,
  createProject,
  getCareers,
  createCareer,
} = require('../controllers/catalogController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Public or student-accessible read routes
router.get('/courses', verifyToken, getCourses);
router.get('/skills', verifyToken, getSkills);
router.get('/projects', verifyToken, getProjects);
router.get('/careers', verifyToken, getCareers);

// Admin-only creation routes
router.post('/courses', verifyToken, requireRole('admin'), createCourse);
router.post('/skills', verifyToken, requireRole('admin'), createSkill);
router.post('/projects', verifyToken, requireRole('admin'), createProject);
router.post('/careers', verifyToken, requireRole('admin'), createCareer);

module.exports = router;
