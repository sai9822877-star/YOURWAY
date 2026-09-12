import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Calendar,
  Zap,
  Clock,
  Sparkles,
  X,
  Users,
} from 'lucide-react';
import { GroupTask, StudyGroup, User } from '../../types';
import { api } from '../../lib/api';

interface GroupTasksTabProps {
  group: StudyGroup;
  currentUser: User;
  onGroupUpdated: (group: StudyGroup) => void;
}

export const GroupTasksTab: React.FC<GroupTasksTabProps> = ({
  group,
  currentUser,
  onGroupUpdated,
}) => {
  const [tasks, setTasks] = useState<GroupTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [xpReward, setXpReward] = useState(25);
  const [submitting, setSubmitting] = useState(false);

  const loadTasks = async () => {
    try {
      const res = await api.getGroupTasks(group.id);
      if (res.tasks) setTasks(res.tasks);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [group.id]);

  const handleToggle = async (taskId: string) => {
    try {
      const res = await api.toggleGroupTask(taskId, currentUser.id);
      if (res.task) {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? res.task : t)));

        // If completed by current user, award group XP
        if (res.task.completedBy?.includes(currentUser.id)) {
          onGroupUpdated({
            ...group,
            groupXP: (group.groupXP || 0) + (res.task.xpReward || 25),
          });
        }
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await api.createGroupTask(group.id, {
        title: title.trim(),
        description: description.trim(),
        deadline: deadline || undefined,
        creatorId: currentUser.id,
        xpReward,
      });

      if (res.task) {
        setTasks((prev) => [res.task, ...prev]);
        setShowCreateModal(false);
        setTitle('');
        setDescription('');
        setDeadline('');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const completedCount = tasks.filter((t) => t.completedBy?.includes(currentUser.id)).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Personal Group Goal Tracker */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900">Group Study Goals & Tasks</h3>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
              Earn XP Together
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Complete synchronized assignments, chapter milestones, and test preparation checkpoints.
          </p>

          {/* Progress Bar */}
          {tasks.length > 0 && (
            <div className="pt-2 max-w-md">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-600">Your Progress in Group</span>
                <span className="text-indigo-600">
                  {completedCount} / {tasks.length} Completed ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <button
          id="open-create-task-modal-btn"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Study Goal</span>
        </button>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading study tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-50 border border-slate-200 text-center">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700 mb-1">No group tasks scheduled</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Keep each other accountable by setting a weekly chapter deadline or practice goal.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
          >
            Create First Study Goal
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const isCompletedByMe = task.completedBy?.includes(currentUser.id);
            const totalCompleted = task.completedBy?.length || 0;

            return (
              <div
                key={task.id}
                className={`p-5 rounded-3xl border transition-all ${
                  isCompletedByMe
                    ? 'bg-slate-50/70 border-slate-200/80 opacity-90'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {/* Completion Toggle */}
                    <button
                      id={`toggle-task-${task.id}-btn`}
                      onClick={() => handleToggle(task.id)}
                      className={`mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none ${
                        isCompletedByMe ? 'text-emerald-600' : ''
                      }`}
                      title={isCompletedByMe ? 'Mark Incomplete' : 'Mark Completed (+XP)'}
                    >
                      {isCompletedByMe ? (
                        <CheckCircle2 className="w-6 h-6 fill-emerald-100 text-emerald-600" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>

                    <div>
                      <h4
                        className={`text-sm font-bold text-slate-900 ${
                          isCompletedByMe ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Meta Footer */}
                      <div className="flex items-center gap-3 mt-3 text-[11px] font-semibold flex-wrap">
                        {task.deadline && (
                          <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Due: {task.deadline}</span>
                          </span>
                        )}

                        <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                          <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>+{task.xpReward || 25} XP</span>
                        </span>

                        <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          <Users className="w-3 h-3" />
                          <span>
                            {totalCompleted} / {group.members.length} peers completed
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        isCompletedByMe
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isCompletedByMe ? 'Done' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Schedule Group Study Goal
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Goal Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Solve Trigonometry Exercise 8.2"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Instructions / Notes
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Try all 10 questions without checking the guide first..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Target Due Date
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    XP Reward
                  </label>
                  <select
                    value={xpReward}
                    onChange={(e) => setXpReward(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  >
                    <option value={15}>+15 XP (Quick practice)</option>
                    <option value={25}>+25 XP (Standard task)</option>
                    <option value={50}>+50 XP (Full chapter test)</option>
                    <option value={100}>+100 XP (Major Milestone)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
                >
                  {submitting ? 'Creating...' : 'Set Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
