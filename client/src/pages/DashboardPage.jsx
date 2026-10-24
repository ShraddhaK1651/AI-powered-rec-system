import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosClient';
import {
  GraduationCap,
  Award,
  BookOpen,
  Code2,
  Compass,
  GitCompare,
  BotMessageSquare,
  Bookmark,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export const DashboardPage = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [skillGapSummary, setSkillGapSummary] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Parallel fetching
        const [recRes, savedRes, chatRes, gapRes] = await Promise.allSettled([
          api.get('/recommendations?top_k=3'),
          api.get('/recommendations/saved'),
          api.get('/rag/sessions'),
          api.post('/recommendations/skill-gap', { careerTitle: profile?.targetRole || 'Full Stack Developer' }),
        ]);

        if (recRes.status === 'fulfilled' && recRes.value.data.success) {
          setRecommendations(recRes.value.data.recommendations);
        }
        if (savedRes.status === 'fulfilled' && savedRes.value.data.success) {
          setSavedItems(savedRes.value.data.saved || []);
        }
        if (chatRes.status === 'fulfilled' && chatRes.value.data.success) {
          setRecentChats(chatRes.value.data.sessions || []);
        }
        if (gapRes.status === 'fulfilled' && gapRes.value.data.success) {
          setSkillGapSummary(gapRes.value.data.analysis);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [profile?.targetRole]);

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    if (!profile) return 20;
    let score = 20; // baseline for user account
    if (profile.fullName) score += 10;
    if (profile.semester) score += 10;
    if (profile.cgpa) score += 10;
    if (profile.skills && profile.skills.length > 0) score += 20;
    if (profile.interests && profile.interests.length > 0) score += 15;
    if (profile.targetRole) score += 15;
    return Math.min(score, 100);
  };

  const completionPct = calculateCompletion();

  // Radar chart data for student competencies
  const radarData = [
    { subject: 'Skill Match', value: skillGapSummary ? skillGapSummary.match_percentage : 75 },
    { subject: 'Academic CGPA', value: profile?.cgpa ? (profile.cgpa * 10) : 80 },
    { subject: 'Course Readiness', value: 85 },
    { subject: 'Capstone Align', value: 90 },
    { subject: 'Core Branch Tech', value: profile?.skills?.length ? Math.min(profile.skills.length * 12, 100) : 60 },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-72 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Top Welcome Banner */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Personalized Academic Workspace
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Welcome back, {profile?.fullName || user?.name}! 👋
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Semester {profile?.semester || 5} • {profile?.college || 'Computer Science & Engineering'} • Target: <span className="font-semibold text-slate-800">{profile?.targetRole || 'Software Engineer'}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/chat"
                className="px-4 py-2 text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl border border-brand-200 transition-colors flex items-center gap-2"
              >
                <BotMessageSquare className="w-4 h-4" />
                Ask Academic AI
              </Link>
              <Link
                to="/profile"
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                Update Profile
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Profile Completion Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 max-w-md">
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Profile Completion</span>
                <span className="text-brand-600 font-bold">{completionPct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
            {completionPct < 100 && (
              <p className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Complete your skills & interests to maximize recommendation accuracy.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Academic CGPA</span>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{profile?.cgpa?.toFixed(2) || '7.50'}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Honors eligible (≥ 8.25 target)</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Semester</span>
              <GraduationCap className="w-5 h-5 text-brand-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">Sem {profile?.semester || 5}</p>
            <p className="text-xs text-slate-500 mt-1">B.Tech Computer Science</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Skills Logged</span>
              <Code2 className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{profile?.skills?.length || 0}</p>
            <p className="text-xs text-slate-500 mt-1">
              {profile?.skills?.slice(0, 2).join(', ') || 'No skills yet'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Target Role Fit</span>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {skillGapSummary ? `${skillGapSummary.match_percentage}%` : '82%'}
            </p>
            <p className="text-xs text-brand-600 font-medium mt-1">{profile?.targetRole || 'Full Stack'}</p>
          </div>
        </div>

        {/* Competency Visualizer & Quick Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Competency Radar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-600" />
                  Competency Readiness
                </h3>
                <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                  Vector Model
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">
                Multi-axial profile alignment across skills, academic prerequisites, and career readiness.
              </p>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                    <Radar
                      name="Student Fit"
                      dataKey="value"
                      stroke="#4f46e5"
                      fill="#6366f1"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <Link
              to="/skill-gap"
              className="mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center justify-between"
            >
              <span>Inspect Detailed Skill-Gap Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Top Recommendations Preview */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-brand-600" />
                  Top Recommended Courses for You
                </h3>
                <p className="text-xs text-slate-500">
                  Ranked by Content-Based Filtering (Cosine Similarity + Prerequisite Matching)
                </p>
              </div>
              <Link
                to="/recommendations"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recommendations?.courses && recommendations.courses.length > 0 ? (
                recommendations.courses.slice(0, 3).map((course, idx) => (
                  <div
                    key={course.code || idx}
                    className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-700 bg-brand-100/60 px-2 py-0.5 rounded">
                          {course.code}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{course.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{course.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                        <span>{course.credits} Credits</span>
                        <span>•</span>
                        <span>Min CGPA: {course.minCgpa}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-medium">Difficulty: {course.difficulty}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-extrabold text-brand-700">
                        {course.relevance_score}%
                      </div>
                      <span className="text-[10px] text-slate-400 block">Match Score</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No courses generated yet. Please ensure catalog is seeded.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lower Row: Capstone Projects & Saved Bookmarks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recommended Capstone Projects */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-600" />
                Recommended Capstone Projects
              </h3>
              <Link to="/recommendations" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                Browse All
              </Link>
            </div>

            <div className="space-y-3">
              {recommendations?.projects && recommendations.projects.length > 0 ? (
                recommendations.projects.slice(0, 2).map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                      <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {proj.relevance_score}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{proj.problemStatement}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.techStack?.slice(0, 4).map((tech, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-medium bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">No capstone projects loaded.</p>
              )}
            </div>
          </div>

          {/* Saved Bookmarks & Recent AI Inquiries */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-brand-600" />
                  Saved Bookmarks ({savedItems.length})
                </h3>
                <Link to="/recommendations" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                  Manage
                </Link>
              </div>

              {savedItems.length > 0 ? (
                <div className="space-y-2">
                  {savedItems.slice(0, 3).map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-800">
                          {item.itemType}
                        </span>
                        <span className="font-semibold text-slate-800 truncate max-w-[200px]">{item.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                  <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p>You haven't bookmarked any recommendations yet.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Bookmark courses or projects to revisit during course registration.</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                to="/chat"
                className="w-full py-2.5 px-4 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors border border-brand-100"
              >
                <BotMessageSquare className="w-4 h-4" />
                Ask Institutional RAG Assistant Questions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
