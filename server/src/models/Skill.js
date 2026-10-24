const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  domain: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Language', 'Framework', 'Database', 'Cloud & DevOps', 'AI & Data Science', 'Security', 'Core CS'],
    default: 'Framework',
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate',
  },
  prerequisites: {
    type: [String],
    default: [],
  },
  targetRoles: {
    type: [String],
    default: [],
  },
  importance: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Good to have'],
    default: 'High',
  },
  tags: {
    type: [String],
    default: [],
  },
  learningResources: [
    {
      title: String,
      url: String,
      type: { type: String, enum: ['Documentation', 'Course', 'Book', 'Tutorial'], default: 'Tutorial' },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Skill', skillSchema);
