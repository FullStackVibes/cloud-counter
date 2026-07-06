/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';

export default function App() {
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('Connecting to API...');
  const [isError, setIsError] = useState<boolean>(false);
  const [isIncrementing, setIsIncrementing] = useState<boolean>(false);
  const [pulse, setPulse] = useState<boolean>(false);

  // Target backend URL: uses current origin when in unified container (port 3000), otherwise localhost:5000
  const API_BASE_URL = (window.location.hostname.includes('run.app') || window.location.port === '3000')
    ? window.location.origin
    : 'http://localhost:5000';

  const fetchInitialCount = async () => {
    setStatus('Fetching count from server...');
    setIsError(false);
    try {
      const response = await fetch(`${API_BASE_URL}/api/count`, {
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

  const handleIncrement = async () => {
    setIsIncrementing(true);
    setStatus('Incrementing count...');
    setIsError(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/increment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }

      const data = await response.json();
      if (data && typeof data.count === 'number') {
        setCount(data.count);
        setStatus('Count saved to database.');
        triggerPulse();
      } else {
        throw new Error('Invalid response data.');
      }
    } catch (error) {
      console.error('[Frontend Error] Failed to increment count:', error);
      setStatus('Failed to update counter on server.');
      setIsError(true);
    } finally {
      setIsIncrementing(false);
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
            Milestone 1
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

        {/* Exactly ONE prominent, large interactive button that reads "Count" */}
        <button
          id="count-btn"
          type="button"
          onClick={handleIncrement}
          disabled={isIncrementing || count === null}
          className="w-full py-5 px-8 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xl rounded-2xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transform active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isIncrementing ? 'Counting...' : 'Count'}
        </button>
      </main>
    </div>
  );
}

