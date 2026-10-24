const ChatHistory = require('../models/ChatHistory');
const aiClient = require('../services/aiServiceClient');
const crypto = require('crypto');

const askQuestion = async (req, res) => {
  try {
    const { query, sessionId } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, message: 'Question query cannot be empty.' });
    }

    const activeSessionId = sessionId || crypto.randomUUID();

    // Call Python FastAPI RAG endpoint
    const ragResponse = await aiClient.queryRAG(query.trim(), 5, 0.30);

    const userMsg = {
      sender: 'user',
      text: query.trim(),
      timestamp: new Date(),
    };

    const assistantMsg = {
      sender: 'assistant',
      text: ragResponse.answer,
      citations: ragResponse.citations || [],
      disclaimer: ragResponse.disclaimer || '',
      timestamp: new Date(),
    };

    // Save or update chat history
    let chat = await ChatHistory.findOne({ sessionId: activeSessionId, userId: req.user._id });
    if (!chat) {
      chat = new ChatHistory({
        userId: req.user._id,
        sessionId: activeSessionId,
        title: query.trim().slice(0, 45) + (query.length > 45 ? '...' : ''),
        messages: [userMsg, assistantMsg],
      });
    } else {
      chat.messages.push(userMsg, assistantMsg);
      chat.updatedAt = new Date();
    }
    await chat.save();

    res.status(200).json({
      success: true,
      sessionId: activeSessionId,
      answer: ragResponse.answer,
      citations: ragResponse.citations || [],
      contextFound: ragResponse.context_found,
      disclaimer: ragResponse.disclaimer,
      timestamp: assistantMsg.timestamp,
    });
  } catch (err) {
    console.error('RAG Q&A error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to process academic query with RAG assistant.',
      error: err.message,
    });
  }
};

const getChatSessions = async (req, res) => {
  try {
    const sessions = await ChatHistory.find({ userId: req.user._id })
      .select('sessionId title createdAt updatedAt messages')
      .sort({ updatedAt: -1 })
      .lean();

    const formatted = sessions.map(s => ({
      sessionId: s.sessionId,
      title: s.title,
      messageCount: s.messages?.length || 0,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      lastMessage: s.messages && s.messages.length > 0 ? s.messages[s.messages.length - 1].text : '',
    }));

    res.status(200).json({ success: true, sessions: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve chat sessions.', error: err.message });
  }
};

const getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await ChatHistory.findOne({ sessionId, userId: req.user._id });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Chat session not found.' });
    }

    res.status(200).json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve session messages.', error: err.message });
  }
};

const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await ChatHistory.findOneAndDelete({ sessionId, userId: req.user._id });
    res.status(200).json({ success: true, message: 'Chat session removed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete chat session.', error: err.message });
  }
};

module.exports = {
  askQuestion,
  getChatSessions,
  getSessionMessages,
  deleteSession,
};
