import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axiosClient';
import {
  BotMessageSquare,
  Send,
  Plus,
  Trash2,
  BookOpen,
  FileText,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const ChatbotPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedCitations, setExpandedCitations] = useState({});

  const messagesEndRef = useRef(null);

  const sampleQuestions = [
    'What are the prerequisites for Deep Learning (CSE401)?',
    'What is the minimum attendance required before detention occurs?',
    'Explain the credit distribution and phases for the B.Tech Capstone Project.',
    'Can I earn academic credits through NPTEL or Coursera online courses?',
  ];

  const fetchSessions = async () => {
    try {
      const res = await api.get('/rag/sessions');
      if (res.data.success) {
        setSessions(res.data.sessions || []);
        if (res.data.sessions?.length > 0 && !currentSessionId) {
          loadSession(res.data.sessions[0].sessionId);
        } else if (res.data.sessions?.length === 0) {
          startNewSession();
        }
      }
    } catch (err) {
      console.error('Failed to fetch chat sessions:', err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const loadSession = async (sessionId) => {
    try {
      setCurrentSessionId(sessionId);
      const res = await api.get(`/rag/sessions/${sessionId}`);
      if (res.data.success) {
        setMessages(res.data.session.messages || []);
      }
    } catch (err) {
      toast.error('Failed to load session messages.');
    }
  };

  const startNewSession = () => {
    const newId = 'session_' + Date.now();
    setCurrentSessionId(newId);
    setMessages([
      {
        sender: 'assistant',
        text: 'Hello! I am your Institutional Academic Guidance Assistant. I am grounded directly in your university\'s official syllabus regulations, capstone guidelines, and course circulars. How can I assist you with your academic curriculum today?',
        citations: [],
        timestamp: new Date(),
      },
    ]);
  };

  const deleteSession = async (sessionId, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/rag/sessions/${sessionId}`);
      toast.success('Session removed.');
      const remaining = sessions.filter((s) => s.sessionId !== sessionId);
      setSessions(remaining);
      if (currentSessionId === sessionId) {
        if (remaining.length > 0) {
          loadSession(remaining[0].sessionId);
        } else {
          startNewSession();
        }
      }
    } catch (err) {
      toast.error('Failed to delete chat session.');
    }
  };

  const handleSend = async (queryToSend) => {
    const query = (queryToSend || inputQuery).trim();
    if (!query || loading) return;

    setInputQuery('');
    const userMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.post('/rag/ask', {
        query,
        sessionId: currentSessionId,
      });

      if (res.data.success) {
        const assistantMsg = {
          sender: 'assistant',
          text: res.data.answer,
          citations: res.data.citations || [],
          disclaimer: res.data.disclaimer,
          contextFound: res.data.contextFound,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        fetchSessions(); // refresh session titles in sidebar
      }
    } catch (err) {
      const errorText =
        err.response?.data?.message ||
        'Failed to connect to the RAG guidance engine. Please ensure the Python AI service is running.';
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: errorText,
          citations: [],
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleCitation = (msgIndex) => {
    setExpandedCitations((prev) => ({
      ...prev,
      [msgIndex]: !prev[msgIndex],
    }));
  };

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Sidebar: Chat History Sessions */}
        <div className="w-full md:w-72 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col shrink-0">
          <button
            onClick={startNewSession}
            className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mb-4"
          >
            <Plus className="w-4 h-4" />
            New Academic Inquiry
          </button>

          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1 block">
            Previous Inquiries
          </span>

          <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[500px]">
            {sessions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No previous conversations.</p>
            ) : (
              sessions.map((s) => (
                <div
                  key={s.sessionId}
                  onClick={() => loadSession(s.sessionId)}
                  className={`group flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                    currentSessionId === s.sessionId
                      ? 'bg-brand-50 border border-brand-200 text-brand-900 font-semibold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate mr-2">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{s.title || 'Guidance Session'}</span>
                  </div>
                  <button
                    onClick={(e) => deleteSession(s.sessionId, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                    title="Delete session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Strict ChromaDB Vector Grounding</span>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Assistant Chat Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm">
                <BotMessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  Institutional Academic Assistant
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Active Grounding
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  Grounded on official institutional curriculum regulations and policy documents
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span>LangChain</span> • <span>MiniLM-L6-v2</span> • <span>ChromaDB</span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[550px]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-2xl px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200/60'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Structured Citations Accordion (for assistant responses) */}
                {msg.sender === 'assistant' && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2 max-w-2xl w-full">
                    <button
                      onClick={() => toggleCitation(idx)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg border border-brand-200 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>
                        Verified Institutional Citations ({msg.citations.length} documents referenced)
                      </span>
                      {expandedCitations[idx] ? (
                        <ChevronUp className="w-3.5 h-3.5 ml-1" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 ml-1" />
                      )}
                    </button>

                    {expandedCitations[idx] && (
                      <div className="mt-2 space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs animate-in fade-in duration-200">
                        {msg.citations.map((cite, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1"
                          >
                            <div className="flex items-center justify-between font-semibold text-slate-800">
                              <span className="flex items-center gap-1 text-brand-700">
                                <FileText className="w-3.5 h-3.5" />
                                {cite.document}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 font-mono text-[11px]">
                                  Page {cite.page}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
                                  {cite.relevance_score}% Match
                                </span>
                              </div>
                            </div>
                            <p className="text-slate-600 italic text-[11px] border-l-2 border-brand-300 pl-2">
                              "{cite.snippet}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs py-2">
                <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                <span>Retrieving institutional chunks and synthesizing grounded answer...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Suggestions */}
          {messages.length <= 1 && (
            <div className="px-6 py-2 border-t border-slate-100 bg-slate-50/50">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Suggested Examiner Inquiries:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-left text-xs bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-slate-700 hover:text-brand-800 px-3 py-1.5 rounded-lg transition-all shadow-2xs"
                  >
                    💡 {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Query Input Box */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask an academic, curriculum, or regulation question (e.g. attendance rules, CSE401 prerequisites)..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={loading || !inputQuery.trim()}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Ask Assistant</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
