import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  HelpCircle,
  BookOpen,
  Paperclip,
  Trash2,
  Flag,
  CornerDownRight,
  X,
  Sparkles,
  Check,
  Filter,
} from 'lucide-react';
import { GroupMessage, StudyGroup, User } from '../../types';
import { api } from '../../lib/api';

interface GroupChatTabProps {
  group: StudyGroup;
  currentUser: User;
  onOpenProfile: (userId: string) => void;
  onGroupUpdated: (group: StudyGroup) => void;
}

const EMOJIS = ['👍', '👏', '🔥', '💡', '🚀', '❤️'];

export const GroupChatTab: React.FC<GroupChatTabProps> = ({
  group,
  currentUser,
  onOpenProfile,
  onGroupUpdated,
}) => {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isDoubt, setIsDoubt] = useState(false);
  const [replyingTo, setReplyingTo] = useState<GroupMessage | null>(null);
  const [filterDoubtsOnly, setFilterDoubtsOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Report modal state
  const [reportingMsgId, setReportingMsgId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Inappropriate language');
  const [reportSuccess, setReportSuccess] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Poll / load messages
  const loadMessages = async () => {
    try {
      const res = await api.getGroupMessages(group.id);
      if (res.messages) {
        setMessages(res.messages);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 4000);
    return () => clearInterval(interval);
  }, [group.id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    setSending(true);
    try {
      const messageType = isDoubt ? 'question' : 'text';
      const replyData = replyingTo
        ? {
            id: replyingTo.id,
            senderName: replyingTo.senderName,
            text: replyingTo.message.substring(0, 60),
          }
        : undefined;

      const res = await api.sendGroupMessage(group.id, {
        senderId: currentUser.id,
        message: inputText.trim(),
        messageType,
        replyTo: replyData,
      });

      if (res.message) {
        setMessages((prev) => [...prev, res.message]);
        setInputText('');
        setIsDoubt(false);
        setReplyingTo(null);

        // Update group XP state locally
        onGroupUpdated({
          ...group,
          groupXP: (group.groupXP || 0) + 5,
        });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.deleteGroupMessage(messageId, currentUser.id);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete message');
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      const res = await api.reactToMessage(messageId, currentUser.id, emoji);
      if (res.message) {
        setMessages((prev) => prev.map((m) => (m.id === messageId ? res.message : m)));
      }
    } catch (err) {
      console.error('Failed to react:', err);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingMsgId) return;
    try {
      await api.reportItem({
        type: 'message',
        targetId: reportingMsgId,
        reporterId: currentUser.id,
        reason: reportReason,
      });
      setReportSuccess(true);
      setTimeout(() => {
        setReportingMsgId(null);
        setReportSuccess(false);
      }, 1800);
    } catch (err) {
      console.error('Failed to report:', err);
    }
  };

  const displayedMessages = filterDoubtsOnly
    ? messages.filter((m) => m.messageType === 'question')
    : messages;

  return (
    <div className="flex flex-col h-[650px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
      {/* Chat Subheader */}
      <div className="bg-slate-950/80 px-4 sm:px-6 py-3 border-b border-slate-800/80 flex items-center justify-between z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">Study Room Chat</span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Active syllabus discussion & doubt clearance
          </span>
        </div>

        {/* Filter doubts toggle */}
        <button
          id="filter-doubts-toggle-btn"
          onClick={() => setFilterDoubtsOnly(!filterDoubtsOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterDoubtsOnly
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Doubts Only</span>
          {messages.filter((m) => m.messageType === 'question').length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-200 text-[10px]">
              {messages.filter((m) => m.messageType === 'question').length}
            </span>
          )}
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            Loading group discussions...
          </div>
        ) : displayedMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-200 mb-1">
              {filterDoubtsOnly ? 'No doubts posted yet' : 'Welcome to the Study Chat!'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm">
              {filterDoubtsOnly
                ? 'Turn off the doubts filter to see all general messages.'
                : 'Say hello, ask questions on today’s lessons, and earn Group XP together.'}
            </p>
          </div>
        ) : (
          displayedMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            const canDelete =
              isMe || group.ownerId === currentUser.id || group.admins.includes(currentUser.id);
            const isQuestion = msg.messageType === 'question';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 group relative ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Sender Avatar */}
                <button
                  onClick={() => onOpenProfile(msg.senderId)}
                  className="shrink-0 self-end focus:outline-none"
                  title={`View ${msg.senderName}'s profile`}
                >
                  <img
                    src={
                      msg.senderAvatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        msg.senderName
                      )}&backgroundColor=4f46e5`
                    }
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-xl object-cover border border-slate-700 hover:ring-2 hover:ring-indigo-400 transition-all"
                  />
                </button>

                {/* Message Bubble Container */}
                <div className={`max-w-[82%] sm:max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  {/* Sender Name & Role Badges */}
                  <div
                    className={`flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 ${
                      isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <button
                      onClick={() => onOpenProfile(msg.senderId)}
                      className="hover:text-indigo-400 transition-colors"
                    >
                      {isMe ? 'You' : msg.senderName}
                    </button>

                    {msg.senderRole === 'owner' && (
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Owner
                      </span>
                    )}
                    {msg.senderRole === 'admin' && (
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Admin
                      </span>
                    )}

                    <span className="text-[10px] text-slate-500 ml-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Bubble Content */}
                  <div
                    className={`p-3.5 rounded-2xl text-xs relative transition-all shadow-md ${
                      isQuestion
                        ? 'bg-gradient-to-br from-amber-950/40 via-slate-800 to-amber-900/30 border-2 border-amber-500/50 text-amber-100'
                        : isMe
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-xs'
                    }`}
                  >
                    {/* Doubt Header Badge */}
                    {isQuestion && (
                      <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-[11px] mb-2 pb-1.5 border-b border-amber-500/20">
                        <HelpCircle className="w-3.5 h-3.5 fill-amber-400/20 text-amber-400" />
                        <span>STUDY QUESTION / DOUBT</span>
                      </div>
                    )}

                    {/* Reply Quote Banner */}
                    {msg.replyTo && (
                      <div className="mb-2 p-2 rounded-lg bg-black/25 border-l-2 border-indigo-400 text-[11px] text-slate-300">
                        <span className="font-bold text-indigo-300 block">{msg.replyTo.senderName}</span>
                        <span className="line-clamp-1 italic text-slate-400">{msg.replyTo.text}</span>
                      </div>
                    )}

                    {/* Text Body */}
                    <p className="whitespace-pre-wrap leading-relaxed break-words font-medium">
                      {msg.message}
                    </p>

                    {/* Quick Reactions Bar below bubble */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 pt-1.5 border-t border-white/10">
                        {Object.entries(msg.reactions).map(([emoji, uids]) => {
                          const userIds = (uids as string[]) || [];
                          const hasReacted = userIds.includes(currentUser.id);
                          return (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(msg.id, emoji)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors ${
                                hasReacted
                                  ? 'bg-indigo-500/40 text-indigo-200 border border-indigo-400/40'
                                  : 'bg-black/30 text-slate-300 hover:bg-black/50 border border-white/5'
                              }`}
                            >
                              <span>{emoji}</span>
                              <span>{userIds.length}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Hover Actions (Reply, React, Delete, Report) */}
                  <div
                    className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 ${
                      isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {/* Emoji Reaction Triggers */}
                    <div className="flex items-center gap-0.5 bg-slate-950/80 px-1.5 py-0.5 rounded-full border border-slate-800">
                      {EMOJIS.slice(0, 4).map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(msg.id, emoji)}
                          className="hover:scale-125 transition-transform p-0.5 text-xs"
                          title={`React with ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setReplyingTo(msg)}
                      className="p-1 hover:text-slate-200 rounded-md hover:bg-slate-800 transition-colors"
                      title="Reply"
                    >
                      <CornerDownRight className="w-3.5 h-3.5" />
                    </button>

                    {canDelete && (
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-1 hover:text-rose-400 rounded-md hover:bg-slate-800 transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!isMe && (
                      <button
                        onClick={() => setReportingMsgId(msg.id)}
                        className="p-1 hover:text-amber-400 rounded-md hover:bg-slate-800 transition-colors"
                        title="Report inappropriate message"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Replying Banner */}
      {replyingTo && (
        <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CornerDownRight className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              Replying to <strong className="text-indigo-300">{replyingTo.senderName}</strong>:{' '}
              <span className="italic text-slate-400 truncate max-w-xs inline-block align-bottom">
                "{replyingTo.message}"
              </span>
            </span>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Input Bar */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2"
      >
        {/* Ask as Doubt Toggle */}
        <button
          type="button"
          id="toggle-doubt-mode-btn"
          onClick={() => setIsDoubt(!isDoubt)}
          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            isDoubt
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Toggle Question / Doubt Mode"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">{isDoubt ? 'Doubt Mode ON' : 'Ask Doubt'}</span>
        </button>

        {/* Input Field */}
        <input
          id="group-chat-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isDoubt
              ? `Describe your question or doubt in ${group.subject}...`
              : `Message ${group.name}...`
          }
          className="grow px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Send Button */}
        <button
          type="submit"
          id="send-group-chat-btn"
          disabled={!inputText.trim() || sending}
          className={`p-2.5 rounded-xl transition-all shrink-0 flex items-center justify-center ${
            inputText.trim()
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Report Modal */}
      {reportingMsgId && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 z-20">
          <div className="w-full max-w-sm bg-slate-900 rounded-2xl border border-slate-800 p-5 text-slate-200">
            <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Flag className="w-4 h-4 text-rose-500" />
              Report Inappropriate Message
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Our safety filters will review this report.
            </p>

            {reportSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold text-center">
                Report submitted. Thank you for protecting the community.
              </div>
            ) : (
              <form onSubmit={handleReport} className="space-y-3">
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="Inappropriate language">Inappropriate language</option>
                  <option value="Bullying or harassment">Bullying or harassment</option>
                  <option value="Spam or off-topic advertising">Spam or off-topic advertising</option>
                  <option value="Personal contact info shared">Personal contact info shared</option>
                </select>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportingMsgId(null)}
                    className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
