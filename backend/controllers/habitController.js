const Habit = require('../models/Habit');

// Helper: Format date as YYYY-MM-DD in local context
const formatDateString = (dateObj) => {
  const d = new Date(dateObj);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper: Calculate streak from history
const calculateStreaks = (history) => {
  if (!history || history.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Get unique completed dates sorted ascending
  const completedDates = Array.from(
    new Set(
      history
        .filter((h) => h.status === 'Completed')
        .map((h) => h.date)
    )
  ).sort();

  if (completedDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  let bestStreak = 1;
  let currentRun = 1;

  for (let i = 1; i < completedDates.length; i++) {
    const prev = new Date(completedDates[i - 1]);
    const curr = new Date(completedDates[i]);
    const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentRun++;
      if (currentRun > bestStreak) {
        bestStreak = currentRun;
      }
    } else if (diffDays > 1) {
      currentRun = 1;
    }
  }

  // Calculate current streak relative to today
  const todayStr = formatDateString(new Date());
  const yesterdayObj = new Date();
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yesterdayStr = formatDateString(yesterdayObj);

  const lastCompleted = completedDates[completedDates.length - 1];
  let currentStreak = 0;

  if (lastCompleted === todayStr || lastCompleted === yesterdayStr) {
    let streakCount = 1;
    for (let i = completedDates.length - 1; i > 0; i--) {
      const curr = new Date(completedDates[i]);
      const prev = new Date(completedDates[i - 1]);
      const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streakCount++;
      } else {
        break;
      }
    }
    currentStreak = streakCount;
  }

  return {
    currentStreak: Math.max(currentStreak, currentRun),
    bestStreak: Math.max(bestStreak, currentStreak, currentRun),
    lastCompletedDate: lastCompleted
  };
};

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req, res) => {
  try {
    const {
      habit,
      date,
      target,
      completionStatus = 'Pending',
      targetValue = 1,
      progressValue = 0,
      unit = 'times',
      category = 'Productivity',
      notes = ''
    } = req.body;

    if (!habit || !date || !target) {
      return res.status(400).json({
        success: false,
        message: 'Please provide habit name, date, and target'
      });
    }

    const isCompleted = completionStatus === 'Completed';
    const effectiveProgress = isCompleted ? (progressValue || targetValue) : progressValue;

    const initialHistory = [
      {
        date,
        status: completionStatus,
        progressValue: effectiveProgress,
        targetValue,
        completedAt: isCompleted ? new Date() : undefined
      }
    ];

    const initialStreaks = isCompleted
      ? { currentStreak: 1, bestStreak: 1, lastCompletedDate: date }
      : { currentStreak: 0, bestStreak: 0, lastCompletedDate: null };

    const newHabit = await Habit.create({
      userId: req.user._id,
      habit: habit.trim(),
      date,
      target: target.trim(),
      completionStatus,
      targetValue: Number(targetValue) || 1,
      progressValue: Number(effectiveProgress) || 0,
      unit: unit.trim() || 'times',
      category: category || 'Productivity',
      notes: notes.trim(),
      currentStreak: initialStreaks.currentStreak,
      bestStreak: initialStreaks.bestStreak,
      lastCompletedDate: initialStreaks.lastCompletedDate,
      history: initialHistory
    });

    return res.status(201).json({
      success: true,
      message: 'Habit created successfully',
      data: newHabit
    });
  } catch (error) {
    console.error('[Create Habit Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating habit'
    });
  }
};

// @desc    Get all habits for logged-in user with search & filter
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res) => {
  try {
    const { search, status, date, category, sortBy } = req.query;

    const query = { userId: req.user._id };

    if (search) {
      query.habit = { $regex: search, $options: 'i' };
    }

    if (status && (status === 'Completed' || status === 'Pending')) {
      query.completionStatus = status;
    }

    if (date) {
      query.date = date;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    let sortCriteria = { date: -1, createdAt: -1 };
    if (sortBy === 'date-asc') sortCriteria = { date: 1, createdAt: 1 };
    if (sortBy === 'habit-asc') sortCriteria = { habit: 1 };
    if (sortBy === 'streak-desc') sortCriteria = { currentStreak: -1 };
    if (sortBy === 'created-desc') sortCriteria = { createdAt: -1 };

    const habits = await Habit.find(query).sort(sortCriteria);

    return res.status(200).json({
      success: true,
      count: habits.length,
      data: habits
    });
  } catch (error) {
    console.error('[Get Habits Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching habits'
    });
  }
};

// @desc    Get single habit by ID
// @route   GET /api/habits/:id
// @access  Private
const getHabitById = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: habit
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching habit'
    });
  }
};

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    const {
      habit: habitName,
      date,
      target,
      completionStatus,
      targetValue,
      progressValue,
      unit,
      category,
      notes
    } = req.body;

    if (habitName) habit.habit = habitName.trim();
    if (date) habit.date = date;
    if (target) habit.target = target.trim();
    if (unit) habit.unit = unit.trim();
    if (category) habit.category = category;
    if (notes !== undefined) habit.notes = notes.trim();
    if (targetValue !== undefined) habit.targetValue = Number(targetValue);
    if (progressValue !== undefined) habit.progressValue = Number(progressValue);

    if (completionStatus) {
      habit.completionStatus = completionStatus;
    }

    // Update history for this habit's date
    const historyIndex = habit.history.findIndex((h) => h.date === habit.date);
    if (historyIndex >= 0) {
      habit.history[historyIndex].status = habit.completionStatus;
      habit.history[historyIndex].progressValue = habit.progressValue;
      habit.history[historyIndex].targetValue = habit.targetValue;
      if (habit.completionStatus === 'Completed') {
        habit.history[historyIndex].completedAt = new Date();
      }
    } else {
      habit.history.push({
        date: habit.date,
        status: habit.completionStatus,
        progressValue: habit.progressValue,
        targetValue: habit.targetValue,
        completedAt: habit.completionStatus === 'Completed' ? new Date() : undefined
      });
    }

    // Recalculate streaks
    const streaks = calculateStreaks(habit.history);
    habit.currentStreak = streaks.currentStreak;
    habit.bestStreak = streaks.bestStreak;
    habit.lastCompletedDate = streaks.lastCompletedDate;

    const updatedHabit = await habit.save();

    return res.status(200).json({
      success: true,
      message: 'Habit updated successfully',
      data: updatedHabit
    });
  } catch (error) {
    console.error('[Update Habit Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating habit'
    });
  }
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found or unauthorized'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Habit deleted successfully',
      data: { _id: req.params.id }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting habit'
    });
  }
};

// @desc    Toggle completion status (Quick Mark Complete / Pending)
// @route   PATCH /api/habits/:id/toggle
// @access  Private
const toggleHabitStatus = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    const nextStatus = habit.completionStatus === 'Completed' ? 'Pending' : 'Completed';
    habit.completionStatus = nextStatus;

    if (nextStatus === 'Completed') {
      habit.progressValue = habit.targetValue;
    } else {
      habit.progressValue = 0;
    }

    // Update history record
    const targetDate = habit.date;
    const historyIndex = habit.history.findIndex((h) => h.date === targetDate);
    if (historyIndex >= 0) {
      habit.history[historyIndex].status = nextStatus;
      habit.history[historyIndex].progressValue = habit.progressValue;
      if (nextStatus === 'Completed') {
        habit.history[historyIndex].completedAt = new Date();
      }
    } else {
      habit.history.push({
        date: targetDate,
        status: nextStatus,
        progressValue: habit.progressValue,
        targetValue: habit.targetValue,
        completedAt: nextStatus === 'Completed' ? new Date() : undefined
      });
    }

    const streaks = calculateStreaks(habit.history);
    habit.currentStreak = streaks.currentStreak;
    habit.bestStreak = streaks.bestStreak;
    habit.lastCompletedDate = streaks.lastCompletedDate;

    const updated = await habit.save();

    return res.status(200).json({
      success: true,
      message: `Habit marked as ${nextStatus}`,
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error toggling habit'
    });
  }
};

// @desc    Update habit numerical progress
// @route   PATCH /api/habits/:id/progress
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const { progressValue } = req.body;
    if (progressValue === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide progressValue'
      });
    }

    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    const numProgress = Math.max(0, Number(progressValue));
    habit.progressValue = numProgress;

    if (numProgress >= habit.targetValue) {
      habit.completionStatus = 'Completed';
    } else {
      habit.completionStatus = 'Pending';
    }

    const historyIndex = habit.history.findIndex((h) => h.date === habit.date);
    if (historyIndex >= 0) {
      habit.history[historyIndex].status = habit.completionStatus;
      habit.history[historyIndex].progressValue = numProgress;
      if (habit.completionStatus === 'Completed') {
        habit.history[historyIndex].completedAt = new Date();
      }
    } else {
      habit.history.push({
        date: habit.date,
        status: habit.completionStatus,
        progressValue: numProgress,
        targetValue: habit.targetValue,
        completedAt: habit.completionStatus === 'Completed' ? new Date() : undefined
      });
    }

    const streaks = calculateStreaks(habit.history);
    habit.currentStreak = streaks.currentStreak;
    habit.bestStreak = streaks.bestStreak;
    habit.lastCompletedDate = streaks.lastCompletedDate;

    const updated = await habit.save();

    return res.status(200).json({
      success: true,
      message: 'Progress updated',
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating progress'
    });
  }
};

// @desc    Get weekly and monthly analytics summary
// @route   GET /api/habits/analytics/summary
// @access  Private
const getAnalyticsSummary = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id });

    const totalHabits = habits.length;
    const completedHabits = habits.filter((h) => h.completionStatus === 'Completed').length;
    const pendingHabits = habits.filter((h) => h.completionStatus === 'Pending').length;
    const overallRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

    // Past 7 days calculation
    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      last7Days.push(formatDateString(d));
    }

    const weeklyTrend = last7Days.map((dateStr) => {
      let completedCount = 0;
      let totalCount = 0;

      habits.forEach((habit) => {
        // Check date matching or history matching
        if (habit.date === dateStr) {
          totalCount++;
          if (habit.completionStatus === 'Completed') completedCount++;
        } else {
          const hist = habit.history.find((h) => h.date === dateStr);
          if (hist) {
            totalCount++;
            if (hist.status === 'Completed') completedCount++;
          }
        }
      });

      const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
      return {
        date: dateStr,
        day: dayName,
        completed: completedCount,
        total: totalCount,
        percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
      };
    });

    const weeklyCompletedCount = weeklyTrend.reduce((sum, item) => sum + item.completed, 0);
    const weeklyTotalCount = weeklyTrend.reduce((sum, item) => sum + item.total, 0);
    const weeklyRate = weeklyTotalCount > 0 ? Math.round((weeklyCompletedCount / weeklyTotalCount) * 100) : 0;

    // Category breakdown
    const categoryStats = {};
    habits.forEach((h) => {
      const cat = h.category || 'Productivity';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { total: 0, completed: 0 };
      }
      categoryStats[cat].total++;
      if (h.completionStatus === 'Completed') {
        categoryStats[cat].completed++;
      }
    });

    // Best and Current streaks across all habits
    const bestStreakAcross = habits.reduce((max, h) => Math.max(max, h.bestStreak || 0), 0);
    const activeStreaksCount = habits.filter((h) => (h.currentStreak || 0) > 0).length;

    return res.status(200).json({
      success: true,
      data: {
        totalHabits,
        completedHabits,
        pendingHabits,
        overallRate,
        weeklyRate,
        weeklyTrend,
        categoryStats,
        bestStreakAcross,
        activeStreaksCount
      }
    });
  } catch (error) {
    console.error('[Analytics Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error generating analytics'
    });
  }
};

// @desc    Get calendar overview with date-by-date habit statuses
// @route   GET /api/habits/calendar/overview
// @access  Private
const getCalendarOverview = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id });

    // Build a map of dates to items
    const calendarMap = {};

    habits.forEach((habit) => {
      // Record base habit date
      if (!calendarMap[habit.date]) {
        calendarMap[habit.date] = [];
      }
      calendarMap[habit.date].push({
        habitId: habit._id,
        habit: habit.habit,
        target: habit.target,
        status: habit.completionStatus,
        progressValue: habit.progressValue,
        targetValue: habit.targetValue,
        unit: habit.unit,
        category: habit.category
      });

      // Also record history dates
      if (habit.history && habit.history.length > 0) {
        habit.history.forEach((hist) => {
          if (hist.date !== habit.date) {
            if (!calendarMap[hist.date]) {
              calendarMap[hist.date] = [];
            }
            // Avoid duplicate entry for same habit
            const exists = calendarMap[hist.date].some((item) => String(item.habitId) === String(habit._id));
            if (!exists) {
              calendarMap[hist.date].push({
                habitId: habit._id,
                habit: habit.habit,
                target: habit.target,
                status: hist.status,
                progressValue: hist.progressValue,
                targetValue: hist.targetValue,
                unit: habit.unit,
                category: habit.category
              });
            }
          }
        });
      }
    });

    // Summary per date
    const summaryByDate = {};
    Object.keys(calendarMap).forEach((dateStr) => {
      const items = calendarMap[dateStr];
      const total = items.length;
      const completed = items.filter((i) => i.status === 'Completed').length;
      const pending = total - completed;

      let status = 'missed';
      if (completed === total && total > 0) status = 'completed';
      else if (completed > 0) status = 'partial';
      else status = 'pending';

      summaryByDate[dateStr] = {
        date: dateStr,
        total,
        completed,
        pending,
        status,
        habits: items
      };
    });

    return res.status(200).json({
      success: true,
      data: summaryByDate
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error generating calendar overview'
    });
  }
};

// @desc    Seed demo habits with realistic history for hackathon presentation
// @route   POST /api/habits/seed
// @access  Private
const seedDemoHabits = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if user already has habits
    const existingCount = await Habit.countDocuments({ userId });
    if (existingCount > 0) {
      // Clear existing habits if requested
      if (req.body.clearExisting) {
        await Habit.deleteMany({ userId });
      } else {
        return res.status(400).json({
          success: false,
          message: 'You already have habits. Pass { "clearExisting": true } to replace them with demo data.'
        });
      }
    }

    const today = new Date();
    const todayStr = formatDateString(today);

    // Generate date sequence for past 7 days
    const pastDates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      pastDates.push(formatDateString(d));
    }

    const demoHabitsData = [
      {
        habit: 'Morning Workout & Stretching',
        target: '30 minutes',
        targetValue: 30,
        progressValue: 30,
        unit: 'minutes',
        category: 'Fitness',
        completionStatus: 'Completed',
        notes: 'Cardio and core stretch routine',
        date: todayStr,
        currentStreak: 7,
        bestStreak: 12,
        history: pastDates.map((d) => ({
          date: d,
          status: 'Completed',
          progressValue: 30,
          targetValue: 30,
          completedAt: new Date(d)
        }))
      },
      {
        habit: 'Read Technical Books',
        target: '20 pages',
        targetValue: 20,
        progressValue: 15,
        unit: 'pages',
        category: 'Study',
        completionStatus: 'Pending',
        notes: 'System Design Interview & MERN patterns',
        date: todayStr,
        currentStreak: 5,
        bestStreak: 8,
        history: pastDates.map((d, idx) => ({
          date: d,
          status: idx === 6 ? 'Pending' : 'Completed',
          progressValue: idx === 6 ? 15 : 20,
          targetValue: 20,
          completedAt: idx === 6 ? undefined : new Date(d)
        }))
      },
      {
        habit: 'Hydrate Daily',
        target: '8 glasses',
        targetValue: 8,
        progressValue: 8,
        unit: 'glasses',
        category: 'Health',
        completionStatus: 'Completed',
        notes: 'Stay hydrated for focus and stamina',
        date: todayStr,
        currentStreak: 6,
        bestStreak: 14,
        history: pastDates.map((d, idx) => ({
          date: d,
          status: idx === 1 ? 'Pending' : 'Completed',
          progressValue: idx === 1 ? 4 : 8,
          targetValue: 8,
          completedAt: idx === 1 ? undefined : new Date(d)
        }))
      },
      {
        habit: 'DSA Problem Solving',
        target: '2 problems',
        targetValue: 2,
        progressValue: 1,
        unit: 'problems',
        category: 'Study',
        completionStatus: 'Pending',
        notes: 'Dynamic programming and graph practice',
        date: todayStr,
        currentStreak: 3,
        bestStreak: 5,
        history: pastDates.map((d, idx) => ({
          date: d,
          status: idx >= 4 ? (idx === 6 ? 'Pending' : 'Completed') : 'Completed',
          progressValue: idx === 6 ? 1 : 2,
          targetValue: 2,
          completedAt: idx === 6 ? undefined : new Date(d)
        }))
      },
      {
        habit: 'Evening Meditation & Gratitude',
        target: '15 minutes',
        targetValue: 15,
        progressValue: 15,
        unit: 'minutes',
        category: 'Mindfulness',
        completionStatus: 'Completed',
        notes: 'Mindful breathing and reflection journal',
        date: todayStr,
        currentStreak: 4,
        bestStreak: 9,
        history: pastDates.map((d, idx) => ({
          date: d,
          status: idx >= 3 ? 'Completed' : 'Pending',
          progressValue: idx >= 3 ? 15 : 5,
          targetValue: 15,
          completedAt: idx >= 3 ? new Date(d) : undefined
        }))
      }
    ];

    const createdList = await Habit.insertMany(
      demoHabitsData.map((h) => ({
        ...h,
        userId
      }))
    );

    return res.status(201).json({
      success: true,
      message: 'Successfully seeded 5 demo habits with realistic history and streaks!',
      count: createdList.length,
      data: createdList
    });
  } catch (error) {
    console.error('[Seed Habits Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error seeding demo habits'
    });
  }
};

module.exports = {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  toggleHabitStatus,
  updateProgress,
  getAnalyticsSummary,
  getCalendarOverview,
  seedDemoHabits
};
