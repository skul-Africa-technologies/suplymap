let currentStep = 1;
const totalSteps = 4;

// Elements
const form = document.getElementById('registerForm');
const industrySelect = document.getElementById('industry');
const otherIndustryWrapper = document.getElementById('otherIndustryWrapper');
const passwordInput = document.getElementById('password');
const passwordStrengthEl = document.getElementById('passwordStrength');

// Show/hide other industry input
industrySelect.addEventListener('change', function() {
  if (this.value === 'Other') {
    otherIndustryWrapper.classList.remove('hidden');
    document.getElementById('otherIndustry').focus();
  } else {
    otherIndustryWrapper.classList.add('hidden');
  }
  clearError('industry');
});

// Password strength checker
passwordInput.addEventListener('input', function() {
  updatePasswordStrength(this.value);
  clearError('password');
});

function updatePasswordStrength(password) {
  if (!password) {
    passwordStrengthEl.classList.add('hidden');
    passwordStrengthEl.classList.remove('flex');
    return;
  }
  
  passwordStrengthEl.classList.remove('hidden');
  passwordStrengthEl.classList.add('flex');
  
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  
  let strength, segments, color, textColor;
  
  if (password.length < 6) {
    strength = 'Weak'; segments = 1; color = 'bg-status-error'; textColor = 'text-status-error';
  } else if (password.length >= 10 && hasNumber && hasSymbol && hasUppercase) {
    strength = 'Strong'; segments = 4; color = 'bg-status-success'; textColor = 'text-status-success';
  } else if (password.length >= 8 && (hasNumber || hasSymbol)) {
    strength = 'Good'; segments = 3; color = 'bg-brand-accent'; textColor = 'text-brand-accent';
  } else {
    strength = 'Fair'; segments = 2; color = 'bg-status-warning'; textColor = 'text-status-warning';
  }
  
  const segmentEls = passwordStrengthEl.querySelectorAll('[data-segment]');
  segmentEls.forEach((el, i) => {
    el.className = 'h-1 flex-1 rounded-full ' + (i < segments ? color : 'bg-app-border');
  });
  
  const labelEl = document.getElementById('strengthLabel');
  labelEl.textContent = strength;
  labelEl.className = 'text-xs font-medium ' + textColor;
}

function togglePassword(fieldId) {
  const input = document.getElementById(fieldId);
  const button = input.nextElementSibling;
  const eyeOpen = button.querySelector('.eye-open');
  const eyeClosed = button.querySelector('.eye-closed');
  
  if (input.type === 'password') {
    input.type = 'text';
    eyeOpen.classList.add('hidden');
    eyeClosed.classList.remove('hidden');
  } else {
    input.type = 'password';
    eyeOpen.classList.remove('hidden');
    eyeClosed.classList.add('hidden');
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

function validateStep(step) {
  let isValid = true;
  
  if (step === 1) {
    const fullName = document.getElementById('fullName').value.trim();
    if (fullName.length < 2) {
      showError('fullName', 'Full name must be at least 2 characters');
      isValid = false;
    } else if (!/^[a-zA-Z\s'-]+$/.test(fullName)) {
      showError('fullName', 'Only letters, spaces, hyphens and apostrophes allowed');
      isValid = false;
    } else {
      clearError('fullName');
    }
  }
  
  if (step === 2) {
    const industry = document.getElementById('industry').value;
    const otherIndustry = document.getElementById('otherIndustry').value.trim();
    
    if (!industry) {
      showError('industry', 'Please select your industry');
      isValid = false;
    } else if (industry === 'Other' && otherIndustry.length < 2) {
      showError('industry', 'Please describe your industry (at least 2 characters)');
      isValid = false;
    } else {
      clearError('industry');
    }
  }
  
  if (step === 3) {
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      showError('email', 'Enter a valid email address');
      isValid = false;
    } else {
      clearError('email');
    }
  }
  
  if (step === 4) {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password.length < 8) {
      showError('password', 'Password must be at least 8 characters');
      isValid = false;
    } else if (!/[0-9]/.test(password)) {
      showError('password', 'Must include at least one number');
      isValid = false;
    } else if (!/[^a-zA-Z0-9]/.test(password)) {
      showError('password', 'Must include at least one special character');
      isValid = false;
    } else {
      clearError('password');
    }
    
    if (password !== confirmPassword) {
      showError('confirmPassword', 'Passwords do not match');
      isValid = false;
    } else {
      clearError('confirmPassword');
    }
  }
  
  return isValid;
}

function updateProgress() {
  const percent = Math.round((currentStep / totalSteps) * 100);
  document.getElementById('currentStepNum').textContent = currentStep;
  document.getElementById('progressPercent').textContent = percent + '%';
  document.getElementById('progressBar').style.width = percent + '%';
}

function showStep(step) {
  const newStepEl = document.querySelector(`[data-step="${step}"]`);
  const currentStepEl = document.querySelector('.step.active');
  
  if (currentStepEl) {
    currentStepEl.classList.remove('active');
  }
  
  newStepEl.classList.add('active', 'fade-in');
  setTimeout(() => newStepEl.classList.remove('fade-in'), 250);
  
  // Focus first input
  const firstInput = newStepEl.querySelector('input, select');
  if (firstInput) setTimeout(() => firstInput.focus(), 50);
  
  updateProgress();
}

function nextStep() {
  if (!validateStep(currentStep)) return;
  
  if (currentStep < totalSteps) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

// Form submission
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  if (!validateStep(4)) return;
  
  const submitBtn = document.getElementById('submitBtn');
  const submitIcon = document.getElementById('submitIcon');
  const submitSpinner = document.getElementById('submitSpinner');
  const apiError = document.getElementById('apiError');
  
  // Show loading
  submitBtn.disabled = true;
  submitIcon.classList.add('hidden');
  submitSpinner.classList.remove('hidden');
  apiError.classList.add('hidden');
  apiError.classList.remove('flex');
  
  // Gather form data
  const industry = document.getElementById('industry').value;
  const formData = {
    fullName: document.getElementById('fullName').value.trim(),
    industry: industry === 'Other' ? document.getElementById('otherIndustry').value.trim() : industry,
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value,
  };
  
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Registration failed');
    }
    
    // Success - redirect to login
    window.location.href = '/login/?registered=true';
    
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

// Clear errors on input
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', () => clearError(input.id));
});
