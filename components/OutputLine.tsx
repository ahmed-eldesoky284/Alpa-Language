import React from 'react';
import { OutputType, Language } from '../types.ts';

interface OutputLineProps {
  type: OutputType;
  content: string;
  language: Language;
}

const OutputLine: React.FC<OutputLineProps> = ({ type, content, language }) => {
  const renderContent = () => {
    const prompt = language === 'ar' ? 'C:\\ألبا>' : 'C:\\ALPA>';
    switch (type) {
      case OutputType.COMMAND:
        return (
          <div className="flex">
            <span className="text-green-600 dark:text-green-400 mr-2">{prompt}</span>
            <span dir="auto">{content}</span>
          </div>
        );
      case OutputType.USER_INPUT:
        return (
          <div className="flex">
            <span className="text-blue-500 dark:text-blue-400 mr-2">{'>'}</span>
            <span dir="auto">{content}</span>
          </div>
        );
      case OutputType.RESPONSE:
         if (content.startsWith('data:image')) {
            return <img src={content} alt="Generated" className="max-w-sm my-2 rounded-lg" />;
          }
        return <pre dir="auto" className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{content}</pre>;
      case OutputType.ERROR:
        return <pre dir="auto" className="whitespace-pre-wrap text-red-600 dark:text-red-400">{content}</pre>;
      default:
        return <pre dir="auto" className="whitespace-pre-wrap">{content}</pre>;
    }
  };

  return <div className="mb-2">{renderContent()}</div>;
};

export default OutputLine;