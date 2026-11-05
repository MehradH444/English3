const express = require('express');
const router = express.Router();
const interactiveController = require('../controllers/interactiveController');

// مسیر ثبت امتیاز بازی‌های آموزشی
router.post('/games/score', interactiveController.saveGameScore);

// مسیر تحلیل در آزمایشگاه زبان (تلفظ و جمله)
router.post('/lab/analyze', interactiveController.languageLabAnalyze);

// مسیر پنل معلم و والدین
router.get('/dashboard/:role/:id', interactiveController.getTeacherOrParentDashboard);

module.exports = router;
