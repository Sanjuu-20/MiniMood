const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

function isLoggedIn() {
  return !!getToken();
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        removeToken();
        if (!window.location.pathname.includes('login')) {
          window.location.href = '/login';
        }
      }
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } 
  catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

async function register(username, email, password) {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  });
  
  if (data.token) {
    setToken(data.token);
  }
  
  return data;
}

async function login(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  if (data.token) {
    setToken(data.token);
  }
  
  return data;
}

function logout() {
  removeToken();
  window.location.href = '/';
}

async function getProfile() {
  return apiRequest('/auth/me');
}

async function getEntries(page = 1, limit = 10) {
  return apiRequest(`/entries?page=${page}&limit=${limit}`);
}

async function getTodayEntry() {
  return apiRequest('/entries/today');
}

async function getEntryByDate(date) {
  return apiRequest(`/entries/${date}`);
}

async function getEntriesRange(startDate, endDate) {
  return apiRequest(`/entries/range?start_date=${startDate}&end_date=${endDate}`);
}

async function saveEntry(moodId, note, entryDate = null) {
  const body = { mood_id: moodId, note };
  if (entryDate) {
    body.entry_date = entryDate;
  }
  
  return apiRequest('/entries', {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

async function deleteEntry(date) {
  return apiRequest(`/entries/${date}`, {
    method: 'DELETE'
  });
}

async function getStats() {
  return apiRequest('/entries/stats');
}

async function getMoods() {
  return apiRequest('/moods');
}

function showToast(message, type = 'success') {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/login';
    return false;
  }
  return true;
}

function redirectIfLoggedIn(path = '/home') {
  if (isLoggedIn()) {
    window.location.href = path;
    return true;
  }
  return false;
}

window.api = {
  register,
  login,
  logout,
  getProfile,
  isLoggedIn,
  requireAuth,
  redirectIfLoggedIn,
  getEntries,
  getTodayEntry,
  getEntryByDate,
  getEntriesRange,
  saveEntry,
  deleteEntry,
  getStats,
  getMoods,  
  showToast,
  formatDate,
  getTodayDate
};
