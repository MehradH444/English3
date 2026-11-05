const db = require('../config/db');

// ایجاد آزمون هوشمند (تولید سؤالات بر اساس درس، نوع و سطح دشواری)
exports.generateQuiz = (req, res) => {
    const { lessonId, questionType, difficulty, limit = 10 } = req.query;
    
    let query = `SELECT * FROM questions WHERE 1=1`;
    let params = [];

    if (lessonId) {
        query += ` AND lesson_id = ?`;
        params.push(lessonId);
    }
    if (questionType) {
        query += ` AND question_type = ?`;
        params.push(questionType);
    }
    if (difficulty) {
        query += ` AND difficulty = ?`;
        params.push(difficulty);
    }

    // تصادفی‌سازی سؤالات و محدود کردن تعداد
    query += ` ORDER BY RANDOM() LIMIT ?`;
    params.push(parseInt(limit));

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }

        const formattedQuestions = rows.map(q => ({
            id: q.id,
            lessonId: q.lesson_id,
            questionType: q.question_type,
            difficulty: q.difficulty,
            questionText: q.question_text,
            options: q.options_json ? JSON.parse(q.options_json) : null
            // توجه: پاسخ صحیح در زمان دریافت آزمون به کاربر ارسال نمی‌شود تا تقلب نشود!
        }));

        res.status(200).json({
            status: 'success',
            totalQuestions: formattedQuestions.length,
            questions: formattedQuestions
        });
    });
};

// تصحیح پاسخ‌نامه آزمون و محاسبه نمره از ۲۰ همراه با تحلیل اشتباهات
exports.submitQuiz = (req, res) => {
    const { userId, testType, answers } = req.body; 
    // answers به صورت آرایه‌ای از اشیاء است: [{ questionId: 1, userAnswer: 'A' }, ...]

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ status: 'error', message: 'پاسخ‌نامه نامعتبر است.' });
    }

    const questionIds = answers.map(a => a.questionId);
    const placeholders = questionIds.map(() => '?').join(',');

    const query = `SELECT id, correct_answer, explanation FROM questions WHERE id IN (${placeholders})`;

    db.all(query, questionIds, (err, dbQuestions) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }

        let correctCount = 0;
        let wrongAnswers = [];

        dbQuestions.forEach(dbQ => {
            const userAnsObj = answers.find(a => a.questionId === dbQ.id);
            const userAnswer = userAnsObj ? userAnsObj.userAnswer.trim().toLowerCase() : '';
            const correctAnswer = dbQ.correct_answer.trim().toLowerCase();

            if (userAnswer === correctAnswer) {
                correctCount++;
            } else {
                wrongAnswers.push({
                    questionId: dbQ.id,
                    userAnswer: userAnsObj ? userAnsObj.userAnswer : '',
                    correctAnswer: dbQ.correct_answer,
                    explanation: dbQ.explanation
                });
            }
        });

        const totalQuestions = dbQuestions.length;
        const rawScore = totalQuestions > 0 ? (correctCount / totalQuestions) : 0;
        const scoreOutOf20 = parseFloat((rawScore * 20).toFixed(2));

        // ذخیره نتیجه در جدول نتایج دانش‌آموز
        const insertResultQuery = `
            INSERT INTO student_results (user_id, test_type, score, total_questions, wrong_answers_json) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const wrongAnswersJson = JSON.stringify(wrongAnswers);

        db.run(insertResultQuery, [userId || 1, testType || 'general_quiz', scoreOutOf20, totalQuestions, wrongAnswersJson], function(insertErr) {
            if (insertErr) {
                console.error('خطا در ذخیره نتیجه آزمون:', insertErr.message);
            }

            res.status(200).json({
                status: 'success',
                scoreOutOf20: scoreOutOf20,
                correctCount: correctCount,
                totalQuestions: totalQuestions,
                wrongAnswers: wrongAnswers
            });
        });
    });
};

// دریافت دفترچه اشتباهات و تاریخچه آزمون‌های کاربر
exports.getStudentMistakes = (req, res) => {
    const userId = req.params.userId || 1;
    const query = `SELECT * FROM student_results WHERE user_id = ? ORDER BY created_at DESC`;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }

        const formattedResults = rows.map(row => ({
            id: row.id,
            testType: row.test_type,
            score: row.score,
            totalQuestions: row.total_questions,
            wrongAnswers: row.wrong_answers_json ? JSON.parse(row.wrong_answers_json) : [],
            createdAt: row.created_at
        }));

        res.status(200).json({
            status: 'success',
            data: formattedResults
        });
    });
};
