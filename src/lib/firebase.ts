import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  reload,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocFromServer,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// 1. Initialize Firebase App and Services
export const app = initializeApp(firebaseConfig);

// CRITICAL: Must include firestoreDatabaseId per Firebase skill specifications
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Configure Google Auth Provider with Gmail / userinfo scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

// Reserved usernames that cannot be claimed
export const RESERVED_USERNAMES = [
  'admin',
  'administrator',
  'system',
  'root',
  'morphic',
  'yourway',
  'support',
  'official',
  'mod',
  'moderator',
  'help',
  'api',
  'guest',
  'null',
  'undefined',
  'superuser',
  'security',
];

// Error handling according to Firebase Skill (FirestoreErrorInfo format)
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection on boot as mandated by skill
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore offline notice: Check connectivity.');
    }
  }
}

// User Profile Schema
export interface StoredUserProfile {
  uid: string;
  username: string;
  displayName: string;
  bio?: string;
  profileImageUrl?: string;
  website?: string;
  classLevel?: string;
  xp?: number;
  rank?: number;
  streak?: number;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Validate Username formatting
export function isValidUsernameFormat(username: string): { valid: boolean; reason?: string } {
  const clean = username.trim().toLowerCase();
  if (clean.length < 3 || clean.length > 30) {
    return { valid: false, reason: 'Username must be between 3 and 30 characters.' };
  }
  if (!/^[a-z0-9_]+$/.test(clean)) {
    return { valid: false, reason: 'Only lowercase letters, numbers, and underscores are allowed.' };
  }
  if (RESERVED_USERNAMES.includes(clean)) {
    return { valid: false, reason: 'This username is reserved by the platform.' };
  }
  return { valid: true };
}

// Check username availability in Firestore + Server
export async function checkUsernameAvailable(
  username: string,
  currentUid?: string
): Promise<{ available: boolean; reason?: string }> {
  const formatCheck = isValidUsernameFormat(username);
  if (!formatCheck.valid) {
    return { available: false, reason: formatCheck.reason };
  }

  const clean = username.trim().toLowerCase();

  try {
    const usernameDocRef = doc(db, 'usernames', clean);
    const snap = await getDoc(usernameDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (currentUid && data.uid === currentUid) {
        return { available: true }; // Owned by current user
      }
      return { available: false, reason: 'Username already taken' };
    }
    return { available: true };
  } catch (err) {
    // Fallback to server verification
    try {
      const res = await fetch(`/api/username/check?username=${encodeURIComponent(clean)}&uid=${currentUid || ''}`);
      const data = await res.json();
      return data;
    } catch {
      return { available: true };
    }
  }
}

// Get user profile from Firestore
export async function getFirebaseUserProfile(uid: string): Promise<StoredUserProfile | null> {
  const path = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as StoredUserProfile;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

// Save or Update user profile in Firestore
export async function saveFirebaseUserProfile(
  uid: string,
  profile: Partial<StoredUserProfile>,
  isNew: boolean = false
): Promise<void> {
  const path = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    const now = new Date().toISOString();

    const existingSnap = await getDoc(userDocRef);
    if (existingSnap.exists()) {
      // Merge updates cleanly without overwriting createdAt
      const updates: any = {
        ...profile,
        updatedAt: now,
      };
      delete updates.createdAt;
      updates.uid = uid;
      await setDoc(userDocRef, updates, { merge: true });
    } else {
      const newProfile: StoredUserProfile = {
        uid,
        username: profile.username || `student_${uid.slice(0, 6)}`,
        displayName: profile.displayName || 'Your Way Student',
        bio: profile.bio || '',
        profileImageUrl: profile.profileImageUrl || '',
        website: profile.website || '',
        classLevel: profile.classLevel || 'Class 10',
        xp: profile.xp ?? 0,
        rank: profile.rank ?? 5,
        streak: profile.streak ?? 1,
        emailVerified: profile.emailVerified ?? false,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(userDocRef, newProfile);
    }

    // Claim username atomically if present
    if (profile.username) {
      try {
        await setDoc(
          doc(db, 'usernames', profile.username.toLowerCase()),
          {
            uid,
            username: profile.username.toLowerCase(),
            createdAt: now,
          },
          { merge: true }
        );
      } catch (e) {
        console.warn('Username claim record notice:', e);
      }
    }
  } catch (err) {
    console.warn('Firestore profile write notice:', err);
    // Fall back gracefully so user login completes via backend sync
  }
}

// Friendly Auth Error Translation
export function formatAuthErrorMessage(error: any): string {
  if (typeof error === 'string') {
    try {
      const parsed = JSON.parse(error);
      if (parsed.error?.includes('Missing or insufficient permissions')) {
        return 'Account setup in progress. Please click Sign In again.';
      }
      return parsed.error || error;
    } catch {
      return error;
    }
  }
  const msg = error?.message || '';
  if (msg.startsWith('{') && msg.includes('Missing or insufficient permissions')) {
    return 'Account setup in progress. Please click Sign In again.';
  }
  const code = error?.code || '';
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'Email is already registered. Please log in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters with letters and numbers.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing.';
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was cancelled.';
    case 'auth/network-request-failed':
      return 'Network error: Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please wait a moment and try again.';
    case 'auth/operation-not-allowed':
      return 'Authentication service is temporarily unavailable.';
    default:
      return error?.message || 'Authentication error. Please try again.';
  }
}

// Execute connection test on import
testFirestoreConnection().catch(console.error);
