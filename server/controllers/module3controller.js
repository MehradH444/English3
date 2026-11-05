const db = require('../config/db');

// دریافت مکالمات یک درس
exports.getConversationsByLesson = (req, res) => {
    const lessonId = req.params.lessonId;
    const query = `SELECT * FROM conversations WHERE lesson_id = ?`;
    db.all(query, [lessonId], (err, rows) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        res.status(200).json({ status: 'success', data: rows });
    });
};

// دریافت متون Reading و درک مطلب یک درس
exports.getReadingByLesson = (req, res) => {
    const lessonId = req.params.lessonId;
    const query = `SELECT * FROM readings WHERE lesson_id = ?`;
    db.all(query, [lessonId], (err, rows) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        const formattedRows = rows.map(item => ({
            ...item,
            questions: item.questions_json ? JSON.parse(item.questions_json) : []
        }));
        res.status(200).json({ status: 'success', data: formattedRows });
    });
};

// دریافت تمرینات Writing یک درس
exports.getWritingByLesson = (req, res) => {
    const lessonId = req.params.lessonId;
    const query = `SELECT * FROM writing_exercises WHERE lesson_id = ?`;
    db.all(query, [lessonId], (err, rows) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        res.status(200).json({ status: 'success', data: rows });
    });
};

// ثبت پاسخ کاربر به تمرین Writing و بررسی صحت آن
exports.checkWritingAnswer = (req, res) => {
    const exerciseId = req.params.exerciseId;
    const { userAnswer } = req.body;

    const query = `SELECT * FROM writing_exercises WHERE id = ?`;
    db.get(query, [exerciseId], (err, row) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        if (!row) {
            return res.status(404).json({ status: 'error', message: 'تمرین مورد نظر یافت نشد.' });
        }

        // مقایسه پاسخ کاربر با پاسخ صحیح (با پاکسازی فاصله‌های اضافی و حروف بزرگ/کوچک)
        const isCorrect = row.correct_answer.trim().toLowerCase() === userAnswer.trim().toLowerCase();

        res.status(200).json({
            status: 'success',
            isCorrect: isCorrect,
            correctAnswer: row.correct_answer,
            hint: row.hint
        });
    });
};
