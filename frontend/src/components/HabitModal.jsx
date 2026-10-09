import React, { useState, useEffect } from 'react';
import { X, Calendar, Target, CheckCircle, Tag, FileText, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'Productivity',
  'Study',
  'Fitness',
  'Health',
  'Mindfulness',
  'Personal',
  'Other'
];

const COMMON_UNITS = ['minutes', 'hours', 'glasses', 'pages', 'problems', 'times'];

const HabitModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const isEditing = !!initialData;

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    habit: '',
    date: todayStr,
    target: '',
    targetValue: 1,
    progressValue: 0,
    unit: 'minutes',
    completionStatus: 'Pending',
    category: 'Productivity',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        habit: initialData.habit || '',
        date: initialData.date || todayStr,
        target: initialData.target || '',
        targetValue: initialData.targetValue || 1,
        progressValue: initialData.progressValue || 0,
        unit: initialData.unit || 'minutes',
        completionStatus: initialData.completionStatus || 'Pending',
        category: initialData.category || 'Productivity',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        habit: '',
        date: todayStr,
        target: '',
        targetValue: 1,
        progressValue: 0,
        unit: 'minutes',
        completionStatus: 'Pending',
        category: 'Productivity',
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      // Auto update target string if user modifies targetValue or unit
      if (name === 'targetValue' || name === 'unit') {
        const val = name === 'targetValue' ? value : prev.targetValue;
        const u = name === 'unit' ? value : prev.unit;
        if (val && u) {
          next.target = `${val} ${u}`;
        }
      }

      // If user marks completed, auto set progressValue = targetValue
      if (name === 'completionStatus' && value === 'Completed') {
        next.progressValue = next.targetValue || 1;
      }
      return next;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleQuickPreset = (presetHabit, presetTarget, presetVal, presetUnit, presetCat) => {
    setFormData((prev) => ({
      ...prev,
      habit: presetHabit,
      target: presetTarget,
      targetValue: presetVal,
      unit: presetUnit,
      category: presetCat
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.habit.trim()) {
      newErrors.habit = 'Habit name is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.target.trim()) {
      newErrors.target = 'Target is required (e.g. 30 minutes, 2 hours)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Habit Record' : 'Add New Habit'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage Habit → Date → Target → Completion Status
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick presets for college hackathon demo if creating new */}
        {!isEditing && (
          <div className="px-6 pt-3">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Quick Hackathon Presets:
            </p>
            <div className="flex gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleQuickPreset('Study DSA & Algorithms', '2 hours', 2, 'hours', 'Study')}
                className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 transition-colors"
              >
                📚 Study (2 hrs)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('Morning Exercise', '30 minutes', 30, 'minutes', 'Fitness')}
                className="text-xs px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-950/40 dark:text-teal-300 transition-colors"
              >
                🏃 Exercise (30m)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('Drink Water', '8 glasses', 8, 'glasses', 'Health')}
                className="text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 transition-colors"
              >
                💧 Water (8 gl)
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Habit Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Habit Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="habit"
              value={formData.habit}
              onChange={handleChange}
              placeholder="e.g. Exercise, Study, Read Books"
              className={`w-full px-3.5 py-2 rounded-xl text-sm border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.habit
                  ? 'border-rose-400 dark:border-rose-600'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {errors.habit && <p className="text-xs text-rose-500 mt-1">{errors.habit}</p>}
          </div>

          {/* Date & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-slate-400" />
                Target Description <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="target"
                value={formData.target}
                onChange={handleChange}
                placeholder="e.g. 30 minutes, 2 hours"
                className={`w-full px-3 py-2 rounded-xl text-sm border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.target
                    ? 'border-rose-400 dark:border-rose-600'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {errors.target && <p className="text-xs text-rose-500 mt-1">{errors.target}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Qty
              </label>
              <input
                type="number"
                min="1"
                name="targetValue"
                value={formData.targetValue}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Progress & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Progress Value
              </label>
              <input
                type="number"
                min="0"
                name="progressValue"
                value={formData.progressValue}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Unit
              </label>
              <input
                type="text"
                list="unit-suggestions"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="minutes, glasses, etc."
                className="w-full px-3 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <datalist id="unit-suggestions">
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Completion Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
              Completion Status <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    completionStatus: 'Pending',
                    progressValue: prev.progressValue === prev.targetValue ? 0 : prev.progressValue
                  }))
                }
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  formData.completionStatus === 'Pending'
                    ? 'border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700 ring-2 ring-amber-400/40'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                ⏳ Pending
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    completionStatus: 'Completed',
                    progressValue: prev.targetValue || 1
                  }))
                }
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  formData.completionStatus === 'Completed'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/40'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                ✅ Completed
              </button>
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              rows="2"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add personal motivation, strategy, or notes..."
              className="w-full px-3 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Create Habit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitModal;
