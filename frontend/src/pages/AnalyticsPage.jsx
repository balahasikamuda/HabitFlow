import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  Layers,
  Calendar,
  RefreshCw,
  PieChart
} from 'lucide-react';

const AnalyticsPage = () => {
  const { error } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/habits/analytics/summary');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Calculating your habit analytics...
        </p>
      </div>
    );
  }

  if (!data) return null;

  const {
    totalHabits,
    completedHabits,
    pendingHabits,
    overallRate,
    weeklyRate,
    weeklyTrend,
    categoryStats,
    bestStreakAcross,
    activeStreaksCount
  } = data;

  const categories = Object.keys(categoryStats || {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          <span>Habit Analytics & Progress</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real-time metrics, weekly trends, and category distribution powered by MongoDB
        </p>
      </div>

      {/* Primary KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Overall Completion Rate
          </span>
          <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
            {overallRate}%
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {completedHabits} of {totalHabits} total completed
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Weekly Completion
          </span>
          <div className="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400">
            {weeklyRate}%
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Past 7 days performance
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Pending Tasks
          </span>
          <div className="text-3xl sm:text-4xl font-black text-amber-500">
            {pendingHabits}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Awaiting today's actions
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Best Active Streak
          </span>
          <div className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <Flame className="w-8 h-8 fill-amber-500" />
            <span>{bestStreakAcross}d</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {activeStreaksCount} habits on streak
          </p>
        </div>
      </div>

      {/* WEEKLY COMPLETION CHART (Required Feature #4) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Weekly Completion Chart (Past 7 Days)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Visualizes completed habits and consistency by day
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            Real MongoDB Data
          </span>
        </div>

        {/* Bar Visualizer */}
        <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end pt-8 pb-4 h-64 border-b border-slate-100 dark:border-slate-800">
          {weeklyTrend &&
            weeklyTrend.map((dayItem, idx) => {
              const heightPct = Math.max(8, dayItem.percentage);
              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end group">
                  {/* Tooltip / Value on top of bar */}
                  <div className="mb-2 text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 transition-opacity">
                    {dayItem.completed}/{dayItem.total}
                  </div>

                  {/* Visual Bar Column */}
                  <div className="w-full max-w-[48px] bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 h-full flex flex-col justify-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-xl transition-all duration-500 ${
                        dayItem.completed > 0
                          ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    />
                  </div>

                  {/* Day Label & Date */}
                  <div className="mt-3 text-center">
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      {dayItem.day}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {dayItem.date.slice(5)}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* HABIT COMPLETION COMPARISON & CATEGORY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Habit Completion Comparison */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Habit Status Ratio</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Proportion of Completed vs Pending habits
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
                </span>
                <span className="text-emerald-700 dark:text-emerald-300">
                  {completedHabits} ({totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> Pending
                </span>
                <span className="text-amber-700 dark:text-amber-300">
                  {pendingHabits} ({totalHabits > 0 ? Math.round((pendingHabits / totalHabits) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${totalHabits > 0 ? (pendingHabits / totalHabits) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Category Performance</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Habit distributions across categories
          </p>

          {categories.length > 0 ? (
            <div className="space-y-3.5">
              {categories.map((cat) => {
                const item = categoryStats[cat];
                const pct = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                      <span>{cat}</span>
                      <span>
                        {item.completed}/{item.total} done ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">
              No habit categories to display yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
