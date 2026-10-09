import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  User,
  Mail,
  Lock,
  Calendar,
  CheckCircle2,
  ListTodo,
  Shield,
  Save,
  Flame,
  Award
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    bestStreak: 0
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }

    const fetchStats = async () => {
      try {
        const res = await api.get('/habits');
        if (res.data.success) {
          const list = res.data.data;
          const total = list.length;
          const completed = list.filter((h) => h.completionStatus === 'Completed').length;
          const pending = list.filter((h) => h.completionStatus === 'Pending').length;
          const best = list.reduce((m, h) => Math.max(m, h.bestStreak || 0), 0);
          setStats({ total, completed, pending, bestStreak: best });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email
      };
      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      await updateProfile(payload);
      success('Profile updated successfully.');
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update profile';
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <User className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          <span>User Profile</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account credentials and view personal habit statistics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card & Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white text-2xl font-black flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {user?.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {user?.email}
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span className="capitalize">{user?.role || 'user'} Account</span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
            </div>
          </div>

          {/* Habit Statistics Card (Required) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Personal Habit Stats
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                  Total Habits
                </span>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {stats.total}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800">
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase">
                  Completed
                </span>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {stats.completed}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800">
                <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 uppercase">
                  Pending
                </span>
                <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
                  {stats.pending}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-800">
                <span className="text-[10px] font-semibold text-orange-700 dark:text-orange-300 uppercase">
                  Best Streak
                </span>
                <div className="text-xl font-black text-orange-600 dark:text-orange-400 mt-1">
                  {stats.bestStreak}d
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Update Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Edit Account Information
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Update your personal details or change your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Change Password (optional)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Leave blank to keep current password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-md shadow-emerald-600/20 transition-all"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
