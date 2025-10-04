import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import AppOptimized from './AppOptimized';

// Performance optimizations
const root = ReactDOM.createRoot(document.getElementById('root'));

// Use requestIdleCallback for non-critical initialization
const initializeApp = () => {
  root.render(
    <React.StrictMode>
      <AppOptimized />
    </React.StrictMode>
  );
};

// Register service worker with better error handling
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Initialize app with performance considerations
if (window.requestIdleCallback) {
  window.requestIdleCallback(initializeApp, { timeout: 100 });
} else {
  // Fallback for browsers without requestIdleCallback
  setTimeout(initializeApp, 0);
}

// Register service worker after app initialization
if (window.requestIdleCallback) {
  window.requestIdleCallback(registerServiceWorker, { timeout: 200 });
} else {
  setTimeout(registerServiceWorker, 100);
}
