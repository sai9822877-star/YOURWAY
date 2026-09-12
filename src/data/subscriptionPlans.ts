import { SubscriptionTier } from '../types';

export interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  priceMonthly: number; // 0, 99, 199
  priceYearly: number;  // 0, 899, 1799
  tag?: string;
  badge: string;
  description: string;
  features: string[];
  detailedFeatures: PlanFeature[];
  popular?: boolean;
  ctaText: string;
  accentColor: string;
  buttonClass: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Starter',
    priceMonthly: 0,
    priceYearly: 0,
    tag: 'Free Forever',
    badge: '₹0 / Month',
    description: 'Essential personalized study schedule & verified learning resources for Class 6–12.',
    popular: false,
    ctaText: 'Current Plan',
    accentColor: 'slate',
    buttonClass: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300',
    features: [
      'Standard Diagnostic Assessment (1 Subject)',
      'Personalized 4-Week Study Timetable',
      'Curated Khan Academy & CrashCourse Videos',
      'Official Textbook Source Redirection (NCERT/CBSE)',
      'Daily Study Streak Counter',
      'Community Class Leaderboard Access',
    ],
    detailedFeatures: [
      { text: 'Standard Diagnostic Assessment (1 Subject)', included: true },
      { text: 'Personalized 4-Week Study Timetable', included: true },
      { text: 'Curated Khan Academy & CrashCourse Videos', included: true },
      { text: 'Official Textbook Redirection Portal', included: true },
      { text: 'Daily Study Streak Counter', included: true },
      { text: 'Class Community Leaderboard', included: true },
      { text: 'Unlimited Diagnostic Re-tests', included: false },
      { text: 'Smart Direct Chapter-wise NCERT Jumps', included: false },
      { text: 'Streak Freeze & Protection Shield', included: false },
      { text: 'Unlock All Classes (Class 6 to 12)', included: false },
      { text: 'AI Deep Root Cause Diagnostic Breakdown', included: false },
      { text: '1-on-1 Priority Host & Educator Guidance', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro Scholar',
    priceMonthly: 99,
    priceYearly: 899, // ~₹75/month when billed annually
    tag: 'Most Popular',
    badge: '₹99 / Month',
    description: 'Supercharge your daily revision with unlimited diagnostic scans, direct chapter links, and streak protection.',
    popular: true,
    ctaText: 'Upgrade to Pro — ₹99',
    accentColor: 'indigo',
    buttonClass: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20',
    features: [
      'Everything in Free Starter, plus:',
      'Unlimited Diagnostic Re-tests & Root Cause Scans',
      'Smart Direct Chapter-wise NCERT & DIKSHA Link Jumps',
      'Streak Freeze & Shield (Never lose your learning streak)',
      'Custom Daily Study Duration & Multi-session Tuning',
      'Unlimited Practice Problem Attempts with Step-by-Step Solutions',
      'Personalized Weakness Revision Priority Alerts',
      'Ad-free & Distraction-free Study Mode',
    ],
    detailedFeatures: [
      { text: 'Standard Diagnostic Assessment (1 Subject)', included: true },
      { text: 'Personalized 4-Week Study Timetable', included: true },
      { text: 'Curated Khan Academy & CrashCourse Videos', included: true },
      { text: 'Official Textbook Redirection Portal', included: true },
      { text: 'Daily Study Streak Counter', included: true },
      { text: 'Class Community Leaderboard', included: true },
      { text: 'Unlimited Diagnostic Re-tests & Scans', included: true, highlight: true },
      { text: 'Smart Direct Chapter-wise NCERT Jumps', included: true, highlight: true },
      { text: 'Streak Freeze & Protection Shield', included: true, highlight: true },
      { text: 'Unlock All Classes (Class 6 to 12)', included: false },
      { text: 'AI Deep Root Cause Diagnostic Breakdown', included: false },
      { text: '1-on-1 Priority Host & Educator Guidance', included: false },
    ],
  },
  {
    id: 'elite',
    name: 'Elite Master',
    priceMonthly: 199,
    priceYearly: 1799, // ~₹150/month when billed annually
    tag: 'Ultimate Value',
    badge: '₹199 / Month',
    description: 'Complete academic mastery across all classes with AI diagnostic insights, and priority host guidance.',
    popular: false,
    ctaText: 'Upgrade to Elite — ₹199',
    accentColor: 'amber',
    buttonClass: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-md shadow-amber-500/20',
    features: [
      'Everything in Pro Scholar, plus:',
      'Unlock All Classes 6 to 12 Simultaneously',
      'AI Deep Diagnostic Root Cause & Misconception Insights',
      '1-on-1 Priority Host & Educator Guidance Q&A',
      'Downloadable & Printable Weekly Study Planners (PDF/Checklist)',
      'Parent Progress Reports & Weekly Performance Digests',
      'Early Access to Board Exam Revision Marathons & Sample Papers',
      'VIP Elite Gold Badge on Leaderboards & Community Profile',
    ],
    detailedFeatures: [
      { text: 'Standard Diagnostic Assessment (1 Subject)', included: true },
      { text: 'Personalized 4-Week Study Timetable', included: true },
      { text: 'Curated Khan Academy & CrashCourse Videos', included: true },
      { text: 'Official Textbook Redirection Portal', included: true },
      { text: 'Daily Study Streak Counter', included: true },
      { text: 'Class Community Leaderboard', included: true },
      { text: 'Unlimited Diagnostic Re-tests & Scans', included: true },
      { text: 'Smart Direct Chapter-wise NCERT Jumps', included: true },
      { text: 'Streak Freeze & Protection Shield', included: true },
      { text: 'Unlock All Classes (Class 6 to 12)', included: true, highlight: true },
      { text: 'AI Deep Root Cause Diagnostic Breakdown', included: true, highlight: true },
      { text: '1-on-1 Priority Host & Educator Guidance', included: true, highlight: true },
    ],
  },
];
