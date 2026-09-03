export type Language = 'hi' | 'en' | 'bn' | 'or' | 'mr';

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'hi', label: 'Hindi', native: '🌐 भाषा: हिन्दी ▼' },
  { code: 'en', label: 'English', native: '🌐 Language: English ▼' },
  { code: 'bn', label: 'Bengali', native: '🌐 ভাষা: বাংলা ▼' },
  { code: 'or', label: 'Odia', native: '🌐 ଭାଷା: ଓଡ଼ିଆ ▼' },
  { code: 'mr', label: 'Marathi', native: '🌐 भाषा: मराठी ▼' }
];

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  hi: {
    title: "समस्या से समाधान — झारखंड राज्य पोर्टल",
    tagline: "सामुदायिक समस्याओं से सहयोगात्मक नवाचार और वास्तविक प्रभाव तक।",
    reportProblem: "समस्या दर्ज करें",
    exploreProblems: "समस्याएं देखें",
    impactMap: "प्रभाव मानचित्र (GIS Map)",
    publicFeed: "सार्वजनिक समस्याएं",
    ttsListen: "🔊 सुनें",
    severity: "गंभीरता",
    urgency: "आपात स्थिति",
    impact: "जन प्रभाव",
    district: "जिला",
    category: "श्रेणी",
    status: "स्थिति",
    login: "लॉगिन करें",
    register: "पंजीकरण",
    citizen: "नागरिक",
    government: "सरकारी विभाग",
    university: "विश्वविद्यालय R&D",
    industry: "उद्योग एवं स्टार्टअप",
    admin: "राज्य बोर्ड प्रशासन",
    sihTag: "स्मार्ट इंडिया हैकाथॉन 2026 - झारखंड राज्य नवाचार मंच"
  },
  en: {
    title: "Solve Bridge — State Innovation Engine",
    tagline: "From Community Problems to Collaborative Innovation and Real-World Impact.",
    reportProblem: "Report a Problem",
    exploreProblems: "Explore Problems",
    impactMap: "Impact Map (GIS)",
    publicFeed: "Public Problems Feed",
    ttsListen: "🔊 Listen",
    severity: "Severity",
    urgency: "Urgency",
    impact: "Public Impact",
    district: "District",
    category: "Category",
    status: "Status",
    login: "Sign In",
    register: "Register",
    citizen: "Citizen",
    government: "Government Dept",
    university: "University R&D",
    industry: "Industry & Startup",
    admin: "Admin Board",
    sihTag: "Smart India Hackathon 2026 — State Civic AI Portal"
  },
  bn: {
    title: "সমাধান ঝাড়খণ্ড — রাজ্য উদ্ভাবন পোর্টাল",
    tagline: "সামাজিক সমস্যা থেকে সহযোগিতামূলক উদ্ভাবন এবং বাস্তব প্রভাব।",
    reportProblem: "সমস্যা জানান",
    exploreProblems: "সমস্যা খুঁজুন",
    impactMap: "জিআইএস মানচিত্র",
    publicFeed: "জনসাধারণের সমস্যা",
    ttsListen: "🔊 শুনুন",
    severity: "তীক্ষ্ণতা",
    urgency: "জরুরী অবস্থা",
    impact: "জন প্রভাব",
    district: "জেলা",
    category: "বিভাগ",
    status: "অবস্থা",
    login: "লগইন",
    register: "নিবন্ধন",
    citizen: "নাগরিক",
    government: "সরকারি বিভাগ",
    university: "বিশ্ববিদ্যালয় গবেষণা",
    industry: "শিল্প ও স্টার্টআপ",
    admin: "প্রশাসন বোর্ড",
    sihTag: "স্মার্ট ইন্ডিয়া হ্যাকাথন ২০২৬ — ঝাড়খণ্ড পোর্টাল"
  },
  or: {
    title: "ସମାଧାନ ଝାଡ଼ଖଣ୍ଡ — ରାଜ୍ୟ ନବସୃଜନ ପୋର୍ଟାଲ",
    tagline: "ସାମାଜିକ ସମସ୍ୟାରୁ ସହଯୋଗୀ ନବସୃଜନ ଏବଂ ବାସ୍ତବ ପ୍ରଭାବ।",
    reportProblem: "ସମସ୍ୟା ଦର୍ଜ କରନ୍ତୁ",
    exploreProblems: "ସମସ୍ୟା ଦେଖନ୍ତୁ",
    impactMap: "ଜିଆଇଏସ ମାନଚିତ୍ର",
    publicFeed: "ସାର୍ବଜନୀନ ସମସ୍ୟା",
    ttsListen: "🔊 ଶୁଣନ୍ତୁ",
    severity: "ଗାମ୍ଭୀର୍ଯ୍ୟ",
    urgency: "ଜରୁରୀ",
    impact: "ଜନ ପ୍ରଭାବ",
    district: "ଜିଲ୍ଲା",
    category: "ଶ୍ରେଣୀ",
    status: "ସ୍ଥିତି",
    login: "ଲଗଇନ",
    register: "ପଞ୍ଜୀକରଣ",
    citizen: "ନାଗରିକ",
    government: "ସରକାରୀ ବିଭାଗ",
    university: "ବିଶ୍ବବିଦ୍ୟାଳୟ R&D",
    industry: "ଶିଳ୍ପ ଓ ଷ୍ଟାର୍ଟଅପ",
    admin: "ପ୍ରଶାସନ",
    sihTag: "ସ୍ମାର୍ଟ ଇଣ୍ଡିଆ ହାକାଥନ୍ ୨୦୨୬ — ଝାଡ଼ଖଣ୍ଡ ପୋର୍ଟାଲ"
  },
  mr: {
    title: "समाधान झारखंड — राज्य नवोपक्रम पोर्टल",
    tagline: "लोकसमस्यांपासून ते सहकार्यात्मक नवोपक्रम आणि प्रत्यक्ष परिणामापर्यंत.",
    reportProblem: "समस्या नोंदवा",
    exploreProblems: "समस्या पहा",
    impactMap: "जीआयएस नकाशा",
    publicFeed: "सार्वजनिक समस्या",
    ttsListen: "🔊 ऐका",
    severity: "तीव्रता",
    urgency: "तातडी",
    impact: "लोक प्रभाव",
    district: "जिल्हा",
    category: "वर्ग",
    status: "स्थिती",
    login: "लॉगिन",
    register: "नोंदणी",
    citizen: "नागरीक",
    government: "सरकारी विभाग",
    university: "विद्यापीठ R&D",
    industry: "उद्योग आणि स्टार्टअप",
    admin: "प्रशासन मंडळ",
    sihTag: "स्मार्ट इंडिया हॅकाथॉन २०२६ — झारखंड पोर्टल"
  }
};

export function speakText(text: string, lang: Language = 'hi') {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langCodes: Record<Language, string> = {
      hi: 'hi-IN',
      en: 'en-IN',
      bn: 'bn-IN',
      or: 'or-IN',
      mr: 'mr-IN'
    };
    utterance.lang = langCodes[lang] || 'hi-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}
