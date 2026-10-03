import { AppointmentStatus, ThemePalette, WorkingDay } from '../types';

export const COLOR_PALETTES: ThemePalette[] = [
  { name: 'indigo', label: 'نیلی (پیش‌فرض)', rgb: '99 102 241', hover: '79 70 229', light: '129 140 248', colorCode: '#6366f1' },
  { name: 'teal', label: 'سبز کله‌غازی', rgb: '20 184 166', hover: '13 148 136', light: '45 212 191', colorCode: '#14b8a6' },
  { name: 'sky', label: 'آبی آسمانی', rgb: '14 165 233', hover: '2 132 199', light: '56 189 248', colorCode: '#0ea5e9' },
  { name: 'emerald', label: 'زمردی', rgb: '16 185 129', hover: '5 150 105', light: '52 211 153', colorCode: '#10b981' },
  { name: 'violet', label: 'بنفش رویال', rgb: '139 92 246', hover: '124 58 237', light: '167 139 250', colorCode: '#8b5cf6' },
  { name: 'purple', label: 'ارغوانی', rgb: '168 85 247', hover: '147 51 234', light: '192 132 252', colorCode: '#a855f7' },
  { name: 'fuchsia', label: 'سرخابی', rgb: '217 70 239', hover: '192 38 211', light: '232 121 249', colorCode: '#d946ef' },
  { name: 'rose', label: 'رز صورتی', rgb: '244 63 94', hover: '225 29 72', light: '251 113 133', colorCode: '#f43f5e' },
  { name: 'cyan', label: 'فیروزه‌ای', rgb: '6 182 212', hover: '8 145 178', light: '34 211 238', colorCode: '#06b6d4' },
  { name: 'slate', label: 'سربی شیک', rgb: '100 116 139', hover: '71 85 105', light: '148 163 184', colorCode: '#64748b' },
];

export const STATUS_MAP: Record<
  AppointmentStatus,
  {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    dotClass: string;
  }
> = {
  pending: {
    label: 'در انتظار تأیید',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
    dotClass: 'bg-amber-400',
  },
  confirmed: {
    label: 'تأیید شده',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
    dotClass: 'bg-emerald-400',
  },
  completed: {
    label: 'انجام شده',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/30',
    dotClass: 'bg-blue-400',
  },
  cancelled: {
    label: 'لغو شده',
    bgClass: 'bg-rose-500/10',
    textClass: 'text-rose-400',
    borderClass: 'border-rose-500/30',
    dotClass: 'bg-rose-400',
  },
  no_show: {
    label: 'عدم مراجعه',
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500/30',
    dotClass: 'bg-purple-400',
  },
};

export const DEFAULT_WORKING_HOURS: WorkingDay[] = [
  { day: 'saturday', day_label: 'شنبه', is_open: true, open_time: '09:00', close_time: '20:00' },
  { day: 'sunday', day_label: 'یکشنبه', is_open: true, open_time: '09:00', close_time: '20:00' },
  { day: 'monday', day_label: 'دوشنبه', is_open: true, open_time: '09:00', close_time: '20:00' },
  { day: 'tuesday', day_label: 'سه‌شنبه', is_open: true, open_time: '09:00', close_time: '20:00' },
  { day: 'wednesday', day_label: 'چهارشنبه', is_open: true, open_time: '09:00', close_time: '20:00' },
  { day: 'thursday', day_label: 'پنج‌شنبه', is_open: true, open_time: '09:00', close_time: '18:00' },
  { day: 'friday', day_label: 'جمعه', is_open: false, open_time: '10:00', close_time: '15:00' },
];
