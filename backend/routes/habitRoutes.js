const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/habitController');
const { protect } = require('../middleware/authMiddleware');

// All habit routes require JWT authentication
router.use(protect);

router.route('/')
  .post(createHabit)
  .get(getHabits);

router.get('/analytics/summary', getAnalyticsSummary);
router.get('/calendar/overview', getCalendarOverview);
router.post('/seed', seedDemoHabits);

router.route('/:id')
  .get(getHabitById)
  .put(updateHabit)
  .delete(deleteHabit);

router.patch('/:id/toggle', toggleHabitStatus);
router.patch('/:id/progress', updateProgress);

module.exports = router;
