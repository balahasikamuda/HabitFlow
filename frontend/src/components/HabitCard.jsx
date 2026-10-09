import React from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Clock,
  Flame,
  Calendar,
  Target,
  Edit2,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';

const HabitCard = ({
  habit,
  onEdit,
  onDelete,
  onToggleStatus,
  onUpdateProgress
}) => {
  const navigate = useNavigate();

  const isCompleted = habit.completionStatus === 'Completed';
  const progressPercent = Math.min(
    100,
    Math.round(((habit.progressValue || 0) / (habit.targetValue || 1)) * 100)
  );

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
    onToggleStatus(habit._id);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    const nextVal = (habit.progressValue || 0) + 1;
    if (nextVal >= habit.targetValue && !isCompleted) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 }
      });
    }
    onUpdateProgress(habit._id, nextVal);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    const nextVal = Math.max(0, (habit.progressValue || 0) - 1);
    onUpdateProgress(habit._id, nextVal);
  };

  return (
    <div
      onClick={() => navigate(`/habits/${habit._id}`)}
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 hover:shadow-lg cursor-pointer overflow-hidden p-5 ${
        isCompleted
          ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Header: Category & Streaks & Status Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Tag className="w-3 h-3 text-slate-400" />
            {habit.category || 'Productivity'}
          </span>

          {(habit.currentStreak || 0) > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
              {habit.currentStreak}d Streak
            </span>
          )}
        </div>

        {/* Status Badge */}
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isCompleted
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
              : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Completed
            </>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              Pending
            </>
          )}
        </span>
      </div>

      {/* CORE INFORMATION BOX: Habit -> Date -> Target -> Status */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
          {habit.habit}
        </h3>

        <div className="grid grid-cols-2 gap-2 mt-2.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400">Date:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{habit.date}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
            <Target className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400">Target:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{habit.target}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Quick Adjustments */}
      <div className="mb-4 pt-1">
        <div className="flex items-center justify-between text-xs font-medium mb-1.5">
          <span className="text-slate-500 dark:text-slate-400">
            Progress:{' '}
            <strong className="text-slate-800 dark:text-slate-200">
              {habit.progressValue || 0} / {habit.targetValue || 1} {habit.unit}
            </strong>
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{progressPercent}%</span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : 'bg-gradient-to-r from-amber-500 to-emerald-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick Stepper for Progress */}
        <div className="flex items-center justify-end gap-1.5 mt-2">
          <button
            onClick={handleDecrement}
            title="Decrease progress"
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleIncrement}
            title="Increase progress"
            className="p-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {/* Quick Mark Complete Button */}
        <button
          onClick={handleToggle}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isCompleted
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isCompleted ? 'Mark Pending' : 'Mark Completed'}</span>
        </button>

        {/* Edit & Delete Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(habit);
            }}
            title="Edit Habit"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(habit);
            }}
            title="Delete Habit"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <div
            title="View Details"
            className="p-1.5 rounded-lg text-slate-400 group-hover:text-emerald-600 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
