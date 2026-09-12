import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Calendar,
  Compass,
  PlayCircle,
  Award,
  BookOpen,
  Atom,
  Calculator,
  Globe,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onViewDashboard: () => void;
  hasCourse: boolean;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
  onViewDashboard,
  hasCourse,
  onOpenAuth,
}) => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Academic badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Diagnostic-Driven EdTech Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 font-display leading-[1.12]">
              Your Course. Your Pace. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 bg-clip-text text-transparent">
                Your Learning Path.
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              Take a 20-question assessment and get a personalized study course built around your current level.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                id="hero-build-course-btn"
                onClick={onStartOnboarding}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-950 text-white font-semibold text-base shadow-lg shadow-slate-950/15 hover:bg-slate-800 hover:shadow-slate-950/25 transition-all duration-200 group"
              >
                <span>Build My Course</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {onOpenAuth && (
                <button
                  id="hero-create-account-btn"
                  onClick={() => onOpenAuth('register')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-50 text-amber-950 font-semibold text-base border border-amber-200 shadow-sm hover:bg-amber-100 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Create Account</span>
                </button>
              )}

              <button
                id="hero-see-how-it-works-btn"
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-800 font-semibold text-base border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <span>See How It Works</span>
              </button>

              {hasCourse && (
                <button
                  id="hero-resume-dashboard-btn"
                  onClick={onViewDashboard}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold text-sm border border-indigo-200/80 hover:bg-indigo-100 transition-colors"
                >
                  <span>Resume Active Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Micro-guarantee */}
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>NCERT Classes 6 to 12</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Guesswork</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Top Educator Video Lessons</span>
              </div>
            </div>
          </div>

          {/* Primary Visual Flow Section */}
          <div className="mt-16 lg:mt-20">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8 md:p-10">
              <div className="text-center mb-8">
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
                  How Your Way Dynamically Tailors Your Curriculum
                </span>
              </div>

              {/* 4-Step Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Step 1 */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/70 relative flex flex-col items-start">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-3">
                    1
                  </div>
                  <div className="font-semibold text-slate-900 text-sm mb-1">
                    20 Questions
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Balanced across subjects, testing Easy, Medium, and Hard concepts.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/70 relative flex flex-col items-start">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm mb-3">
                    2
                  </div>
                  <div className="font-semibold text-slate-900 text-sm mb-1">
                    Level Analysis
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Detects Strong (80%+), Developing (60-79%), and Priority (&lt;60%) topics.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/70 relative flex flex-col items-start">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-3">
                    3
                  </div>
                  <div className="font-semibold text-slate-900 text-sm mb-1">
                    Personalized Course
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Allocates 40% time to priority gaps while keeping curriculum balanced.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/70 relative flex flex-col items-start">
                  <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm mb-3">
                    4
                  </div>
                  <div className="font-semibold text-slate-900 text-sm mb-1">
                    Daily Timetable
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Fits your available hours with verified video lessons and practice drills.
                  </p>
                </div>
              </div>

              {/* Sample Quote Callout */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 bg-slate-50/50 p-4 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <span className="font-medium text-slate-800">
                    "I didn’t choose a course. The platform built one for me."
                  </span>
                </div>
                <button
                  onClick={onStartOnboarding}
                  className="font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1"
                >
                  Start your assessment now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Coverage (Class 9 Demo Ready) */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Complete Multi-Subject Syllabus
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display mt-2">
              Ready for Class 9 CBSE / NCERT Curriculum
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Each subject includes 10+ core topics, verified video lessons from top educators, and targeted practice problems.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mathematics */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Mathematics</h3>
              <p className="text-xs text-slate-500 mb-4">
                Number Systems, Polynomials, Coordinate Geometry, Linear Equations, Triangles, Circles.
              </p>
              <div className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded inline-block">
                10 Topics • 12+ Questions
              </div>
            </div>

            {/* Science */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Atom className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Science</h3>
              <p className="text-xs text-slate-500 mb-4">
                Matter, Atoms & Molecules, Cell Structure, Plant/Animal Tissues, Laws of Motion, Gravitation.
              </p>
              <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded inline-block">
                10 Topics • 11+ Questions
              </div>
            </div>

            {/* English */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">English</h3>
              <p className="text-xs text-slate-500 mb-4">
                Determiners & Modals, Subject-Verb Agreement, Passive Voice, Reported Speech, Literature.
              </p>
              <div className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded inline-block">
                10 Topics • 8+ Questions
              </div>
            </div>

            {/* Social Science */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Social Science</h3>
              <p className="text-xs text-slate-500 mb-4">
                French Revolution, Russian Revolution, India Physical Features, Climate, Constitutional Design.
              </p>
              <div className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded inline-block">
                10 Topics • 9+ Questions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Detailed Section */}
      <section id="how-it-works-section" className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              The Architecture of Personalization
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-display mt-2">
              How Morphic Works in 3 Simple Steps
            </h2>
          </div>

          <div className="space-y-8">
            {/* Step 1 card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-lg flex-shrink-0">
                01
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Take the Adaptive 20-Question Diagnostic Assessment
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Instead of generic tests, Morphic selects questions across your selected subjects with an intentional difficulty distribution: 40% Easy, 40% Medium, and 20% Hard. Each question directly maps to syllabus topics.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">Class 6–12 Ready</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">Immediate Topic Tagging</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">Zero Guesswork</span>
                </div>
              </div>
            </div>

            {/* Step 2 card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center font-extrabold text-lg flex-shrink-0">
                02
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Diagnostic Analysis & Weakness Identification
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Scores are immediately categorized into Strong (80-100%), Developing (60-79%), and Priority Needs (&lt;60%). If Linear Equations or Newton's Laws show conceptual vulnerabilities, Morphic flags them for focused reinforcement.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium">Strong: 80–100%</span>
                  <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 font-medium">Developing: 60–79%</span>
                  <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-medium">Priority: 0–59%</span>
                </div>
              </div>
            </div>

            {/* Step 3 card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-lg flex-shrink-0">
                03
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Tailored 4-Week Schedule & Curated YouTube Lessons
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Your customized course allocates 40% of sessions to priority gaps, 35% to developing concepts, and 25% to maintaining strengths. Each session pairs a verified educational YouTube lesson with structured learning outcomes and immediate practice problems.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">Official YouTube API Proxy</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">Khan Academy & CrashCourse Lessons</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">Day-by-Day Timetable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 text-center">
            <button
              id="landing-bottom-cta-btn"
              onClick={onStartOnboarding}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-slate-950 text-white font-bold text-base shadow-lg shadow-slate-950/20 hover:bg-slate-800 transition-all"
            >
              <span>Build My Personalized Course</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
