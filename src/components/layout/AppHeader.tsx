import React, { useState } from "react";
import {
  Plus,
  Palette,
  Wifi,
  WifiOff,
  Clock,
  Sparkles,
  PhoneCall,
} from "lucide-react";
import { useAppStore } from "../../stores/appStore";
import { formatShamsiDate } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { ThemeColorPicker } from "./ThemeColorPicker";

interface AppHeaderProps {
  onOpenNewAppointment: () => void;
}

export function AppHeader({ onOpenNewAppointment }: AppHeaderProps) {
  const { tenant, isApiConnected, fetchInitialData } = useAppStore();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);

  const todayShamsi = formatShamsiDate(new Date(), true);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
        {/* Right side (RTL Start): Clinic & Date */}
        <div className="flex items-center gap-3">
          <div className="md:hidden flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center shrink-0">
              {tenant?.logo ? (
                <img
                  src={tenant?.logo}
                  alt={tenant?.name}
                  className="w-9 h-9 rounded-xl object-cover"
                />
              ) : (
                <span className="text-brand-primary font-black text-sm">U</span>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-slate-100 truncate max-w-37.5">
                {tenant?.name}
              </h2>
              <p className="text-[10px] text-slate-400 truncate">
                {todayShamsi}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
            <Clock className="w-4 h-4 text-brand-primary" />
            <span className="font-medium text-slate-200">{todayShamsi}</span>
          </div>
        </div>

        {/* Left side (RTL End): Actions & Theme & Connection */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* API Status Badge */}
          <button
            onClick={() => setShowApiModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:border-slate-700 transition-colors"
            title="وضعیت اتصال به API بک‌اند"
          >
            {isApiConnected ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline text-emerald-400">
                  بک‌اند زنده
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline text-amber-400">
                  آفلاین (دمو)
                </span>
              </>
            )}
          </button>

          {/* Theme Color Quick Button */}
          <button
            onClick={() => setShowThemeModal(true)}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition-all hover:scale-105"
            title="تغییر تم رنگی"
          >
            <Palette className="w-4 h-4 text-brand-primary" />
          </button>

          {/* Quick manual booking button (Prominent for Secretary) */}
          <Button
            onClick={onOpenNewAppointment}
            variant="primary"
            size="sm"
            className="h-10 px-3 sm:px-4 rounded-xl shadow-lg flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-3" />
            <span className="text-xs sm:text-sm font-semibold">
              ثبت نوبت تلفنی
            </span>
          </Button>
        </div>
      </header>

      {/* Theme Color Picker Modal */}
      <Modal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        title="شخصی‌سازی رنگ پنل مدیریت"
        description="یکی از ۱۰ پالت استاندارد تیل‌ویند را برای تم اصلی سیستم انتخاب فرمایید."
        maxWidth="md"
      >
        <div className="py-2">
          <ThemeColorPicker />
          <div className="mt-6 flex justify-end">
            <Button
              variant="primary"
              onClick={() => setShowThemeModal(false)}
              size="md"
            >
              اعمال و بستن
            </Button>
          </div>
        </div>
      </Modal>

      {/* API Connectivity Modal */}
      <Modal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        title="وضعیت اتصال سرویس بک‌اند (FastAPI)"
        maxWidth="md"
      >
        <div className="space-y-4 text-right">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">آدرس اندپوینت:</span>
              <code className="text-xs text-brand-primary font-mono bg-slate-900 px-2 py-1 rounded">
                {import.meta.env.VITE_API_URL ||
                  "http://localhost:8000/api/v1/admin"}
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">وضعیت اتصال:</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isApiConnected
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {isApiConnected
                  ? "متصل به سرور بک‌اند"
                  : "سرویس‌دهی لوکال با دیتای آزمایشی"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">احراز هویت:</span>
              <span className="text-xs text-slate-300">
                هدر X-Admin-Api-Key
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            در صورت عدم دسترسی به سرور محلی پورت ۸۰۰۰، تمامی تغییرات (ایجاد
            نوبت، تغییر وضعیت نوبت‌ها، مدیریت خدمات و پرسنل) در حافظه لوکال
            انجام شده و منشی محترم می‌تواند بدون قطعی به کار خود ادامه دهد.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                fetchInitialData();
                setShowApiModal(false);
              }}
            >
              تلاش مجدد برای اتصال
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowApiModal(false)}
            >
              متوجه شدم
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
