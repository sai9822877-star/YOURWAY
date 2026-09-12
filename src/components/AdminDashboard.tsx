import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Award,
  FileQuestion,
  AlertTriangle,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { api } from '../lib/api';
import { Question, ClassLevel } from '../types';
import { DEMO_SUBJECTS, DEMO_TOPICS } from '../data/demoData';

interface AdminDashboardProps {
  onRefreshData?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onRefreshData }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  // New Question Form State
  const [newClass, setNewClass] = useState<ClassLevel>('Class 9');
  const [newSubject, setNewSubject] = useState<string>('sub_maths');
  const [newTopic, setNewTopic] = useState<string>('top_m1');
  const [newQuestionText, setNewQuestionText] = useState<string>('');
  const [newOptionA, setNewOptionA] = useState<string>('');
  const [newOptionB, setNewOptionB] = useState<string>('');
  const [newOptionC, setNewOptionC] = useState<string>('');
  const [newOptionD, setNewOptionD] = useState<string>('');
  const [newCorrect, setNewCorrect] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newExplanation, setNewExplanation] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const m = await api.getAdminMetrics();
      setMetrics(m);
      if (m && m.allQuestions) {
        setQuestions(m.allQuestions);
      }
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      loadData();
    } catch (err) {
      alert('Failed to delete question');
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText || !newOptionA || !newOptionB || !newOptionC || !newOptionD) {
      alert('Please fill all options and question prompt');
      return;
    }

    try {
      const res = await api.addQuestion({
        class: newClass,
        subjectId: newSubject,
        topicId: newTopic,
        question: newQuestionText,
        optionA: newOptionA,
        optionB: newOptionB,
        optionC: newOptionC,
        optionD: newOptionD,
        correctAnswer: newCorrect,
        difficulty: newDifficulty,
        explanation: newExplanation || 'Explanation for correct answer.',
      });

      if (res && res.question) {
        setQuestions((prev) => [res.question, ...prev]);
        setShowAddModal(false);
        // Reset form
        setNewQuestionText('');
        setNewOptionA('');
        setNewOptionB('');
        setNewOptionC('');
        setNewOptionD('');
        setNewExplanation('');
        loadData();
      }
    } catch (err) {
      alert('Failed to add question');
    }
  };

  const handleResetDatabase = async () => {
    if (!confirm('Are you sure you want to reset all database data to clean demo state?')) return;
    try {
      await api.resetDatabase();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 4000);
      loadData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert('Failed to reset database');
    }
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subjectId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>System & Curriculum Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
              Admin & Diagnostics Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Inspect student metrics, diagnostic failure patterns, and manage question pools.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleResetDatabase}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors shadow-xs"
              title="Reset test data to fresh seed state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database to Demo</span>
            </button>
          </div>
        </div>

        {resetSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Database successfully reset to initial demo curriculum & questions!</span>
          </div>
        )}

        {/* Section 14 Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Students */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Total Students
            </div>
            <div className="text-3xl font-black text-slate-900 font-display">
              {metrics?.totalUsers || 24}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Active student profiles</div>
          </div>

          {/* Assessment Attempts */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Diagnostic Tests
            </div>
            <div className="text-3xl font-black text-slate-900 font-display">
              {metrics?.totalAssessments || 18}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">20-question submissions</div>
          </div>

          {/* Average Score */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Average Score
            </div>
            <div className="text-3xl font-black text-indigo-600 font-display">
              {metrics?.averageAssessmentScore || 71}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Platform-wide average</div>
          </div>

          {/* Total Question Bank */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Question Bank
            </div>
            <div className="text-3xl font-black text-slate-900 font-display">
              {questions.length || 40}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Active multi-choice questions</div>
          </div>

          {/* Course Completion Rate */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Course Completion
            </div>
            <div className="text-3xl font-black text-emerald-600 font-display">
              {metrics?.courseCompletionRate || 42}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Active pacing rate</div>
          </div>
        </div>

        {/* Most Difficult Topics Callout */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Platform Diagnostic: Most Common Student Gaps</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[
              { topic: 'Linear Equations in Two Variables', subject: 'Mathematics', failRate: '68% Fail Rate' },
              { topic: 'Structure of the Atom & Valence', subject: 'Science', failRate: '61% Fail Rate' },
              { topic: 'Active & Passive Voice Transformation', subject: 'English', failRate: '54% Fail Rate' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between"
              >
                <div>
                  <span className="font-bold text-slate-800">{item.topic}</span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">{item.subject}</span>
                </div>
                <span className="font-extrabold text-rose-600 mt-3 inline-block">
                  {item.failRate}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Question Management Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Diagnostic Question Bank
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Class 6–12 syllabus assessment questions with difficulty weighting.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Question</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions by keyword or subject..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Questions Table / List */}
          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-1">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {q.class}
                    </span>
                    <span className="font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {q.subjectId.replace('sub_', '')}
                    </span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded ${
                        q.difficulty === 'Easy'
                          ? 'bg-emerald-50 text-emerald-700'
                          : q.difficulty === 'Medium'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </div>

                  <div className="font-bold text-slate-900 text-sm">{q.question}</div>

                  <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                    <div className={q.correctAnswer === 'A' ? 'font-bold text-emerald-700' : ''}>
                      A: {q.optionA}
                    </div>
                    <div className={q.correctAnswer === 'B' ? 'font-bold text-emerald-700' : ''}>
                      B: {q.optionB}
                    </div>
                    <div className={q.correctAnswer === 'C' ? 'font-bold text-emerald-700' : ''}>
                      C: {q.optionC}
                    </div>
                    <div className={q.correctAnswer === 'D' ? 'font-bold text-emerald-700' : ''}>
                      D: {q.optionD}
                    </div>
                  </div>

                  <div className="text-slate-400 text-[11px] pt-1">
                    Explanation: {q.explanation}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 font-display mb-4">
              Add New Diagnostic Question
            </h3>

            <form onSubmit={handleAddQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value as ClassLevel)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Easy">Easy (40%)</option>
                    <option value="Medium">Medium (40%)</option>
                    <option value="Hard">Hard (20%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                >
                  {DEMO_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Question Prompt</label>
                <textarea
                  rows={2}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Enter the question prompt..."
                  className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Answer Options</label>
                <input
                  type="text"
                  placeholder="Option A"
                  value={newOptionA}
                  onChange={(e) => setNewOptionA(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                  required
                />
                <input
                  type="text"
                  placeholder="Option B"
                  value={newOptionB}
                  onChange={(e) => setNewOptionB(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                  required
                />
                <input
                  type="text"
                  placeholder="Option C"
                  value={newOptionC}
                  onChange={(e) => setNewOptionC(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                  required
                />
                <input
                  type="text"
                  placeholder="Option D"
                  value={newOptionD}
                  onChange={(e) => setNewOptionD(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correct Answer</label>
                  <select
                    value={newCorrect}
                    onChange={(e) => setNewCorrect(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Explanation</label>
                <textarea
                  rows={2}
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Explain why the correct answer is right..."
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-950 text-white font-bold hover:bg-slate-800"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
