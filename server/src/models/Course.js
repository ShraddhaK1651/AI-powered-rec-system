const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
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
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate',
  },
  credits: {
    type: Number,
    default: 3,
  },
  minCgpa: {
    type: Number,
    default: 6.0,
  },
  prerequisites: {
    type: [String],
    default: [],
  },
  skillsCovered: {
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
  syllabusOutline: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', courseSchema);
