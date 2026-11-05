const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// مسیر افزودن واژه جدید توسط مدیر
router.post('/admin/vocabulary/add', adminController.addVocabularyItem);

// مسیر تهیه پشتیبان دستی از پایگاه داده
router.post('/admin/backup', adminController.backupDatabase);

// مسیر دریافت گزارش وضعیت سلامت سرور و دیتابیس
router.get('/admin/server/health', adminController.getServerHealthStatus);

module.exports = router;
