import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import type { LoginFormData } from '../types/auth';
import api from '../lib/axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get('registered') === 'true';

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError('');
    try {
      const response = await api.post('https://suplymap.onrender.com/api/auth/login', {
        email: data.email,
        password: data.password,
      });
      const { token } = response.data;
      localStorage.setItem('auth_token', token);
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const message =
        error?.response?.data?.message ??
        'Invalid email or password. Please try again.';
      setApiError(message);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md bg-app-card rounded-2xl border border-app-border p-8 md:p-10 shadow-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
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
        <div className="text-center mt-6 mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-text-secondary">
            Sign in to your account
          </p>
        </div>

        {/* Success banner */}
        {justRegistered && (
          <div className="bg-emerald-50 border border-brand-accent/30 rounded-lg px-4 py-3 mb-6 flex items-start gap-2.5">
            <CheckCircle
              size={16}
              className="text-brand-accent mt-0.5 shrink-0"
            />
            <p className="text-sm text-brand-primary font-medium">
              Account created successfully! Please sign in.
            </p>
          </div>
        )}

        {/* Error banner */}
        {apiError && (
          <div className="bg-red-50 border border-status-error/30 rounded-lg px-4 py-3 mb-6 flex items-start gap-2.5">
            <AlertCircle
              size={16}
              className="text-status-error mt-0.5 shrink-0"
            />
            <p className="text-sm text-status-error">{apiError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email address"
            type="email"
            placeholder="you@company.com"
            leftIcon={<Mail size={16} />}
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register('password')}
            />
            <div className="flex justify-end mt-2">
              <a
                href="#"
                className="text-xs text-brand-primary hover:text-brand-accent hover:underline transition-colors"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            loading={isSubmitting}
            type="submit"
          >
            Sign in
          </Button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="text-brand-primary font-medium hover:text-brand-accent hover:underline transition-colors"
          >
            Create one free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
