import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Lock,
  RefreshCw,
  Send,
  CheckCircle2,
  ExternalLink,
  Clock,
  Loader2,
} from 'lucide-react';
import { User } from '../../types';
import { auth, formatAuthErrorMessage } from '../../lib/firebase';
import { sendEmailVerification, sendPasswordResetEmail, reload } from 'firebase/auth';
import { api } from '../../lib/api';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUserRefreshed?: (user: User) => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserRefreshed,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSendingVerify, setIsSendingVerify] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isSendingGmailReport, setIsSendingGmailReport] = useState(false);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  if (!isOpen) return null;

  const fbUser = auth.currentUser;
  const isGoogleUser = fbUser?.providerData?.some((p) => p.providerId === 'google.com');
  const isEmailVerified = fbUser?.emailVerified || isGoogleUser || false;

  // Refresh auth token and email verification status
  const handleCheckStatus = async () => {
    if (!fbUser) return;
    setIsRefreshing(true);
    setMessage(null);
    try {
      await reload(fbUser);
      if (fbUser.emailVerified) {
        setMessage({
          type: 'success',
          text: 'Great news! Your email address has been verified successfully.',
        });
      } else {
        setMessage({
          type: 'error',
          text: 'Your email is still marked as unverified. Please click the link sent to your inbox.',
        });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: formatAuthErrorMessage(err) });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Resend verification email
  const handleResendVerification = async () => {
    if (!fbUser) return;
    setIsSendingVerify(true);
    setMessage(null);
    try {
      await sendEmailVerification(fbUser);
      setMessage({
        type: 'success',
        text: `A new verification email has been dispatched to ${fbUser.email}. Please check your inbox and spam folder.`,
      });
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setMessage({ type: 'error', text: formatAuthErrorMessage(err) });
    } finally {
      setIsSendingVerify(false);
    }
  };

  // Send password reset email
  const handleSendPasswordReset = async () => {
    const targetEmail = fbUser?.email || currentUser.email;
    if (!targetEmail) return;

    setIsSendingReset(true);
    setMessage(null);
    try {
      await sendPasswordResetEmail(auth, targetEmail);
      setMessage({
        type: 'success',
        text: `Password reset email sent to ${targetEmail}. Follow the link to choose a new password.`,
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: formatAuthErrorMessage(err) });
    } finally {
      setIsSendingReset(false);
    }
  };

  // Send study summary to Gmail
  const handleSendGmailReport = async () => {
    const targetEmail = fbUser?.email || currentUser.email;
    if (!targetEmail) return;

    setIsSendingGmailReport(true);
    setMessage(null);
    try {
      const res = await api.sendGmailStudyReport({
        email: targetEmail,
        userName: currentUser.name,
        classLevel: currentUser.class,
        summary: {
          streak: currentUser.streak || 1,
          xp: currentUser.xp || 100,
          completedLessons: currentUser.completedLessons?.length || 0,
        },
      });
      setMessage({
        type: 'success',
        text: res.message || `Study schedule report dispatched to ${targetEmail}!`,
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to send Gmail study report.' });
    } finally {
      setIsSendingGmailReport(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-950 font-display text-base">Account & Security</h3>
              <p className="text-xs text-slate-500">Firebase Authentication & Gmail integration</p>
            </div>
          </div>
          <button
            id="close-security-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {message && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Email Verification Status Card */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                Email Verification
              </span>
              {isEmailVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                  <AlertTriangle className="w-3 h-3 text-amber-600" /> Unverified
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-600">
              Account Email: <span className="font-semibold text-slate-900">{fbUser?.email || currentUser.email}</span>
            </p>

            {isGoogleUser && (
              <p className="text-[11px] text-indigo-600 font-medium">
                Signed in securely via Google / Gmail account.
              </p>
            )}

            {!isEmailVerified && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isSendingVerify || resendCooldown > 0}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSendingVerify ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Send className="w-3 h-3" />
                  )}
                  <span>{resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Email'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCheckStatus}
                  disabled={isRefreshing}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Check Status</span>
                </button>
              </div>
            )}
          </div>

          {/* Password Reset Card */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Password & Credentials
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              We send an official Firebase secure reset link directly to your verified email address.
            </p>
            <button
              type="button"
              onClick={handleSendPasswordReset}
              disabled={isSendingReset}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              {isSendingReset ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Mail className="w-3 h-3" />
              )}
              <span>Send Password Reset Email</span>
            </button>
          </div>

          {/* Gmail Feature Card */}
          <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                Gmail Study Digest
              </span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                Active
              </span>
            </div>
            <p className="text-[11px] text-indigo-900/80 leading-relaxed">
              Deliver your weekly adaptive timetable, chapter revision goals, and rank reports directly to your Gmail inbox.
            </p>
            <button
              type="button"
              onClick={handleSendGmailReport}
              disabled={isSendingGmailReport}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-indigo-600 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSendingGmailReport ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Send className="w-3 h-3" />
              )}
              <span>Send Timetable to Gmail</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
