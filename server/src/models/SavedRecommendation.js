const mongoose = require('mongoose');

const savedRecommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itemType: {
    type: String,
    enum: ['course', 'skill', 'project', 'career'],
    required: true,
  },
  itemId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

savedRecommendationSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('SavedRecommendation', savedRecommendationSchema);
