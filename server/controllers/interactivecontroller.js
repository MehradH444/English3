const db = require('../config/db');

// ۱. بازی‌های آموزشی (ثبت امتیاز بازی واژگان یا گرامر)
exports.saveGameScore = (req, res) => {
    const { userId, gameName, score } = req.body;

    if (!gameName || score === undefined) {
        return res.status(400).json({ status: 'error', message: 'اطلاعات بازی ناقص است.' });
    }

    // ذخیره امتیاز بازی در جدول نتایج یا جداول امتیازات
    const query = `INSERT INTO student_results (user_id, test_type, score, total_questions, wrong_answers_json) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [userId || 1, `game_${gameName}`, score, 20, JSON.stringify([])], function(err) {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        res.status(200).json({
            status: 'success',
            message: 'امتیاز بازی با موفقیت ثبت شد.',
            gameScore: score
        });
    });
};

// ۲. آزمایشگاه زبان (شبیه‌سازی بررسی تلفظ و ساختار جمله)
exports.languageLabAnalyze = (req, res) => {
    const { sentence, audioText } = req.body;

    if (!sentence && !audioText) {
        return res.status(400).json({ status: 'error', message: 'متن یا صوت برای تحلیل ارسال نشده است.' });
    }

    // شبیه‌سازی تحلیل آزمایشگاه زبان (تلفظ و گرامر)
    res.status(200).json({
        status: 'success',
        inputProvided: sentence || audioText,
        pronunciationScore: 92, // درصد تطابق تلفظ
        grammarCorrectness: true,
        feedback: 'تلفظ کلمات واضح و آهنگ کلام (Intonation) صحیح بود. آفرین!'
    });
};

// ۳. پنل معلم و والدین (مشاهده وضعیت پیشرفت کلاس یا فرزند)
exports.getTeacherOrParentDashboard = (req, res) => {
    const role = req.params.role; // 'teacher' یا 'parent'
    const targetId = req.params.id || 1;

    // بازیابی آخرین فعالیت‌ها و میانگین نمرات دانش‌آموزان تحت نظارت
    const query = `SELECT u.full_name, sr.test_type, sr.score, sr.created_at 
                   FROM student_results sr 
                   JOIN users u ON sr.user_id = u.id 
                   ORDER BY sr.created_at DESC LIMIT 10`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }

        res.status(200).json({
            status: 'success',
            dashboardRole: role,
            monitoredRecords: rows
        });
    });
};
