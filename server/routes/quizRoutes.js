const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// مسیر دریافت سؤالات و ساخت آزمون هوشمند
router.get('/quiz/generate', quizController.generateQuiz);

// مسیر ارسال و تصحیح پاسخ‌نامه آزمون
router.post('/quiz/submit', quizController.submitQuiz);

// مسیر دریافت دفترچه اشتباهات و نتایج آزمون‌های کاربر
router.get('/student/mistakes/:userId', quizController.getStudentMistakes);

module.exports = router;
