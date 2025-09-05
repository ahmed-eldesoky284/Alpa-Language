import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { getSuggestions } from '../services/suggestionService.ts';
import { Theme, Language } from '../types.ts';
import ThemeToggleButton from './ThemeToggleButton.tsx';

interface CommandInputProps {
  onSubmit: (command: string) => void;
  commandHistory: string[];
  theme: Theme;
  onToggleTheme: () => void;
  language: Language;
  isChatting: boolean;
}

const CommandInput: React.FC<CommandInputProps> = ({ onSubmit, commandHistory, theme, onToggleTheme, language, isChatting }) => {
  const [inputValue, setInputValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const newSuggestions = getSuggestions(value);
    setSuggestions(newSuggestions);
    setActiveSuggestionIndex(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue);
      setInputValue('');
      setHistoryIndex(-1);
      setSuggestions([]);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    const parts = inputValue.trim().split(' ');
    const isCompletingCommand = parts.length <= 1 && !inputValue.endsWith(' ');
  
    if (isCompletingCommand) {
      setInputValue(suggestion + ' ');
    } else {
      parts[parts.length - 1] = suggestion;
      setInputValue(parts.join(' ') + ' ');
    }
  
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Suggestion navigation takes priority
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        handleSuggestionClick(suggestions[activeSuggestionIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setSuggestions([]);
        return;
      }
    }

    // Command history navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        if (newIndex !== historyIndex) {
            setHistoryIndex(newIndex);
            setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  };


  const chatPrompt = language === 'ar' ? 'محادثة> ' : 'CHAT> ';
  const alpaPrompt = language === 'ar' ? 'C:\\ألبا>' : 'C:\\ALPA>';
  const prompt = isChatting ? chatPrompt : alpaPrompt;

  return (
    <form onSubmit={handleSubmit} className="flex items-center border-t border-gray-200 dark:border-gray-700 pt-2">
      <span className="text-green-600 dark:text-green-400 mr-2">{prompt}</span>
      <div className="relative flex-grow">
         {suggestions.length > 0 && (
            <div className="absolute bottom-full left-0 mb-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto z-10">
            <ul>
                {suggestions.map((suggestion, index) => (
                <li
                    key={suggestion}
                    className={`px-3 py-1 cursor-pointer text-gray-800 dark:text-gray-300 ${index === activeSuggestionIndex ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    onMouseDown={(e) => e.preventDefault()} // Prevents input blur on click
                    onClick={() => handleSuggestionClick(suggestion)}
                >
                    {suggestion}
                </li>
                ))}
            </ul>
            </div>
        )}
        <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-gray-900 dark:text-gray-200 outline-none"
            autoFocus
            spellCheck="false"
            autoComplete="off"
            dir="auto"
        />
      </div>
       <ThemeToggleButton theme={theme} toggleTheme={onToggleTheme} />
    </form>
  );
};

export default CommandInput;