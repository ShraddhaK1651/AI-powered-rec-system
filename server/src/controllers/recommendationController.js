const StudentProfile = require('../models/StudentProfile');
const Course = require('../models/Course');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Career = require('../models/Career');
const SavedRecommendation = require('../models/SavedRecommendation');
const aiClient = require('../services/aiServiceClient');

const getRecommendations = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found. Please complete your profile first.',
      });
    }

    // Retrieve active catalog items from MongoDB
    const [courses, skills, projects, careers] = await Promise.all([
      Course.find().lean(),
      Skill.find().lean(),
      Project.find().lean(),
      Career.find().lean(),
    ]);

    const topK = parseInt(req.query.top_k) || 5;

    // Call Python FastAPI Content-Based Recommendation Engine
    const recommendations = await aiClient.getRecommendations(profile, {
      courses,
      skills,
      projects,
      careers,
    }, topK);

    res.status(200).json({
      success: true,
      profile: {
        semester: profile.semester,
        cgpa: profile.cgpa,
        targetRole: profile.targetRole,
        skills: profile.skills,
        interests: profile.interests,
      },
      recommendations,
    });
  } catch (err) {
    console.error('Error generating recommendations:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations.',
      error: err.message,
    });
  }
};

const getSkillGap = async (req, res) => {
  try {
    const { careerTitle, careerId } = req.body;
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    let career = null;
    if (careerId) {
      career = await Career.findById(careerId).lean();
    } else if (careerTitle) {
      career = await Career.findOne({ title: new RegExp(`^${careerTitle}$`, 'i') }).lean();
    } else {
      // Default to student's target role or first career in DB
      career = await Career.findOne({ title: new RegExp(`^${profile.targetRole}$`, 'i') }).lean();
      if (!career) {
        career = await Career.findOne().lean();
      }
    }

    if (!career) {
      return res.status(404).json({ success: false, message: 'Specified career path not found in catalog.' });
    }

    const gapAnalysis = await aiClient.getSkillGap(profile, career);

    res.status(200).json({
      success: true,
      career,
      analysis: gapAnalysis,
    });
  } catch (err) {
    console.error('Skill gap error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to perform skill-gap analysis.',
      error: err.message,
    });
  }
};

const saveRecommendation = async (req, res) => {
  try {
    const { itemType, itemId, title, metadata } = req.body;

    if (!itemType || !itemId || !title) {
      return res.status(400).json({ success: false, message: 'itemType, itemId, and title are required.' });
    }

    const saved = await SavedRecommendation.findOneAndUpdate(
      { userId: req.user._id, itemType, itemId },
      { $set: { title, metadata, savedAt: new Date() } },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, message: 'Recommendation bookmarked successfully.', saved });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to bookmark recommendation.', error: err.message });
  }
};

const getSavedRecommendations = async (req, res) => {
  try {
    const saved = await SavedRecommendation.find({ userId: req.user._id }).sort({ savedAt: -1 });
    res.status(200).json({ success: true, saved });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch saved recommendations.', error: err.message });
  }
};

const removeSavedRecommendation = async (req, res) => {
  try {
    const { id } = req.params;
    await SavedRecommendation.findOneAndDelete({ _id: id, userId: req.user._id });
    res.status(200).json({ success: true, message: 'Bookmark removed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to remove bookmark.', error: err.message });
  }
};

module.exports = {
  getRecommendations,
  getSkillGap,
  saveRecommendation,
  getSavedRecommendations,
  removeSavedRecommendation,
};
