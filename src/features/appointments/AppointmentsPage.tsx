import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../stores/appStore';
import { Appointment, AppointmentStatus } from '../../types';
import {
  formatShamsiDate,
  formatTime,
  formatToman,
  formatPhone,
  toPersianDigits,
} from '../../lib/utils';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { AppointmentDetailModal } from './AppointmentDetailModal';
import { NewAppointmentModal } from './NewAppointmentModal';
import {
  Search,
  Plus,
  Phone,
  Calendar,
  Clock,
  User,
  Filter,
  RefreshCw,
  CheckCircle2,
  CheckCheck,
  ChevronLeft,
} from 'lucide-react';

type TabKey = 'all' | 'pending' | 'today' | 'confirmed' | 'completed' | 'other';

export function AppointmentsPage() {
  const { appointments, staff, services, updateAppointmentStatus, fetchInitialData, isLoading } =
    useAppStore();

  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [staffFilter, setStaffFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);

  // Tab counts
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayCount = appointments.filter((a) => a.starts_at.startsWith(todayDateStr)).length;

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Tab filter
      if (activeTab === 'pending' && apt.status !== 'pending') return false;
      if (activeTab === 'confirmed' && apt.status !== 'confirmed') return false;
      if (activeTab === 'completed' && apt.status !== 'completed') return false;
      if (activeTab === 'today' && !apt.starts_at.startsWith(todayDateStr)) return false;
      if (activeTab === 'other' && apt.status !== 'cancelled' && apt.status !== 'no_show')
        return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = apt.customer_name.toLowerCase().includes(query);
        const matchesPhone = apt.customer_phone.includes(query);
        const matchesRef = apt.reference_code.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesRef) return false;
      }

      // Staff filter
      if (staffFilter && apt.staff_id !== staffFilter) return false;

      // Service filter
      if (serviceFilter && apt.service_id !== serviceFilter) return false;

      return true;
    });
  }, [appointments, activeTab, searchQuery, staffFilter, serviceFilter, todayDateStr]);

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'all', label: 'همه نوبت‌ها', count: appointments.length },
    { key: 'pending', label: 'در انتظار تأیید', count: pendingCount },
    { key: 'today', label: 'نوبت‌های امروز', count: todayCount },
    { key: 'confirmed', label: 'تأیید شده' },
    { key: 'completed', label: 'انجام شده' },
    { key: 'other', label: 'لغو / عدم مراجعه' },
  ];

  return (
    <div className="space-y-4 pb-20 md:pb-6 text-right">
      {/* Top Banner / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800/80 backdrop-blur-sm">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-100 flex items-center gap-2">
            <span>مدیریت نوبت‌های کلینیک</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
              {toPersianDigits(filteredAppointments.length)} نوبت
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            بررسی، تأیید، لغو و تغییر سریع وضعیت نوبت‌های ثبت شده مراجعین
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => fetchInitialData()}
            isLoading={isLoading}
            className="h-11 px-3 sm:px-4"
            title="به‌روزرسانی لیست نوبت‌ها"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span className="text-xs hidden sm:inline">به‌روزرسانی</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsNewOpen(true)}
            className="h-11 px-4 sm:px-5 font-semibold text-xs sm:text-sm shadow-lg shadow-black/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>ثبت نوبت تلفنی</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs (Horizontal scrolling on mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all select-none min-h-[44px] ${
                isActive
                  ? 'bg-brand-primary text-white shadow-md shadow-black/20'
                  : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`text-[11px] font-black px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-black/25 text-white'
                      : tab.key === 'pending'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {toPersianDigits(tab.count)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search and Dropdown Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/60">
        <Input
          placeholder="جستجوی نام مراجع، شماره تلفن، کد پیگیری..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
          className="h-11"
        />

        <Select
          value={staffFilter}
          onChange={(e) => setStaffFilter(e.target.value)}
          className="h-11"
        >
          <option value="">همه پرسنل و پزشکان</option>
          {staff.map((st) => (
            <option key={st.id} value={st.id}>
              {st.name}
            </option>
          ))}
        </Select>

        <Select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="h-11"
        >
          <option value="">همه خدمات کلینیک</option>
          {services.map((srv) => (
            <option key={srv.id} value={srv.id}>
              {srv.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-8 h-8" />}
          title="نوبتی با این مشخصات یافت نشد"
          description="می‌توانید فیلترها را تغییر داده یا نوبت جدیدی را به صورت تلفنی ثبت فرمایید."
          actionLabel="ثبت اولین نوبت تلفنی"
          onAction={() => setIsNewOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              onClick={() => {
                setSelectedAppointment(apt);
                setIsDetailOpen(true);
              }}
              className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-lg shadow-black/20 flex flex-col justify-between"
            >
              {/* Card Header: Name, Reference & Status */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-100 text-sm sm:text-base group-hover:text-brand-primary transition-colors truncate">
                        {apt.customer_name}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {apt.reference_code}
                      </span>
                    </div>

                    <p className="text-xs text-brand-primary font-medium mt-1 truncate">
                      {apt.service_name || 'خدمت انتخابی'}
                    </p>
                  </div>

                  <StatusBadge status={apt.status} />
                </div>

                {/* Details Grid */}
                <div className="mt-3.5 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{formatShamsiDate(apt.starts_at, true)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      ساعت {formatTime(apt.starts_at)} الی {formatTime(apt.ends_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      مجری: {apt.staff_name || 'پرسنل کلینیک'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Phone, Price & Quick Action */}
              <div
                className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href={`tel:${apt.customer_phone}`}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-[38px] rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors"
                  title="تماس مستقیم با مراجع"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="dir-ltr text-[11px]">{formatPhone(apt.customer_phone)}</span>
                </a>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">
                    {formatToman(apt.price)}
                  </span>

                  {apt.status === 'pending' && (
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                      className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 flex items-center justify-center transition-colors"
                      title="تأیید فوری نوبت"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}

                  {apt.status === 'confirmed' && (
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                      className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 flex items-center justify-center transition-colors"
                      title="ثبت اتمام خدمت"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
