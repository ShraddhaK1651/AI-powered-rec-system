const StudentProfile = require('../models/StudentProfile');

const getProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await StudentProfile.create({
        userId: req.user._id,
        fullName: req.user.name,
        email: req.user.email,
      });
    }
    res.status(200).json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch student profile.', error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      college,
      semester,
      cgpa,
      skills,
      programmingLanguages,
      interests,
      preferredRoles,
      targetRole,
      careerGoals,
      learningPreferences,
    } = req.body;

    // Validate fields
    const updateData = {
      updatedAt: new Date(),
      isCompleted: true,
    };

    if (fullName) updateData.fullName = fullName.trim();
    if (college) updateData.college = college.trim();
    if (semester !== undefined) updateData.semester = Number(semester);
    if (cgpa !== undefined) updateData.cgpa = Number(cgpa);
    if (skills) updateData.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (programmingLanguages) updateData.programmingLanguages = Array.isArray(programmingLanguages) ? programmingLanguages : programmingLanguages.split(',').map(s => s.trim());
    if (interests) updateData.interests = Array.isArray(interests) ? interests : interests.split(',').map(s => s.trim());
    if (preferredRoles) updateData.preferredRoles = Array.isArray(preferredRoles) ? preferredRoles : preferredRoles.split(',').map(s => s.trim());
    if (targetRole) updateData.targetRole = targetRole.trim();
    if (careerGoals !== undefined) updateData.careerGoals = careerGoals.trim();
    if (learningPreferences) updateData.learningPreferences = learningPreferences;

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Student profile updated successfully.',
      profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update student profile.',
      error: err.message,
    });
  }
};

module.exports = { getProfile, updateProfile };
