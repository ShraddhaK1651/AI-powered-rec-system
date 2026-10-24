const fs = require('fs');
const crypto = require('crypto');
const DocumentMetadata = require('../models/DocumentMetadata');
const User = require('../models/User');
const Course = require('../models/Course');
const Project = require('../models/Project');
const Career = require('../models/Career');
const Skill = require('../models/Skill');
const aiClient = require('../services/aiServiceClient');

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No document file uploaded.' });
    }

    const docId = 'doc_' + crypto.randomBytes(6).toString('hex');
    const { originalname, path: filePath, size, mimetype } = req.file;

    // Send to Python FastAPI RAG vector ingestion endpoint
    const ingestResult = await aiClient.ingestDocumentToRAG(docId, filePath, originalname);

    // Save document metadata in MongoDB
    const docMeta = await DocumentMetadata.create({
      docId,
      filename: originalname,
      originalName: originalname,
      fileSize: size,
      mimeType: mimetype,
      chunkCount: ingestResult.chunk_count || 0,
      status: 'indexed',
      uploadedBy: req.user._id,
      uploadedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: `Document "${originalname}" indexed successfully (${ingestResult.chunk_count} chunks).`,
      document: docMeta,
      ingestResult,
    });
  } catch (err) {
    console.error('Document upload error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to upload and index document in vector database.',
      error: err.message,
    });
  }
};

const listDocuments = async (req, res) => {
  try {
    const documents = await DocumentMetadata.find().sort({ uploadedAt: -1 }).lean();
    const chromaDocs = await aiClient.listRAGDocuments();

    // Cross-reference ChromaDB actual indexed chunk counts
    const chromaMap = {};
    chromaDocs.forEach(d => {
      chromaMap[d.doc_id] = d.chunk_count;
    });

    const enriched = documents.map(d => ({
      ...d,
      actualChromaChunks: chromaMap[d.docId] !== undefined ? chromaMap[d.docId] : d.chunkCount,
    }));

    res.status(200).json({ success: true, documents: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to list documents.', error: err.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { docId } = req.params;

    // 1. Remove vectors from ChromaDB via Python AI service
    await aiClient.deleteRAGDocument(docId);

    // 2. Remove document record from MongoDB
    const deleted = await DocumentMetadata.findOneAndDelete({ docId });

    res.status(200).json({
      success: true,
      message: `Document ${deleted?.filename || docId} and its vector embeddings were removed.`,
    });
  } catch (err) {
    console.error('Delete document error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete document.', error: err.message });
  }
};

const getStats = async (req, res) => {
  try {
    const [totalStudents, totalCourses, totalProjects, totalCareers, totalSkills, totalDocs, aiHealth] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Course.countDocuments(),
      Project.countDocuments(),
      Career.countDocuments(),
      Skill.countDocuments(),
      DocumentMetadata.countDocuments(),
      aiClient.checkAiServiceHealth(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalCourses,
        totalProjects,
        totalCareers,
        totalSkills,
        totalDocuments: totalDocs,
        aiService: aiHealth,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats.', error: err.message });
  }
};

module.exports = {
  uploadDocument,
  listDocuments,
  deleteDocument,
  getStats,
};
