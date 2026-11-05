const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// ۱. افزودن محتوای جدید به فرهنگ لغت (توسط مدیر)
exports.addVocabularyItem = (req, res) => {
    const { lessonId, wordEn, meaningFa, pronunciationFa, ipa, partOfSpeech, examples } = req.body;

    if (!wordEn || !meaningFa || !lessonId) {
        return res.status(400).json({ status: 'error', message: 'اطلاعات ضروری واژه (درس، کلمه انگلیسی و معنی) وارد نشده است.' });
    }

    const examplesJson = examples ? JSON.stringify(examples) : JSON.stringify([]);
    const query = `INSERT INTO vocabulary (lesson_id, word_en, meaning_fa, pronunciation_fa, ipa, part_of_speech, examples_json) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [lessonId, wordEn, meaningFa, pronunciationFa, ipa, partOfSpeech, examplesJson], function(err) {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        res.status(200).json({
            status: 'success',
            message: 'واژه جدید با موفقیت به پایگاه داده اضافه شد.',
            vocabId: this.lastID
        });
    });
};

// ۲. پشتیبان‌گیری دستی از پایگاه داده
exports.backupDatabase = (req, res) => {
    const dbPath = path.join(__dirname, '../../database/prospect3.db');
    const backupDir = path.join(__dirname, '../../database/backups');

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupFileName = `backup_${Date.now()}.db`;
    const backupPath = path.join(backupDir, backupFileName);

    fs.copyFile(dbPath, backupPath, (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'خطا در ایجاد نسخه پشتیبان: ' + err.message });
        }
        res.status(200).json({
            status: 'success',
            message: 'نسخه پشتیبان پایگاه داده با موفقیت تهیه شد.',
            backupFile: backupFileName
        });
    });
};

// ۳. داشبورد وضعیت و سلامت سرور (Server Monitoring)
exports.getServerHealthStatus = (req, res) => {
    const memoryUsage = process.memoryUsage();
    const uptimeSeconds = process.uptime();

    // بررسی اتصال به پایگاه داده
    db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
        const dbStatus = err ? 'Disconnected' : 'Connected';
        const userCount = row ? row.count : 0;

        res.status(200).json({
            status: 'success',
            serverUptime: `${Math.floor(uptimeSeconds / 60)} دقیقه و ${Math.floor(uptimeSeconds % 60)} ثانیه`,
            databaseStatus: dbStatus,
            totalUsersRegistered: userCount,
            memoryUsageMB: {
                rss: (memoryUsage.rss / 1024 / 1024).toFixed(2),
                heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
                heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2)
            },
            timestamp: new Date().toISOString()
        });
    });
};
