const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

const client = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: 45000, // 45 seconds for vector operations
});

const checkAiServiceHealth = async () => {
  try {
    const res = await client.get('/health');
    return res.data;
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
};

const getRecommendations = async (studentProfile, catalog, topK = 5) => {
  try {
    const payload = {
      student_profile: {
        name: studentProfile.fullName || 'Student',
        semester: studentProfile.semester || 5,
        cgpa: studentProfile.cgpa || 7.5,
        skills: studentProfile.skills || [],
        programming_languages: studentProfile.programmingLanguages || [],
        interests: studentProfile.interests || [],
        preferred_roles: studentProfile.preferredRoles || [],
        target_role: studentProfile.targetRole || 'Software Engineer',
        career_goals: studentProfile.careerGoals || '',
      },
      courses: catalog.courses || [],
      skills: catalog.skills || [],
      projects: catalog.projects || [],
      careers: catalog.careers || [],
      top_k: topK,
    };

    const res = await client.post('/api/recommend/all', payload);
    return res.data.recommendations;
  } catch (err) {
    console.error('[AIServiceClient] Recommendation engine error:', err.response?.data || err.message);
    throw new Error(err.response?.data?.detail || 'Failed to generate recommendations from AI service.');
  }
};

const getSkillGap = async (studentProfile, career) => {
  try {
    const payload = {
      student_profile: {
        name: studentProfile.fullName || 'Student',
        semester: studentProfile.semester || 5,
        cgpa: studentProfile.cgpa || 7.5,
        skills: studentProfile.skills || [],
        programming_languages: studentProfile.programmingLanguages || [],
        interests: studentProfile.interests || [],
        preferred_roles: studentProfile.preferredRoles || [],
        target_role: studentProfile.targetRole || 'Software Engineer',
      },
      career,
    };

    const res = await client.post('/api/recommend/skill-gap', payload);
    return res.data;
  } catch (err) {
    console.error('[AIServiceClient] Skill-gap analysis error:', err.response?.data || err.message);
    throw new Error(err.response?.data?.detail || 'Failed to compute skill gap analysis.');
  }
};

const queryRAG = async (query, topK = 5, similarityThreshold = 0.35) => {
  try {
    const res = await client.post('/api/rag/query', {
      query,
      top_k: topK,
      similarity_threshold: similarityThreshold,
    });
    return res.data;
  } catch (err) {
    console.error('[AIServiceClient] RAG query error:', err.response?.data || err.message);
    throw new Error(err.response?.data?.detail || 'Failed to process RAG assistant query.');
  }
};

const ingestDocumentToRAG = async (docId, filePath, filename) => {
  try {
    const formData = new FormData();
    formData.append('doc_id', docId);
    formData.append('file', fs.createReadStream(filePath), filename);

    const res = await client.post('/api/rag/upload-document', formData, {
      headers: formData.getHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error('[AIServiceClient] Document ingestion error:', err.response?.data || err.message);
    throw new Error(err.response?.data?.detail || 'Failed to ingest document into vector store.');
  }
};

const listRAGDocuments = async () => {
  try {
    const res = await client.get('/api/rag/documents');
    return res.data;
  } catch (err) {
    console.error('[AIServiceClient] List RAG docs error:', err.message);
    return [];
  }
};

const deleteRAGDocument = async (docId) => {
  try {
    const res = await client.delete(`/api/rag/documents/${docId}`);
    return res.data;
  } catch (err) {
    console.error('[AIServiceClient] Delete RAG doc error:', err.message);
    throw new Error(err.response?.data?.detail || 'Failed to remove document vectors from ChromaDB.');
  }
};

module.exports = {
  checkAiServiceHealth,
  getRecommendations,
  getSkillGap,
  queryRAG,
  ingestDocumentToRAG,
  listRAGDocuments,
  deleteRAGDocument,
};
