import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import type { RegisterFormData } from '../types/auth';
import { industries } from '../data/industries';
import api from '../lib/axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ProgressBar from '../components/ui/ProgressBar';

/* ── Step Schemas ───────────────────────────────────────── */

const step1Schema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Only letters allowed'),
});

const step2Schema = z.object({
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Only letters allowed'),
});

const step4Schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

const step5Schema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Must include at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Must include at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/* ── Password Strength ──────────────────────────────────── */

type Strength = 'weak' | 'fair' | 'good' | 'strong';

function evaluateStrength(password: string): Strength {
  if (password.length < 6) return 'weak';
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  if (password.length >= 10 && hasNumber && hasSymbol && hasUppercase)
    return 'strong';
  if (password.length >= 8 && (hasNumber || hasSymbol)) return 'good';
  return 'fair';
}

const strengthConfig: Record<Strength, { segments: number; color: string; label: string }> = {
  weak: { segments: 1, color: 'bg-status-error', label: 'Weak' },
  fair: { segments: 2, color: 'bg-status-warning', label: 'Fair' },
  good: { segments: 3, color: 'bg-brand-accent', label: 'Good' },
  strong: { segments: 4, color: 'bg-success', label: 'Strong' },
};

const strengthTextColor: Record<Strength, string> = {
  weak: 'text-status-error',
  fair: 'text-status-warning',
  good: 'text-brand-accent',
  strong: 'text-success',
};

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const strength = evaluateStrength(password);
  const config = strengthConfig[strength];

  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            className={`h-1 flex-1 rounded-full ${
              seg <= config.segments ? config.color : 'bg-app-border'
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${strengthTextColor[strength]}`}>
        {config.label}
      </span>
    </div>
  );
}

/* ── Step transition animation ──────────────────────────── */

const stepVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

/* ── Register Page ──────────────────────────────────────── */

export default function Register() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<RegisterFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [otherIndustry, setOtherIndustry] = useState('');
  const [industryError, setIndustryError] = useState('');

  /* Step 1 form */
  const step1Form = useForm<{ firstName: string }>({
    resolver: zodResolver(step1Schema),
    defaultValues: { firstName: formData.firstName ?? '' },
  });

  /* Step 2 form */
  const step2Form = useForm<{ lastName: string }>({
    resolver: zodResolver(step2Schema),
    defaultValues: { lastName: formData.lastName ?? '' },
  });

  /* Step 4 form */
  const step4Form = useForm<{ email: string }>({
    resolver: zodResolver(step4Schema),
    defaultValues: { email: formData.email ?? '' },
  });

  /* Step 5 form */
  const step5Form = useForm<{ password: string; confirmPassword: string }>({
    resolver: zodResolver(step5Schema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue = step5Form.watch('password');

  /* ── Navigation helpers ─────────────────────────────── */

  const goBack = useCallback(() => {
    setCurrentStep((s) => Math.max(1, s - 1));
  }, []);

  const handleStep1Next = step1Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, firstName: data.firstName }));
    setCurrentStep(2);
  });

  const handleStep2Next = step2Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, lastName: data.lastName }));
    setCurrentStep(3);
  });

  const handleStep3Next = () => {
    if (!selectedIndustry) {
      setIndustryError('Please select your industry');
      return;
    }
    if (selectedIndustry === 'Other' && otherIndustry.trim().length < 2) {
      setIndustryError('Please describe your industry (at least 2 characters)');
      return;
    }
    setIndustryError('');
    const industryValue =
      selectedIndustry === 'Other' ? otherIndustry.trim() : selectedIndustry;
    setFormData((prev) => ({ ...prev, industry: industryValue }));
    setCurrentStep(4);
  };

  const handleStep4Next = step4Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, email: data.email }));
    setCurrentStep(5);
  });

  const handleFinalSubmit = step5Form.handleSubmit(async (data) => {
    setApiError('');
    setIsSubmitting(true);
    try {
      await api.post('/api/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        industry: formData.industry,
        email: formData.email,
        password: data.password,
      });
      navigate('/login?registered=true');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const message =
        error?.response?.data?.message ??
        'Something went wrong. Please try again.';
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  /* ── Render ─────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-md bg-app-card rounded-2xl border border-app-border p-8 md:p-10 shadow-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5">
          <img
            src="/logo.png"
            alt="SupplyMap"
            className="h-10 w-auto"
          />
          {/* <span className="text-xl font-bold text-brand-deep">SupplyMap</span> */}
        </div>

        {/* Heading */}
        <div className="text-center mt-6 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">
            Create your account
          </h1>
        </div>
        <p className="text-sm text-text-secondary text-center mb-8">
          Join thousands of supply chain teams
        </p>

        {/* Progress bar */}
        <div className="mb-8">
          <ProgressBar currentStep={currentStep} totalSteps={5} />
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          {/* ── STEP 1 ── */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              <h2 className="text-base font-semibold text-text-primary mb-6">
                What&apos;s your first name?
              </h2>
              <form onSubmit={handleStep1Next} className="space-y-6">
                <Input
                  label="First name"
                  placeholder="e.g. Amina"
                  type="text"
                  autoFocus
                  autoComplete="given-name"
                  error={step1Form.formState.errors.firstName?.message}
                  {...step1Form.register('firstName')}
                />
                <Button variant="primary" fullWidth type="submit">
                  Continue
                  <ArrowRight size={16} />
                </Button>
              </form>
            </motion.div>
          )}

          {/* ── STEP 2 ── */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              <h2 className="text-base font-semibold text-text-primary mb-6">
                And your last name?
              </h2>
              <form onSubmit={handleStep2Next} className="space-y-6">
                <Input
                  label="Last name"
                  placeholder="e.g. Yusuf"
                  type="text"
                  autoFocus
                  autoComplete="family-name"
                  error={step2Form.formState.errors.lastName?.message}
                  {...step2Form.register('lastName')}
                />
                <div className="flex justify-between gap-3">
                  <Button variant="ghost" type="button" onClick={goBack}>
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                  <Button variant="primary" type="submit">
                    Continue
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ── STEP 3 ── */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              <h2 className="text-base font-semibold text-text-primary mb-2">
                What industry are you in?
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                We&apos;ll tailor your experience based on your sector.
              </p>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Industry
                  </label>
                  <div className="relative">
                    <select
                      value={selectedIndustry}
                      onChange={(e) => {
                        setSelectedIndustry(e.target.value);
                        setIndustryError('');
                      }}
                      className={`w-full h-11 px-4 text-sm rounded-lg border bg-app-card text-text-primary outline-none cursor-pointer transition-all duration-200 appearance-none pr-10 ${
                        industryError
                          ? 'border-status-error focus:border-status-error focus:ring-2 focus:ring-status-error/20'
                          : 'border-app-border focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20'
                      }`}
                    >
                      <option disabled value="">
                        Select your industry
                      </option>
                      {industries.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary"
                    />
                  </div>
                  {industryError && (
                    <p className="text-xs text-status-error flex items-center gap-1">
                      <AlertCircle size={12} />
                      {industryError}
                    </p>
                  )}
                </div>

                <AnimatePresence>
                  {selectedIndustry === 'Other' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <Input
                        label="Please describe your industry"
                        placeholder="e.g. Space Tourism, Vertical Farming, Quantum Computing..."
                        type="text"
                        value={otherIndustry}
                        onChange={(e) => {
                          setOtherIndustry(e.target.value);
                          setIndustryError('');
                        }}
                        autoFocus
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex justify-between gap-3 mt-6">
                <Button variant="ghost" type="button" onClick={goBack}>
                  <ArrowLeft size={16} />
                  Back
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleStep3Next}
                >
                  Continue
                  <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4 ── */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              <h2 className="text-base font-semibold text-text-primary mb-2">
                Your work email
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                We&apos;ll send your account confirmation here.
              </p>
              <form onSubmit={handleStep4Next} className="space-y-6">
                <Input
                  label="Work email"
                  type="email"
                  placeholder="you@company.com"
                  leftIcon={<Mail size={16} />}
                  autoFocus
                  autoComplete="email"
                  error={step4Form.formState.errors.email?.message}
                  {...step4Form.register('email')}
                />
                <div className="flex justify-between gap-3">
                  <Button variant="ghost" type="button" onClick={goBack}>
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                  <Button variant="primary" type="submit">
                    Continue
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ── STEP 5 ── */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              <h2 className="text-base font-semibold text-text-primary mb-2">
                Secure your account
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                Use at least 8 characters with a number or symbol.
              </p>

              {apiError && (
                <div className="bg-red-50 border border-status-error/30 rounded-lg px-4 py-3 mb-6 flex items-start gap-2.5">
                  <AlertCircle
                    size={16}
                    className="text-status-error mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-status-error">{apiError}</p>
                </div>
              )}

              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <div>
                  <Input
                    label="Create password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    autoFocus
                    autoComplete="new-password"
                    error={step5Form.formState.errors.password?.message}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    }
                    {...step5Form.register('password')}
                  />
                  <PasswordStrength password={passwordValue ?? ''} />
                </div>

                <Input
                  label="Confirm password"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  error={step5Form.formState.errors.confirmPassword?.message}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                      aria-label={
                        showConfirm ? 'Hide password' : 'Show password'
                      }
                    >
                      {showConfirm ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  }
                  {...step5Form.register('confirmPassword')}
                />

                <div className="flex justify-between gap-3 pt-2">
                  <Button variant="ghost" type="button" onClick={goBack}>
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    loading={isSubmitting}
                  >
                    Create Account
                    {!isSubmitting && <Check size={16} />}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login link */}
        <p className="mt-8 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-brand-primary font-medium hover:text-brand-accent hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
