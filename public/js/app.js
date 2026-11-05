// آدرس پایه سرور (در حالت توسعه)
const BASE_URL = 'http://localhost:3000/api';

// ۱. تابع بررسی وضعیت سرور
async function checkServerHealth() {
    const resultBox = document.getElementById('health-result');
    resultBox.innerText = 'در حال ارتباط با سرور...';
    
    try {
        const response = await fetch(`${BASE_URL}/admin/server/health`);
        const data = await response.json();
        
        if (data.status === 'success') {
            resultBox.innerText = `وضعیت دیتابیس: ${data.databaseStatus}\nزمان فعالیت سرور: ${data.serverUptime}\nکاربران ثبت‌نام شده: ${data.totalUsersRegistered}`;
        } else {
            resultBox.innerText = 'خطا در دریافت اطلاعات سرور.';
        }
    } catch (error) {
        resultBox.innerText = `خطای ارتباطی: ${error.message}`;
    }
}

// ۲. تابع دریافت لغات یک درس
async function getVocabulary(lessonId) {
    const resultBox = document.getElementById('vocab-result');
    resultBox.innerText = 'در حال بارگذاری لغات...';
    
    try {
        const response = await fetch(`${BASE_URL}/vocabulary/lesson/${lessonId}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.data.length > 0) {
            let html = '<ul>';
            data.data.forEach(word => {
                html += `<li><strong>${word.wordEn}</strong>: ${word.meaningFa} (${word.partOfSpeech})</li>`;
            });
            html += '</ul>';
            resultBox.innerHTML = html;
        } else {
            resultBox.innerText = 'هیچ لغتی برای این درس یافت نشد. (لطفاً ابتدا دیتابیس را پر کنید)';
        }
    } catch (error) {
        resultBox.innerText = `خطای ارتباطی: ${error.message}`;
    }
}

// ۳. تابع پرسش از هوش مصنوعی
async function askAi() {
    const questionInput = document.getElementById('ai-question').value;
    const resultBox = document.getElementById('ai-result');
    
    if (!questionInput.trim()) {
        resultBox.innerText = 'لطفاً ابتدا یک سؤال وارد کنید.';
        return;
    }

    resultBox.innerText = 'هوش مصنوعی در حال تحلیل پاسخ...';
    
    try {
        const response = await fetch(`${BASE_URL}/ai/tutor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: questionInput, topic: 'پرسش عمومی پایه نهم' })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            resultBox.innerText = data.aiAnswer;
        } else {
            resultBox.innerText = 'خطا در دریافت پاسخ از هوش مصنوعی.';
        }
    } catch (error) {
        resultBox.innerText = `خطای ارتباطی: ${error.message}`;
    }
}

// ۴. تابع ساخت آزمون تصادفی
async function generateQuiz(lessonId, limit) {
    const resultBox = document.getElementById('quiz-result');
    resultBox.innerText = 'در حال ساخت آزمون...';
    
    try {
        const response = await fetch(`${BASE_URL}/quiz/generate?lessonId=${lessonId}&limit=${limit}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.questions.length > 0) {
            let html = '<ol>';
            data.questions.forEach(q => {
                html += `<li>${q.questionText}</li>`;
            });
            html += '</ol>';
            resultBox.innerHTML = html;
        } else {
            resultBox.innerText = 'سؤالی برای این شرایط یافت نشد. (ابتدا باید بانک سؤالات پر شود)';
        }
    } catch (error) {
        resultBox.innerText = `خطای ارتباطی: ${error.message}`;
    }
}
