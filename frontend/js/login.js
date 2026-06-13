// Check for registration success
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('registered') === 'true') {
  const successBanner = document.getElementById('successBanner');
  successBanner.classList.remove('hidden');
  successBanner.classList.add('flex');
}

// Key used to mark authenticated state in localStorage
const AUTH_KEY = 'suplymap_auth';

function togglePassword() {
  const input = document.getElementById('password');
  const button = input && input.nextElementSibling;
  const eyeOpen = button && button.querySelector('.eye-open');
  const eyeClosed = button && button.querySelector('.eye-closed');
  
  if (!input) return;
  
  if (input.type === 'password') {
    input.type = 'text';
    if (eyeOpen) eyeOpen.classList.add('hidden');
    if (eyeClosed) eyeClosed.classList.remove('hidden');
  } else {
    input.type = 'password';
    if (eyeOpen) eyeOpen.classList.remove('hidden');
    if (eyeClosed) eyeClosed.classList.add('hidden');
  }
}

function showError(fieldId, message) {
  const errorEl = document.getElementById(fieldId + 'Error');
  const input = document.getElementById(fieldId);
  
  if (errorEl) {
    errorEl.querySelector('span').textContent = message;
    errorEl.classList.remove('hidden');
    errorEl.classList.add('flex');
  }
  
  if (input) {
    input.classList.remove('border-app-border', 'focus:border-brand-accent', 'focus:ring-brand-accent/20');
    input.classList.add('border-status-error', 'focus:border-status-error', 'focus:ring-status-error/20');
  }
}

function clearError(fieldId) {
  const errorEl = document.getElementById(fieldId + 'Error');
  const input = document.getElementById(fieldId);
  
  if (errorEl) {
    errorEl.classList.add('hidden');
    errorEl.classList.remove('flex');
  }
  
  if (input) {
    input.classList.add('border-app-border', 'focus:border-brand-accent', 'focus:ring-brand-accent/20');
    input.classList.remove('border-status-error', 'focus:border-status-error', 'focus:ring-status-error/20');
  }
}

// Clear errors on input
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', () => clearError(input.id));
});

// Logout helper: clear auth and redirect to login
function logout() {
  try { localStorage.removeItem(AUTH_KEY); } catch (e) {}
  if (!window.location.pathname.startsWith('/login')) {
    window.location.href = '/login/';
  }
}

// Form submission
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  let isValid = true;
  
  if (!emailRegex.test(email)) {
    showError('email', 'Enter a valid email address');
    isValid = false;
  } else {
    clearError('email');
  }
  
  if (!password) {
    showError('password', 'Password is required');
    isValid = false;
  } else {
    clearError('password');
  }
  
  if (!isValid) return;
  
  const submitBtn = document.getElementById('submitBtn');
  const submitIcon = document.getElementById('submitIcon');
  const submitSpinner = document.getElementById('submitSpinner');
  const apiError = document.getElementById('apiError');
  const successBanner = document.getElementById('successBanner');
  
  // Hide banners
  successBanner.classList.add('hidden');
  successBanner.classList.remove('flex');
  apiError.classList.add('hidden');
  apiError.classList.remove('flex');
  
  // Show loading
  submitBtn.disabled = true;
  submitIcon.classList.add('hidden');
  submitSpinner.classList.remove('hidden');
  
  try {
    const response = await fetch('https://suplymap.onrender.com/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Invalid credentials');
    }
    
    // Success - store auth marker and redirect to dashboard
    const data = await response.json().catch(() => ({}));
    try {
      const token = data.token || null;
      if (token) {
        localStorage.setItem(AUTH_KEY, token);
      } else {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ ok: true, at: Date.now() }));
      }
    } catch (e) {}
    window.location.href = '/dashboard/';
    
  } catch (error) {
    apiError.querySelector('p').textContent = error.message || 'Something went wrong. Please try again.';
    apiError.classList.remove('hidden');
    apiError.classList.add('flex');
  } finally {
    submitBtn.disabled = false;
    submitIcon.classList.remove('hidden');
    submitSpinner.classList.add('hidden');
  }
});
