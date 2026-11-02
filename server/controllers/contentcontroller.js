const db = require('../config/db');

// دریافت لیست تمام دروس کتاب Prospect 3
exports.getAllLessons = (req, res) => {
    const query = `SELECT * FROM lessons ORDER BY lesson_number ASC`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        res.status(200).json({ status: 'success', data: rows });
    });
};

// دریافت واژگان یک درس خاص همراه با جزئیات کامل
exports.getVocabularyByLesson = (req, res) => {
    const lessonId = req.params.lessonId;
    const query = `SELECT * FROM vocabulary WHERE lesson_id = ?`;
    db.all(query, [lessonId], (err, rows) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        // پارس کردن مقادیر JSON مثال‌ها
        const formattedRows = rows.map(item => ({
            ...item,
            examples: item.examples_json ? JSON.parse(item.examples_json) : []
        }));
        res.status(200).json({ status: 'success', data: formattedRows });
    });
};

// دریافت مباحث گرامری یک درس خاص
exports.getGrammarByLesson = (req, res) => {
    const lessonId = req.params.lessonId;
    const query = `SELECT * FROM grammar_topics WHERE lesson_id = ?`;
    db.all(query, [lessonId], (err, rows) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        const formattedRows = rows.map(item => ({
            ...item,
            examples: item.examples_json ? JSON.parse(item.examples_json) : []
        }));
        res.status(200).json({ status: 'success', data: formattedRows });
    });
};

// جستجوی پیشرفته در فرهنگ لغت (فارسی و انگلیسی)
exports.searchVocabulary = (req, res) => {
    const searchTerm = `%${req.query.q || ''}%`;
    const query = `SELECT * FROM vocabulary WHERE word_en LIKE ? OR meaning_fa LIKE ?`;
    db.all(query, [searchTerm, searchTerm], (err, rows) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        const formattedRows = rows.map(item => ({
            ...item,
            examples: item.examples_json ? JSON.parse(item.examples_json) : []
        }));
        res.status(200).json({ status: 'success', data: formattedRows });
    });
};
