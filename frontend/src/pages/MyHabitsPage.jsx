import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import HabitCard from '../components/HabitCard';
import HabitModal from '../components/HabitModal';
import DeleteModal from '../components/DeleteModal';
import {
  Search,
  Filter,
  PlusCircle,
  LayoutGrid,
  Table as TableIcon,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  Eye,
  Flame,
  ArrowUpDown,
  RefreshCw,
  Sparkles
} from 'lucide-react';

const MyHabitsPage = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (statusFilter !== 'All') params.status = statusFilter;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (dateFilter) params.date = dateFilter;

      const res = await api.get('/habits', { params });
      if (res.data.success) {
        setHabits(res.data.data);
      }
    } catch (err) {
      error('Failed to fetch habit records');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, categoryFilter, dateFilter, error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHabits();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchHabits]);

  const handleSaveHabit = async (formData) => {
    try {
      if (editingHabit) {
        const res = await api.put(`/habits/${editingHabit._id}`, formData);
        if (res.data.success) {
          setHabits((prev) =>
            prev.map((h) => (h._id === editingHabit._id ? res.data.data : h))
          );
          success('Habit updated successfully.');
        }
      } else {
        const res = await api.post('/habits', formData);
        if (res.data.success) {
          setHabits((prev) => [res.data.data, ...prev]);
          success('Habit added successfully.');
        }
      }
      setEditingHabit(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save habit';
      error(msg);
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await api.delete(`/habits/${deleteTarget._id}`);
      if (res.data.success) {
        setHabits((prev) => prev.filter((h) => h._id !== deleteTarget._id));
        success('Habit deleted successfully.');
      }
    } catch (err) {
      error('Failed to delete habit');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.patch(`/habits/${id}/toggle`);
      if (res.data.success) {
        setHabits((prev) =>
          prev.map((h) => (h._id === id ? res.data.data : h))
        );
        success(res.data.message);
      }
    } catch (err) {
      error('Failed to toggle habit status');
    }
  };

  const handleUpdateProgress = async (id, progressValue) => {
    try {
      const res = await api.patch(`/habits/${id}/progress`, { progressValue });
      if (res.data.success) {
        setHabits((prev) =>
          prev.map((h) => (h._id === id ? res.data.data : h))
        );
      }
    } catch (err) {
      error('Failed to update progress');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setDateFilter('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
      {/* Title & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Habits
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Displaying core records: <strong>Habit → Date → Target → Completion Status</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Table or Card Grid */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('table')}
              title="Table View (Required Format)"
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'table'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>

          <button
            onClick={() => {
              setEditingHabit(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-md shadow-emerald-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Habit</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR (Required Feature) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search by Name */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search habit by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Filter by Completion Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Statuses (Pending & Completed)</option>
              <option value="Completed">Completed Only</option>
              <option value="Pending">Pending Only</option>
            </select>
          </div>

          {/* Filter by Category */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Categories</option>
              <option value="Productivity">Productivity</option>
              <option value="Study">Study</option>
              <option value="Fitness">Fitness</option>
              <option value="Health">Health</option>
              <option value="Mindfulness">Mindfulness</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          {/* Filter by Date */}
          <div className="relative flex items-center gap-1.5">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="text-xs text-rose-500 hover:underline px-1 whitespace-nowrap"
              >
                Clear Date
              </button>
            )}
          </div>
        </div>

        {/* Filter status summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span>
            Found <strong>{habits.length}</strong> {habits.length === 1 ? 'record' : 'records'}
          </span>
          {(searchTerm || statusFilter !== 'All' || categoryFilter !== 'All' || dateFilter) && (
            <button
              onClick={clearFilters}
              className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* CONTENT: Table View OR Card Grid */}
      {loading ? (
        <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Loading your habits...
          </p>
        </div>
      ) : habits.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">
            No habits found
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Try adjusting your search terms or add a new habit.
          </p>
          <button
            onClick={() => {
              setEditingHabit(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add First Habit</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* REQUIRED TABLE FORMAT: | Habit | Date | Target | Completion Status | Actions | */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-5">Habit</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Target</th>
                  <th className="py-3.5 px-5">Completion Status</th>
                  <th className="py-3.5 px-5">Progress / Streak</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                {habits.map((h) => {
                  const isCompleted = h.completionStatus === 'Completed';
                  return (
                    <tr
                      key={h._id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/habits/${h._id}`)}
                    >
                      {/* Habit Column */}
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {h.habit}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {h.category || 'Productivity'}
                        </span>
                      </td>

                      {/* Date Column */}
                      <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300 font-mono text-xs whitespace-nowrap">
                        {h.date}
                      </td>

                      {/* Target Column */}
                      <td className="py-3.5 px-5 text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap">
                        {h.target}
                      </td>

                      {/* Completion Status Column */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(h._id);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 hover:bg-amber-200'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pending</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Progress / Streak Column */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="text-xs text-slate-600 dark:text-slate-300">
                          {h.progressValue || 0} / {h.targetValue || 1} {h.unit}
                        </div>
                        {(h.currentStreak || 0) > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                            <Flame className="w-3 h-3 fill-amber-500" />
                            {h.currentStreak}d Streak
                          </span>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => navigate(`/habits/${h._id}`)}
                            title="View Details"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingHabit(h);
                              setIsModalOpen(true);
                            }}
                            title="Edit Habit"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(h)}
                            title="Delete Habit"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {habits.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}
              onEdit={(h) => {
                setEditingHabit(h);
                setIsModalOpen(true);
              }}
              onDelete={(h) => setDeleteTarget(h)}
              onToggleStatus={handleToggleStatus}
              onUpdateProgress={handleUpdateProgress}
            />
          ))}
        </div>
      )}

      {/* Edit & Add Habit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHabit(null);
        }}
        onSubmit={handleSaveHabit}
        initialData={editingHabit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        habitTitle={deleteTarget?.habit}
      />
    </div>
  );
};

export default MyHabitsPage;
