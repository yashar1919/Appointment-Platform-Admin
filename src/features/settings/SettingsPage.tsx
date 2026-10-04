import React, { useState } from "react";
import { useAppStore } from "../../stores/appStore";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "../../stores/themeStore";
import { DEFAULT_WORKING_HOURS } from "../../lib/constants";
import { WorkingDay } from "../../types";
import { ThemeColorPicker } from "../../components/layout/ThemeColorPicker";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Switch } from "../../components/ui/Switch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import {
  Building2,
  Clock,
  Key,
  Palette,
  Check,
  Copy,
  Globe,
  Instagram,
  Phone,
  MapPin,
  RotateCcw,
  Sparkles,
  LogOut,
} from "lucide-react";

export function SettingsPage() {
  const { tenant, updateTenant, showToast } = useAppStore();
  const { apiKey, login, logout } = useAuthStore();
  const { currentPalette } = useThemeStore();

  // Business Profile states
  const [name, setName] = useState(tenant?.name || "");
  const [phone, setPhone] = useState(tenant?.phone || "");
  const [address, setAddress] = useState(tenant?.address || "");
  const [logo, setLogo] = useState(tenant?.logo || "");
  const [instagram, setInstagram] = useState(tenant?.instagram || "");
  const [description, setDescription] = useState(tenant?.description || "");

  // Working Hours states
  const [workingHours, setWorkingHours] = useState<WorkingDay[]>(
    tenant?.working_hours && tenant.working_hours.length > 0
      ? tenant.working_hours
      : DEFAULT_WORKING_HOURS,
  );

  // API Key edit modal
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState(apiKey || "");
  const [hasCopiedKey, setHasCopiedKey] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTenant({
      name: name.trim(),
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      logo: logo.trim() || undefined,
      instagram: instagram.trim() || undefined,
      description: description.trim() || undefined,
    });
  };

  const handleWorkingHourChange = (
    index: number,
    field: keyof WorkingDay,
    val: boolean | string,
  ) => {
    const updated = [...workingHours];
    updated[index] = {
      ...updated[index],
      [field]: val,
    };
    setWorkingHours(updated);
  };

  const handleSaveWorkingHours = async () => {
    await updateTenant({
      working_hours: workingHours,
    });
  };

  const handleCopyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setHasCopiedKey(true);
      showToast("کلید دسترسی با موفقیت در کلیپ‌بورد کپی شد.", "success");
      setTimeout(() => setHasCopiedKey(false), 2500);
    }
  };

  const handleSaveApiKey = () => {
    if (newApiKey.trim()) {
      login(newApiKey.trim());
      setIsApiKeyModalOpen(false);
      showToast("کلید جدید API با موفقیت تنظیم شد.", "success");
    }
  };

  return (
    <div className="space-y-5 pb-20 md:pb-6 text-right max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800/80 backdrop-blur-sm">
        <h2 className="text-lg sm:text-xl font-black text-slate-100 flex items-center gap-2">
          <span>تنظیمات و شخصی‌سازی کلینیک</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          مدیریت مشخصات کسب‌وکار، تقویم کاری، کلید اتصال و تم رنگی رابط کاربری
        </p>
      </div>

      {/* Theme Customizer Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base">
                تم و رنگ اصلی پنل منشی
              </CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                تغییر لحظه‌ای رنگ برند و عناصر اصلی سامانه به یکی از ۱۰ پالت
                استاندارد
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ThemeColorPicker />
        </CardContent>
      </Card>

      {/* Business Info Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base">
                اطلاعات کسب‌وکار و پروفایل کلینیک
              </CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                نام کلینیک، شماره‌های تماس، لوگو و بیوگرافی نمایش داده شده به
                مراجعین
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="نام مجموعه یا کلینیک *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="شماره تماس اصلی پذیرش"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="۰۲۱۲۲..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="آدرس اینترنتی لوگو (URL)"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="https://..."
              />

              <Input
                label="شناسه اینستاگرام کلینیک"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="venus_beauty_clinic"
                icon={<Instagram className="w-4 h-4" />}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-medium text-slate-300">
                آدرس کامل دفتر مرکزی
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 text-sm transition-all focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none dir-rtl text-right"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-medium text-slate-300">
                توضیحات و بیوگرافی کوتاه کلینیک
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 text-sm transition-all focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none dir-rtl text-right"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="md">
                ذخیره تغییرات پروفایل
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Working Hours Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base">
                ساعات کاری و روزهای پذیرش
              </CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                تعیین روزهای باز و ساعات شروع و پایان پذیرش نوبت‌ها
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {workingHours.map((wh, idx) => (
              <div
                key={wh.day}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80"
              >
                <div className="flex items-center justify-between sm:justify-start gap-4 sm:w-40">
                  <span className="text-sm font-bold text-slate-200">
                    {wh.day_label}
                  </span>
                  <Switch
                    checked={wh.is_open}
                    onCheckedChange={(checked) =>
                      handleWorkingHourChange(idx, "is_open", checked)
                    }
                    label={wh.is_open ? "دایر" : "تعطیل"}
                  />
                </div>

                {wh.is_open ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span>از ساعت:</span>
                      <input
                        type="time"
                        value={wh.open_time}
                        onChange={(e) =>
                          handleWorkingHourChange(
                            idx,
                            "open_time",
                            e.target.value,
                          )
                        }
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-100 text-xs font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span>تا ساعت:</span>
                      <input
                        type="time"
                        value={wh.close_time}
                        onChange={(e) =>
                          handleWorkingHourChange(
                            idx,
                            "close_time",
                            e.target.value,
                          )
                        }
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-100 text-xs font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-rose-400">
                    تعطیل و عدم پذیرش نوبت
                  </span>
                )}
              </div>
            ))}

            <div className="flex justify-end pt-3">
              <Button
                onClick={handleSaveWorkingHours}
                variant="primary"
                size="md"
              >
                ذخیره ساعات کاری
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Key & Security Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base">
                کلید دسترسی و احراز هویت API
              </CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                کلید امنیتی ارسال شده در هدر X-Admin-Api-Key جهت برقراری ارتباط
                با بک‌اند FastAPI
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 block">
                کلید فعلی سیستم:
              </span>
              <code className="text-xs font-mono text-brand-primary bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 inline-block dir-ltr">
                {apiKey
                  ? `${apiKey.substring(0, 8)}••••••••••••`
                  : "کلیدی تنظیم نشده"}
              </code>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyApiKey}
                className="gap-1.5 text-xs"
              >
                {hasCopiedKey ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی کلید</span>
                  </>
                )}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setNewApiKey(apiKey || "");
                  setIsApiKeyModalOpen(true);
                }}
                className="text-xs"
              >
                تغییر کلید
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              جهت خروج از حساب منشی و تعویض اکانت:
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={logout}
              className="gap-1.5 text-xs h-9"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج از پنل</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit API Key Modal */}
      <Modal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        title="تنظیم کلید دسترسی جدید (Admin API Key)"
        description="کلید ارائه‌شده توسط ادمین بک‌اند FastAPI را وارد فرمایید."
        maxWidth="sm"
      >
        <div className="space-y-4 text-right">
          <Input
            label="کلید API جدید *"
            value={newApiKey}
            onChange={(e) => setNewApiKey(e.target.value)}
            placeholder="sec_..."
            dir="ltr"
            className="font-mono text-left"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsApiKeyModalOpen(false)}
            >
              انصراف
            </Button>
            <Button variant="primary" size="md" onClick={handleSaveApiKey}>
              ذخیره و ورود
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
