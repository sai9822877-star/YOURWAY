import React, { useState } from 'react';
import {
  X,
  Users,
  Lock,
  Globe,
  Sparkles,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { ClassLevel, StudyGroup } from '../../types';
import { ALL_CLASSES, getGroupSubjectOptions } from '../../data/classCurriculum';
import { api } from '../../lib/api';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string;
  defaultClass?: ClassLevel;
  onGroupCreated: (group: StudyGroup) => void;
}

const PRESET_PICTURES = [
  {
    name: 'Collaborative Study',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Math & Formulas',
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Science & Lab',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Books & Notes',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Space & Astronomy',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Coding & Logic',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
  },
];

const DEFAULT_RULES = [
  'Keep all discussions strictly focused on learning and syllabus topics.',
  'Respect doubts and different learning paces; support your peers.',
  'No spam, promotions, or irrelevant links.',
  'Share clear step-by-step notes when solving problems together.',
];

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  creatorId,
  defaultClass = 'Class 9',
  onGroupCreated,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(defaultClass);
  const [subject, setSubject] = useState('General Study');
  const [selectedPicture, setSelectedPicture] = useState(PRESET_PICTURES[0].url);
  const [customPicture, setCustomPicture] = useState('');
  const [maxMembers, setMaxMembers] = useState<number>(20);
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [rules, setRules] = useState<string[]>(DEFAULT_RULES);
  const [newRuleInput, setNewRuleInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subjectOptions = getGroupSubjectOptions(selectedClass);

  const handleAddRule = () => {
    if (newRuleInput.trim() && rules.length < 6) {
      setRules([...rules, newRuleInput.trim()]);
      setNewRuleInput('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please give your study group a name.');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a short description of what this group studies.');
      return;
    }

    setLoading(true);
    try {
      const pictureToUse = customPicture.trim() || selectedPicture;
      const res = await api.createGroup({
        name: name.trim(),
        description: description.trim(),
        class: selectedClass,
        subject,
        picture: pictureToUse,
        maxMembers,
        privacy,
        rules,
        creatorId,
      });

      if (res.group) {
        onGroupCreated(res.group);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create study group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 px-6 py-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Create Study Group
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  +100 Group XP
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Form a collaborative space for your class syllabus and peer doubts.
              </p>
            </div>
          </div>
          <button
            id="close-create-group-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Group Name & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Group Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="create-group-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Class 9 Science Explorers, Board Exam Achievers"
                maxLength={60}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Description & Goal <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="create-group-desc-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this group focusing on? (e.g. Solving NCERT exemplars and weekly doubt sessions)"
                rows={3}
                maxLength={250}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900 bg-slate-50/50 resize-none"
              />
            </div>
          </div>

          {/* Class & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Grade / Class <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="create-group-class-select"
                  value={selectedClass}
                  onChange={(e) => {
                    const newClass = e.target.value as ClassLevel;
                    setSelectedClass(newClass);
                    const opts = getGroupSubjectOptions(newClass);
                    if (!opts.includes(subject)) {
                      setSubject(opts[0] || 'General Study');
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {ALL_CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                <GraduationCap className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Subject Focus <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="create-group-subject-select"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {subjectOptions.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
                <BookOpen className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Privacy & Member Limit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Privacy Setting
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="privacy-public-btn"
                  onClick={() => setPrivacy('public')}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    privacy === 'public'
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <div className="text-left">
                    <div>Public</div>
                    <div className="text-[10px] text-slate-500 font-normal">Anyone can join</div>
                  </div>
                </button>

                <button
                  type="button"
                  id="privacy-private-btn"
                  onClick={() => setPrivacy('private')}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    privacy === 'private'
                      ? 'bg-slate-900 border-slate-950 text-white shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <div className="text-left">
                    <div>Private</div>
                    <div className="text-[10px] text-slate-400 font-normal">Invite / request</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Member Capacity Limit
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 20, 50].map((limit) => (
                  <button
                    key={limit}
                    type="button"
                    id={`capacity-${limit}-btn`}
                    onClick={() => setMaxMembers(limit)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      maxMembers === limit
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {limit}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Group Picture */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Choose Group Picture</span>
              <span className="text-[10px] font-normal text-slate-500 lowercase">select or paste custom url</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
              {PRESET_PICTURES.map((pic) => (
                <button
                  key={pic.name}
                  type="button"
                  onClick={() => {
                    setSelectedPicture(pic.url);
                    setCustomPicture('');
                  }}
                  className={`relative rounded-xl overflow-hidden border-2 aspect-square transition-all group ${
                    selectedPicture === pic.url && !customPicture
                      ? 'border-indigo-600 ring-2 ring-indigo-300 scale-95'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                  title={pic.name}
                >
                  <img src={pic.url} alt={pic.name} className="w-full h-full object-cover" />
                  {selectedPicture === pic.url && !customPicture && (
                    <div className="absolute inset-0 bg-indigo-900/30 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                id="custom-picture-url-input"
                type="url"
                value={customPicture}
                onChange={(e) => setCustomPicture(e.target.value)}
                placeholder="Or paste custom image URL (Unsplash, etc.)"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Study Rules / Expectations */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Study Group Rules & Etiquette
            </label>
            <div className="space-y-1.5 mb-2">
              {rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    {rule}
                  </span>
                  {rules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {rules.length < 6 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRuleInput}
                  onChange={(e) => setNewRuleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRule();
                    }
                  }}
                  placeholder="Add custom group rule..."
                  className="grow px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  id="add-custom-rule-btn"
                  onClick={handleAddRule}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              id="cancel-create-group-btn"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-create-group-btn"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
            >
              {loading ? (
                <span>Creating...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Create Group & Start Learning</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
