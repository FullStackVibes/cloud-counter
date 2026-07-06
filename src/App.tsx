/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';

export default function App() {
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('Connecting to API...');
  const [isError, setIsError] = useState<boolean>(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [pulse, setPulse] = useState<boolean>(false);

  // Target backend URL: uses current origin when in unified container (port 3000), otherwise localhost:5000
  const API_BASE_URL = (window.location.hostname.includes('run.app') || window.location.port === '3000')
    ? window.location.origin
    : 'http://localhost:5000';

  const fetchInitialCount = async () => {
    setStatus('Fetching count from server...');
    setIsError(false);
    try {
      const response = await fetch(`${API_BASE_URL}/api/counter`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }

      const data = await response.json();
      if (data && typeof data.count === 'number') {
        setCount(data.count);
        setStatus('Connected to SQLite server.');
        triggerPulse();
      } else {
        throw new Error('Invalid JSON structure.');
      }
    } catch (error) {
      console.error('[Frontend Error] Failed to fetch initial count:', error);
      setStatus('Error connecting to API server.');
      setIsError(true);
      setCount(0);
    }
  };

  const handleCounterAction = async (action: 'increment' | 'decrement' | 'reset') => {
    setActiveAction(action);
    const actionText = action === 'increment' ? 'Incrementing...' : (action === 'decrement' ? 'Decrementing...' : 'Resetting...');
    setStatus(actionText);
    setIsError(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/counter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }

      const data = await response.json();
      if (data && typeof data.count === 'number') {
        setCount(data.count);
        const successText = action === 'increment' ? 'Count incremented (+1).' : (action === 'decrement' ? 'Count decremented (-1).' : 'Count reset to 0.');
        setStatus(successText);
        triggerPulse();
      } else {
        throw new Error('Invalid response data.');
      }
    } catch (error) {
      console.error(`[Frontend Error] Failed to execute ${action}:`, error);
      setStatus(`Failed to execute ${action} on server.`);
      setIsError(true);
    } finally {
      setActiveAction(null);
    }
  };

  const triggerPulse = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 150);
  };

  useEffect(() => {
    fetchInitialCount();
  }, []);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-6 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <main className="w-full max-w-sm bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center flex flex-col items-center justify-between min-h-[380px]">
        {/* Main Title */}
        <header className="w-full">
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-3">
            Milestone 2
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">CloudCounter</h1>
          <p className="text-slate-400 text-sm mt-1">Client-Server Mechanics</p>
        </header>

        {/* Central Text Display showing the current global counter value */}
        <div className="my-8 flex flex-col items-center justify-center">
          <div
            id="counter-display"
            className={`text-8xl sm:text-9xl font-black tracking-tighter text-indigo-400 select-none transition-transform duration-150 ease-out ${
              pulse ? 'scale-105 text-indigo-300' : ''
            }`}
          >
            {count !== null ? count : '...'}
          </div>
          <div
            id="status-message"
            className={`text-xs mt-4 h-4 font-medium transition-colors ${
              isError ? 'text-rose-400' : 'text-slate-500'
            }`}
          >
            {status}
          </div>
        </div>

        {/* Three distinct buttons styled with custom colors (Green for Increment, Red for Decrement, Gray for Reset) */}
        <div className="w-full flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              id="increment-btn"
              type="button"
              onClick={() => handleCounterAction('increment')}
              disabled={activeAction !== null || count === null}
              className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transform active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-1.5"
            >
              <span>{activeAction === 'increment' ? '...' : '+ Increment'}</span>
            </button>
            <button
              id="decrement-btn"
              type="button"
              onClick={() => handleCounterAction('decrement')}
              disabled={activeAction !== null || count === null}
              className="w-full py-4 px-4 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transform active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-rose-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-1.5"
            >
              <span>{activeAction === 'decrement' ? '...' : '- Decrement'}</span>
            </button>
          </div>
          <button
            id="reset-btn"
            type="button"
            onClick={() => handleCounterAction('reset')}
            disabled={activeAction !== null || count === null}
            className="w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-200 font-semibold text-base rounded-xl shadow-md shadow-slate-900/30 hover:shadow-slate-700/50 transform active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-slate-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            <span>{activeAction === 'reset' ? 'Resetting...' : '↺ Reset'}</span>
          </button>
        </div>
      </main>
    </div>
  );
}

