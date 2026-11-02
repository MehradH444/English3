const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// مسیر دریافت تمام دروس
router.get('/lessons', contentController.getAllLessons);

// مسیر دریافت واژگان یک درس
router.get('/lessons/:lessonId/vocabulary', contentController.getVocabularyByLesson);

// مسیر دریافت گرامر یک درس
router.get('/lessons/:lessonId/grammar', contentController.getGrammarByLesson);

// مسیر جستجوی واژگان
router.get('/vocabulary/search', contentController.searchVocabulary);

module.exports = router;
