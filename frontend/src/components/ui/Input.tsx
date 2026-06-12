import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightElement, className, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-text-secondary [&>svg]:size-4">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full h-11 px-4 py-2.5',
              'text-sm text-text-primary',
              'bg-app-card border rounded-lg outline-none',
              'placeholder:text-text-secondary',
              'transition-all duration-200',
              error
                ? 'border-status-error focus:border-status-error focus:ring-2 focus:ring-status-error/20'
                : 'border-app-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20',
              leftIcon && 'pl-10',
              rightElement && 'pr-10',
              className
            )}
            {...rest}
          />
          {rightElement && (
            <span className="absolute right-3">{rightElement}</span>
          )}
        </div>
        {error && (
          <p className="text-xs text-status-error flex items-center gap-1">
            <AlertCircle size={12} />
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-text-secondary">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
