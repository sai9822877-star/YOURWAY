import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  Link2,
  ExternalLink,
  ThumbsUp,
  Plus,
  X,
  Sparkles,
  Bookmark,
  GraduationCap,
} from 'lucide-react';
import { GroupResource, StudyGroup, User } from '../../types';
import { api } from '../../lib/api';

interface GroupResourcesTabProps {
  group: StudyGroup;
  currentUser: User;
  onOpenCourse?: () => void;
  onGroupUpdated: (group: StudyGroup) => void;
}

export const GroupResourcesTab: React.FC<GroupResourcesTabProps> = ({
  group,
  currentUser,
  onOpenCourse,
  onGroupUpdated,
}) => {
  const [resources, setResources] = useState<GroupResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'course' | 'lesson' | 'book' | 'notes' | 'link'>('notes');
  const [urlOrId, setUrlOrId] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadResources = async () => {
    try {
      const res = await api.getGroupResources(group.id);
      if (res.resources) setResources(res.resources);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, [group.id]);

  const handleVote = async (resourceId: string) => {
    try {
      const res = await api.voteResourceHelpful(resourceId, currentUser.id);
      if (res.resource) {
        setResources((prev) => prev.map((r) => (r.id === resourceId ? res.resource : r)));
      }
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !urlOrId.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await api.addGroupResource(group.id, {
        title: title.trim(),
        type,
        urlOrId: urlOrId.trim(),
        description: description.trim(),
        userId: currentUser.id,
      });

      if (res.resource) {
        setResources((prev) => [res.resource, ...prev]);
        setShowAddModal(false);
        setTitle('');
        setUrlOrId('');
        setDescription('');
        onGroupUpdated({
          ...group,
          groupXP: (group.groupXP || 0) + 20,
        });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add resource');
    } finally {
      setSubmitting(false);
    }
  };

  const getTypeIcon = (t: string) => {
    switch (t) {
      case 'course':
        return <GraduationCap className="w-4 h-4 text-indigo-500" />;
      case 'lesson':
        return <BookOpen className="w-4 h-4 text-emerald-500" />;
      case 'book':
        return <Bookmark className="w-4 h-4 text-amber-500" />;
      case 'notes':
        return <FileText className="w-4 h-4 text-cyan-500" />;
      default:
        return <Link2 className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            Shared Study Resources
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {resources.length} Materials
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Peer notes, recommended curriculum lessons, and NCERT reference links for {group.subject}.
          </p>
        </div>

        <button
          id="open-add-resource-modal-btn"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Share Resource (+20 XP)</span>
        </button>
      </div>

      {/* Recommended Platform Material Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Your Way Curriculum Integration
            </div>
            <h4 className="text-sm font-bold text-white mt-0.5">
              Official {group.class} {group.subject} Syllabus
            </h4>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Study the interactive chapter modules and textbook solutions linked directly to this group.
            </p>
          </div>
        </div>

        {onOpenCourse && (
          <button
            onClick={onOpenCourse}
            className="px-4 py-2 rounded-xl bg-white text-slate-950 hover:bg-slate-100 text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>Open {group.subject} Course</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading resources...</div>
      ) : resources.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-50 border border-slate-200 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700 mb-1">No shared resources yet</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Be the first to share helpful study notes, formulas, or video links with your peers!
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
          >
            Share First Resource
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((res) => {
            const hasVoted = res.helpfulUserIds?.includes(currentUser.id);

            return (
              <div
                key={res.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      {getTypeIcon(res.type)}
                      <span>{res.type}</span>
                    </span>

                    <span className="text-[10px] text-slate-400">
                      Shared by {res.sharedByName}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1.5">{res.title}</h4>
                  {res.description && (
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {res.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={res.urlOrId.startsWith('http') ? res.urlOrId : '#'}
                    target={res.urlOrId.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <span>Open Material</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Upvote / Helpful Button */}
                  <button
                    onClick={() => handleVote(res.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      hasVoted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                    title="Mark this resource as helpful"
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-emerald-600' : ''}`} />
                    <span>Helpful ({res.helpfulCount})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                Share Study Material
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddResource} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Resource Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 Key Formulas & Derivations"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Resource Type
                  </label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                  >
                    <option value="notes">Notes & Summary</option>
                    <option value="book">NCERT / Textbook</option>
                    <option value="lesson">Lesson / Lecture</option>
                    <option value="course">Course Module</option>
                    <option value="link">Reference Website / Tool</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    URL or File Link <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={urlOrId}
                    onChange={(e) => setUrlOrId(e.target.value)}
                    placeholder="https://drive... or website"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description / Quick Notes
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly explain what topics or problem types this covers..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
                >
                  {submitting ? 'Sharing...' : 'Share with Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
