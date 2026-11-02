const express = require('express');
const router = express.Router();
const module3Controller = require('../controllers/module3Controller');

// مسیرهای مکالمات
router.get('/lessons/:lessonId/conversations', module3Controller.getConversationsByLesson);

// مسیرهای Reading
router.get('/lessons/:lessonId/reading', module3Controller.getReadingByLesson);

// مسیرهای Writing و تصحیح پاسخ
router.get('/lessons/:lessonId/writing', module3Controller.getWritingByLesson);
router.post('/writing/check/:exerciseId', module3Controller.checkWritingAnswer);

module.exports = router;
