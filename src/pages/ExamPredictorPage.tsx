import React, { useState } from 'react';
import { 
  Sparkles, 
  BarChart3, 
  FileText, 
  Download, 
  Eye, 
  FolderPlus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Sliders,
  Printer
} from 'lucide-react';
import { Paper, ExamBoard, GradeLevel } from '../types';
import { ExamPredictionResult } from '../types/workspace';
import { workspaceService } from '../services/workspaceService';
import { AddToProjectModal } from '../components/workspace/AddToProjectModal';

interface ExamPredictorPageProps {
  papers: Paper[];
  onSelectPaper: (paper: Paper) => void;
  onDownloadPaper: (paper: Paper, e?: React.MouseEvent) => void;
  onNavigateToWorkspace: () => void;
}

export const ExamPredictorPage: React.FC<ExamPredictorPageProps> = ({
  papers,
  onSelectPaper,
  onDownloadPaper,
  onNavigateToWorkspace
}) => {
  const [board, setBoard] = useState<ExamBoard>('CBSE');
  const [grade, setGrade] = useState<GradeLevel>('Class 12');
  const [subject, setSubject] = useState<string>('Physics');
  const [targetYear, setTargetYear] = useState<number>(2025);
  
  const [prediction, setPrediction] = useState<ExamPredictionResult | null>(() => 
    workspaceService.generateExamPrediction('CBSE', 'Class 12', 'Physics', 2025, papers)
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddToProjectOpen, setIsAddToProjectOpen] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      const res = workspaceService.generateExamPrediction(board, grade, subject, targetYear, papers);
      setPrediction(res);
      setIsGenerating(false);
      showToast('Predicted blueprint generated successfully');
    }, 400);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-[#0A1222] to-emerald-950/30 border border-white/[0.14] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RULE-BASED PATTERN PREDICTION & ASSEMBLY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#F8FAFC] tracking-tight">
            Exam Paper Predictor
          </h1>

          <p className="text-xs sm:text-sm text-[#A7B4C8] leading-relaxed">
            Analyze historical question frequency, chapter weightages, and recurring derivations from past year papers. Auto-assemble a balanced mock test to test your exam readiness.
          </p>
        </div>
      </div>

      {/* Configuration Controls Bar */}
      <form onSubmit={handleGenerate} className="p-4 sm:p-5 rounded-2xl bg-[#101B2D]/80 border border-white/[0.12] grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
        <div>
          <label className="block text-[11px] text-[#A7B4C8] mb-1 font-semibold uppercase">Exam Board</label>
          <select
            value={board}
            onChange={(e) => setBoard(e.target.value as ExamBoard)}
            className="w-full px-3 py-2 bg-[#0A1222] border border-white/[0.14] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ICSE</option>
            <option value="JEE Main">JEE Main</option>
            <option value="JEE Advanced">JEE Advanced</option>
            <option value="NEET UG">NEET UG</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] text-[#A7B4C8] mb-1 font-semibold uppercase">Class / Level</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value as GradeLevel)}
            className="w-full px-3 py-2 bg-[#0A1222] border border-white/[0.14] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="Class 10">Class 10</option>
            <option value="Class 11">Class 11</option>
            <option value="Class 12">Class 12</option>
            <option value="Competitive">Competitive</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] text-[#A7B4C8] mb-1 font-semibold uppercase">Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 bg-[#0A1222] border border-white/[0.14] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Mathematics">Mathematics</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] text-[#A7B4C8] mb-1 font-semibold uppercase">Target Year</label>
          <select
            value={targetYear}
            onChange={(e) => setTargetYear(Number(e.target.value))}
            className="w-full px-3 py-2 bg-[#0A1222] border border-white/[0.14] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="col-span-2 sm:col-span-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#050914] text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isGenerating ? 'Predicting...' : 'Predict & Assemble'}</span>
        </button>
      </form>

      {/* Prediction Output Section */}
      {prediction && (
        <div className="space-y-8 animate-in fade-in">
          {/* Top Predictive Intelligence Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#101B2D]/80 border border-white/[0.1] space-y-1">
              <div className="text-xs text-[#A7B4C8] flex items-center justify-between">
                <span>Predictive Confidence</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {prediction.confidenceScore}%
              </div>
              <div className="text-[11px] text-[#A7B4C8]">
                Based on recurring pattern density across 5 years
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#101B2D]/80 border border-white/[0.1] space-y-1">
              <div className="text-xs text-[#A7B4C8] flex items-center justify-between">
                <span>Predicted Paper Structure</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {prediction.totalMarks} Marks · {prediction.timeAllowedMinutes / 60}h
              </div>
              <div className="text-[11px] text-cyan-400">
                {prediction.assembledPaper.sections.length} Sections (MCQ, Short, Long)
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#101B2D]/80 border border-white/[0.1] space-y-1">
              <div className="text-xs text-[#A7B4C8] flex items-center justify-between">
                <span>Target Focus</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-300 font-mono truncate">
                {prediction.board} {prediction.targetYear}
              </div>
              <div className="text-[11px] text-[#A7B4C8]">
                {prediction.grade} — {prediction.subject}
              </div>
            </div>
          </div>

          {/* Section: Chapter Weightages & Recurring Concepts */}
          <div className="p-5 sm:p-7 rounded-3xl bg-[#0A1222]/90 border border-white/[0.12] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Predicted Syllabus Weightage Breakdown
                </h3>
                <p className="text-xs text-[#A7B4C8]">
                  Expected mark contributions and recurring question topics calculated from curriculum patterns.
                </p>
              </div>
              <span className="text-xs text-cyan-400 font-mono">
                Total 100% Weightage Allocated
              </span>
            </div>

            <div className="space-y-4">
              {prediction.topicWeightages.map((topic, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#101B2D]/60 border border-white/[0.08] space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{topic.chapter}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase ${
                          topic.difficulty === 'hard'
                            ? 'bg-rose-500/20 text-rose-300'
                            : topic.difficulty === 'medium'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {topic.difficulty} difficulty
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span className="text-cyan-300 font-bold">{topic.weightPercent}% weight</span>
                      <span className="text-[#A7B4C8]">~{topic.estimatedMarks} Marks</span>
                    </div>
                  </div>

                  {/* Weight bar */}
                  <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full"
                      style={{ width: `${topic.weightPercent}%` }}
                    />
                  </div>

                  {/* Recurring Concepts */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-[#A7B4C8] font-medium mr-1">Recurring Concepts:</span>
                    {topic.recurringConcepts.map((c, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.06] text-cyan-200 border border-white/[0.06]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Preparation Strategy Bullet Points */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#101B2D]/80 border border-white/[0.1] space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Recommended High-Yield Revision Strategy</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#A7B4C8]">
              {prediction.preparationStrategy.map((tip, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-2">
                  <span className="text-cyan-400 font-mono font-bold shrink-0">{i + 1}.</span>
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Assembled Predicted Mock Examination Paper */}
          <div className="p-5 sm:p-7 rounded-3xl bg-[#0A1222] border border-white/[0.14] space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Assembled Mock Examination Paper
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                  {prediction.assembledPaper.title}
                </h3>
                <p className="text-xs text-[#A7B4C8]">
                  Full timed question set with formulas and step-by-step marking guidelines.
                </p>
              </div>

              {/* Action buttons on the predicted paper */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onSelectPaper(prediction.assembledPaper)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#050914] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Eye className="w-4 h-4" />
                  <span>Practice in Viewer</span>
                </button>

                <button
                  onClick={(e) => onDownloadPaper(prediction.assembledPaper, e)}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-white flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download Paper</span>
                </button>

                <button
                  onClick={() => setIsAddToProjectOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-white flex items-center gap-1.5"
                  title="Attach this paper to a study project"
                >
                  <FolderPlus className="w-4 h-4 text-teal-400" />
                  <span>Save to Project</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white"
                  title="Print examination paper"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Questions by Sections */}
            <div className="space-y-6">
              {prediction.assembledPaper.sections.map((section) => (
                <div key={section.id} className="space-y-4">
                  <div className="bg-[#101B2D]/80 p-3 sm:p-4 rounded-2xl border border-white/[0.08] flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{section.name}: {section.title}</h4>
                      <p className="text-[11px] text-[#A7B4C8] mt-0.5">{section.instructions}</p>
                    </div>
                    <span className="font-mono text-xs text-cyan-300 font-bold shrink-0">
                      [{section.totalMarks} Marks]
                    </span>
                  </div>

                  <div className="space-y-3">
                    {section.questions.map((q) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] space-y-2.5 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-xs sm:text-sm font-medium text-white leading-relaxed">
                            <span className="font-bold text-cyan-400 mr-2 font-mono">Q.{q.number}</span>
                            <span>{q.text}</span>
                          </div>
                          <span className="text-[11px] font-mono text-[#A7B4C8] shrink-0 font-semibold">
                            [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                          </span>
                        </div>

                        {/* Choices if MCQ */}
                        {q.choices && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-4">
                            {q.choices.map((c) => (
                              <div
                                key={c.key}
                                className="text-xs p-2 rounded-xl bg-[#0A1222] border border-white/[0.08] text-[#E2E8F0] flex items-center gap-2"
                              >
                                <span className="font-mono font-bold text-cyan-400">({c.key})</span>
                                <span>{c.text}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Formula or solution hint */}
                        {q.formula && (
                          <div className="text-[11px] font-mono text-teal-300 bg-teal-950/30 border border-teal-500/20 px-3 py-1.5 rounded-xl">
                            Formula: {q.formula}
                          </div>
                        )}
                        {q.solutionHint && (
                          <div className="text-[11px] text-[#A7B4C8] pl-2 border-l-2 border-cyan-400/40 italic">
                            Hint: {q.solutionHint}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add To Project Modal */}
      {prediction && (
        <AddToProjectModal
          paper={prediction.assembledPaper}
          isOpen={isAddToProjectOpen}
          onClose={() => setIsAddToProjectOpen(false)}
          onSuccess={(projName) => {
            showToast(`Paper attached to ${projName}`);
          }}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#101B2D] text-[#F8FAFC] border border-white/[0.14] text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
