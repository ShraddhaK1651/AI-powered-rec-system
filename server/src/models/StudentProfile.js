const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    default: 'Department of Computer Science & Engineering',
    trim: true,
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
    default: 5,
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0.0,
    max: 10.0,
    default: 7.5,
  },
  skills: {
    type: [String],
    default: [],
  },
  programmingLanguages: {
    type: [String],
    default: [],
  },
  interests: {
    type: [String],
    default: [],
  },
  preferredRoles: {
    type: [String],
    default: [],
  },
  targetRole: {
    type: String,
    default: 'Full Stack Developer',
    trim: true,
  },
  careerGoals: {
    type: String,
    default: '',
    trim: true,
  },
  learningPreferences: {
    type: String,
    enum: ['hands-on', 'theoretical', 'project-based', 'video-tutorials', 'hybrid'],
    default: 'project-based',
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
