import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-brand-primary text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-brand-primary',
  ghost:
    'bg-transparent text-brand-primary border border-brand-primary hover:bg-blue-50 active:bg-blue-100 focus:ring-brand-primary',
  danger:
    'bg-status-error text-white hover:bg-red-600 active:bg-red-700 focus:ring-status-error',
};

const sizeStyles: Record<string, string> = {
  sm: 'text-sm px-3 py-2 h-9',
  md: 'text-sm px-4 py-2.5 h-11',
  lg: 'text-base px-6 py-3 h-12',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  fullWidth,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'font-medium rounded-lg transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'flex items-center justify-center gap-2',
        'cursor-pointer',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {loading && <Loader2 className="animate-spin" size={16} />}
      {children}
    </button>
  );
}
