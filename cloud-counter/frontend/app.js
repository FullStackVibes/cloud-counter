/**
 * CloudCounter - Frontend Application Logic (Milestone 2)
 * Handles network fetch requests to get and update the global counter with action parameters.
 */

// Target backend server URL (port 5000 as specified by Milestone requirements)
// Includes fallback to current origin when hosted through unified container ingress (port 3000)
const API_BASE_URL = (window.location.hostname.includes('run.app') || window.location.port === '3000')
  ? window.location.origin
  : 'http://localhost:5000';

// DOM Elements
const counterDisplay = document.getElementById('counter-display');
const incrementButton = document.getElementById('increment-btn');
const decrementButton = document.getElementById('decrement-btn');
const resetButton = document.getElementById('reset-btn');
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
 * On DOM content load, fire an asynchronous fetch() GET request to /api/counter
 */
async function fetchInitialCount() {
  updateStatus('Fetching count from server...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/counter`, {
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
 * When clicked, fire a fetch() POST request to /api/counter with the specified action
 * @param {string} action ('increment', 'decrement', or 'reset')
 * @param {HTMLButtonElement} btnElem
 */
async function handleCounterAction(action, btnElem) {
  const allButtons = [incrementButton, decrementButton, resetButton];
  allButtons.forEach(btn => { if (btn) btn.disabled = true; });

  const actionText = action === 'increment' ? 'Incrementing...' : (action === 'decrement' ? 'Decrementing...' : 'Resetting...');
  updateStatus(actionText);

  try {
    const response = await fetch(`${API_BASE_URL}/api/counter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ action: action })
    });

    if (!response.ok) {
      throw new Error(`Server status: ${response.status}`);
    }

    const data = await response.json();
    if (data && typeof data.count === 'number') {
      updateCounterUI(data.count);
      const successText = action === 'increment' ? 'Count incremented (+1).' : (action === 'decrement' ? 'Count decremented (-1).' : 'Count reset to 0.');
      updateStatus(successText);
    } else {
      throw new Error('Invalid response structure.');
    }
  } catch (error) {
    console.error(`[Frontend Error] Failed to execute ${action}:`, error);
    updateStatus(`Failed to execute ${action} on server.`, true);
  } finally {
    allButtons.forEach(btn => { if (btn) btn.disabled = false; });
  }
}

// Initial DOM Content Load event listener
document.addEventListener('DOMContentLoaded', () => {
  // Fire asynchronous GET request on initial load
  fetchInitialCount();

  // Attach click event listeners to the action buttons
  if (incrementButton) {
    incrementButton.addEventListener('click', () => handleCounterAction('increment', incrementButton));
  }
  if (decrementButton) {
    decrementButton.addEventListener('click', () => handleCounterAction('decrement', decrementButton));
  }
  if (resetButton) {
    resetButton.addEventListener('click', () => handleCounterAction('reset', resetButton));
  }
});
