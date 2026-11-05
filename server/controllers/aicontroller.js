const db = require('../config/db');

// ۱. دستیار خصوصی هوش مصنوعی (پاسخ به سوالات آموزشی و گرامری)
exports.askAiTutor = (req, res) => {
    const { question, topic } = req.body;

    if (!question) {
        return res.status(400).json({ status: 'error', message: 'لطفاً پرسش خود را وارد کنید.' });
    }

    // شبیه‌سازی پاسخ تخصصی معلم هوش مصنوعی برای کتاب Prospect 3 پایه نهم
    // در نسخه نهایی، این بخش به API مدل هوش مصنوعی متصل می‌شود.
    let aiResponse = `سلام! به عنوان معلم خصوصی هوش مصنوعی کتاب Prospect 3، در پاسخ به پرسش شما درباره "${topic || 'درس'}":\n`;
    
    if (question.includes('گرامر') || question.includes('grammar')) {
        aiResponse += `در گرامر زبان انگلیسی پایه نهم، دقت به فرمول جملات و افعال کمکی بسیار مهم است. برای این مبحث، همیشه به فاعل و زمان جمله توجه کنید.`;
    } else if (question.includes('معنی') || question.includes('کلمه')) {
        aiResponse += `برای یادگیری بهتر واژگان جدید، استفاده از فلش‌کارت‌ها و ساخت جملات مثال‌زدنی بهترین روش است.`;
    } else {
        aiResponse += `نکته آموزشی مهم: کتاب Prospect 3 بر تقویت مکالمه روزمره و ساختارهای پایه‌ای تمرکز دارد. تلاش کنید مثال‌های مشابه بسازید تا مبحث کاملاً ملکه ذهنتان شود.`;
    }

    res.status(200).json({
        status: 'success',
        question: question,
        aiAnswer: aiResponse,
        timestamp: new Date().toISOString()
    });
};

// ۲. مکالمه هوشمند (تمرین سناریوهای روزمره با هوش مصنوعی)
exports.smartConversation = (req, res) => {
    const { scenario, userMessage } = req.body;

    if (!userMessage) {
        return res.status(400).json({ status: 'error', message: 'پیام کاربر الزامی است.' });
    }

    // پاسخ متناسب با سناریوی تمرینی مکالمه
    let botReply = `آفرین! جمله شما از نظر ساختاری خوب بود. `;
    let feedback = `پیشنهاد: می‌توانید از کلمات جایگزین هم استفاده کنید.`;

    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        botReply += `Hello! How can I help you today with your travel plans?`;
    } else {
        botReply += `That's interesting! Tell me more about your experience in this lesson.`;
    }

    res.status(200).json({
        status: 'success',
        scenario: scenario || 'General Practice',
        userMessage: userMessage,
        botReply: botReply,
        grammaticalFeedback: feedback
    });
};

// ۳. تحلیل هوشمند عملکرد دانش‌آموز و تخمین آمادگی امتحان
exports.analyzeStudentPerformance = (req, res) => {
    const userId = req.params.userId || 1;

    const query = `SELECT * FROM student_results WHERE user_id = ? ORDER BY created_at DESC`;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }

        if (rows.length === 0) {
            return res.status(200).json({
                status: 'success',
                message: 'هنوز داده کافی برای تحلیل عملکرد ثبت نشده است.',
                stats: { totalTests: 0, averageScore: 0, readinessIndex: 'نامشخص' }
            });
        }

        let totalScore = 0;
        rows.forEach(r => totalScore += r.score);
        const averageScore = parseFloat((totalScore / rows.length).toFixed(2));

        // محاسبه شاخص آمادگی امتحان
        let readiness = 'نیاز به تلاش بیشتر';
        if (averageScore >= 17) {
            readiness = 'عالی و آماده برای امتحانات نهایی';
        } else if (averageScore >= 14) {
            readiness = 'خوب و متوسط - با چند مرور دیگر مسلط می‌شوید';
        }

        res.status(200).json({
            status: 'success',
            stats: {
                totalTests: rows.length,
                averageScore: averageScore,
                readinessIndex: readiness,
                latestResult: rows[0]
            }
        });
    });
};
