const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

// فراخوانی تمام روت‌های ماژول‌ها
const contentRoutes = require('./routes/contentRoutes');
const module3Routes = require('./routes/module3Routes');
const quizRoutes = require('./routes/quizRoutes');
const aiRoutes = require('./routes/aiRoutes');
const interactiveRoutes = require('./routes/interactiveRoutes');

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

// اتصال تمام مسیرهای ماژول‌های آموزشی، هوش مصنوعی و امکانات تعاملی به اپلیکیشن
app.use('/api', contentRoutes);
app.use('/api', module3Routes);
app.use('/api', quizRoutes);
app.use('/api', aiRoutes);
app.use('/api', interactiveRoutes);

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
