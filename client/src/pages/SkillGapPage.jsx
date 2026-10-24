import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axiosClient';
import {
  GitCompare,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  BookOpen,
  Layers,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Target,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

export const SkillGapPage = () => {
  const { profile } = useAuth();
  const toast = useToast();

  const [selectedRole, setSelectedRole] = useState(profile?.targetRole || 'Full Stack Developer');
  const [analysis, setAnalysis] = useState(null);
  const [careerData, setCareerData] = useState(null);
  const [loading, setLoading] = useState(true);

  const availableRoles = [
    'Full Stack Developer',
    'Machine Learning Engineer',
    'Cloud Solutions Architect',
    'Cybersecurity Analyst',
  ];

  const fetchSkillGap = async (role) => {
    try {
      setLoading(true);
      const res = await api.post('/recommendations/skill-gap', { careerTitle: role });
      if (res.data.success) {
        setAnalysis(res.data.analysis);
        setCareerData(res.data.career);
      }
    } catch (err) {
      toast.error('Failed to analyze skill gap for selected role.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillGap(selectedRole);
  }, [selectedRole]);

  const pieData = analysis
    ? [
        { name: 'Acquired Skills', value: analysis.acquired_count, color: '#10b981' },
        { name: 'Missing Skills', value: analysis.missing_count, color: '#f59e0b' },
      ]
    : [];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Comparative Competency Diagnostic
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Career Skill-Gap Analysis & Roadmap
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Quantitative matrix evaluating your verified skills against industry benchmarks.
              </p>
            </div>

            {/* Role Selector dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Target Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 text-sm font-semibold rounded-xl border border-brand-300 bg-brand-50 text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="h-44 bg-slate-200 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview Match Score & Summary Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Donut Chart */}
              <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
                <div className="h-40 w-40 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={48}
                        outerRadius={68}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-900">
                      {analysis?.match_percentage}%
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      Readiness
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs mt-2">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Acquired ({analysis?.acquired_count})
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Missing ({analysis?.missing_count})
                  </span>
                </div>
              </div>

              {/* Role Context & Salary/Growth */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">{careerData?.title}</h3>
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                    {careerData?.averageSalary}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {careerData?.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
                  <span>Domain: <strong className="text-slate-800">{careerData?.domain}</strong></span>
                  <span>Growth Velocity: <strong className="text-indigo-600">{careerData?.growthRate}</strong></span>
                  <span>Total Skill Benchmarks: <strong className="text-slate-800">{analysis?.total_required}</strong></span>
                </div>
              </div>
            </div>

            {/* Skills Breakdown: Acquired vs Missing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Acquired Skills Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    Skills You Already Possess ({analysis?.matching_skills?.length || 0})
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  These verified skills match the core requirements for {selectedRole}.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {analysis?.matching_skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-emerald-50/80 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills Card with Priority Tiers */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    Missing Skills to Acquire ({analysis?.missing_skills?.length || 0})
                  </h3>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    Priority Gaps
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Ranked by criticality to bridge your profile to standard market expectations.
                </p>

                {analysis?.priority_breakdown?.high?.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
                      Immediate High-Priority Prerequisites:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.priority_breakdown.high.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-lg"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {analysis?.priority_breakdown?.medium?.length > 0 && (
                  <div className="space-y-1 pt-2">
                    <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                      Secondary Applied Competencies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.priority_breakdown.medium.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-lg"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preparation Roadmap */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-brand-600" />
                    Sequential 12-Week Bridge Roadmap
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Recommended curriculum timeline to systematically close identified gaps for {selectedRole}.
                  </p>
                </div>
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
                  3 Structured Phases
                </span>
              </div>

              <div className="space-y-4">
                {analysis?.learning_roadmap?.map((phase, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{phase.phase}</h4>
                        <span className="text-[11px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {phase.duration}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 pt-1 leading-relaxed">{phase.action}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 md:max-w-xs shrink-0">
                      {phase.focus_skills?.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-indigo-200 text-indigo-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Institutional Disclaimer */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs text-slate-600">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{analysis?.disclaimer}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
