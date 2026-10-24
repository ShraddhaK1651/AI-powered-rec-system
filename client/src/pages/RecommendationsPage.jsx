import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axiosClient';
import { ScoreBreakdown } from '../components/ScoreBreakdown';
import {
  Compass,
  BookOpen,
  Code2,
  Layers,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Filter,
  Sparkles,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

export const RecommendationsPage = () => {
  const { profile } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'skills' | 'projects' | 'careers'
  const [recommendations, setRecommendations] = useState(null);
  const [savedItemIds, setSavedItemIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const [recRes, savedRes] = await Promise.all([
        api.get('/recommendations?top_k=5'),
        api.get('/recommendations/saved'),
      ]);

      if (recRes.data.success) {
        setRecommendations(recRes.data.recommendations);
      }
      if (savedRes.data.success) {
        const ids = new Set(savedRes.data.saved.map((item) => `${item.itemType}_${item.itemId}`));
        setSavedItemIds(ids);
      }
    } catch (err) {
      toast.error('Failed to load recommendation dataset.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleBookmark = async (itemType, itemId, title, metadata) => {
    const key = `${itemType}_${itemId}`;
    try {
      const res = await api.post('/recommendations/save', {
        itemType,
        itemId: String(itemId),
        title,
        metadata,
      });
      if (res.data.success) {
        setSavedItemIds((prev) => new Set(prev).add(key));
        toast.success(`Bookmarked "${title}" to your saved dashboard.`);
      }
    } catch (err) {
      toast.error('Failed to bookmark item.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="h-28 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Filter items if needed
  const getFilteredCourses = () => {
    if (!recommendations?.courses) return [];
    if (filterDifficulty === 'all') return recommendations.courses;
    return recommendations.courses.filter(
      (c) => c.difficulty.toLowerCase() === filterDifficulty.toLowerCase()
    );
  };

  const getFilteredProjects = () => {
    if (!recommendations?.projects) return [];
    if (filterDifficulty === 'all') return recommendations.projects;
    return recommendations.projects.filter(
      (p) => p.difficulty.toLowerCase() === filterDifficulty.toLowerCase()
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with explainable formula pill */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Deterministic Content-Based Engine
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Personalized Recommendations Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Cosine similarity vectors generated from your profile ({profile?.skills?.length || 0} skills, CGPA {profile?.cgpa}, target: {profile?.targetRole}).
              </p>
            </div>

            {/* Explainable Scoring Formula Box */}
            <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-100 max-w-sm">
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block mb-1">
                Engine Formula Formulation:
              </span>
              <p className="text-xs font-mono text-indigo-800 font-semibold">
                Score = 0.40·Skill + 0.30·Interest + 0.20·Career + 0.10·Academic
              </p>
              <p className="text-[10px] text-indigo-600 mt-0.5">
                Deterministic tie-breaking with strict prerequisite verification.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 border-b sm:border-b-0 border-slate-200 pb-2 sm:pb-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'courses'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Courses & Electives ({recommendations?.courses?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'skills'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" />
              High-Priority Skills ({recommendations?.skills?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'projects'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              Capstone Projects ({recommendations?.projects?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('careers')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'careers'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Career Paths ({recommendations?.careers?.length || 0})
            </button>
          </div>

          {(activeTab === 'courses' || activeTab === 'projects') && (
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500 font-medium">Difficulty:</span>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Difficulties</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            {getFilteredCourses().map((course) => {
              const isSaved = savedItemIds.has(`course_${course.code}`);
              return (
                <div
                  key={course.code}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded">
                          {course.code}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          {course.title}
                        </h3>
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {course.domain}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex items-center sm:flex-col items-end gap-2 shrink-0">
                      <div className="text-right">
                        <span className="text-xl font-extrabold text-brand-700 block">
                          {course.relevance_score}%
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-slate-400">
                          Relevance Match
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleBookmark('course', course.code, course.title, {
                            code: course.code,
                            credits: course.credits,
                            domain: course.domain,
                          })
                        }
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          isSaved
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                        title={isSaved ? 'Bookmarked' : 'Save course'}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
                        <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Bookmark'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Course Details Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Difficulty</span>
                      <span className="font-semibold text-slate-800">{course.difficulty}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Credits</span>
                      <span className="font-semibold text-slate-800">{course.credits} Credits</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Minimum CGPA</span>
                      <span className="font-semibold text-slate-800">{course.minCgpa} / 10.0</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Prerequisites</span>
                      <span className="font-semibold text-slate-800">
                        {course.prerequisites?.length > 0 ? course.prerequisites.join(', ') : 'None'}
                      </span>
                    </div>
                  </div>

                  {/* Skills Covered */}
                  {course.skillsCovered && course.skillsCovered.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-500 mr-1">Skills Trained:</span>
                      {course.skillsCovered.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium bg-indigo-50/70 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Explainable Score Breakdown Component */}
                  <ScoreBreakdown
                    relevanceScore={course.relevance_score}
                    componentScores={course.component_scores}
                    explanation={course.explanation}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: SKILLS */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations?.skills?.map((skill, idx) => {
              const isSaved = savedItemIds.has(`skill_${skill.name}`);
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{skill.name}</h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              skill.status === 'Acquired'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {skill.status}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">{skill.domain} • {skill.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-brand-700">{skill.relevance_score}%</span>
                        <span className="text-[10px] text-slate-400 block">Priority Score</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      💡 <span className="font-semibold text-slate-800">Why recommended:</span> {skill.reason}
                    </p>

                    {skill.learningResources && skill.learningResources.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs font-semibold text-slate-700 block mb-1">
                          Curated Learning Resources:
                        </span>
                        <div className="space-y-1">
                          {skill.learningResources.map((res, rIdx) => (
                            <a
                              key={rIdx}
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-brand-600 hover:text-brand-800 flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>{res.title} ({res.type})</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Priority: <strong className="text-slate-800">{skill.priority}</strong>
                    </span>
                    <button
                      onClick={() => handleBookmark('skill', skill.name, skill.name, { domain: skill.domain })}
                      className="text-xs font-semibold text-slate-600 hover:text-brand-600 flex items-center gap-1"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      {isSaved ? 'Saved' : 'Save Skill'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: CAPSTONE PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {getFilteredProjects().map((proj, idx) => {
              const isSaved = savedItemIds.has(`project_${proj.title}`);
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">{proj.title}</h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {proj.difficulty} Difficulty
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-brand-700">{proj.domain}</p>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                        {proj.problemStatement}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xl font-extrabold text-brand-700">{proj.relevance_score}%</span>
                      <span className="text-[10px] text-slate-400 block uppercase">Capstone Fit</span>
                      <button
                        onClick={() => handleBookmark('project', proj.title, proj.title, { difficulty: proj.difficulty })}
                        className="mt-2 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-1 ml-auto"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        {isSaved ? 'Saved' : 'Bookmark'}
                      </button>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-xs font-semibold text-slate-500 mr-1">Recommended Tech Stack:</span>
                    {proj.techStack?.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-medium bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded border border-slate-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Expected Learning Outcomes */}
                  {proj.expectedOutcomes && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                      <span className="font-semibold text-slate-700 block">Evaluation & Deliverable Outcomes:</span>
                      {proj.expectedOutcomes.map((out, oIdx) => (
                        <p key={oIdx} className="text-slate-600 flex items-start gap-2">
                          <span className="text-brand-600 font-bold">•</span>
                          <span>{out}</span>
                        </p>
                      ))}
                    </div>
                  )}

                  <ScoreBreakdown
                    relevanceScore={proj.relevance_score}
                    componentScores={proj.component_scores}
                    explanation={proj.reason}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: CAREER PATHS */}
        {activeTab === 'careers' && (
          <div className="space-y-6">
            {recommendations?.careers?.map((car, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900">{car.title}</h3>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                        {car.domain}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{car.description}</p>
                    <div className="flex items-center gap-4 text-xs font-semibold pt-1">
                      <span className="text-emerald-700">Salary Band: {car.averageSalary}</span>
                      <span className="text-indigo-700">Growth: {car.growthRate}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-2xl font-extrabold text-brand-700">{car.relevance_score}%</span>
                    <span className="text-[10px] text-slate-400 block uppercase">Profile Synergy</span>
                  </div>
                </div>

                {/* Matching vs Missing Skills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1.5">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Skills You Already Possess ({car.matching_skills?.length || 0})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {car.matching_skills?.map((s, sIdx) => (
                        <span key={sIdx} className="text-[11px] font-medium bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1.5">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Skills to Acquire ({car.missing_skills?.length || 0})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {car.missing_skills?.map((s, sIdx) => (
                        <span key={sIdx} className="text-[11px] font-medium bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <a
                    href="/skill-gap"
                    className="text-xs font-bold text-brand-600 hover:text-brand-800 inline-flex items-center gap-1"
                  >
                    Launch Full Skill-Gap Preparation Roadmap for {car.title}
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
