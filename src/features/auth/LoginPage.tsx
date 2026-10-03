import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { Key, Eye, EyeOff, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuthStore();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      setError('لطفاً کلید دسترسی (API Key) را وارد فرمایید.');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      login(apiKeyInput.trim(), rememberMe);
      setIsLoading(false);
    }, 400);
  };

  const handleDemoLogin = () => {
    setApiKeyInput('sec_venus_live_948271');
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      login('sec_venus_live_948271', true);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-right selection:bg-brand-primary/30 selection:text-brand-primary">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Brand & Logo Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-brand-primary/15 border border-brand-primary/30 items-center justify-center shadow-lg shadow-black/30 mb-3 text-brand-primary">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            Unitimely Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            پنل مدیریت اختصاصی کلینیک و رزرواسیون نوبت‌ها
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs sm:text-sm font-medium text-slate-300">
                کلید دسترسی ادمین (Admin API Key)
              </label>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-xs text-brand-primary hover:underline flex items-center gap-1"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showKey ? 'مخفی‌سازی' : 'نمایش'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => {
                  setApiKeyInput(e.target.value);
                  setError('');
                }}
                placeholder="sec_..."
                dir="ltr"
                className="w-full h-12 px-3.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 placeholder:text-slate-500 font-mono text-sm transition-all focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-left"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <Key className="w-4 h-4" />
              </div>
            </div>
            {error && <p className="text-xs text-rose-400">{error}</p>}
          </div>

          <div className="flex items-center justify-between pt-1">
            <Switch
              checked={rememberMe}
              onCheckedChange={setRememberMe}
              label="مرا به خاطر بسپار"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full font-bold shadow-lg shadow-black/30"
          >
            ورود به پنل مدیریت
          </Button>

          {/* Quick Demo Access Button */}
          <div className="pt-2">
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-900 px-2 text-slate-500">یا دسترسی سریع آزمایشی</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-4 min-h-[44px] rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 group"
            >
              <Building2 className="w-4 h-4 text-brand-primary group-hover:scale-110 transition-transform" />
              <span>ورود مستقیم با کلید آزمایشی (کلینیک ونوس)</span>
            </button>
          </div>
        </form>

        {/* Security badge */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>ارتباط امن هدر X-Admin-Api-Key با سرور FastAPI</span>
        </div>
      </div>
    </div>
  );
}
