import { Language } from './types.ts';

interface LocaleStrings {
  title: string;
  subtitle: string;
  description: string;
  launchButton: string;
  languageToggleLabel: string;
  docsButton: string;
  backButton: string;
  installTitle: string;
  installDescription: string;
  downloadWindows: string;
  downloadMacOS: string;
  downloadLinux: string;
  vscodeExtension: string;
  downloadFor: string;
  otherPlatforms: string;
  docsContent: string;
  // Features Section
  featuresTitle: string;
  featureAiTitle: string;
  featureAiDescription: string;
  featureBilingualTitle: string;
  featureBilingualDescription: string;
  featureMultiDomainTitle: string;
  featureMultiDomainDescription: string;
  featureVisionTitle: string;
  featureVisionDescription: string;
  featureToolingTitle: string;
  featureToolingDescription: string;
  featureDeploymentTitle: string;
  featureDeploymentDescription: string;
}

const enDocsContent = `
## Welcome to Alpa
Alpa is a bilingual, AI-native programming language designed for productivity and integration across multiple domains. This documentation will guide you through its core features.
### Core Concepts
The language is built around modules that provide powerful commands for specific tasks. You can interact with these modules using English, Arabic, or short aliases.
- **AI-Native:** Interact with generative AI models directly from the language.
- **Bilingual:** All keywords and commands work in English and Arabic.
- **Multi-Domain:** Built-in tools for data analysis, web development, robotics, and more.

## Installation & Tooling
While this is a web-based terminal, Alpa is designed as a production-ready language.
### VS Code Extension
To enhance your development experience, Alpa provides a dedicated VS Code extension featuring:
- **AI-powered autocompletion:** Get smart suggestions as you type.
- **Syntax Highlighting:** Improved readability for Alpa code.
- **Bilingual Tooltips:** Hover over commands to see descriptions in your preferred language.

## Deployment
Alpa is designed to be a production-ready language, which includes tools for deploying your projects.

### Deploying to GitHub Pages
You can deploy the Alpa static website simulator directly to GitHub Pages using a simple command. This will simulate the build and deployment process.
\`\`\`
deploy.ghpages
\`\`\`

### Deploying to Vercel
Similarly, you can simulate a deployment to Vercel, a popular platform for frontend applications.
\`\`\`
deploy.vercel
\`\`\`

### Publishing the VS Code Extension
The Alpa VS Code extension can be packaged and published to the official marketplace. This command simulates the entire process.
\`\`\`
# This command simulates packaging and publishing
deploy.vscode
\`\`\`

## AI Module (ذكاء)
The AI module is at the heart of Alpa. You can use it to perform various AI tasks.
\`\`\`
# Generate an image from a prompt
image a cat wearing a space helmet
# Or in Arabic
تخيل قطة ترتدي خوذة فضاء
\`\`\`

### Advanced AI Commands
**Speech-to-Text**
\`\`\`
# Transcribe an audio file
ai.stt "meeting_recording.mp3"
\`\`\`
**Text-to-Speech**
\`\`\`
# Generate an audio file from text
ai.tts "Hello from Alpa language"
\`\`\`
**OCR (Optical Character Recognition)**
\`\`\`
# Extract text from an image
ai.ocr "invoice.png"
\`\`\`
**Content Analysis**
\`\`\`
# Analyze the sentiment and topics of a text
ai.analyze "Alpa is a fantastic and productive language for AI development."
\`\`\`

## Chatbot Development (بوت)
Build and deploy chatbots with a single command.
- \`bot.new\` (بوت.جديد): Initializes, configures, and deploys a new chatbot.
- **Supported Platforms:** \`web\`, \`whatsapp\`, \`telegram\`, \`facebook\`, \`instagram\`.
- **Data Sources:** You can use a URL to a live API, a Hugging Face model endpoint, or a local file.
\`\`\`
# Create a new bot for Telegram using a Hugging Face model
bot.new telegram "https://huggingface.co/models/My-LLM"

# Create a web-based bot using a local data file
bot.new web "faq.csv"
\`\`\`

## Camera Module (كاميرا)
Interact with the device's camera for real-time computer vision tasks.
\`\`\`
# Open the camera and detect objects
camera.open
detect.objects both
\`\`\`
`;

const arDocsContent = `
## مرحباً بك في ألبا
ألبا هي لغة برمجة ثنائية اللغة، ومصممة أصلاً للذكاء الاصطناعي لتحقيق الإنتاجية والتكامل عبر مجالات متعددة. ستوجهك هذه الوثائق عبر ميزاتها الأساسية.
### المفاهيم الأساسية
اللغة مبنية حول وحدات (modules) توفر أوامر قوية لمهام محددة. يمكنك التفاعل مع هذه الوحدات باستخدام الإنجليزية أو العربية أو الاختصارات.
- **مبنية للذكاء الاصطناعي:** تفاعل مع نماذج الذكاء الاصطناعي التوليدية مباشرة من اللغة.
- **ثنائية اللغة:** جميع الكلمات الرئيسية والأوامر تعمل باللغتين الإنجليزية والعربية.
- **متعددة المجالات:** أدوات مدمجة لتحليل البيانات، وتطوير الويب، والروبوتات، والمزيد.

## التثبيت والأدوات
بينما هذه واجهة طرفية (terminal) على الويب، تم تصميم ألبا كلغة جاهزة للإنتاج.
### إضافة VS Code
لتحسين تجربة التطوير الخاصة بك، توفر ألبا إضافة مخصصة لـ VS Code تتميز بما يلي:
- **إكمال تلقائي مدعوم بالذكاء الاصطناعي:** احصل على اقتراحات ذكية أثناء الكتابة.
- **تمييز الصيغة (Syntax Highlighting):** قابلية قراءة محسنة لكود ألبا.
- **تلميحات ثنائية اللغة:** مرر الفأرة فوق الأوامر لرؤية الأوصاف بلغتك المفضلة.

## النشر (Deployment)
تم تصميم ألبا لتكون لغة جاهزة للإنتاج، وهذا يتضمن أدوات لنشر مشاريعك.

### النشر على GitHub Pages
يمكنك نشر محاكي موقع ألبا الثابت مباشرة على GitHub Pages باستخدام أمر بسيط. سيقوم هذا الأمر بمحاكاة عملية البناء والنشر.
\`\`\`
نشر.ghpages
\`\`\`

### النشر على Vercel
بشكل مشابه، يمكنك محاكاة عملية نشر إلى Vercel، وهي منصة شائعة لتطبيقات الواجهة الأمامية.
\`\`\`
نشر.vercel
\`\`\`

### نشر إضافة VS Code
يمكن حزم إضافة VS Code الخاصة بلغة ألبا ونشرها في المتجر الرسمي. هذا الأمر يحاكي العملية بأكملها.
\`\`\`
# هذا الأمر يحاكي عملية الحزم والنشر
نشر.vscode
\`\`\`

## وحدة الذكاء (AI)
وحدة الذكاء هي قلب لغة ألبا. يمكنك استخدامها لأداء مهام الذكاء الاصطناعي المختلفة.
\`\`\`
# توليد صورة من نص
image a cat wearing a space helmet
# أو بالعربية
تخيل قطة ترتدي خوذة فضاء
\`\`\`

### أوامر الذكاء الاصطناعي المتقدمة
**تحويل الصوت إلى نص**
\`\`\`
# تفريغ نصي لملف صوتي
ذكاء.صوت_الى_نص "تسجيل_اجتماع.mp3"
\`\`\`
**تحويل النص إلى صوت**
\`\`\`
# توليد ملف صوتي من نص
ذكاء.نص_الى_صوت "مرحباً من لغة ألبا"
\`\`\`
**التعرف الضوئي على الحروف (OCR)**
\`\`\`
# استخراج نص من صورة
ذكاء.استخراج_نص "فاتورة.png"
\`\`\`
**تحليل المحتوى**
\`\`\`
# تحليل المشاعر والمواضيع الرئيسية في نص
ذكاء.تحليل "ألبا لغة رائعة ومنتجة لتطوير الذكاء الاصطناعي."
\`\`\`

## تطوير روبوتات الدردشة (بوت)
قم ببناء ونشر روبوتات الدردشة بأمر واحد.
- \`بوت.جديد\` (bot.new): يقوم بتهيئة وتكوين ونشر روبوت دردشة جديد.
- **المنصات المدعومة:** \`web\`, \`whatsapp\`, \`telegram\`, \`facebook\`, \`instagram\`.
- **مصادر البيانات:** يمكنك استخدام رابط URL لواجهة برمجة تطبيقات مباشرة، أو نقطة نهاية لنموذج Hugging Face، أو ملف محلي.
\`\`\`
# إنشاء بوت جديد لتليجرام باستخدام نموذج Hugging Face
بوت.جديد telegram "https://huggingface.co/models/My-LLM"

# إنشاء بوت للويب باستخدام ملف بيانات محلي
بوت.جديد web "faq.csv"
\`\`\`

## وحدة الكاميرا (Camera)
تفاعل مع كاميرا الجهاز لمهام الرؤية الحاسوبية في الوقت الفعلي.
\`\`\`
# فتح الكاميرا وكشف الأشياء
كاميرا.فتح
كشف.اشياء both
\`\`\`
`;

export const locales: Record<Language, LocaleStrings> = {
  en: {
    title: 'Alpa Language',
    subtitle: 'A new way to interact with your computer and the world.',
    description: 'Use natural language to execute commands, generate content, and control your device. Alpa combines a powerful command-line interface with cutting-edge AI to understand your intent.',
    launchButton: 'Launch Terminal',
    languageToggleLabel: 'العربية',
    docsButton: 'Documentation',
    backButton: 'Back',
    installTitle: 'Get Started with Alpa',
    installDescription: 'Download the Alpa runtime for your operating system or add the extension to VS Code.',
    downloadWindows: 'Windows',
    downloadMacOS: 'macOS',
    downloadLinux: 'Linux',
    vscodeExtension: 'VS Code Extension',
    downloadFor: 'Download for',
    otherPlatforms: 'Other platforms',
    docsContent: enDocsContent,
    featuresTitle: 'The Power of Alpa',
    featureAiTitle: 'AI-Native Core',
    featureAiDescription: 'Directly access generative AI for text, images, and analysis with simple, intuitive commands.',
    featureBilingualTitle: 'Bilingual Syntax',
    featureBilingualDescription: 'Code seamlessly in English or Arabic. Alpa understands both, making it accessible to everyone.',
    featureMultiDomainTitle: 'Multi-Domain Powerhouse',
    featureMultiDomainDescription: 'From data science and web development to robotics and cloud, Alpa provides built-in modules for every need.',
    featureVisionTitle: 'Interactive Vision',
    featureVisionDescription: 'Leverage your camera for real-time object detection, face tracking, and AI-powered visual analysis.',
    featureToolingTitle: 'Developer-Centric Tooling',
    featureToolingDescription: 'Boost your productivity with an AI-powered VS Code extension, smart suggestions, and a powerful REPL.',
    featureDeploymentTitle: 'Rapid Deployment',
    featureDeploymentDescription: 'Deploy chatbots, websites, and backend services in seconds with single-line commands.',
  },
  ar: {
    title: 'لغة ألبا',
    subtitle: 'طريقة جديدة للتفاعل مع حاسوبك والعالم.',
    description: 'استخدم اللغة الطبيعية لتنفيذ الأوامر وإنشاء المحتوى والتحكم في جهازك. تجمع ألبا بين واجهة سطر أوامر قوية وذكاء اصطناعي متطور لفهم ما تريد.',
    launchButton: 'شغل الطرفية',
    languageToggleLabel: 'English',
    docsButton: 'الوثائق',
    backButton: 'رجوع',
    installTitle: 'ابدأ مع ألبا',
    installDescription: 'قم بتنزيل بيئة تشغيل ألبا لنظام التشغيل الخاص بك أو أضف الإضافة إلى VS Code.',
    downloadWindows: 'ويندوز',
    downloadMacOS: 'ماك',
    downloadLinux: 'لينكس',
    vscodeExtension: 'إضافة VS Code',
    downloadFor: 'تنزيل لـ',
    otherPlatforms: 'منصات أخرى',
    docsContent: arDocsContent,
    featuresTitle: 'قوة لغة ألبا',
    featureAiTitle: 'قلب نابض بالذكاء الاصطناعي',
    featureAiDescription: 'صل إلى الذكاء الاصطناعي التوليدي مباشرة لإنشاء النصوص والصور والتحليلات بأوامر بسيطة وبديهية.',
    featureBilingualTitle: 'صيغة ثنائية اللغة',
    featureBilingualDescription: 'برمج بسلاسة باللغة الإنجليزية أو العربية. تفهم ألبا كلتيهما، مما يجعلها في متناول الجميع.',
    featureMultiDomainTitle: 'قوة متعددة المجالات',
    featureMultiDomainDescription: 'من علوم البيانات وتطوير الويب إلى الروبوتات والسحابة، توفر ألبا وحدات مدمجة لكل احتياجاتك.',
    featureVisionTitle: 'رؤية تفاعلية',
    featureVisionDescription: 'استخدم الكاميرا الخاصة بك للكشف عن الأشياء وتتبع الوجوه والتحليل البصري المدعوم بالذكاء الاصطناعي.',
    featureToolingTitle: 'أدوات موجهة للمطورين',
    featureToolingDescription: 'عزز إنتاجيتك مع إضافة VS Code المدعومة بالذكاء الاصطناعي، والاقتراحات الذكية، وبيئة REPL قوية.',
    featureDeploymentTitle: 'نشر فوري',
    featureDeploymentDescription: 'انشر روبوتات الدردشة والمواقع وخدمات الواجهة الخلفية في ثوانٍ بأوامر من سطر واحد.',
  },
};