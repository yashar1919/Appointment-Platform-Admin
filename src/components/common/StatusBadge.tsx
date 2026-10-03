import React from 'react';
import { STATUS_MAP } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { AppointmentStatus } from '../../types';

interface StatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, className, showDot = true, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_MAP[status] || STATUS_MAP.pending;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold border select-none',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        config.bgClass,
        config.textClass,
        config.borderClass,
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            'rounded-full animate-pulse',
            size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5',
            config.dotClass
          )}
        />
      )}
      {config.label}
    </span>
  );
}
