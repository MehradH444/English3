const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// میان‌افزارهای امنیتی و پردازش داده‌ها
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// سرویس‌دهی به فایل‌های استاتیک فرانت‌اند
app.use(express.static(path.join(__dirname, '../public')));

// مسیر تست سلامت سرور
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'سرور پلتفرم آموزش انگلیسی پایه نهم (Prospect 3) با موفقیت فعال است.',
        timestamp: new Date().toISOString()
    });
});

// مدیریت خطاهای سراسری (Global Error Handler)
app.use((err, req, res, next) => {
    console.error('خطای سیستمی:', err.stack);
    res.status(500).json({
        status: 'error',
        message: 'یک خطای داخلی در سرور رخ داده است.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// راه‌اندازی سرور
app.listen(PORT, () => {
    console.log(`سرور روی پورت ${PORT} در حال اجراست...`);
});
