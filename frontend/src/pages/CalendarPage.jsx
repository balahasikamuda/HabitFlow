import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import HabitCard from '../components/HabitCard';
import HabitModal from '../components/HabitModal';
import DeleteModal from '../components/DeleteModal';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  PlusCircle,
  RefreshCw,
  Info
} from 'lucide-react';

const CalendarPage = () => {
  const { success, error } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCalendar = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/habits/calendar/overview');
      if (res.data.success) {
        setCalendarData(res.data.data);
      }
    } catch (err) {
      error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today.toISOString().split('T')[0]);
  };

  // Calendar matrix calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate days array
  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevDateObj = new Date(year, month - 1, d);
    const dateStr = prevDateObj.toISOString().split('T')[0];
    calendarCells.push({
      day: d,
      dateStr,
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    // Format YYYY-MM-DD
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    const dateStr = `${year}-${mStr}-${dStr}`;
    calendarCells.push({
      day: d,
      dateStr,
      isCurrentMonth: true
    });
  }

  // Next month leading days to complete full grid
  const remainingCells = (7 - (calendarCells.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const nextDateObj = new Date(year, month + 1, d);
    const dateStr = nextDateObj.toISOString().split('T')[0];
    calendarCells.push({
      day: d,
      dateStr,
      isCurrentMonth: false
    });
  }

  const selectedDayInfo = calendarData[selectedDate] || {
    date: selectedDate,
    total: 0,
    completed: 0,
    pending: 0,
    status: 'empty',
    habits: []
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.patch(`/habits/${id}/toggle`);
      if (res.data.success) {
        success(res.data.message);
        fetchCalendar();
      }
    } catch (err) {
      error('Failed to toggle status');
    }
  };

  const handleUpdateProgress = async (id, val) => {
    try {
      const res = await api.patch(`/habits/${id}/progress`, { progressValue: val });
      if (res.data.success) {
        fetchCalendar();
      }
    } catch (err) {
      error('Failed to update progress');
    }
  };

  const handleSaveHabit = async (formData) => {
    try {
      if (editingHabit) {
        await api.put(`/habits/${editingHabit._id}`, formData);
        success('Habit updated.');
      } else {
        await api.post('/habits', formData);
        success('Habit added for selected date!');
      }
      setIsModalOpen(false);
      setEditingHabit(null);
      fetchCalendar();
    } catch (err) {
      error('Failed to save habit');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/habits/${deleteTarget._id}`);
      success('Habit deleted.');
      setDeleteTarget(null);
      fetchCalendar();
    } catch (err) {
      error('Failed to delete habit');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            <span>Habit Calendar</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track daily habit completions, pending items, and missed routines by date
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">All Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-300">Partially Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="text-slate-600 dark:text-slate-300">Pending / None</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid (2 columns on large screen) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {monthNames[month]} {year}
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Today
              </button>
              <button
                onClick={prevMonth}
                aria-label="Previous Month"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                aria-label="Next Month"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            {daysOfWeek.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar day cells */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((cell, idx) => {
              const dayData = calendarData[cell.dateStr];
              const isSelected = cell.dateStr === selectedDate;
              const isToday = cell.dateStr === new Date().toISOString().split('T')[0];

              let badgeColor = 'bg-transparent';
              if (dayData && dayData.total > 0) {
                if (dayData.completed === dayData.total) {
                  badgeColor = 'bg-emerald-500';
                } else if (dayData.completed > 0) {
                  badgeColor = 'bg-amber-500';
                } else {
                  badgeColor = 'bg-rose-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(cell.dateStr)}
                  className={`min-h-[72px] sm:min-h-[84px] p-2 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30'
                  } ${!cell.isCurrentMonth ? 'opacity-40' : 'opacity-100'}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {cell.day}
                    </span>
                    {dayData && dayData.total > 0 && (
                      <span className={`w-2 h-2 rounded-full ${badgeColor}`} />
                    )}
                  </div>

                  {dayData && dayData.total > 0 && (
                    <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate mt-1">
                      {dayData.completed}/{dayData.total} done
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Habits Inspection Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Selected Date
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedDate}
              </h3>
            </div>

            <button
              onClick={() => {
                setEditingHabit(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add for Date</span>
            </button>
          </div>

          {/* Metrics for selected date */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-center">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800">
              <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase">
                Completed
              </span>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {selectedDayInfo.completed}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800">
              <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 uppercase">
                Pending
              </span>
              <div className="text-lg font-black text-amber-600 dark:text-amber-400">
                {selectedDayInfo.pending}
              </div>
            </div>
          </div>

          {/* Habit list for selected date */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {selectedDayInfo.habits && selectedDayInfo.habits.length > 0 ? (
              selectedDayInfo.habits.map((item, idx) => {
                const isItemCompleted = item.status === 'Completed';
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.habit}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Target: {item.target} • {item.progressValue || 0}/{item.targetValue || 1} {item.unit}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleStatus(item.habitId)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 transition-colors ${
                        isItemCompleted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {isItemCompleted ? 'Completed' : 'Pending'}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                <Info className="w-6 h-6 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p>No habits logged on {selectedDate}.</p>
                <p className="mt-1">Click "Add for Date" to schedule a habit.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveHabit}
        initialData={{ date: selectedDate }}
      />

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        habitTitle={deleteTarget?.habit}
      />
    </div>
  );
};

export default CalendarPage;
