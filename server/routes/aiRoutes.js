const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// مسیر دستیار هوش مصنوعی (معلم خصوصی)
router.post('/ai/tutor', aiController.askAiTutor);

// مسیر مکالمه هوشمند و تمرین سناریو
router.post('/ai/conversation', aiController.smartConversation);

// مسیر تحلیل هوشمند عملکرد و گزارش پیشرفت
router.get('/ai/performance/:userId', aiController.analyzeStudentPerformance);

module.exports = router;
