const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  problemStatement: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  techStack: {
    type: [String],
    default: [],
  },
  requiredSkills: {
    type: [String],
    default: [],
  },
  expectedOutcomes: {
    type: [String],
    default: [],
  },
  targetRoles: {
    type: [String],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  architectureDiagramUrl: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', projectSchema);
