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

-- جدول درس‌های کتاب (شش درس کتاب Prospect 3)
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
    examples_json TEXT,
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

-- جدول مکالمات (Conversations) هر درس
CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER,
    speaker TEXT NOT NULL,
    line_en TEXT NOT NULL,
    line_fa TEXT NOT NULL,
    audio_timestamp TEXT,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- جدول متون Reading و درک مطلب
CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER,
    title TEXT NOT NULL,
    passage_text TEXT NOT NULL,
    translation_fa TEXT NOT NULL,
    questions_json TEXT, -- سؤالات درک مطلب و True/False
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- جدول تمرینات Writing و نگارش
CREATE TABLE IF NOT EXISTS writing_exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER,
    exercise_type TEXT NOT NULL, -- مثلاً unscramble, fill_in_blanks, sentence_building
    prompt_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    hint TEXT,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- جدول بانک سؤالات و آزمون‌ها
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER,
    question_type TEXT CHECK(question_type IN ('vocabulary', 'grammar', 'reading', 'listening', 'translation', 'mcq', 'true_false')) NOT NULL,
    difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
    question_text TEXT NOT NULL,
    options_json TEXT,
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
    mastery_level INTEGER DEFAULT 0,
    personal_note TEXT,
    is_favorite BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vocab_id) REFERENCES vocabulary(id) ON DELETE CASCADE
);
