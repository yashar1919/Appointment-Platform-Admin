import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import {
  formatShamsiDate,
  formatTime,
  formatToman,
  formatPhone,
  toPersianDigits,
} from '../../lib/utils';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { AppointmentDetailModal } from '../appointments/AppointmentDetailModal';
import { NewAppointmentModal } from '../appointments/NewAppointmentModal';
import { Appointment } from '../../types';
import {
  CalendarClock,
  Coins,
  AlertCircle,
  CheckCircle2,
  Users,
  Plus,
  ArrowLeft,
  Phone,
  Clock,
  Sparkles,
  TrendingUp,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export function DashboardPage() {
  const navigate = useNavigate();
  const { stats, appointments, tenant, updateAppointmentStatus } = useAppStore();

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);

  // Compute live today stats from appointments
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.starts_at.startsWith(todayStr));
  const pendingAppointments = appointments.filter((a) => a.status === 'pending');
  const confirmedAppointments = appointments.filter((a) => a.status === 'confirmed');
  const completedToday = todayAppointments.filter((a) => a.status === 'completed');

  const todayRevenue = todayAppointments
    .filter((a) => a.status === 'completed' || a.status === 'confirmed')
    .reduce((sum, a) => sum + (a.price || 0), 0);

  // Next 5 upcoming appointments
  const upcomingAppointments = [...appointments]
    .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
    .slice(0, 5);

  // Weekly chart data
  const chartData = stats.weekly_stats || [
    { day_name: 'شنبه', count: 12, revenue: 14200000 },
    { day_name: 'یکشنبه', count: 9, revenue: 10800000 },
    { day_name: 'دوشنبه', count: 15, revenue: 18500000 },
    { day_name: 'سه‌شنبه', count: 11, revenue: 12900000 },
    { day_name: 'چهارشنبه', count: 14, revenue: 16700000 },
    { day_name: 'پنج‌شنبه', count: 18, revenue: 22400000 },
    { day_name: 'جمعه', count: 4, revenue: 4800000 },
  ];

  return (
    <div className="space-y-5 pb-20 md:pb-6 text-right">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-5 sm:p-6 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>پنل مدیریت رزرواسیون یونیتایملی</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100">
              سلام و وقت‌بخیر، همکار گرامی
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              به پنل منشی {tenant.name} خوش آمدید. نوبت‌های امروز آماده بررسی و مدیریت می‌باشند.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsNewOpen(true)}
              className="shadow-lg shadow-black/30 font-bold"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>ثبت نوبت تلفنی جدید</span>
            </Button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -left-12 -top-12 w-56 h-56 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Stats Cards Grid (Mobile-friendly 2x2 grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Today Appointments */}
        <Card className="p-4 sm:p-5 relative overflow-hidden bg-slate-900/90 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">نوبت‌های امروز</span>
            <div className="w-9 h-9 rounded-xl bg-brand-primary/15 text-brand-primary flex items-center justify-center">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-slate-100">
              {toPersianDigits(todayAppointments.length || stats.today_appointments)}
            </span>
            <span className="text-xs text-slate-400 mr-1.5">مورد رزرو</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">
              {toPersianDigits(confirmedAppointments.length)} تأیید شده
            </span>
          </div>
        </Card>

        {/* Today Revenue */}
        <Card className="p-4 sm:p-5 relative overflow-hidden bg-slate-900/90 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">درآمد امروز</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg sm:text-xl font-black text-emerald-400 truncate block">
              {formatToman(todayRevenue || stats.today_revenue)}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>نوبت‌های قطعی و تکمیل شده</span>
          </div>
        </Card>

        {/* Pending Confirmations */}
        <Card
          className={`p-4 sm:p-5 relative overflow-hidden cursor-pointer transition-all ${
            pendingAppointments.length > 0
              ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/60'
              : 'bg-slate-900/90 border-slate-800'
          }`}
          onClick={() => navigate('/appointments')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-300">در انتظار تأیید</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-amber-400">
              {toPersianDigits(pendingAppointments.length)}
            </span>
            {pendingAppointments.length > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 animate-pulse">
                نیاز به بررسی
              </span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span>برای بررسی ضربه بزنید</span>
          </div>
        </Card>

        {/* Completed Bookings */}
        <Card className="p-4 sm:p-5 relative overflow-hidden bg-slate-900/90 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">تکمیل شده‌ها</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-slate-100">
              {toPersianDigits(completedToday.length || stats.completed_bookings)}
            </span>
            <span className="text-xs text-slate-400 mr-1.5">مراجعه موفق</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>کل مشتریان: {toPersianDigits(stats.total_customers || 240)} نفر</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Weekly Chart & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Appointments Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">آمار نوبت‌های هفته جاری</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">تعداد مراجعین بر اساس روزهای هفته</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              <Activity className="w-3.5 h-3.5 text-brand-primary" />
              <span>هفته جاری</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="day_name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                    tickFormatter={(val) => toPersianDigits(val)}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl text-right text-xs space-y-1">
                            <p className="font-bold text-slate-100">{data.day_name}</p>
                            <p className="text-brand-primary font-semibold">
                              تعداد نوبت: {toPersianDigits(data.count)}
                            </p>
                            <p className="text-emerald-400">
                              درآمد: {formatToman(data.revenue)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="rgb(var(--primary))"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base">دسترسی‌های سریع منشی</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">عملیات پرتکرار و روزانه کلینیک</p>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <button
              onClick={() => setIsNewOpen(true)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 text-slate-100 transition-all text-right group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shadow-md">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold block">ثبت نوبت تلفنی جدید</span>
                  <span className="text-[11px] text-slate-400 block">رزرو فوری برای مراجع تماس‌گیرنده</span>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/appointments')}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 text-slate-100 transition-all text-right group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold block">نوبت‌های در انتظار</span>
                  <span className="text-[11px] text-slate-400 block">
                    {toPersianDigits(pendingAppointments.length)} نوبت منتظر تأیید
                  </span>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/services')}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 text-slate-100 transition-all text-right group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold block">خدمات و تعرفه‌ها</span>
                  <span className="text-[11px] text-slate-400 block">مدیریت قیمت‌ها و پکیج‌ها</span>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            </button>
          </CardContent>
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 rounded-b-2xl">
            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              سامانه یونیتایملی • پشتیبانی منشی: ۰۲۱-۲۲۴۰۹۸۷۶
            </p>
          </div>
        </Card>
      </div>

      {/* Upcoming Appointments Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">نوبت‌های پیش‌رو (سریع‌ترین مراجعات)</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">۵ نوبت نزدیک کلینیک</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/appointments')}
            className="text-xs text-brand-primary gap-1"
          >
            <span>مشاهده همه نوبت‌ها</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-800/80">
            {upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                onClick={() => {
                  setSelectedAppointment(apt);
                  setIsDetailOpen(true);
                }}
                className="p-4 hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{apt.customer_name}</span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800">
                        {apt.reference_code}
                      </span>
                      <StatusBadge status={apt.status} size="sm" />
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-slate-300 font-medium">{apt.service_name}</span>
                      <span>•</span>
                      <span>{formatShamsiDate(apt.starts_at, true)}</span>
                      <span>•</span>
                      <span>ساعت {formatTime(apt.starts_at)}</span>
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800/60"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-xs font-bold text-slate-200">
                    {formatToman(apt.price)}
                  </span>

                  <a
                    href={`tel:${apt.customer_phone}`}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-colors"
                    title="تماس با مراجع"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  {apt.status === 'pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                      className="h-9 px-3 text-xs bg-emerald-600 hover:bg-emerald-500"
                    >
                      تأیید فوری
                    </Button>
                  )}

                  {apt.status === 'confirmed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                      className="h-9 px-3 text-xs"
                    >
                      ثبت اتمام
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedAppointment(null);
        }}
      />

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
      />
    </div>
  );
}
