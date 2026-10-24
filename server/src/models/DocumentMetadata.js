const mongoose = require('mongoose');

const documentMetadataSchema = new mongoose.Schema({
  docId: {
    type: String,
    required: true,
    unique: true,
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  chunkCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'indexed', 'failed'],
    default: 'indexed',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DocumentMetadata', documentMetadataSchema);
