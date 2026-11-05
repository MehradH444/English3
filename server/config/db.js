const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// تعیین مسیر فایل پایگاه داده
const dbDir = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)){
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'prospect3.db');

// ایجاد اتصال به پایگاه داده
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('خطا در اتصال به پایگاه داده SQLite:', err.message);
    } else {
        console.log('اتصال موفقیت‌آمیز به پایگاه داده SQLite برقرار شد.');
    }
});

// اجرای فایل ساخت جداول (Schema) در صورت نیاز
const schemaPath = path.join(dbDir, 'schema.sql');
if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql, (err) => {
        if (err) {
            console.error('خطا در اجرای اسکریپت ساخت جداول:', err.message);
        } else {
            console.log('ساختار جداول پایگاه داده بررسی و بارگذاری شد.');
        }
    });
}

module.exports = db;
