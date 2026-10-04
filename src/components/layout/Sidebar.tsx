import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarClock,
  Sparkles,
  Users,
  MapPin,
  Settings,
  ChevronRight,
  ChevronLeft,
  CircleDot,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import { useAppStore } from "../../stores/appStore";
import { cn, toPersianDigits } from "../../lib/utils";

interface SidebarProps {
  onOpenNewAppointment: () => void;
}

export function Sidebar({ onOpenNewAppointment }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { tenant, appointments, isApiConnected } = useAppStore();

  const pendingCount = appointments.filter(
    (a) => a.status === "pending",
  ).length;

  const navItems = [
    { to: "/", label: "داشبورد", icon: LayoutDashboard },
    {
      to: "/appointments",
      label: "مدیریت نوبت‌ها",
      icon: CalendarClock,
      badge: pendingCount,
    },
    { to: "/services", label: "خدمات و پکیج‌ها", icon: Sparkles },
    { to: "/staff", label: "پرسنل و کادر درمان", icon: Users },
    { to: "/locations", label: "شعب و موقعیت‌ها", icon: MapPin },
    { to: "/settings", label: "تنظیمات کلینیک", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-l border-slate-800 bg-slate-950 text-slate-200 transition-all duration-300 relative select-none shrink-0 z-30",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-11 h-11 rounded-2xl bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center shrink-0 shadow-lg shadow-black/30">
            {tenant?.logo ? (
              <img
                src={tenant.logo}
                alt={tenant?.name}
                className="w-11 h-11 rounded-2xl object-cover"
              />
            ) : (
              <span className="text-brand-primary font-black text-lg">U</span>
            )}
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-100 truncate">
                {tenant?.name}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isApiConnected
                      ? "bg-emerald-400 animate-pulse"
                      : "bg-amber-400",
                  )}
                />
                <span className="text-[11px] text-slate-400">
                  {isApiConnected ? "متصل به سرور" : "حالت لوکال (آفلاین)"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 transition-colors"
          title={isCollapsed ? "باز کردن منو" : "جمع کردن منو"}
        >
          {isCollapsed ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Quick Action Button */}
      <div className="p-3">
        <button
          onClick={onOpenNewAppointment}
          className={cn(
            "w-full min-h-11 flex items-center justify-center gap-2 rounded-xl bg-brand-primary hover:opacity-95 text-white font-medium text-sm transition-all shadow-md shadow-black/20 active:scale-[0.98]",
            isCollapsed ? "px-0" : "px-3 py-2.5",
          )}
          title="ثبت نوبت دستی"
        >
          <PlusCircle className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>ثبت نوبت جدید</span>}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-slate-900 text-white border border-slate-700/80 shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive
                        ? "text-brand-primary"
                        : "group-hover:text-slate-200",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {!isCollapsed && (
                    <span className="truncate flex-1 text-right">
                      {item.label}
                    </span>
                  )}
                  {!isCollapsed &&
                    item.badge !== undefined &&
                    item.badge > 0 && (
                      <span className="shrink-0 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {toPersianDigits(item.badge)}
                      </span>
                    )}
                  {/* Subtle active pill indicator on the right side */}
                  {isActive && (
                    <div className="absolute right-0 top-2 bottom-2 w-1 rounded-l-full bg-brand-primary" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Client app link info */}
      <div className="p-3 border-t border-slate-800/80">
        <a
          href="https://unitimely.ir"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-2.5 p-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors",
            isCollapsed && "justify-center",
          )}
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-slate-500" />
          {!isCollapsed && (
            <div className="truncate text-right">
              <span className="font-semibold block text-slate-300">
                Unitimely
              </span>
              <span className="text-[10px] text-slate-500">
                پلتفرم رزرواسیون کلینیک
              </span>
            </div>
          )}
        </a>
      </div>
    </aside>
  );
}
