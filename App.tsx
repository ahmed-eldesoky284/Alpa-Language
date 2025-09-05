import React, { useState, useEffect, useRef } from 'react';
import Terminal from './components/Terminal.tsx';
import CommandInput from './components/CommandInput.tsx';
import Website from './components/Website.tsx';
import { HistoryItem, OutputType, ObjectDetectionMode, Theme, Language } from './types.ts';
import { processCommand } from './services/alpaLanguageService.ts';
import { WELCOME_MESSAGE } from './constants.ts';
import { generateDescriptionForImage, createChat, sendMessage } from './services/geminiService.ts';
import type { CameraViewHandles } from './components/CameraView.tsx';
import ThemeToggleButton from './components/ThemeToggleButton.tsx';
import CameraView from './components/CameraView.tsx';
import Documentation from './components/Documentation.tsx';
import type { Chat } from '@google/genai';


const App: React.FC = () => {
  const [view, setView] = useState<'website' | 'terminal' | 'docs'>('website');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [objectDetectionMode, setObjectDetectionMode] = useState<ObjectDetectionMode>(ObjectDetectionMode.NONE);
  const [isFaceDetectionOn, setIsFaceDetectionOn] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('alpa-theme') as Theme) || 'dark');
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('alpa-lang') as Language) || 'en');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const cameraViewRef = useRef<CameraViewHandles>(null);

  useEffect(() => {
    const root = window.document.documentElement;

    // Manage theme class on the html element for Tailwind CSS
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('alpa-theme', theme);

    // Manage language and text direction
    localStorage.setItem('alpa-lang', language);
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [theme, language]);

  useEffect(() => {
    if (view === 'terminal' && history.length === 0) {
      setHistory([{ type: OutputType.RESPONSE, content: WELCOME_MESSAGE }]);
    }
  }, [view, history.length]);

  useEffect(() => {
    if (view === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isLoading, view]);
  
  useEffect(() => {
    const loadVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // Initial call in case voices are already loaded
    return () => {
        window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
    setStream(null);
    setObjectDetectionMode(ObjectDetectionMode.NONE);
    setIsFaceDetectionOn(false);
  };

  const startCamera = async (onSuccess?: () => void) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsCameraOpen(true);
      onSuccess?.();
    } catch (err) {
      setHistory(prev => [...prev, { type: OutputType.ERROR, content: 'Error: Could not access camera. Please grant permission.' }]);
    }
  };

 const handleCameraDescribe = async (prompt: string) => {
    // FIX: Corrected typo from cameraViewref to cameraViewRef.
    if (!isCameraOpen || !cameraViewRef.current) {
      setHistory(prev => [...prev, { type: OutputType.ERROR, content: 'Error: Camera is not open. Use camera.open first.' }]);
      return;
    }
    
    setIsLoading(true);
    const base64Data = cameraViewRef.current.captureFrame();

    if (!base64Data) {
        setHistory(prev => [...prev, { type: OutputType.ERROR, content: 'Error: Could not capture frame. The camera may be disconnected or the video stream has ended. Please try `camera.open` again.' }]);
        setIsLoading(false);
        return;
    }

    const description = await generateDescriptionForImage(base64Data, prompt);

    setHistory(prev => [...prev, { type: OutputType.RESPONSE, content: description }]);
    setIsLoading(false);
};

  const handleCommandSubmit = async (command: string) => {
    if (isChatting) {
        setHistory(prev => [...prev, { type: OutputType.USER_INPUT, content: command }]);
        setIsLoading(true);
        const lowerCaseCommand = command.toLowerCase();

        if (lowerCaseCommand === 'exit' || lowerCaseCommand === 'خروج') {
            setIsChatting(false);
            setChatSession(null);
            setHistory(prev => [...prev, { type: OutputType.RESPONSE, content: 'Exited chat session.' }]);
            setIsLoading(false);
            return;
        }

        if (chatSession) {
            const response = await sendMessage(chatSession, command);
            setHistory(prev => [...prev, { type: OutputType.RESPONSE, content: response }]);
        } else {
            setHistory(prev => [...prev, { type: OutputType.ERROR, content: 'Error: Chat session not found. Please exit and start a new chat.' }]);
        }
        setIsLoading(false);
        setCommandHistory(prev => [...prev, command]);
        return;
    }
      
    setHistory(prev => [...prev, { type: OutputType.COMMAND, content: command }]);
    setIsLoading(true);

    const onOutput = (item: HistoryItem) => {
      setHistory(prevHistory => [...prevHistory, item]);
    };
    
    const result = await processCommand(command, isCameraOpen, onOutput);
    
    setIsLoading(false);

    if (result.commandKey !== 'CLEAR') {
        setCommandHistory(prev => [...prev, command]);
    }
    
    if (result.output) {
      const outputType = result.output.startsWith('Error:') ? OutputType.ERROR : OutputType.RESPONSE;
      onOutput({ type: outputType, content: result.output });
    }

    // Handle actions
    switch (result.action) {
      case 'START_CHAT':
        const newChat = createChat();
        setChatSession(newChat);
        setIsChatting(true);
        break;
      case 'CAMERA_START':
        if (!isCameraOpen) {
           await startCamera();
        }
        break;
      case 'CAMERA_STOP':
        stopCamera();
        break;
      case 'START_CAMERA_AND_DETECT':
        await startCamera(() => {
            if (result.payload && Object.values(ObjectDetectionMode).includes(result.payload as ObjectDetectionMode)) {
                setObjectDetectionMode(result.payload as ObjectDetectionMode);
            }
        });
        break;
      case 'CAMERA_CAPTURE_AND_DESCRIBE':
        handleCameraDescribe(result.payload as string);
        break;
      case 'SET_OBJECT_DETECTION_MODE':
        if (result.payload && Object.values(ObjectDetectionMode).includes(result.payload as ObjectDetectionMode)) {
            setObjectDetectionMode(result.payload as ObjectDetectionMode);
        }
        break;
      case 'SET_FACE_DETECTION':
        if (typeof result.payload === 'boolean') {
            setIsFaceDetectionOn(result.payload);
        }
        break;
      case 'CLEAR':
        stopCamera(); // Also stop camera on clear
        setHistory([{ type: OutputType.RESPONSE, content: WELCOME_MESSAGE }]);
        break;
      case 'SPEAK_TEXT':
        if (typeof result.payload === 'string' && result.payload.trim() !== '') {
            const utterance = new SpeechSynthesisUtterance(result.payload);
            const arabicRegex = /[\u0600-\u06FF]/;
            if (arabicRegex.test(result.payload)) {
                const arabicVoice = voices.find(voice => voice.lang.startsWith('ar'));
                if (arabicVoice) {
                    utterance.voice = arabicVoice;
                    utterance.lang = arabicVoice.lang;
                }
            }
            window.speechSynthesis.speak(utterance);
        }
        break;
      case 'DOWNLOAD_FILE':
        if (result.payload && result.payload.filename && typeof result.payload.content === 'string') {
            const { filename, content, mimeType } = result.payload;
            try {
                const blob = new Blob([content], { type: mimeType || 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (err) {
                console.error('Download failed:', err);
                setHistory(prev => [...prev, { type: OutputType.ERROR, content: 'Error: Could not trigger file download.' }]);
            }
        }
        break;
    }
  };

  if (view === 'website') {
    return <Website onLaunchTerminal={() => setView('terminal')} onShowDocs={() => setView('docs')} theme={theme} toggleTheme={toggleTheme} language={language} setLanguage={setLanguage} />;
  }

  if (view === 'docs') {
    return (
       <Documentation onBack={() => setView('website')} theme={theme} toggleTheme={toggleTheme} language={language} setLanguage={setLanguage} />
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen font-mono p-4 flex flex-col">
       <div className="flex-grow overflow-y-auto">
        <Terminal history={history} isLoading={isLoading} language={language} />
        {isCameraOpen && stream && (
            <CameraView ref={cameraViewRef} stream={stream} objectDetectionMode={objectDetectionMode} isFaceDetectionOn={isFaceDetectionOn} />
        )}
        <div ref={terminalEndRef} />
       </div>
      <CommandInput onSubmit={handleCommandSubmit} commandHistory={commandHistory} theme={theme} onToggleTheme={toggleTheme} language={language} isChatting={isChatting} />
    </div>
  );
};

export default App;