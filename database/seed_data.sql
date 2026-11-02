-- درج واژگان استاندارد درس اول: شخصیت‌ها (Lesson 1: Personalities)
INSERT OR IGNORE INTO vocabulary (lesson_id, word_en, meaning_fa, pronunciation_fa, ipa, part_of_speech, synonyms, antonyms, examples_json) VALUES 
(1, 'Hard-working', 'سخت‌کوش', 'هارد-ورکینگ', '/ˌhɑːrd ˈwɜːrkɪŋ/', 'Adjective', 'Diligent, Industrious', 'Lazy', '["He is a hard-working student.", "او یک دانش‌آموز سخت‌کوش است."]'),
(1, 'Clever', 'باهوش، زیرک', 'کلور', '/ˈklevər/', 'Adjective', 'Smart, Intelligent', 'Stupid, Foolish', '["She is a clever girl.", "او دختری باهوش است."]'),
(1, 'Generous', 'بخشنده، سخاوتمند', 'جنروس', '/ˈdʒenərəs/', 'Adjective', 'Unselfish, Charitable', 'Mean, Selfish', '["My uncle is very generous.", "عموی من خیلی بخشنده است."]'),
(1, 'Shy', 'خجالتی', 'شای', '/ʃaɪ/', 'Adjective', 'Timid, Reserved', 'Outgoing, Confident', '["The new boy is a bit shy.", "پسر جدید کمی خجالتی است."]');

-- درج مباحث گرامری درس اول
INSERT OR IGNORE INTO grammar_topics (lesson_id, topic_title, definition_fa, formula, examples_json, common_mistakes) VALUES 
(1, 'معرفی ویژگی‌های شخصیتی با افعال To Be', 'برای توصیف ویژگی‌های ظاهری و شخصیتی افراد از ساختار فاعل به همراه افعال تو بی (am/is/are) و صفت استفاده می‌شود.', 'Subject + Am/Is/Are + Adjective', '["He is kind.", "They are helpful."]', 'استفاده نادرست از فعل کمکی do به جای افعال to be (مثلاً اشتباه: He does kind).');

-- درج واژگان استاندارد درس دوم: مسافرت (Lesson 2: Traveling)
INSERT OR IGNORE INTO vocabulary (lesson_id, word_en, meaning_fa, pronunciation_fa, ipa, part_of_speech, synonyms, antonyms, examples_json) VALUES 
(2, 'Destination', 'مقصد', 'دستینیشن', '/ˌdestɪˈneɪʃn/', 'Noun', 'Goal, End point', '', '["What is your destination?", "مقصد شما کجاست؟"]'),
(2, 'Foreign', 'خارجی', 'فورین', '/ˈfɔːrən/', 'Adjective', 'Overseas, External', 'Domestic', '["He likes to travel to foreign countries.", "او دوست دارد به کشورهای خارجی سفر کند."]');

-- درج مباحث گرامری درس دوم
INSERT OR IGNORE INTO grammar_topics (lesson_id, topic_title, definition_fa, formula, examples_json, common_mistakes) VALUES 
(2, 'زمان حال استمراری (Present Continuous) برای آینده نزدیک', 'برای بیان برنامه‌ها و تصمیمات قطعی برای سفرهای آینده از زمان حال استمراری استفاده می‌شود.', 'Subject + Am/Is/Are + Verb-ing + Time Expression', '["I am traveling to Shiraz next week.", "من هفته آینده به شیراز سفر می‌کنم."]', 'فراموش کردن پسوند ing یا استفاده نادرست از فعل to be.');
