// Safely ensure window.fetch is writable and configurable (e.g. for sandboxed test runners/mockers)
try {
  if (typeof window !== 'undefined' && window.fetch) {
    const originalFetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      value: originalFetch,
      writable: true,
      configurable: true,
      enumerable: true
    });
  }
} catch (e) {
  console.warn('[CloudCounter] Polyfill for fetch configurability failed:', e);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
