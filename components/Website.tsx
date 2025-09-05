import React from 'react';
import { Theme, Language } from '../types.ts';
import { locales } from '../locales.ts';
import ThemeToggleButton from './ThemeToggleButton.tsx';
import { config } from '../config.ts';

type OperatingSystem = 'Windows' | 'macOS' | 'Linux' | 'Unknown';

const getOperatingSystem = (): OperatingSystem => {
    const platform = window.navigator.platform;
    const userAgent = window.navigator.userAgent;

    if (platform.startsWith('Win') || /Windows/.test(userAgent)) {
        return 'Windows';
    }
    if (platform.startsWith('Mac') || /Macintosh/.test(userAgent)) {
        return 'macOS';
    }
    if (platform.startsWith('Linux') || /Linux/.test(userAgent)) {
        return 'Linux';
    }
    return 'Unknown';
}

const handleDownload = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
};


const DownloadButton: React.FC<{ icon: JSX.Element, label: string, onClick?: () => void }> = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center justify-center gap-3 px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transform hover:scale-105 transition-transform duration-200 w-full max-w-xs sm:w-auto"
    >
        {icon}
        <span>{label}</span>
    </button>
);

const FeatureCard: React.FC<{ icon: JSX.Element, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 h-full">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-gray-950 text-blue-600 dark:text-blue-400 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);


const Website: React.FC<{
  onLaunchTerminal: () => void;
  onShowDocs: () => void;
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}> = ({ onLaunchTerminal, onShowDocs, theme, toggleTheme, language, setLanguage }) => {
  const t = locales[language];
  const [detectedOS, setDetectedOS] = React.useState<OperatingSystem>('Unknown');

  React.useEffect(() => {
    setDetectedOS(getOperatingSystem());
  }, []);


  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const icons = {
      windows: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3,12V3H12V12H3M3,21V13.5H12V21H3M13.5,3V12H21V3H13.5M13.5,21V13.5H21V21H13.5Z" /></svg>,
      macos: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.1,13.84C19.25,13.84 19.5,13.84 19.65,13.84C19.65,13.56 19.6,12.39 19.6,12.11C19.55,10.63 18.8,8.34 17.2,7.14C16.2,6.34 14.8,6.09 14,6.09C12.3,6.09 11.2,6.94 10.3,6.94C9.4,6.94 8.5,6.14 7.2,6.14C5.6,6.14 4.1,7.14 3.3,8.74C1.5,12.24 2.8,16.59 4.6,18.94C5.5,19.94 6.6,21.09 8,21.09C8.9,21.09 9.3,20.59 10.9,20.59C12.5,20.59 12.9,21.09 14,21.09C15.3,21.09 16.2,19.94 17.1,18.94C17.7,18.24 18.2,17.34 18.6,16.44C18.1,16.24 17.5,15.94 17.1,15.44C16.5,14.64 16.6,13.64 17.3,13.04C17.8,12.64 18.5,12.59 19,12.89C19,12.84 19.05,12.84 19.1,12.84M13.2,4.09C13.8,3.49 14.2,2.69 14.1,1.79C13.2,1.89 12.3,2.39 11.8,3.09C11.2,3.79 10.7,4.69 10.8,5.59C11.8,5.49 12.6,4.79 13.2,4.09Z" /></svg>,
      linux: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14,14.2H10V20.6C10.9,20.8 11.5,21 12,21C12.6,21 13.1,20.8 14,20.6V14.2M18.8,10.3C18.9,10.8 19,11.4 19,12C19,12.2 19,12.3 19,12.5C18.3,12.4 17.5,12.2 16.7,11.9C16,11.7 15,11.5 14,11.1V4.4C15.2,4.8 16.2,5.1 17.1,5.4C18,5.7 18.5,5.9 18.7,6C19,6.1 19.1,6.2 19.2,6.2C19.5,6.4 19.6,6.6 19.5,6.9C19.4,7.2 19.1,7.5 18.7,7.6C18.5,7.7 18.3,7.7 18,7.7C17.3,7.7 16.4,7.5 15.3,7.1C15,7 14.5,6.9 14,6.8V10.1C15.3,10.4 16.8,10.5 18.3,10.3C18.5,10.3 18.6,10.3 18.8,10.3M12,2C14,2 15.3,2.4 16.1,3.2C16.9,4 17,4.8 17,5.5C17,5.7 17,5.8 16.9,6C16.8,6.1 16.5,6.3 16.1,6.5C15.7,6.7 15,6.9 14,7.1V7.2C14.7,7.5 15.2,7.9 15.5,8.4C15.8,8.9 16,9.5 16,10.1C16,11.2 15.5,12.1 14.6,12.8C13.7,13.5 12.7,13.8 11.5,13.8H10V11.8H11.5C12,11.8 12.3,11.7 12.6,11.5C12.9,11.3 13,11 13,10.6C13,10.2 12.9,9.9 12.6,9.7C12.3,9.5 12,9.4 11.5,9.4H10V7.4H11.5C11.9,7.4 12.2,7.3 12.5,7.1C12.8,6.9 12.9,6.6 12.9,6.2C12.9,5.8 12.8,5.5 12.5,5.3C12.2,5.1 11.9,5 11.5,5H10V3.8H11.2C12.3,3.8 13.1,4.1 13.5,4.8C13.6,5 13.8,5.1 14,5.1C14.2,5.1 14.4,5 14.5,4.8C14.6,4.6 14.6,4.4 14.5,4.2C14.2,3.3 13.3,2.8 12,2.8C11.1,2.8 10.4,3 10,3.2V2H12M5,6.1C5.2,6 5.5,5.8 5.9,5.6C6.3,5.4 6.8,5.2 7.4,5C8.3,4.7 9,4.5 9.1,4.4C9.2,4.3 9.3,4.2 9.4,4.2C9.5,4.2 9.6,4.3 9.7,4.3C9.9,4.4 10,4.6 10,4.9C10,5.2 9.8,5.4 9.5,5.5C9.4,5.6 9.2,5.6 9,5.6C8.3,5.6 7.4,5.8 6.3,6.2C6,6.3 5.5,6.4 5,6.5V9.8C6.3,9.5 7.8,9.4 9.3,9.6C9.5,9.6 9.6,9.6 9.8,9.6C9.9,10.1 10,10.7 10,11.3C10,11.5 10,11.6 10,11.8C9.3,11.7 8.5,11.5 7.7,11.2C7,11 6,10.8 5,10.4V4.4L5,6.1Z" /></svg>,
      vscode: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23,3.3l-5.7,2.3v12.8l5.7,2.3V3.3z M15.2,0L2.3,5.6v12.8L15.2,24V0z M13.1,17.4l-4-2.3V8.9l4-2.3V17.4z"/></svg>,
  };
  
   const featureIcons = {
    ai: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2a1 1 0 0 0 1 1h2"/><path d="M15 5h2a1 1 0 0 1 1 1v2"/></svg>,
    bilingual: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>,
    multiDomain: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5a1.5 1.5 0 0 1 3 0V11a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V9.5a1.5 1.5 0 0 1 3 0V11a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V9.5a1.5 1.5 0 0 1 3 0V11a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v- симптомы"/><rect x="3" y="14" width="18" height="7" rx="2"/></svg>,
    vision: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    tooling: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 18-6-6 6-6"/><path d="M8 6h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2z"/></svg>,
    deployment: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/><path d="M12 18h8"/><path d="M18 15v6"/><path d="M15 18h-2a2 2 0 1 0 0-4h2"/></svg>,
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-sans ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="absolute top-4 right-4 flex items-center space-x-4 z-10">
        <button
          onClick={handleLanguageToggle}
          className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-500"
        >
          {t.languageToggleLabel}
        </button>
        <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
      </div>
      <main className="text-center p-8 flex flex-col items-center w-full">
        <div className="min-h-[50vh] flex flex-col justify-center items-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            {t.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
            {t.subtitle}
            </p>
            <div className="max-w-2xl mx-auto mb-10">
            <p className="text-base text-gray-700 dark:text-gray-400">
                {t.description}
            </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button
                    onClick={onLaunchTerminal}
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transform hover:scale-105 transition-transform duration-200"
                    >
                    {t.launchButton}
                </button>
                <button
                    onClick={onShowDocs}
                    className="px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-75 transform hover:scale-105 transition-transform duration-200"
                    >
                    {t.docsButton}
                </button>
            </div>
        </div>

        <section className="w-full max-w-6xl px-4 py-16 bg-gray-100 dark:bg-gray-950 rounded-2xl">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">{t.featuresTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard icon={featureIcons.ai} title={t.featureAiTitle} description={t.featureAiDescription} />
                <FeatureCard icon={featureIcons.bilingual} title={t.featureBilingualTitle} description={t.featureBilingualDescription} />
                <FeatureCard icon={featureIcons.multiDomain} title={t.featureMultiDomainTitle} description={t.featureMultiDomainDescription} />
                <FeatureCard icon={featureIcons.vision} title={t.featureVisionTitle} description={t.featureVisionDescription} />
                <FeatureCard icon={featureIcons.tooling} title={t.featureToolingTitle} description={t.featureToolingDescription} />
                <FeatureCard icon={featureIcons.deployment} title={t.featureDeploymentTitle} description={t.featureDeploymentDescription} />
            </div>
        </section>


        <section className="w-full max-w-4xl px-4 mt-24">
            <h2 className="text-3xl font-bold mb-4">{t.installTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{t.installDescription}</p>
            <div className="flex flex-col items-center">
                <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 mb-6">
                    {detectedOS !== 'Unknown' && (
                        <DownloadButton 
                            icon={icons[detectedOS.toLowerCase() as keyof typeof icons]} 
                            label={`${t.downloadFor} ${detectedOS}`} 
                            onClick={() => handleDownload(config.downloads[detectedOS.toLowerCase() as 'windows' | 'macos' | 'linux'])} 
                        />
                    )}
                    <DownloadButton 
                        icon={icons.vscode}
                        label={t.vscodeExtension}
                        onClick={() => handleDownload(config.downloads.vscode_extension_marketplace)}
                    />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-x-4 gap-y-2 flex-wrap justify-center">
                        <span className="font-semibold">{t.otherPlatforms}:</span>
                        {detectedOS !== 'Windows' && <a href="#" onClick={(e) => { e.preventDefault(); handleDownload(config.downloads.windows); }} className="hover:underline">{t.downloadWindows}</a>}
                        {detectedOS !== 'macOS' && <a href="#" onClick={(e) => { e.preventDefault(); handleDownload(config.downloads.macos); }} className="hover:underline">{t.downloadMacOS}</a>}
                        {detectedOS !== 'Linux' && <a href="#" onClick={(e) => { e.preventDefault(); handleDownload(config.downloads.linux); }} className="hover:underline">{t.downloadLinux}</a>}
                    </div>
                </div>
            </div>
        </section>

      </main>
      <footer className="w-full text-center p-4 text-sm text-gray-500 dark:text-gray-400 mt-16">
        <p>&copy; {config.copyright.year} {config.copyright.holder}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Website;