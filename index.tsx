import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { initializeTfjs } from './services/tfjsService.ts';

// Initialize TensorFlow.js once before the application starts.
// This is the best practice to avoid platform warnings.
initializeTfjs().then(() => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
