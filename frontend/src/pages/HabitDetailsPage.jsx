import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import HabitModal from '../components/HabitModal';
import DeleteModal from '../components/DeleteModal';
import {
  ArrowLeft,
  Calendar,
  Target,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  History,
  Edit2,
  Trash2,
  Tag,
  TrendingUp,
  FileText,
  Plus,
  Minus,
  RefreshCw
} from 'lucide-react';

const HabitDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchHabit = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/habits/${id}`);
      if (res.data.success) {
        setHabit(res.data.data);
      }
    } catch (err) {
      error('Habit not found or access denied');
      navigate('/habits');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, error]);

  useEffect(() => {
    fetchHabit();
  }, [fetchHabit]);

  const handleToggleStatus = async () => {
    try {
      const res = await api.patch(`/habits/${id}/toggle`);
      if (res.data.success) {
        setHabit(res.data.data);
        if (res.data.data.completionStatus === 'Completed') {
          confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
        }
        success(res.data.message);
      }
    } catch (err) {
      error('Failed to toggle habit status');
    }
  };

  const handleUpdateProgress = async (newVal) => {
    try {
      const res = await api.patch(`/habits/${id}/progress`, { progressValue: newVal });
      if (res.data.success) {
        setHabit(res.data.data);
        if (res.data.data.completionStatus === 'Completed' && habit.completionStatus !== 'Completed') {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
        }
      }
    } catch (err) {
      error('Failed to update progress');
    }
  };

  const handleEditSave = async (formData) => {
    try {
      const res = await api.put(`/habits/${id}`, formData);
      if (res.data.success) {
        setHabit(res.data.data);
        success('Habit updated successfully.');
      }
    } catch (err) {
      error('Failed to update habit');
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await api.delete(`/habits/${id}`);
      if (res.data.success) {
        success('Habit deleted successfully.');
        navigate('/habits');
      }
    } catch (err) {
      error('Failed to delete habit');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Loading habit details...
        </p>
      </div>
    );
  }

  if (!habit) return null;

  const isCompleted = habit.completionStatus === 'Completed';
  const progressPercent = Math.min(
    100,
    Math.round(((habit.progressValue || 0) / (habit.targetValue || 1)) * 100)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Link
          to="/habits"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Habits</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <Edit2 className="w-4 h-4 text-slate-500" />
            <span>Edit Habit</span>
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Habit Showcase Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {habit.category || 'Productivity'}
              </span>
              <span className="text-xs text-slate-400">
                Created: {new Date(habit.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {habit.habit}
            </h1>
          </div>

          {/* Quick Mark Complete Button */}
          <button
            onClick={handleToggleStatus}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold shadow-md transition-all self-start ${
              isCompleted
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/25'
                : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/25'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Mark Pending' : 'Mark as Completed'}</span>
          </button>
        </div>

        {/* Core Field Cards: Habit → Date → Target → Completion Status */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Date
            </span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{habit.date}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Target
            </span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm">
              <Target className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{habit.target}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Status
            </span>
            <div className="flex items-center gap-1.5 font-bold text-sm">
              {isCompleted ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Completed
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Pending
                </span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Current Streak
            </span>
            <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 text-sm">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>{habit.currentStreak || 0} {habit.currentStreak === 1 ? 'day' : 'days'}</span>
            </div>
          </div>
        </div>

        {/* Progress & Quick Stepper */}
        <div className="mb-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-sm font-semibold mb-2">
            <span className="text-slate-700 dark:text-slate-300">
              Daily Progress Target
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {habit.progressValue || 0} / {habit.targetValue || 1} {habit.unit} ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Adjust progress:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateProgress(Math.max(0, (habit.progressValue || 0) - 1))}
                className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold flex items-center gap-1"
              >
                <Minus className="w-3 h-3" /> 1 {habit.unit}
              </button>
              <button
                onClick={() => handleUpdateProgress((habit.progressValue || 0) + 1)}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> 1 {habit.unit}
              </button>
            </div>
          </div>
        </div>

        {/* Notes (if any) */}
        {habit.notes && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">Notes:</strong>
              <p>{habit.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* STREAK & MILESTONES SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-7 h-7 fill-amber-500" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Active Streak
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {habit.currentStreak || 0} consecutive days
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Last completed date: {habit.lastCompletedDate || 'Not completed yet'}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Personal Best Streak
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {habit.bestStreak || 0} days
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Keep going to beat your all-time high!
            </p>
          </div>
        </div>
      </div>

      {/* HABIT HISTORY TABLE (Required Feature) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Habit History Logs
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {habit.history?.length || 0} logged days
          </span>
        </div>

        {habit.history && habit.history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Progress Recorded</th>
                  <th className="py-2.5 px-3 text-right">Completion Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {habit.history
                  .slice()
                  .reverse()
                  .map((log, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-mono text-xs text-slate-700 dark:text-slate-300">
                        {log.date}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                            log.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {log.status === 'Completed' ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-xs text-slate-600 dark:text-slate-400">
                        {log.progressValue || 0} / {log.targetValue || habit.targetValue} {habit.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right text-xs text-slate-400 font-mono">
                        {log.completedAt ? new Date(log.completedAt).toLocaleTimeString() : '—'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4 text-center">
            No previous history entries recorded yet.
          </p>
        )}
      </div>

      {/* Edit Modal */}
      <HabitModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSave}
        initialData={habit}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        habitTitle={habit.habit}
      />
    </div>
  );
};

export default HabitDetailsPage;
