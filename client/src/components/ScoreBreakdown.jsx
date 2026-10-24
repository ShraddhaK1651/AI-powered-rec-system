import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

export const ScoreBreakdown = ({ relevanceScore, componentScores, explanation }) => {
  if (!componentScores) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          Explainable Multi-Factor Score:
        </span>
        <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">
          {relevanceScore}% Match
        </span>
      </div>

      {/* Component factors progress bars */}
      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50/75 p-2 rounded-lg border border-slate-100">
        {componentScores.skill_match !== undefined && (
          <div>
            <div className="flex justify-between mb-0.5">
              <span>Skill Match (w₁: 40%)</span>
              <span className="font-medium text-slate-800">{componentScores.skill_match}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(componentScores.skill_match, 100)}%` }}
              />
            </div>
          </div>
        )}

        {componentScores.interest_match !== undefined && (
          <div>
            <div className="flex justify-between mb-0.5">
              <span>Interest Match (w₂: 30%)</span>
              <span className="font-medium text-slate-800">{componentScores.interest_match}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(componentScores.interest_match, 100)}%` }}
              />
            </div>
          </div>
        )}

        {componentScores.career_match !== undefined && (
          <div>
            <div className="flex justify-between mb-0.5">
              <span>Career Align (w₃: 20%)</span>
              <span className="font-medium text-slate-800">{componentScores.career_match}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(componentScores.career_match, 100)}%` }}
              />
            </div>
          </div>
        )}

        {componentScores.academic_match !== undefined && (
          <div>
            <div className="flex justify-between mb-0.5">
              <span>Academic Match (w₄: 10%)</span>
              <span className="font-medium text-slate-800">{componentScores.academic_match}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-violet-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(componentScores.academic_match, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {explanation && (
        <p className="text-xs text-slate-500 italic bg-white p-2 rounded border border-slate-100">
          💡 <span className="text-slate-700 not-italic font-medium">Why recommended:</span> {explanation}
        </p>
      )}
    </div>
  );
};
