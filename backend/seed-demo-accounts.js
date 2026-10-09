const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Habit = require('./models/Habit');

dotenv.config();

const DEMO_ACCOUNTS = [
  {
    name: 'Demo User 1',
    email: 'demo1@habitflow.com',
    password: 'Demo@123',
    role: 'user',
    reminderSettings: { enabled: true, time: '08:00' },
    themePreference: 'light'
  },
  {
    name: 'Demo User 2',
    email: 'demo2@habitflow.com',
    password: 'Demo@456',
    role: 'user',
    reminderSettings: { enabled: true, time: '09:00' },
    themePreference: 'dark'
  }
];

const seedDemoAccounts = async () => {
  try {
    await connectDB();
    console.log('[Seed] Connected to database');

    const today = new Date();
    const formatDate = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    const pastDates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      pastDates.push(formatDate(d));
    }
    const todayStr = formatDate(today);

    for (const demoData of DEMO_ACCOUNTS) {
      let user = await User.findOne({ email: demoData.email });

      if (!user) {
        // Password hashing is performed automatically by User pre('save') hook
        user = await User.create({
          name: demoData.name,
          email: demoData.email,
          password: demoData.password,
          role: demoData.role,
          reminderSettings: demoData.reminderSettings,
          themePreference: demoData.themePreference
        });
        console.log(`[Seed] Created account: ${demoData.email}`);
      } else {
        console.log(`[Seed] Account already exists (idempotent, preserved): ${demoData.email}`);
      }

      // Check if user has habits seeded so each account has distinct isolated habits
      const existingHabits = await Habit.countDocuments({ userId: user._id });
      if (existingHabits === 0) {
        const habitsForUser = demoData.email === 'demo1@habitflow.com' ? [
          {
            userId: user._id,
            habit: 'Morning 5km Run & Cardio',
            target: '30 mins',
            targetValue: 30,
            progressValue: 30,
            unit: 'mins',
            category: 'Fitness',
            completionStatus: 'Completed',
            notes: 'Pace: 5:20/km around the park',
            date: todayStr,
            currentStreak: 7,
            bestStreak: 14,
            history: pastDates.map((d) => ({
              date: d,
              status: 'Completed',
              progressValue: 30,
              targetValue: 30,
              completedAt: new Date(d)
            }))
          },
          {
            userId: user._id,
            habit: 'System Architecture & LeetCode',
            target: '2 hours',
            targetValue: 2,
            progressValue: 1,
            unit: 'hours',
            category: 'Study',
            completionStatus: 'Pending',
            notes: 'Distributed systems and caching patterns',
            date: todayStr,
            currentStreak: 4,
            bestStreak: 9,
            history: pastDates.map((d, idx) => ({
              date: d,
              status: idx === 6 ? 'Pending' : 'Completed',
              progressValue: idx === 6 ? 1 : 2,
              targetValue: 2,
              completedAt: idx === 6 ? undefined : new Date(d)
            }))
          },
          {
            userId: user._id,
            habit: 'Drink 3L Hydration Goal',
            target: '8 glasses',
            targetValue: 8,
            progressValue: 8,
            unit: 'glasses',
            category: 'Health',
            completionStatus: 'Completed',
            notes: 'Maintained optimal hydration during the day',
            date: todayStr,
            currentStreak: 5,
            bestStreak: 12,
            history: pastDates.map((d, idx) => ({
              date: d,
              status: idx === 2 ? 'Pending' : 'Completed',
              progressValue: idx === 2 ? 4 : 8,
              targetValue: 8,
              completedAt: idx === 2 ? undefined : new Date(d)
            }))
          }
        ] : [
          {
            userId: user._id,
            habit: 'Deep Work Session',
            target: '90 mins',
            targetValue: 90,
            progressValue: 90,
            unit: 'mins',
            category: 'Productivity',
            completionStatus: 'Completed',
            notes: 'Focused coding with notifications silenced',
            date: todayStr,
            currentStreak: 6,
            bestStreak: 10,
            history: pastDates.map((d) => ({
              date: d,
              status: 'Completed',
              progressValue: 90,
              targetValue: 90,
              completedAt: new Date(d)
            }))
          },
          {
            userId: user._id,
            habit: 'Evening Meditation & Journaling',
            target: '15 mins',
            targetValue: 15,
            progressValue: 15,
            unit: 'mins',
            category: 'Mindfulness',
            completionStatus: 'Completed',
            notes: 'Reflection on goals and mindfulness breathing',
            date: todayStr,
            currentStreak: 8,
            bestStreak: 15,
            history: pastDates.map((d) => ({
              date: d,
              status: 'Completed',
              progressValue: 15,
              targetValue: 15,
              completedAt: new Date(d)
            }))
          },
          {
            userId: user._id,
            habit: 'Read Technical Book',
            target: '20 pages',
            targetValue: 20,
            progressValue: 10,
            unit: 'pages',
            category: 'Study',
            completionStatus: 'Pending',
            notes: 'Clean Code principles chapter 7',
            date: todayStr,
            currentStreak: 3,
            bestStreak: 8,
            history: pastDates.map((d, idx) => ({
              date: d,
              status: idx === 6 ? 'Pending' : 'Completed',
              progressValue: idx === 6 ? 10 : 20,
              targetValue: 20,
              completedAt: idx === 6 ? undefined : new Date(d)
            }))
          }
        ];

        await Habit.insertMany(habitsForUser);
        console.log(`[Seed] Seeded habits for ${demoData.email}`);
      } else {
        console.log(`[Seed] User ${demoData.email} already has ${existingHabits} habits`);
      }
    }

    console.log('[Seed] All demo accounts and habits ready!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDemoAccounts();
