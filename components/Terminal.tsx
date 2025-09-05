import React from 'react';
import { HistoryItem, OutputType, Language } from '../types.ts';
import OutputLine from './OutputLine.tsx';

interface TerminalProps {
  history: HistoryItem[];
  isLoading: boolean;
  language: Language;
}

const LoadingIndicator: React.FC = () => (
    <div className="flex items-baseline space-x-1 text-gray-500 dark:text-gray-400">
        <span>Processing</span>
        <div className="w-1 h-1 bg-current rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-1 h-1 bg-current rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
    </div>
);


const Terminal: React.FC<TerminalProps> = ({ history, isLoading, language }) => {
  return (
    <div className="flex-grow" aria-live="polite">
      {history.map((item, index) => (
        <OutputLine key={index} type={item.type} content={item.content} language={language} />
      ))}
      {isLoading && <LoadingIndicator />}
    </div>
  );
};

export default Terminal;