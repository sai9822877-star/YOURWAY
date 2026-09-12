import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  GraduationCap,
  BookOpen,
  Clock,
  Calendar,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import { ClassLevel, StudyPreferences, TimeOfDay } from '../types';

interface OnboardingFlowProps {
  onComplete: (data: {
    name: string;
    email: string;
    classLevel: ClassLevel;
    selectedSubjects: string[];
    preferences: StudyPreferences;
  }) => void;
  onCancel: () => void;
  initialClass?: ClassLevel;
  initialSubjects?: string[];
  initialName?: string;
  initialEmail?: string;
}

const AVAILABLE_CLASSES: ClassLevel[] = [
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];

const AVAILABLE_SUBJECTS: Array<{ id: string; name: string; description: string; recommended: boolean }> = [
  { id: 'sub_maths', name: 'Mathematics', description: 'Algebra, Geometry, Number Systems, Mensuration', recommended: true },
  { id: 'sub_science', name: 'Science', description: 'Physics, Chemistry, Cell Biology, Living Organisms', recommended: true },
  { id: 'sub_english', name: 'English', description: 'Grammar Syntax, Literature, Comprehension, Writing', recommended: true },
  { id: 'sub_social_science', name: 'Social Science', description: 'History, Geography, Democratic Institutions, Economics', recommended: true },
  { id: 'sub_hindi', name: 'Hindi', description: 'Vyakaran, Sahitya, Nibandh, Patra Lekhan', recommended: false },
  { id: 'sub_cs', name: 'Computer Science', description: 'Algorithms, Data Structures, Python Basics, Digital Logic', recommended: false },
];

const STUDY_DURATION_OPTIONS = [
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
  { label: '3+ hours', value: 180 },
];

const DAYS_OF_WEEK: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  onCancel,
  initialClass = 'Class 9',
  initialSubjects = ['sub_maths', 'sub_science', 'sub_english', 'sub_social_science'],
  initialName = 'Aarav Sharma',
  initialEmail = 'student@morphic.edu',
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState<string>(initialName);
  const [email, setEmail] = useState<string>(initialEmail);
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(initialClass);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(initialSubjects);
  const [dailyMinutes, setDailyMinutes] = useState<number>(60);
  const [studyDays, setStudyDays] = useState<
    ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[]
  >(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [preferredTime, setPreferredTime] = useState<TimeOfDay>('Evening');

  const toggleSubject = (id: string) => {
    if (selectedSubjects.includes(id)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== id));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, id]);
    }
  };

  const toggleDay = (day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday') => {
    if (studyDays.includes(day)) {
      if (studyDays.length > 1) {
        setStudyDays(studyDays.filter((d) => d !== day));
      }
    } else {
      setStudyDays([...studyDays, day]);
    }
  };

  const handleFinish = () => {
    onComplete({
      name: name.trim() || 'Student',
      email: email.trim() || 'student@morphic.edu',
      classLevel: selectedClass,
      selectedSubjects,
      preferences: {
        dailyMinutes,
        studyDays,
        preferredTime,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl my-8 overflow-hidden">
        {/* Modal Header & Progress */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              M
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 font-display">Personalize Your Path</div>
              <div className="text-xs text-slate-500">Step {step} of 3</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step ? 'w-8 bg-indigo-600' : s < step ? 'w-4 bg-indigo-300' : 'w-4 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: CLASS SELECTION */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
                <GraduationCap className="w-4 h-4" />
                <span>Step 1 — Class</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-950 font-display">
                What class are you studying in?
              </h2>
              <p className="text-sm text-slate-500 mt-1 mb-6">
                Morphic generates diagnostic questions and syllabi precisely aligned with your grade standard.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {AVAILABLE_CLASSES.map((cls) => {
                  const isSelected = selectedClass === cls;
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setSelectedClass(cls)}
                      className={`p-4 rounded-xl border text-center font-semibold transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-sm ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-base">{cls}</div>
                      {cls === 'Class 9' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 mt-1 inline-block">
                          Full Syllabus Ready
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Basic Student Credentials */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Student Profile (For your course dashboard)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. aarav@example.com"
                      className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SUBJECTS SELECTION */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Step 2 — Subjects</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-950 font-display">
                Which subjects do you want to study?
              </h2>
              <p className="text-sm text-slate-500 mt-1 mb-6">
                Choose the subjects you want assessed. Your 20 questions will be balanced across your selections.
              </p>

              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {AVAILABLE_SUBJECTS.map((subj) => {
                  const isChecked = selectedSubjects.includes(subj.id);
                  return (
                    <div
                      key={subj.id}
                      onClick={() => toggleSubject(subj.id)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span>{subj.name}</span>
                            {subj.recommended && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                Core Syllabus
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">{subj.description}</div>
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-slate-400">
                        {isChecked ? `${Math.round(20 / selectedSubjects.length)} Questions` : 'Select'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: STUDY PREFERENCES */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4" />
                <span>Step 3 — Study Preferences</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-950 font-display">
                How and when do you study best?
              </h2>
              <p className="text-sm text-slate-500 mt-1 mb-6">
                Morphic generates a weekly timetable calibrated directly to your available hours.
              </p>

              {/* Daily Study Time */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  How much time can you study every day?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {STUDY_DURATION_OPTIONS.map((opt) => {
                    const isSelected = dailyMinutes === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDailyMinutes(opt.value)}
                        className={`py-3 px-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Days of week */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Which days do you want to study?
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = studyDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Study Time */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Preferred study time (Optional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['Morning', 'Afternoon', 'Evening', 'Night'] as TimeOfDay[]).map((time) => {
                    const isSelected = preferredTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setPreferredTime(time)}
                        className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {time === 'Morning' && <Sun className="w-4 h-4 text-amber-500" />}
                        {time === 'Afternoon' && <Sun className="w-4 h-4 text-orange-500" />}
                        {time === 'Evening' && <Sunset className="w-4 h-4 text-indigo-500" />}
                        {time === 'Night' && <Moon className="w-4 h-4 text-slate-700" />}
                        <span className="text-xs">{time}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200/60 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2"
              >
                Cancel
              </button>
            )}
          </div>

          <div>
            {step < 3 ? (
              <button
                id="onboarding-next-btn"
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={step === 2 && selectedSubjects.length === 0}
                className="inline-flex items-center gap-2 text-xs font-bold px-6 py-2.5 rounded-xl bg-slate-950 text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="onboarding-start-assessment-btn"
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-2 text-xs font-bold px-6 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start 20-Question Assessment</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
