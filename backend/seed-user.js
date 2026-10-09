const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Habit = require('./models/Habit');

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/habitflow';
    await mongoose.connect(mongoUri);
    console.log('[MongoDB Connected for Seeding]');

    const email = 'demo@habitflow.com';
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: 'Alex Hackathon',
        email,
        password: 'password123',
        role: 'user',
        reminderSettings: {
          enabled: true,
          time: '09:00'
        },
        themePreference: 'light'
      });
      console.log(`[Created Demo User] ${email} with password: password123`);
    } else {
      console.log(`[Demo User Exists] ${email}`);
    }

    // Check if habits exist for demo user
    const habitCount = await Habit.countDocuments({ userId: user._id });
    if (habitCount === 0) {
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

      const demoHabits = [
        {
          userId: user._id,
          habit: 'Morning Cardio & Exercise',
          target: '30 minutes',
          targetValue: 30,
          progressValue: 30,
          unit: 'minutes',
          category: 'Fitness',
          completionStatus: 'Completed',
          notes: 'Running and core bodyweight circuits',
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
          userId: user._id,
          habit: 'DSA & Algorithms Practice',
          target: '2 hours',
          targetValue: 2,
          progressValue: 1,
          unit: 'hours',
          category: 'Study',
          completionStatus: 'Pending',
          notes: 'Graphs and dynamic programming problems',
          date: todayStr,
          currentStreak: 5,
          bestStreak: 8,
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
          habit: 'Daily Water Intake',
          target: '8 glasses',
          targetValue: 8,
          progressValue: 8,
          unit: 'glasses',
          category: 'Health',
          completionStatus: 'Completed',
          notes: 'Stay hydrated for focus and health',
          date: todayStr,
          currentStreak: 6,
          bestStreak: 14,
          history: pastDates.map((d, idx) => ({
            date: d,
            status: idx === 2 ? 'Pending' : 'Completed',
            progressValue: idx === 2 ? 4 : 8,
            targetValue: 8,
            completedAt: idx === 2 ? undefined : new Date(d)
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
          notes: 'Designing Data-Intensive Applications',
          date: todayStr,
          currentStreak: 3,
          bestStreak: 7,
          history: pastDates.map((d, idx) => ({
            date: d,
            status: idx >= 4 ? (idx === 6 ? 'Pending' : 'Completed') : 'Completed',
            progressValue: idx === 6 ? 10 : 20,
            targetValue: 20,
            completedAt: idx === 6 ? undefined : new Date(d)
          }))
        },
        {
          userId: user._id,
          habit: 'Evening Meditation & Journaling',
          target: '15 minutes',
          targetValue: 15,
          progressValue: 15,
          unit: 'minutes',
          category: 'Mindfulness',
          completionStatus: 'Completed',
          notes: 'Reflection and gratitude journaling',
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

      await Habit.insertMany(demoHabits);
      console.log(`[Seeded 5 Initial Habits for Demo User]`);
    }

    console.log('[Seeding Completed Successfully]');
    process.exit(0);
  } catch (err) {
    console.error('[Seeding Error]', err);
    process.exit(1);
  }
};

seedDatabase();
