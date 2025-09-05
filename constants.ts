import { ObjectDetectionMode } from './types.ts';

export const WELCOME_MESSAGE = `Welcome to Alpa Language v1.0
Copyright (c) 2025 Ahmed Eldesoky.
Type 'help' for a list of available commands.`;

export interface CommandDef {
  aliases: string[];
  description: string;
  usage?: string;
  args?: string[];
  action?: string;
  payload?: (parts: string[]) => any;
}

export const COMMAND_MAP: { [key: string]: CommandDef } = {
  HELP: {
    aliases: ['help', 'مساعدة'],
    description: 'Displays a list of available commands and their descriptions.',
    usage: 'help',
  },
  CLEAR: {
    aliases: ['clear', 'مسح'],
    description: 'Clears the terminal screen.',
    usage: 'clear',
    action: 'CLEAR',
  },
  EXIT: {
    aliases: ['exit', 'خروج'],
    description: 'Exits the terminal (simulated).',
    usage: 'exit',
  },
  AI_CHAT: {
    aliases: ['ai.chat', 'ذكاء.محادثة'],
    description: 'Starts an interactive chat session with the AI.',
    usage: 'ai.chat',
    action: 'START_CHAT',
  },
  AI_IMAGE: {
    aliases: ['image', 'تخيل'],
    description: 'Generates an image based on a text prompt.',
    usage: 'image <prompt>',
  },
  CAMERA_OPEN: {
    aliases: ['camera.open', 'كاميرا.فتح'],
    description: 'Opens the camera view.',
    usage: 'camera.open',
    action: 'CAMERA_START',
  },
  CAMERA_CLOSE: {
    aliases: ['camera.close', 'كاميرا.اغلاق'],
    description: 'Closes the camera view.',
    usage: 'camera.close',
    action: 'CAMERA_STOP',
  },
  CAMERA_DESCRIBE: {
    aliases: ['camera.describe', 'كاميرا.وصف'],
    description: 'Uses AI to describe what the camera sees. You can add a prompt.',
    usage: 'camera.describe [prompt]',
    action: 'CAMERA_CAPTURE_AND_DESCRIBE',
    payload: (parts) => parts.join(' '),
  },
  DETECT_OBJECTS: {
    aliases: ['detect.objects', 'كشف.اشياء'],
    description: `Detects objects, people, or both in the camera view.`,
    usage: `detect.objects <${Object.values(ObjectDetectionMode).join('|')}>`,
    args: Object.values(ObjectDetectionMode),
    action: 'SET_OBJECT_DETECTION_MODE',
    payload: (parts) => parts[0] || ObjectDetectionMode.OBJECTS,
  },
  DETECT_FACES: {
    aliases: ['detect.faces', 'كشف.وجوه'],
    description: 'Toggles face detection on or off.',
    usage: 'detect.faces <on|off>',
    args: ['on', 'off'],
    action: 'SET_FACE_DETECTION',
    payload: (parts) => parts[0] === 'on',
  },
  BOT_NEW: {
    aliases: ['bot.new', 'بوت.جديد'],
    description: 'Builds and deploys a chatbot for various platforms (e.g., web, whatsapp, telegram).',
    usage: 'bot.new <platform> <data_source_url_or_file>',
  },
  AI_SPEECH_TO_TEXT: {
    aliases: ['ai.stt', 'ذكاء.صوت_الى_نص'],
    description: 'Transcribes audio from a file into text.',
    usage: 'ai.stt <file.mp3>',
  },
  AI_TEXT_TO_SPEECH: {
    aliases: ['ai.tts', 'ذكاء.نص_الى_صوت'],
    description: 'Converts text into speech.',
    usage: 'ai.tts "<text_to_convert>"',
    action: 'SPEAK_TEXT',
    payload: (parts) => parts.join(' '),
  },
  AI_OCR: {
    aliases: ['ai.ocr', 'ذكاء.استخراج_نص'],
    description: 'Extracts text from an image or video file.',
    usage: 'ai.ocr <image.png | video.mp4>',
  },
  AI_ANALYZE: {
    aliases: ['ai.analyze', 'ذكاء.تحليل'],
    description: 'Performs a deep analysis of the provided content (e.g., sentiment, topics).',
    usage: 'ai.analyze <"text content" | file.txt>',
  },
  AI_SUMMARIZE: {
    aliases: ['ai.summarize', 'ذكاء.تلخيص'],
    description: 'Fetches content from a URL and generates a concise summary.',
    usage: 'ai.summarize <url>',
  },
  DEPLOY_GHPAGES: {
    aliases: ['deploy.ghpages', 'نشر.ghpages'],
    description: 'Builds and deploys the Alpa website to GitHub Pages.',
    usage: 'deploy.ghpages',
  },
  DEPLOY_VSC_EXTENSION: {
    aliases: ['deploy.vscode', 'نشر.vscode'],
    description: 'Packages the Alpa VS Code extension into a downloadable file.',
    usage: 'deploy.vscode',
  },
  DEPLOY_VERCEL: {
    aliases: ['deploy.vercel', 'نشر.vercel'],
    description: 'Deploys the Alpa project to Vercel.',
    usage: 'deploy.vercel',
  },
};