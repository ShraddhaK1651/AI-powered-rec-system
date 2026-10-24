const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  requiredSkills: {
    type: [String],
    default: [],
  },
  averageSalary: {
    type: String,
    default: '₹10 - 24 LPA',
  },
  growthRate: {
    type: String,
    default: '22% YoY',
  },
  roadmap: [
    {
      step: Number,
      title: String,
      description: String,
      duration: String,
    }
  ],
  recommendedCourses: {
    type: [String],
    default: [],
  },
  recommendedProjects: {
    type: [String],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Career', careerSchema);
