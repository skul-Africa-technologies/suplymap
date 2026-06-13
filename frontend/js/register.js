/* ── SuplyMap Register ──────────────────────────────────────── */

const API_BASE = 'https://suplymap.onrender.com/api/v1';

/* ── DOM refs ── */
const step1El         = document.getElementById('step1');
const step2El         = document.getElementById('step2');
const nextBtn         = document.getElementById('nextBtn');
const backBtn         = document.getElementById('backBtn');
const registerForm    = document.getElementById('registerForm');
const progressBar     = document.getElementById('progressBar');
const mobileStepText  = document.getElementById('mobileStepText');

const fullnameInput   = document.getElementById('fullname');
const industrySelect  = document.getElementById('industry');
const emailInput      = document.getElementById('email');
const passwordInput   = document.getElementById('password');

const fullnameError   = document.getElementById('fullnameError');
const industryError   = document.getElementById('industryError');
const emailError      = document.getElementById('emailError');
const passwordError   = document.getElementById('passwordError');

const errorBanner     = document.getElementById('errorBanner');
const errorText       = document.getElementById('errorText');

const submitBtn       = document.getElementById('submitBtn');
const btnText         = document.getElementById('btnText');
const btnSpinner      = document.getElementById('btnSpinner');

const togglePwd       = document.getElementById('togglePassword');
const eyeIcon         = document.getElementById('eyeIcon');
const strengthContainer = document.getElementById('strengthContainer');
const strengthLabel   = document.getElementById('strengthLabel');
const bars            = [
  document.getElementById('bar1'),
  document.getElementById('bar2'),
  document.getElementById('bar3'),
  document.getElementById('bar4'),
];

/* Left panel step indicators */
const stepIndicators  = document.querySelectorAll('.step-indicator');

/* ── State ── */
let currentStep = 1;

/* ── Helpers ── */
function showError(el, msg) {
  el.textContent = msg;
  el.classList.remove('hidden');
}

function clearError(el) {
  el.textContent = '';
  el.classList.add('hidden');
}

function setInputState(input, state) {
  input.classList.remove('is-error', 'is-valid');
  if (state) input.classList.add(state);
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  btnText.textContent = loading ? 'Creating account…' : 'Create account';
  btnSpinner.classList.toggle('hidden', !loading);
}

function showBanner(msg) {
  errorText.textContent = msg;
  errorBanner.classList.remove('hidden');
  errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideBanner() {
  errorBanner.classList.add('hidden');
}

/* ── Update UI for step ── */
function updateStepUI(step) {
  currentStep = step;
  progressBar.style.width = step === 1 ? '50%' : '100%';
  mobileStepText.textContent = `Step ${step} of 2`;

  /* Left panel indicators */
  stepIndicators.forEach((el) => {
    const n = parseInt(el.dataset.step, 10);
    el.classList.remove('is-active', 'is-done');
    if (n < step) el.classList.add('is-done');
    if (n === step) el.classList.add('is-active');
  });
}

/* ── Animate step transition ── */
function showStep(incoming, outgoing) {
  outgoing.classList.add('step-exit');
  setTimeout(() => {
    outgoing.classList.add('hidden');
    outgoing.classList.remove('step-exit');
    incoming.classList.remove('hidden');
    incoming.classList.add('step-enter');
    setTimeout(() => incoming.classList.remove('step-enter'), 300);
  }, 200);
}

/* ── Validators ── */
function validateFullname(value) {
  if (!value.trim()) return 'Full name is required.';
  if (value.trim().length < 2) return 'Enter your full name.';
  return null;
}

function validateIndustry(value) {
  if (!value) return 'Please select your industry.';
  return null;
}

function validateEmail(value) {
  if (!value.trim()) return 'Email address is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
  return null;
}

function validatePassword(value) {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

/* ── Password strength ── */
function getStrength(value) {
  let score = 0;
  if (value.length >= 8)  score++;
  if (value.length >= 12) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return Math.min(Math.ceil(score * 4 / 5), 4);
}

const STRENGTH_CONFIG = [
  { label: '',        color: 'bg-gray-100' },
  { label: 'Weak',    color: 'bg-red-400'  },
  { label: 'Fair',    color: 'bg-yellow-400' },
  { label: 'Good',    color: 'bg-brand-softblue' },
  { label: 'Strong',  color: 'bg-brand-green' },
];

function updateStrength(value) {
  if (!value) {
    strengthContainer.classList.add('hidden');
    return;
  }
  strengthContainer.classList.remove('hidden');
  const score = getStrength(value);
  const config = STRENGTH_CONFIG[score];

  bars.forEach((bar, i) => {
    bar.className = `strength-bar h-1 flex-1 rounded-full transition-all ${i < score ? config.color : 'bg-gray-100'}`;
  });

  strengthLabel.textContent = score > 0 ? `${config.label} password` : '';
  strengthLabel.className = `text-xs ${score <= 1 ? 'text-red-500' : score === 2 ? 'text-yellow-600' : 'text-brand-secondary'}`;
}

/* ── Live validation ── */
fullnameInput.addEventListener('blur', () => {
  const err = validateFullname(fullnameInput.value);
  err ? (showError(fullnameError, err), setInputState(fullnameInput, 'is-error'))
      : (clearError(fullnameError), setInputState(fullnameInput, 'is-valid'));
});

industrySelect.addEventListener('blur', () => {
  const err = validateIndustry(industrySelect.value);
  err ? (showError(industryError, err), setInputState(industrySelect, 'is-error'))
      : (clearError(industryError), setInputState(industrySelect, 'is-valid'));
});

emailInput.addEventListener('blur', () => {
  const err = validateEmail(emailInput.value);
  err ? (showError(emailError, err), setInputState(emailInput, 'is-error'))
      : (clearError(emailError), setInputState(emailInput, 'is-valid'));
});

passwordInput.addEventListener('input', () => {
  updateStrength(passwordInput.value);
  clearError(passwordError);
  setInputState(passwordInput, null);
  hideBanner();
});

passwordInput.addEventListener('blur', () => {
  const err = validatePassword(passwordInput.value);
  err ? (showError(passwordError, err), setInputState(passwordInput, 'is-error'))
      : (clearError(passwordError), setInputState(passwordInput, 'is-valid'));
});

/* Clear on input */
fullnameInput.addEventListener('input', () => { clearError(fullnameError); setInputState(fullnameInput, null); });
industrySelect.addEventListener('change', () => { clearError(industryError); setInputState(industrySelect, null); });
emailInput.addEventListener('input', () => { clearError(emailError); setInputState(emailInput, null); hideBanner(); });

/* ── Toggle password visibility ── */
togglePwd.addEventListener('click', () => {
  const visible = passwordInput.type === 'text';
  passwordInput.type = visible ? 'password' : 'text';
  eyeIcon.className = visible ? 'ri-eye-line text-base' : 'ri-eye-off-line text-base';
});

/* ── Step 1 → Step 2 ── */
nextBtn.addEventListener('click', () => {
  const nameErr     = validateFullname(fullnameInput.value);
  const industryErr = validateIndustry(industrySelect.value);
  let hasError = false;

  if (nameErr) {
    showError(fullnameError, nameErr);
    setInputState(fullnameInput, 'is-error');
    hasError = true;
  }

  if (industryErr) {
    showError(industryError, industryErr);
    setInputState(industrySelect, 'is-error');
    hasError = true;
  }

  if (hasError) return;

  showStep(step2El, step1El);
  updateStepUI(2);
  emailInput.focus();
});

/* ── Step 2 → Step 1 ── */
backBtn.addEventListener('click', () => {
  hideBanner();
  showStep(step1El, step2El);
  updateStepUI(1);
});

/* ── Form submit ── */
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideBanner();

  const emailVal    = emailInput.value.trim();
  const passwordVal = passwordInput.value;

  const emailErr = validateEmail(emailVal);
  const pwErr    = validatePassword(passwordVal);
  let hasError   = false;

  if (emailErr) {
    showError(emailError, emailErr);
    setInputState(emailInput, 'is-error');
    hasError = true;
  }

  if (pwErr) {
    showError(passwordError, pwErr);
    setInputState(passwordInput, 'is-error');
    hasError = true;
  }

  if (hasError) return;

  /* Build payload */
  const payload = {
    fullname: fullnameInput.value.trim(),
    industry: industrySelect.value,
    email:    emailVal,
    password: passwordVal,
  };

  setLoading(true);

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      /* Store token if returned */
      if (data.token) {
        localStorage.setItem('sm_token', data.token);
      }
      if (data.data && data.data.token) {
        localStorage.setItem('sm_token', data.data.token);
      }

      /* Redirect */
      window.location.href = '/';
    } else {
      const msg =
        data.message ||
        data.error ||
        (data.errors && data.errors[0] && data.errors[0].message) ||
        'Registration failed. Please check your details and try again.';
      showBanner(msg);
    }
  } catch {
    showBanner('Unable to connect. Check your internet connection and try again.');
  } finally {
    setLoading(false);
  }
});

/* ── Init ── */
updateStepUI(1);
