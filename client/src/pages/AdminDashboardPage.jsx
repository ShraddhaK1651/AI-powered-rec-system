import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axiosClient';
import {
  ShieldCheck,
  Upload,
  FileText,
  Trash2,
  Database,
  Users,
  BookOpen,
  Layers,
  Cpu,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  HardDrive,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [stats, setStats] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, docsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/documents'),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (docsRes.data.success) {
        setDocuments(docsRes.data.documents || []);
      }
    } catch (err) {
      toast.error('Failed to load administration telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['pdf', 'txt', 'md'].includes(ext)) {
        toast.error('Only PDF and TXT documents are supported for RAG indexing.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File exceeds maximum allowable 10MB limit.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select an institutional document file.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      const res = await api.post('/admin/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setSelectedFile(null);
        fetchAdminData(); // Refresh documents and chunk counts
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to index document into vector store.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (docId, filename) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}" and remove its vectors from ChromaDB?`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/documents/${docId}`);
      if (res.data.success) {
        toast.success(`Removed ${filename} from knowledge base.`);
        setDocuments(documents.filter((d) => d.docId !== docId));
        fetchAdminData();
      }
    } catch (err) {
      toast.error('Failed to delete document vectors.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              Administrative Operations Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Institutional Resource & Knowledge Base Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Logged in as <strong className="text-white">{user?.email}</strong>. Manage institutional curriculum documents, ChromaDB vector indexing, and catalog entities.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Telemetry
          </button>
        </div>

        {/* Telemetry Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Registered Students</span>
              <Users className="w-5 h-5 text-brand-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats?.totalStudents || 0}</p>
            <p className="text-xs text-slate-400 mt-1">Profiles in MongoDB</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Academic Courses</span>
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats?.totalCourses || 0}</p>
            <p className="text-xs text-slate-400 mt-1">Curriculum electives</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Capstone Projects</span>
              <Layers className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats?.totalProjects || 0}</p>
            <p className="text-xs text-slate-400 mt-1">VII/VIII Sem major projects</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Indexed Documents</span>
              <HardDrive className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats?.totalDocuments || 0}</p>
            <p className="text-xs text-slate-400 mt-1">ChromaDB Persistent Store</p>
          </div>
        </div>

        {/* Document Ingestion & RAG Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-brand-600" />
                Upload Institutional Document
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                PDF or TXT documents (Syllabus, Regulations, Grading Manuals).
              </p>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-brand-500 transition-colors">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <label className="cursor-pointer">
                  <span className="text-xs font-semibold text-brand-600 hover:text-brand-700 block">
                    Choose PDF or TXT file
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.txt,.md"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-400 mt-1">Max file size: 10MB</p>
                {selectedFile && (
                  <p className="mt-2 text-xs font-semibold text-slate-800 bg-brand-50 p-1.5 rounded border border-brand-200">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              <div className="text-xs text-slate-500 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="font-semibold text-slate-700">RAG Chunking Specifications:</p>
                <p>• Chunk Size: <strong>800 characters</strong></p>
                <p>• Chunk Overlap: <strong>150 characters</strong></p>
                <p>• Embeddings: <strong>sentence-transformers/all-MiniLM-L6-v2</strong></p>
                <p>• Vector Target: <strong>ChromaDB (Persistent)</strong></p>
              </div>

              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Process & Index into ChromaDB
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Indexed Documents Table Card */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  Indexed Knowledge Base Documents
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Institutional texts serving student RAG inquiries with verified source attribution.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {documents.length} Active Records
              </span>
            </div>

            <div className="overflow-x-auto">
              {documents.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No documents in vector store. Upload academic regulations to activate RAG.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3">Document Title</th>
                      <th className="py-2.5 px-3">Doc ID</th>
                      <th className="py-2.5 px-3">Chroma Chunks</th>
                      <th className="py-2.5 px-3">File Size</th>
                      <th className="py-2.5 px-3">Indexed On</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {documents.map((doc) => (
                      <tr key={doc.docId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                          <span className="truncate max-w-[180px]">{doc.filename}</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{doc.docId}</td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            {doc.actualChromaChunks || doc.chunkCount} chunks
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : 'N/A'}
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteDoc(doc.docId, doc.filename)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Remove document and prune ChromaDB vectors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
