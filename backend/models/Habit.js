const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  progressValue: {
    type: Number,
    default: 0
  },
  targetValue: {
    type: Number,
    default: 1
  },
  completedAt: {
    type: Date
  }
}, { _id: false });

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    habit: {
      type: String,
      required: [true, 'Please provide a habit name'],
      trim: true,
      maxlength: [100, 'Habit name cannot exceed 100 characters']
    },
    date: {
      type: String,
      required: [true, 'Please provide a date (YYYY-MM-DD)'],
      trim: true
    },
    target: {
      type: String,
      required: [true, 'Please specify the target (e.g., 30 minutes, 2 hours)'],
      trim: true
    },
    completionStatus: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending'
    },
    targetValue: {
      type: Number,
      default: 1,
      min: [1, 'Target value must be at least 1']
    },
    progressValue: {
      type: Number,
      default: 0,
      min: 0
    },
    unit: {
      type: String,
      default: 'times',
      trim: true
    },
    category: {
      type: String,
      enum: ['Health', 'Fitness', 'Study', 'Productivity', 'Mindfulness', 'Personal', 'Other'],
      default: 'Productivity'
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    bestStreak: {
      type: Number,
      default: 0
    },
    lastCompletedDate: {
      type: String,
      default: null
    },
    history: [historySchema],
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Compound index for fast queries by user and date
habitSchema.index({ userId: 1, date: 1 });
habitSchema.index({ userId: 1, completionStatus: 1 });

module.exports = mongoose.model('Habit', habitSchema);
