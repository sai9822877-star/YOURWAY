import React, { useState, useEffect } from 'react';
import {
  X,
  User as UserIcon,
  AtSign,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  reload,
  signOut,
} from 'firebase/auth';
import {
  auth,
  googleProvider,
  saveFirebaseUserProfile,
  checkUsernameAvailable,
  formatAuthErrorMessage,
} from '../lib/firebase';
import { api } from '../lib/api';
import { User, ClassLevel } from '../types';
import { YourWayLogo } from './YourWayLogo';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
  isSkippable?: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const CLASS_OPTIONS: ClassLevel[] = [
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'register',
  isSkippable = false,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login' | 'verify' | 'forgot'>(initialMode);

  // Register Fields
  const [fullName, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>('Class 9');

  // Login & Forgot Fields
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [forgotEmail, setForgotEmail] = useState<string>('');

  // Verification Screen State
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [verificationFeedback, setVerificationFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // UI state
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [forgotSuccess, setForgotSuccess] = useState<boolean>(false);

  // Username validation state for Register form
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available?: boolean;
    message?: string;
  }>({ checking: false });

  // Real-time debounced username check
  useEffect(() => {
    if (activeTab !== 'register') return;

    const clean = username.trim().toLowerCase();
    if (!clean) {
      setUsernameStatus({ checking: false });
      return;
    }

    if (clean.length < 3) {
      setUsernameStatus({ checking: false, available: false, message: 'Minimum 3 characters' });
      return;
    }

    if (!/^[a-z0-9_]+$/.test(clean)) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: 'Only letters, numbers, and underscores',
      });
      return;
    }

    setUsernameStatus({ checking: true });
    const timer = setTimeout(async () => {
      try {
        const result = await checkUsernameAvailable(clean);
        setUsernameStatus({
          checking: false,
          available: result.available,
          message: result.available ? 'Username available' : result.reason || 'Username already taken',
        });
      } catch {
        setUsernameStatus({ checking: false, available: true });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username, activeTab]);

  // Handle Google Sign In via Firebase
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const effectiveEmail = fbUser.email || 'learner@gmail.com';
      const effectiveName = fbUser.displayName || 'Your Way Student';
      const cleanUsername = (effectiveEmail.split('@')[0] || 'student')
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_');

      // Save user profile in Firestore
      await saveFirebaseUserProfile(
        fbUser.uid,
        {
          uid: fbUser.uid,
          username: cleanUsername,
          displayName: effectiveName,
          profileImageUrl: fbUser.photoURL || undefined,
          classLevel: 'Class 9',
          emailVerified: true,
        },
        true
      );

      // Sync with internal backend
      const syncRes = await api.syncFirebaseUser({
        uid: fbUser.uid,
        email: effectiveEmail,
        name: effectiveName,
        username: cleanUsername,
        classLevel: 'Class 9',
        profileImageUrl: fbUser.photoURL || undefined,
        emailVerified: true,
      });

      localStorage.setItem('your_way_user_id', syncRes.user.id);
      onSuccess(syncRes.user);
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setError(formatAuthErrorMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle Real Email + Password Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Field Validations
    if (!fullName.trim()) {
      setError('Full Name is required.');
      return;
    }

    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || cleanUsername.length < 3) {
      setError('Please choose a username with at least 3 characters.');
      return;
    }

    if (usernameStatus.available === false) {
      setError(usernameStatus.message || 'Please choose an available username.');
      return;
    }

    if (!registerEmail.trim() || !registerEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (registerPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (registerPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail.trim(),
        registerPassword
      );
      const fbUser = userCredential.user;

      // 2. Update Firebase Auth Display Name
      await updateProfile(fbUser, {
        displayName: fullName.trim(),
      });

      // 3. Save profile in Firestore
      await saveFirebaseUserProfile(
        fbUser.uid,
        {
          uid: fbUser.uid,
          username: cleanUsername,
          displayName: fullName.trim(),
          classLevel: selectedClass,
          emailVerified: false,
        },
        true
      );

      // 4. Send real email verification link via Firebase Auth
      await sendEmailVerification(fbUser);

      // 5. Direct user to Verification Required Screen
      setPendingVerificationEmail(registerEmail.trim());
      setActiveTab('verify');
      setResendCooldown(60);

      // Start cooldown timer
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(formatAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Real Email + Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginEmail.trim()) {
      setError('Please enter your email.');
      return;
    }

    if (!loginPassword) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail.trim(),
        loginPassword
      );
      const fbUser = userCredential.user;

      // Check if email verification is completed
      if (!fbUser.emailVerified) {
        setPendingVerificationEmail(fbUser.email || loginEmail);
        setActiveTab('verify');
        setVerificationFeedback({
          type: 'error',
          text: 'Your email address is unverified. Please verify your email before accessing your student dashboard.',
        });
        setLoading(false);
        return;
      }

      // Email is verified -> sync and proceed
      const syncRes = await api.syncFirebaseUser({
        uid: fbUser.uid,
        email: fbUser.email || loginEmail.trim(),
        name: fbUser.displayName || 'Your Way Student',
        profileImageUrl: fbUser.photoURL || undefined,
        emailVerified: true,
      });

      localStorage.setItem('your_way_user_id', syncRes.user.id);
      onSuccess(syncRes.user);
      onClose();
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(formatAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Check email verification status button
  const handleCheckVerification = async () => {
    if (!auth.currentUser) {
      setError('Session expired. Please sign in again.');
      setActiveTab('login');
      return;
    }

    setLoading(true);
    setVerificationFeedback(null);

    try {
      await reload(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        setVerificationFeedback({
          type: 'success',
          text: 'Email verified successfully! Setting up your student workspace...',
        });

        // Sync with backend
        const syncRes = await api.syncFirebaseUser({
          uid: auth.currentUser.uid,
          email: auth.currentUser.email || pendingVerificationEmail,
          name: auth.currentUser.displayName || fullName || 'Student',
          username: username || undefined,
          classLevel: selectedClass,
          emailVerified: true,
        });

        localStorage.setItem('your_way_user_id', syncRes.user.id);

        setTimeout(() => {
          onSuccess(syncRes.user);
          onClose();
        }, 1000);
      } else {
        setVerificationFeedback({
          type: 'error',
          text: 'Email not verified yet. Please check your Gmail/inbox and click the link.',
        });
      }
    } catch (err: any) {
      setVerificationFeedback({
        type: 'error',
        text: formatAuthErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const handleResendVerification = async () => {
    if (!auth.currentUser) {
      setError('Please log in first to request a verification email.');
      setActiveTab('login');
      return;
    }

    setLoading(true);
    setVerificationFeedback(null);

    try {
      await sendEmailVerification(auth.currentUser);
      setVerificationFeedback({
        type: 'success',
        text: `A new verification email has been dispatched to ${auth.currentUser.email}.`,
      });
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setVerificationFeedback({
        type: 'error',
        text: formatAuthErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };

  // Forgot password flow
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, forgotEmail.trim());
      setForgotSuccess(true);
    } catch (err: any) {
      setError(formatAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <YourWayLogo size="sm" showText={false} />
            <div>
              <h2 className="font-extrabold text-slate-950 font-display text-base tracking-tight">
                {activeTab === 'verify'
                  ? 'Verify Your Email'
                  : activeTab === 'forgot'
                  ? 'Reset Password'
                  : activeTab === 'register'
                  ? 'Create Your Account'
                  : 'Welcome Back'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {activeTab === 'verify'
                  ? 'Real-time Firebase email authentication'
                  : isSkippable
                  ? 'Your Way Personalized Learning Platform'
                  : 'Mandatory Sign In to Access Platform'}
              </p>
            </div>
          </div>
          {isSkippable ? (
            <button
              id="auth-modal-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
              <Lock className="w-3 h-3" />
              <span>Sign In Required</span>
            </div>
          )}
        </div>

        {/* Auth Mode Toggle Tabs (when not in verify/forgot) */}
        {activeTab !== 'verify' && activeTab !== 'forgot' && (
          <div className="px-6 pt-4 flex gap-1 bg-white">
            <button
              id="auth-tab-register-btn"
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Sign Up
            </button>
            <button
              id="auth-tab-login-btn"
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Sign In
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ==================== VERIFICATION REQUIRED VIEW ==================== */}
          {activeTab === 'verify' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mx-auto flex items-center justify-center shadow-xs">
                <Mail className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">Check your inbox</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  We sent a real Firebase verification link to:
                  <br />
                  <span className="font-bold text-slate-950 text-sm">
                    {pendingVerificationEmail || auth.currentUser?.email}
                  </span>
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-left text-[11px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-900">What to do:</p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Open your Gmail / mail client.</li>
                  <li>Click the official verification link from Firebase.</li>
                  <li>Return here and click <strong>&quot;I&apos;ve Verified My Email&quot;</strong> below.</li>
                </ol>
              </div>

              {verificationFeedback && (
                <div
                  className={`p-3 rounded-xl border text-left flex items-start gap-2 ${
                    verificationFeedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}
                >
                  {verificationFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <span>{verificationFeedback.text}</span>
                </div>
              )}

              <div className="pt-2 space-y-2">
                <button
                  id="auth-check-verified-btn"
                  type="button"
                  onClick={handleCheckVerification}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>I&apos;ve Verified My Email</span>
                </button>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={loading || resendCooldown > 0}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold disabled:opacity-50 flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>{resendCooldown > 0 ? `Resend email in ${resendCooldown}s` : 'Resend verification email'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      signOut(auth);
                      setActiveTab('login');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                  >
                    Sign in with other account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== FORGOT PASSWORD VIEW ==================== */}
          {activeTab === 'forgot' && (
            <div className="space-y-4 py-2">
              {forgotSuccess ? (
                <div className="text-center space-y-3 py-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Password Reset Email Dispatched</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    We sent a secure password reset link to <strong>{forgotEmail}</strong>. Follow the instructions in the email to set a new password.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setForgotSuccess(false);
                    }}
                    className="mt-2 px-4 py-2 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Enter the email address associated with your account. We will send you an official Firebase password reset link.
                  </p>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Account Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@gmail.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2 rounded-xl bg-slate-950 text-white font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      <span>Send Reset Link</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ==================== SIGN UP TAB ==================== */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              {/* Google One-Click Auth */}
              <button
                id="auth-google-signup-btn"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition-all font-bold text-slate-700 flex items-center justify-center gap-3 shadow-2xs hover:border-slate-400 disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Sign up with Google / Gmail</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  or email & password
                </span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="register-fullname-input"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Arjun Patel"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Unique Username */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    Username <span className="text-rose-500">*</span>
                  </label>
                  {usernameStatus.checking ? (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Loader2 className="w-2.5 h-2.5 animate-spin" /> Checking...
                    </span>
                  ) : usernameStatus.message ? (
                    <span
                      className={`text-[10px] font-bold flex items-center gap-1 ${
                        usernameStatus.available ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {usernameStatus.available ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {usernameStatus.message}
                    </span>
                  ) : null}
                </div>
                <div className="relative">
                  <AtSign className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="register-username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="arjun_patel"
                    maxLength={30}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border bg-white focus:outline-none focus:ring-2 font-medium text-slate-900 ${
                      usernameStatus.available === false
                        ? 'border-rose-300 focus:ring-rose-500'
                        : usernameStatus.available
                        ? 'border-emerald-300 focus:ring-emerald-500'
                        : 'border-slate-200 focus:ring-indigo-500'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Gmail / Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="register-email-input"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="arjun@gmail.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Class Level */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Curriculum Class</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <select
                    id="register-class-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value as ClassLevel)}
                    className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900 appearance-none cursor-pointer"
                  >
                    {CLASS_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c} (CBSE / NCERT Syllabus)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      id="register-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Confirm</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      id="register-confirmpassword-input"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                id="register-submit-btn"
                type="submit"
                disabled={loading || googleLoading || usernameStatus.available === false}
                className="w-full py-2.5 rounded-xl bg-slate-950 text-white font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>Create Account & Send Verification</span>
              </button>
            </form>
          )}

          {/* ==================== SIGN IN TAB ==================== */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3">
              {/* Google One-Click Auth */}
              <button
                id="auth-google-signin-btn"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition-all font-bold text-slate-700 flex items-center justify-center gap-3 shadow-2xs hover:border-slate-400 disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Sign in with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  or email login
                </span>
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="login-email-input"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(loginEmail);
                      setActiveTab('forgot');
                    }}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-2.5 rounded-xl bg-slate-950 text-white font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>Sign In to Learning Dashboard</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
