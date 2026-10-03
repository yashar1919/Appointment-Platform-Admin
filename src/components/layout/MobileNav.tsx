import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarClock,
  Sparkles,
  Users,
  Settings,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { cn, toPersianDigits } from '../../lib/utils';

export function MobileNav() {
  const { appointments } = useAppStore();
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;

  const tabs = [
    { to: '/', label: 'داشبورد', icon: LayoutDashboard },
    { to: '/appointments', label: 'نوبت‌ها', icon: CalendarClock, badge: pendingCount },
    { to: '/services', label: 'خدمات', icon: Sparkles },
    { to: '/staff', label: 'پرسنل', icon: Users },
    { to: '/settings', label: 'تنظیمات', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 pb-safe shadow-2xl">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-all relative select-none active:scale-95',
                  isActive ? 'text-brand-primary' : 'text-slate-400 hover:text-slate-200'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-transform duration-200',
                        isActive ? 'scale-110' : ''
                      )}
                    />
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                        {toPersianDigits(tab.badge)}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-[10px] mt-1 font-medium tracking-tight',
                      isActive ? 'font-bold' : ''
                    )}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <div className="absolute top-0 w-8 h-0.5 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
