/**
 * CloudCounter - Frontend Application Logic (Milestone 1)
 * Handles network fetch requests to get and update the global counter.
 */

// Target backend server URL (port 5000 as specified by Milestone 1 requirements)
// Includes fallback to current origin when hosted through unified container ingress (port 3000)
const API_BASE_URL = (window.location.hostname.includes('run.app') || window.location.port === '3000')
  ? window.location.origin
  : 'http://localhost:5000';

// DOM Elements
const counterDisplay = document.getElementById('counter-display');
const countButton = document.getElementById('count-btn');
const statusMessage = document.getElementById('status-message');

/**
 * Update the visible counter element on screen
 * @param {number|string} value 
 */
function updateCounterUI(value) {
  if (counterDisplay) {
    counterDisplay.textContent = value;
    // Brief animation feedback
    counterDisplay.classList.add('scale-105', 'text-indigo-300');
    setTimeout(() => {
      counterDisplay.classList.remove('scale-105', 'text-indigo-300');
    }, 150);
  }
}

/**
 * Update the status helper text
 * @param {string} text 
 * @param {boolean} isError 
 */
function updateStatus(text, isError = false) {
  if (statusMessage) {
    statusMessage.textContent = text;
    statusMessage.className = `text-xs mt-4 h-4 font-medium transition-colors ${
      isError ? 'text-rose-400' : 'text-slate-500'
    }`;
  }
}

/**
 * On DOM content load, fire an asynchronous fetch() GET request to /api/count
 */
async function fetchInitialCount() {
  updateStatus('Fetching count from server...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/count`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Server status: ${response.status}`);
    }

    const data = await response.json();
    if (data && typeof data.count === 'number') {
      updateCounterUI(data.count);
      updateStatus('Connected to SQLite server.');
    } else {
      throw new Error('Invalid JSON received from server.');
    }
  } catch (error) {
    console.error('[Frontend Error] Failed to fetch initial count:', error);
    updateStatus('Error connecting to API server.', true);
    updateCounterUI('0');
  }
}

/**
 * When clicked, fire a fetch() POST request to /api/increment
 */
async function handleIncrementCount() {
  if (countButton) {
    countButton.disabled = true;
  }
  updateStatus('Incrementing count...');

  try {
    const response = await fetch(`${API_BASE_URL}/api/increment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Server status: ${response.status}`);
    }

    const data = await response.json();
    if (data && typeof data.count === 'number') {
      updateCounterUI(data.count);
      updateStatus('Count saved to database.');
    } else {
      throw new Error('Invalid response structure.');
    }
  } catch (error) {
    console.error('[Frontend Error] Failed to increment count:', error);
    updateStatus('Failed to update counter on server.', true);
  } finally {
    if (countButton) {
      countButton.disabled = false;
    }
  }
}

// Initial DOM Content Load event listener
document.addEventListener('DOMContentLoaded', () => {
  // Fire asynchronous GET request on initial load
  fetchInitialCount();

  // Attach click event listener to the "Count" button
  if (countButton) {
    countButton.addEventListener('click', handleIncrementCount);
  }
});
