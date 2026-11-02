-- پایگاه داده پلتفرم جامع آموزش انگلیسی پایه نهم (Prospect 3)

-- جدول کاربران سیستم (دانش‌آموز، معلم، ولی، مدیر)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK(role IN ('student', 'teacher', 'parent', 'admin')) DEFAULT 'student',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول درس‌های کتاب (شدرس کتاب Prospect 3)
CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_number INTEGER UNIQUE NOT NULL,
    title_fa TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description TEXT
);

-- جدول فرهنگ لغت جامع (واژگان ۶ درس)
CREATE TABLE IF NOT EXISTS vocabulary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER,
    word_en TEXT NOT NULL,
    meaning_fa TEXT NOT NULL,
    pronunciation_fa TEXT,
    ipa TEXT,
    part_of_speech TEXT,
    synonyms TEXT,
    antonyms TEXT,
    examples_json TEXT, -- ذخیره مثال‌ها به صورت ساختاریافته (JSON)
    image_url TEXT,
    audio_url TEXT,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- جدول آموزش گرامر
CREATE TABLE IF NOT EXISTS grammar_topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER,
    topic_title TEXT NOT NULL,
    definition_fa TEXT,
    formula TEXT,
    examples_json TEXT,
    common_mistakes TEXT,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- جدول بانک سؤالات و آزمون‌ها
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER,
    question_type TEXT CHECK(question_type IN ('vocabulary', 'grammar', 'reading', 'listening', 'translation', 'mcq', 'true_false')) NOT NULL,
    difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
    question_text TEXT NOT NULL,
    options_json TEXT, -- گزینه‌ها برای سؤالات چهارگزینه‌ای
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- جدول ثبت نتایج آزمون‌ها و پیشرفت دانش‌آموز
CREATE TABLE IF NOT EXISTS student_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    test_type TEXT NOT NULL,
    score REAL NOT NULL,
    total_questions INTEGER NOT NULL,
    wrong_answers_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- جدول دفترچه لغات شخصی و فلش‌کارت‌ها
CREATE TABLE IF NOT EXISTS user_vocabulary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    vocab_id INTEGER,
    mastery_level INTEGER DEFAULT 0, -- میزان تسلط برای مرور فاصله‌دار
    personal_note TEXT,
    is_favorite BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vocab_id) REFERENCES vocabulary(id) ON DELETE CASCADE
);

-- درج داده‌های اولیه مربوط به ۶ درس کتاب Prospect 3
INSERT OR IGNORE INTO lessons (lesson_number, title_fa, title_en, description) VALUES 
(1, 'درس اول: شخصیت‌ها', 'Lesson 1: Personalities', 'آموزش واژگان، صفات شخصیتی و گرامر مربوط به معرفی افراد'),
(2, 'درس دوم: مسافرت', 'Lesson 2: Traveling', 'مکالمات سفر، مکان‌های گردشگری و ساختارهای گرامری مرتبط'),
(3, 'درس سوم: مناشو و جشن‌ها', 'Lesson 3: Festivals and Ceremonies', 'آداب و رسوم، جشن‌ها و مناسبت‌های مختلف'),
(4, 'درس چهارم: خدمات شهری', 'Lesson 4: Services', 'امکانات شهر، پرسش و پاسخ درباره آدرس و خدمات عمومی'),
(5, 'درس پنجم: رسانه‌ها و هنر', 'Lesson 5: Media and Art', 'سینما، تلویزیون، هنر و رسانه‌های جمعی'),
(6, 'درس ششم: سلامت و پزشکی', 'Lesson 6: Health and Medical', 'بیماری‌ها، توصیه‌های پزشکی و سبک زندگی سالم');
