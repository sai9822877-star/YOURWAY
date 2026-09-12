import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Globe,
  User as UserIcon,
  AtSign,
  FileText,
  GraduationCap,
} from 'lucide-react';
import { User, ClassLevel } from '../../types';
import { processAndCropAvatar, uploadAvatarToServer } from '../../lib/avatarUtils';
import { checkUsernameAvailable, saveFirebaseUserProfile, auth } from '../../lib/firebase';
import { updateProfile } from 'firebase/auth';
import { api } from '../../lib/api';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onProfileUpdated: (updatedUser: User) => void;
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

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated,
}) => {
  // Form state
  const [displayName, setDisplayName] = useState(currentUser.name || '');
  const [username, setUsername] = useState(currentUser.username || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [website, setWebsite] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>(currentUser.class || 'Class 9');

  // Avatar state
  const [previewAvatar, setPreviewAvatar] = useState<string>(
    currentUser.avatar || currentUser.profilePicture || ''
  );
  const [newAvatarDataUrl, setNewAvatarDataUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Username validation state
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available?: boolean;
    message?: string;
  }>({ checking: false });

  // Submission state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setDisplayName(currentUser.name || '');
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
      setClassLevel(currentUser.class || 'Class 9');
      setPreviewAvatar(currentUser.avatar || currentUser.profilePicture || '');
      setNewAvatarDataUrl(null);
      setUploadProgress(0);
      setError(null);
      setSuccessMessage(null);
      setUsernameStatus({ checking: false });
    }
  }, [isOpen, currentUser]);

  // Debounced username uniqueness checker
  useEffect(() => {
    const clean = username.trim().toLowerCase();
    if (!clean) {
      setUsernameStatus({ checking: false, available: false, message: 'Username is required.' });
      return;
    }

    if (clean === currentUser.username?.toLowerCase()) {
      setUsernameStatus({ checking: false, available: true, message: 'Your current username' });
      return;
    }

    if (clean.length < 3) {
      setUsernameStatus({ checking: false, available: false, message: 'Minimum 3 characters.' });
      return;
    }

    if (!/^[a-z0-9_]+$/.test(clean)) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: 'Only letters, numbers, and underscores allowed.',
      });
      return;
    }

    setUsernameStatus({ checking: true });
    const timer = setTimeout(async () => {
      try {
        const result = await checkUsernameAvailable(clean, currentUser.id);
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
  }, [username, currentUser.id, currentUser.username]);

  if (!isOpen) return null;

  // Handle avatar file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessingImage(true);
    try {
      const processed = await processAndCropAvatar(file, 300);
      setPreviewAvatar(processed.dataUrl);
      setNewAvatarDataUrl(processed.dataUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to process selected image.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Reset to original values
  const handleReset = () => {
    setDisplayName(currentUser.name || '');
    setUsername(currentUser.username || '');
    setBio(currentUser.bio || '');
    setClassLevel(currentUser.class || 'Class 9');
    setWebsite('');
    setPreviewAvatar(currentUser.avatar || currentUser.profilePicture || '');
    setNewAvatarDataUrl(null);
    setError(null);
  };

  // Submit profile changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!displayName.trim()) {
      setError('Display Name cannot be empty.');
      return;
    }

    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || cleanUsername.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    if (!usernameStatus.available && cleanUsername !== currentUser.username?.toLowerCase()) {
      setError(usernameStatus.message || 'Please choose an available username.');
      return;
    }

    setIsSaving(true);
    setUploadProgress(10);

    try {
      let finalAvatarUrl = previewAvatar;

      // 1. Upload new avatar if changed
      if (newAvatarDataUrl) {
        finalAvatarUrl = await uploadAvatarToServer(
          currentUser.id,
          newAvatarDataUrl,
          (pct) => setUploadProgress(pct)
        );
      }

      // 2. Update Firebase Auth user profile (if logged in via Firebase Auth)
      if (auth.currentUser) {
        try {
          await updateProfile(auth.currentUser, {
            displayName: displayName.trim(),
            photoURL: finalAvatarUrl,
          });
        } catch (e) {
          console.warn('Firebase Auth updateProfile non-fatal:', e);
        }
      }

      // 3. Save to Firestore `users/{uid}`
      await saveFirebaseUserProfile(
        currentUser.id,
        {
          displayName: displayName.trim(),
          username: cleanUsername,
          bio: bio.trim(),
          website: website.trim(),
          classLevel: classLevel,
          profileImageUrl: finalAvatarUrl,
          emailVerified: auth.currentUser?.emailVerified ?? true,
        },
        false
      );

      // 4. Sync with internal backend so timetable, courses & groups update
      const syncRes = await api.syncFirebaseUser({
        uid: currentUser.id,
        email: currentUser.email,
        name: displayName.trim(),
        username: cleanUsername,
        classLevel: classLevel,
        profileImageUrl: finalAvatarUrl,
        bio: bio.trim(),
        website: website.trim(),
        emailVerified: auth.currentUser?.emailVerified ?? true,
      });

      const updatedUser: User = {
        ...currentUser,
        ...(syncRes?.user || {}),
        name: displayName.trim(),
        username: cleanUsername,
        class: classLevel,
        avatar: finalAvatarUrl,
        profilePicture: finalAvatarUrl,
        bio: bio.trim(),
      };

      onProfileUpdated(updatedUser);
      setSuccessMessage('Profile changes saved successfully!');

      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Could not save profile changes. Please try again.');
    } finally {
      setIsSaving(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-950 font-display text-base sm:text-lg">Edit Profile</h3>
            <p className="text-xs text-slate-500">Update your public identity, avatar, and study preferences</p>
          </div>
          <button
            id="close-edit-profile-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Avatar Edit & Crop Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-md">
                {previewAvatar ? (
                  <img
                    src={previewAvatar}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-extrabold text-xl">
                    {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>

              {isProcessingImage && (
                <div className="absolute inset-0 bg-slate-900/60 rounded-2xl flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-slate-950 text-white hover:bg-indigo-600 transition-colors shadow-sm"
                title="Change Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="text-center sm:text-left flex-1">
              <div className="font-bold text-slate-900 text-sm">Profile Picture</div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Images are automatically square-cropped and compressed for fast loading.
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Image</span>
                </button>
                {newAvatarDataUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewAvatarDataUrl(null);
                      setPreviewAvatar(currentUser.avatar || '');
                    }}
                    className="px-2.5 py-1.5 text-slate-500 hover:text-rose-600 font-medium"
                  >
                    Revert
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Upload Progress Bar if active */}
          {uploadProgress > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                <span>Saving Avatar & Profile...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Display Name */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Display Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                id="edit-displayname-input"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Arjun Patel"
                maxLength={80}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                required
              />
            </div>
          </div>

          {/* Username with Uniqueness Feedback */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">
                Username <span className="text-rose-500">*</span>
              </label>
              {usernameStatus.checking ? (
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                  <Loader2 className="w-2.5 h-2.5 animate-spin" /> Checking availability...
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
                id="edit-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="e.g. arjun_patel"
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
            <p className="text-[10px] text-slate-400 mt-1">
              Letters, numbers, and underscores only. Must be unique.
            </p>
          </div>

          {/* Bio */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Bio</label>
              <span className="text-[10px] text-slate-400">{bio.length} / 250</span>
            </div>
            <div className="relative">
              <textarea
                id="edit-bio-input"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={250}
                placeholder="Tell your study groups about your academic interests and target exams..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900 resize-none"
              />
            </div>
          </div>

          {/* Class Level */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Class (Curriculum)</label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <select
                id="edit-class-select"
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value as ClassLevel)}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900 appearance-none cursor-pointer"
              >
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c} (NCERT Curriculum)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Website / Portfolio */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Website / Portfolio (Optional)</label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                id="edit-website-input"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://github.com/my-study-notes"
                maxLength={200}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Footer Controls: Save Changes, Cancel, Reset */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-slate-500 hover:text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Changes</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                id="save-profile-btn"
                type="submit"
                disabled={isSaving || (usernameStatus.available === false && username !== currentUser.username)}
                className="px-5 py-2 rounded-xl bg-slate-950 text-white font-bold hover:bg-indigo-600 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
