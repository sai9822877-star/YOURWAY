import React, { useState, useEffect } from 'react';
import {
  Mail,
  Check,
  X,
  Users,
  Clock,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { AppNotification, StudyGroup, User } from '../../types';
import { api } from '../../lib/api';

interface InvitationsTabProps {
  currentUser: User;
  onOpenGroup: (groupId: string) => void;
  onRefreshGroups: () => void;
}

export const InvitationsTab: React.FC<InvitationsTabProps> = ({
  currentUser,
  onOpenGroup,
  onRefreshGroups,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications(currentUser.id);
      if (res.notifications) {
        setNotifications(res.notifications);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [currentUser.id]);

  const handleRespond = async (invitationId: string, accept: boolean) => {
    try {
      const res = await api.respondToInvitation(invitationId, currentUser.id, accept);
      if (res.success) {
        setActionMessage(
          accept ? 'Accepted! You are now a member of this study group.' : 'Invitation declined.'
        );
        setTimeout(() => setActionMessage(null), 3000);
        onRefreshGroups();
        loadNotifications();
        if (accept && res.group) {
          onOpenGroup(res.group.id);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to respond to invitation');
    }
  };

  // Filter invitation-related notifications
  const inviteNotifications = notifications.filter(
    (n) => n.type === 'group_invitation'
  );

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <span>Group Invitations & Requests</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            {inviteNotifications.length} Pending
          </span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Review peer invitations to study groups or pending join requests for groups you manage.
        </p>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading invitations...</div>
      ) : inviteNotifications.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-50 border border-slate-200 text-center">
          <Mail className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700 mb-1">No pending invitations</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You're all caught up! Explore groups or invite peers to your own group to study together.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {inviteNotifications.map((notif) => {
            const isInvite = notif.type === 'group_invite';

            return (
              <div
                key={notif.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{notif.message}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Accept / Decline actions */}
                {(notif.invitationId || notif.data?.invitationId) && (
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      id={`decline-invite-${notif.id}-btn`}
                      onClick={() => handleRespond(notif.invitationId || notif.data?.invitationId, false)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>

                    <button
                      id={`accept-invite-${notif.id}-btn`}
                      onClick={() => handleRespond(notif.invitationId || notif.data?.invitationId, true)}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept & Join</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
