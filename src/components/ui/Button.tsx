import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-brand-primary text-white shadow-lg shadow-black/20 hover:opacity-95 focus:ring-brand-primary',
      secondary:
        'bg-slate-800 text-slate-100 hover:bg-slate-700/80 border border-slate-700 focus:ring-slate-500',
      outline:
        'border border-slate-700 text-slate-200 hover:bg-slate-800/60 hover:text-white focus:ring-slate-600',
      ghost:
        'text-slate-300 hover:bg-slate-800 hover:text-slate-100 focus:ring-slate-700',
      destructive:
        'bg-rose-600/90 text-white hover:bg-rose-600 shadow-md shadow-rose-950/30 focus:ring-rose-500',
    };

    // Mobile-first touch sizes: min 44px touch targets for standard actions
    const sizes = {
      sm: 'h-9 px-3 text-xs gap-1.5',
      md: 'h-11 px-4 text-sm gap-2 min-h-[44px]',
      lg: 'h-12 px-6 text-base gap-2.5 min-h-[48px]',
      icon: 'h-11 w-11 min-h-[44px] min-w-[44px] p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
