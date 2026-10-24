import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  GitCompare,
  BotMessageSquare,
  Sparkles,
  ShieldCheck,
  Cpu,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Award,
  Layers,
  Database,
  ExternalLink,
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-brand-600 animate-pulse" />
              VII-Semester CSE Major Project • Production Grade
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              AI-Powered Personalized <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600">
                Academic & Career Guidance
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Empowering college engineering students with deterministic content-based course matching, quantitative skill-gap roadmaps, and an institution-grounded RAG conversational assistant.
            </p>

            {/* Quick Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition-all"
              >
                Sign In as Student
              </Link>
            </div>

            {/* Live Demo Quickfill Credentials Box */}
            <div className="mt-8 p-4 max-w-xl mx-auto bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm text-left">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Quick Evaluation Accounts (One-Click Testing)
                </span>
                <span className="text-[11px] text-slate-400">Pre-seeded with real CSE curriculum</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="font-semibold text-slate-800">Student Profile (Arjun Sharma):</p>
                  <p className="text-slate-600 font-mono text-[11px]">student@institution.edu</p>
                  <p className="text-slate-500 font-mono text-[11px]">Student@12345</p>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100">
                  <p className="font-semibold text-amber-900">Administrator Portal:</p>
                  <p className="text-amber-800 font-mono text-[11px]">admin@institution.edu</p>
                  <p className="text-amber-700 font-mono text-[11px]">Admin@12345</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">The Problem</span>
              <h2 className="text-3xl font-bold text-slate-900">
                Static Academic Portals & Generic Chatbots Fail College Students
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                Engineering students frequently make sub-optimal elective choices and choose capstone projects detached from market reality. Conventional portals display static syllabi, while ungrounded chatbots hallucinate academic regulations, attendance policies, and prerequisite requirements.
              </p>
              <div className="space-y-2.5 pt-2">
                <div className="flex items-start gap-2.5 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</div>
                  <span>Generic AI models invent college attendance rules and missing elective prerequisites.</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</div>
                  <span>No quantifiable formula explaining why a course or project aligns with a specific career role.</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">Our Solution</span>
              <h3 className="text-2xl font-bold text-slate-900">
                Grounded RAG Intelligence + Explainable Content-Based Filtering
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                EduPath AI unifies institutional documents with an explainable multi-factor cosine recommendation algorithm and vector-retrieval conversational assistant.
              </p>
              <div className="space-y-2.5 pt-2">
                <div className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Explainable Scoring:</strong> Overall Score = w₁·Skill + w₂·Interest + w₃·Career + w₄·Academic</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Grounded RAG:</strong> Strict citations from official university curriculum PDFs via ChromaDB</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Automated Skill Gap:</strong> Sequential 3-phase roadmap closing gaps for industry roles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">Engineered Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Four Unified Guidance Pillars
          </h2>
          <p className="text-slate-600 mt-3 text-sm">
            Designed for technical depth and transparent scoring during viva examination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-brand-600 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Course & Elective Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculates cosine similarity across student technical tags, prerequisites, and CGPA thresholds to rank Top-5 electives with component score breakdowns.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <GitCompare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Skill-Gap Analysis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compares current student skills against target roles (e.g., Full Stack, ML Engineer, Cloud Architect), generating priority tiers and phased learning roadmaps.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <BotMessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">RAG Academic Assistant</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Indexes institutional circulars, syllabi, and regulations into ChromaDB using MiniLM-L6-v2 embeddings, returning strictly cited answers with zero policy hallucination.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Capstone Portfolio Match</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recommends major project problem statements with complete technology stacks, difficulty ratings, and required skills for VII/VIII semester final-year teams.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">Workflow</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              How the System Operates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm mx-auto">1</div>
              <h4 className="font-bold text-slate-900 text-sm">Profile Vectorization</h4>
              <p className="text-xs text-slate-600">Student inputs semester, CGPA, technical skills, languages, and career goals.</p>
            </div>

            <div className="relative p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm mx-auto">2</div>
              <h4 className="font-bold text-slate-900 text-sm">Multi-Factor Matching</h4>
              <p className="text-xs text-slate-600">Python FastAPI service computes weighted cosine similarity across catalog entities.</p>
            </div>

            <div className="relative p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm mx-auto">3</div>
              <h4 className="font-bold text-slate-900 text-sm">Gap Radar & Roadmaps</h4>
              <p className="text-xs text-slate-600">Identifies missing prerequisites and arranges curriculum into a 12-week roadmap.</p>
            </div>

            <div className="relative p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm mx-auto">4</div>
              <h4 className="font-bold text-slate-900 text-sm">Grounded Q&A Inquiries</h4>
              <p className="text-xs text-slate-600">Ask questions regarding college electives, attendance cutoffs, and capstone regulations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to evaluate the Major Project platform?</h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed">
            Experience end-to-end recommendation workflows with seeded test profiles or create a new student account to observe real-time adaptation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              Launch Student Dashboard
            </Link>
            <Link
              to="/admin-login"
              className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Open Administrator Console
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
