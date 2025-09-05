import React, { ReactNode } from 'react';
import { Theme, Language } from '../types.ts';
import { locales } from '../locales.ts';
import ThemeToggleButton from './ThemeToggleButton.tsx';
import { config } from '../config.ts';

interface DocumentationProps {
  onBack: () => void;
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.trim().split('\n');
  const elements: ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent = '';

  const flushCodeBlock = () => {
    if (codeBlockContent) {
      elements.push(
        <pre key={elements.length} className="bg-gray-200 dark:bg-gray-800 p-4 rounded-md my-4 overflow-x-auto">
          <code className="font-mono text-sm text-gray-800 dark:text-gray-200">{codeBlockContent.trim()}</code>
        </pre>
      );
      codeBlockContent = '';
    }
  };

  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (!inCodeBlock) {
        flushCodeBlock();
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent += line + '\n';
      return;
    }

    if (line.startsWith('## ')) {
      elements.push(<h2 key={index} className="text-3xl font-bold mt-8 mb-4 pb-2 border-b border-gray-300 dark:border-gray-600">{line.substring(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={index} className="text-2xl font-bold mt-6 mb-3">{line.substring(4)}</h3>);
    } else if (line.startsWith('- ')) {
       elements.push(
        <li key={index} className="ml-6 my-1 list-disc">
          <span dangerouslySetInnerHTML={{ __html: line.substring(2).replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 font-mono px-1 py-0.5 rounded text-sm">$1</code>') }} />
        </li>
      );
    } else if (line.trim() === '') {
        elements.push(<div key={index} className="h-4" />); // Spacer for empty lines
    } 
    else {
      elements.push(<p key={index} className="my-4" dangerouslySetInnerHTML={{ __html: line.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 font-mono px-1 py-0.5 rounded text-sm">$1</code>') }} />);
    }
  });
  
  flushCodeBlock(); // Add any remaining code block at the end

  return <>{elements}</>;
};


const Documentation: React.FC<DocumentationProps> = ({ onBack, theme, toggleTheme, language, setLanguage }) => {
    const t = locales[language];

    const handleLanguageToggle = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-sans ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <header className="p-4 flex justify-between items-center">
             <button
                onClick={onBack}
                className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-500"
                >
                {t.backButton}
            </button>
            <div className="flex items-center space-x-4">
                <button
                onClick={handleLanguageToggle}
                className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-500"
                >
                {t.languageToggleLabel}
                </button>
                <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
            </div>
        </header>
        <main className="p-4 sm:p-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-950 p-6 sm:p-8 rounded-lg shadow-lg">
                 <MarkdownRenderer content={t.docsContent} />
            </div>
        </main>
         <footer className="text-center p-4 text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; {config.copyright.year} {config.copyright.holder}. All rights reserved.</p>
        </footer>
        </div>
    );
};

export default Documentation;