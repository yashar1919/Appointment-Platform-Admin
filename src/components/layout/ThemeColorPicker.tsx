import React from 'react';
import { Check } from 'lucide-react';
import { COLOR_PALETTES } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { useThemeStore } from '../../stores/themeStore';
import { ThemePaletteName } from '../../types';

interface ThemeColorPickerProps {
  compact?: boolean;
}

export function ThemeColorPicker({ compact = false }: ThemeColorPickerProps) {
  const { currentPalette, setThemeColor } = useThemeStore();

  return (
    <div className="space-y-3">
      {!compact && (
        <div className="text-right">
          <label className="text-sm font-semibold text-slate-200 block">
            رنگ اصلی پنل مدیریت (Primary Color)
          </label>
          <span className="text-xs text-slate-400 block mt-0.5">
            رنگ پویا برای دکمه‌ها، نشانگرها، تب‌های فعال و هایلایت‌های سراسر سیستم
          </span>
        </div>
      )}

      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
        {COLOR_PALETTES.map((palette) => {
          const isSelected = currentPalette === palette.name;
          return (
            <button
              key={palette.name}
              type="button"
              onClick={() => setThemeColor(palette.name as ThemePaletteName)}
              title={`${palette.label} (${palette.name})`}
              className={cn(
                'group relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 border cursor-pointer',
                isSelected
                  ? 'bg-slate-800/90 border-slate-500 ring-2 ring-brand-primary shadow-lg'
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
              )}
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-md flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ backgroundColor: palette.colorCode }}
              >
                {isSelected && <Check className="w-4 h-4 text-white drop-shadow stroke-3" />}
              </div>
              <span className="text-[10px] text-slate-300 font-medium truncate max-w-full text-center">
                {palette.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
