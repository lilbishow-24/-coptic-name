// خريطة تحويل الحروف الإنجليزية إلى ما يقابلها في النطق العربي (لإعدادها للتحويل القبطي)
const englishToArabicMap = {
    'A': 'ا', 'B': 'ب', 'C': 'ك', 'D': 'د', 'E': 'ي',
    'F': 'ف', 'G': 'ج', 'H': 'ه', 'I': 'ي', 'J': 'ج',
    'K': 'ك', 'L': 'ل', 'M': 'م', 'N': 'ن', 'O': 'و',
    'P': 'ب', 'Q': 'ق', 'R': 'ر', 'S': 'س', 'T': 'ت',
    'U': 'و', 'V': 'ف', 'W': 'و', 'X': 'كس', 'Y': 'ي',
    'Z': 'ز', 'TH': 'ث', 'SH': 'ش', 'CH': 'ش', 'KH': 'خ',
    ' ': ' ' 
};

// خريطة التحويل الأساسية من العربي إلى القبطي
const copticMap = {
    'أ': 'Ⲁ', 'ا': 'Ⲁ', 'آ': 'Ⲁ',
    'ب': 'Ⲃ', 'ة': 'Ⲧ', 
    'ت': 'Ⲧ', 
    'ث': 'Ⲑ', 
    'ج': 'Ⲅ', 
    'ح': 'Ϩ', 
    'خ': 'Ⲭ', 
    'د': 'Ⲇ', 
    'ذ': 'Ⲇ', 
    'ر': 'Ⲣ', 
    'ز': 'Ⲍ', 
    'س': 'Ⲥ', 'ص': 'Ⲥ', 
    'ش': 'Ϣ', 
    'ض': 'Ⲇ', 
    'ط': 'Ⲧ', 
    'ظ': 'Ⲑ', 
    'ع': 'Ⲁ', 
    'غ': 'Ⲅ', 
    'ف': 'Ϥ', 
    'ق': 'Ⲕ', 
    'ك': 'Ⲕ', 
    'ل': 'Ⲗ', 
    'م': 'Ⲙ', 
    'ن': 'Ⲛ', 
    'ه': 'Ϩ', 
    'و': 'ⲞⲨ', 
    'ي': 'Ⲓ', 'ى': 'Ⲓ', 'ئ': 'Ⲓ', 
    'ِ': 'Ⲉ', 'َ': 'Ⲁ', 'ُ': 'Ⲟ', 
    ' ': ' ' 
};

/**
 * تحويل الاسم الإنجليزي إلى نطق عربي تقريبي.
 * @param {string} englishText النص بالإنجليزية.
 * @returns {string} النص المحول للعربية.
 */
function transliterateEnglishToArabic(englishText) {
    let arabicText = englishText.toUpperCase();
    
    // تحويل الحروف المركبة أولاً
    arabicText = arabicText.replace(/SH/g, 'ش').replace(/CH/g, 'ش').replace(/KH/g, 'خ').replace(/TH/g, 'ث');

    let result = '';
    for (const char of arabicText) {
        // نستخدم 'ي' للحرف I لأسماء مثل Mina
        const mappedChar = englishToArabicMap[char] || ''; 
        result += mappedChar;
    }
    return result;
}


/**
 * دالة التحويل الرئيسية (تدعم العربي والإنجليزي).
 * @returns {string} النص القبطي النهائي.
 */
function convertToCoptic() {
    let inputName = document.getElementById('NameInput').value.trim();
    if (!inputName) {
        document.getElementById('copticResult').textContent = 'الرجاء إدخال اسم لتبدأ عملية التحويل.';
        return '';
    }

    // تحديد ما إذا كان المدخل إنجليزياً (يحتوي على حروف لاتينية)
    if (/[A-Za-z]/.test(inputName)) {
        inputName = transliterateEnglishToArabic(inputName);
    }

    let copticResult = '';
    
    // عملية التحويل حرفاً حرفاً من العربي إلى القبطي
    for (let i = 0; i < inputName.length; i++) {
        const char = inputName[i];
        const copticChar = copticMap[char] || char; 
        copticResult += copticChar;
    }

    const finalCopticText = copticResult.toUpperCase();
    document.getElementById('copticResult').textContent = finalCopticText;

    return finalCopticText;
}


/**
 * دالة النطق الصوتي المحسّنة لحل مشكلة الصوت.
 */
function speakCopticName() {
    const copticText = convertToCoptic();
    
    if (!copticText) return; 

    if ('speechSynthesis' in window) {
        
        // **إلغاء أي نطق سابق معلق (مهم جداً لحل المشكلة)**
        window.speechSynthesis.cancel();
        
        const textToSpeak = copticText;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        // **محاولة الحصول على صوت عربي فوري (حل مشكلة عدم عمل الصوت)**
        const voices = window.speechSynthesis.getVoices();
        const arabicVoice = voices.find(voice => voice.lang.startsWith('ar') || voice.lang.startsWith('AR'));
        
        if (arabicVoice) {
            utterance.voice = arabicVoice;
            utterance.lang = arabicVoice.lang;
        } else {
            // إذا لم يجد صوتاً عربياً، يستخدم الإعدادات الافتراضية
            utterance.lang = 'en-US'; 
        }

        utterance.rate = 0.8;
        utterance.pitch = 0.9;
        
        // **تشغيل النطق**
        window.speechSynthesis.speak(utterance);
    } else {
        alert('المتصفح لا يدعم النطق الصوتي المباشر.');
    }
}