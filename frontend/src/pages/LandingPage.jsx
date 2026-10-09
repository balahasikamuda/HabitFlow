import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Flame,
  CheckCircle2,
  Calendar,
  BarChart3,
  Bell,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  Award,
  Zap,
  Clock,
  Compass
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-100/50 via-transparent to-transparent dark:from-emerald-950/20 dark:via-transparent dark:to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Hackathon pill */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300 shadow-sm">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>College Hackathon • Lifestyle & Personal Management – Habit Tracking</span>
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Build better habits.{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                Track your progress.
              </span>{' '}
              Stay consistent.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              <strong>HabitFlow</strong> is a modern, full-stack <strong>MERN</strong> habit tracking application
              designed to seamlessly track your daily routines, targets, completion statuses, and streaks with
              MongoDB persistence and real-time analytics.
            </p>

            {/* Core Data Highlight Pill */}
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 bg-white dark:bg-slate-900 py-2.5 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Core Management:</span>
              <span className="font-semibold text-slate-900 dark:text-white">Habit</span>
              <span className="text-slate-400">➔</span>
              <span className="font-semibold text-slate-900 dark:text-white">Date</span>
              <span className="text-slate-400">➔</span>
              <span className="font-semibold text-slate-900 dark:text-white">Target</span>
              <span className="text-slate-400">➔</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Completion Status</span>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all text-base"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all text-base"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-base"
                  >
                    <span>Log In to Account</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Live Preview Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12 mb-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-slate-400 ml-2">HabitFlow Dashboard Preview</span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Live Mockup
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Fitness</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                  Completed
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Morning Exercise</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Target: 30 minutes</p>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">Progress: 30/30 minutes (100%)</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                <Flame className="w-3.5 h-3.5 fill-amber-500" /> 7 Day Streak
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-teal-600 dark:text-teal-400">Study</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                  Pending
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">DSA Practice</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Target: 2 hours</p>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-1">Progress: 1/2 hours (50%)</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                <Flame className="w-3.5 h-3.5 fill-amber-500" /> 5 Day Streak
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Health</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                  Completed
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Hydrate Daily</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Target: 8 glasses</p>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">Progress: 8/8 glasses (100%)</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                <Flame className="w-3.5 h-3.5 fill-amber-500" /> 12 Day Streak
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Everything Required for Habit Mastery
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            Built strictly adhering to the hackathon specifications with modern, responsive productivity features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Full CRUD on MongoDB
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Create, view, edit, and delete habit records backed by a dedicated MongoDB database and Node/Express REST APIs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Habit Streaks Tracking
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Track your current and best streaks dynamically. Keep momentum alive by maintaining consecutive completed days.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Interactive Calendar
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Select any date to see completed, pending, and scheduled habits directly from your database records.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Weekly & Monthly Analytics
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Visualize completion percentages, weekly trends, category distributions, and overall consistency rates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              JWT Authentication & Security
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Secure registration and login with bcrypt password hashing and token-based protected endpoints.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Reminders & Dark Mode
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Configure daily reminder times, toggle between dark and light themes, and enjoy a fully responsive layout.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100/70 dark:bg-slate-900/50 py-16 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              How HabitFlow Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
              Four simple steps from registration to daily habit tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">01</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2 mb-1">
                Register & Log In
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Create a secure account protected by bcrypt & JWT authentication.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">02</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2 mb-1">
                Add Your Habit
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Define Habit, Date, Target (e.g. 30 mins) and initial Status (Pending).
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">03</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2 mb-1">
                Mark Progress
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Update progress incrementally and toggle to Completed with confetti celebrations.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">04</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2 mb-1">
                Streaks & Analytics
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Inspect streak milestones, weekly/monthly charts, and calendar history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <p className="font-medium">
          HabitFlow – Habit Tracking Application • College Hackathon Submission (Lifestyle & Personal Management)
        </p>
        <p className="mt-1">
          Built with MongoDB, Express.js, React.js, and Node.js (MERN Stack)
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
