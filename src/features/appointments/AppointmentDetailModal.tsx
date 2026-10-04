import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAppStore } from '../../stores/appStore';
import { Appointment, AppointmentStatus } from '../../types';
import {
  formatShamsiDate,
  formatTime,
  formatToman,
  formatPhone,
  toPersianDigits,
} from '../../lib/utils';
import {
  Phone,
  Clock,
  Calendar,
  Sparkles,
  User,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CheckCheck,
  FileText,
} from 'lucide-react';

interface AppointmentDetailModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentDetailModal({
  appointment,
  isOpen,
  onClose,
}: AppointmentDetailModalProps) {
  const { updateAppointmentStatus } = useAppStore();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!appointment) return null;

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    setIsUpdating(true);
    try {
      await updateAppointmentStatus(appointment.id, newStatus);
      onClose();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="جزئیات و مدیریت نوبت"
      maxWidth="md"
    >
      <div className="space-y-4 text-right">
        {/* Top Header Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
              کد پیگیری: {appointment.reference_code}
            </span>
            <h4 className="text-base font-bold text-slate-100 mt-1">
              {appointment.customer_name}
            </h4>
          </div>
          <StatusBadge status={appointment.status} />
        </div>

        {/* Customer Phone & Direct Call Action */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400">
              <Phone className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">شماره تماس مراجع:</span>
              <span className="text-sm font-bold text-slate-200 text-right" dir="ltr">
                {formatPhone(appointment.customer_phone)}
              </span>
            </div>
          </div>

          <a
            href={`tel:${appointment.customer_phone}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-11 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 font-medium text-xs transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>تماس تلفنی</span>
          </a>
        </div>

        {/* Timing & Location Details Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/70 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-primary" />
              تاریخ نوبت:
            </span>
            <p className="font-semibold text-slate-200">
              {formatShamsiDate(appointment.starts_at, true)}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/70 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-primary" />
              ساعت مراجعه:
            </span>
            <p className="font-semibold text-slate-200">
              {formatTime(appointment.starts_at)} الی {formatTime(appointment.ends_at)}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/70 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              خدمت انتخابی:
            </span>
            <p className="font-semibold text-slate-200 truncate">
              {appointment.service_name || 'خدمت کلینیک'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/70 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-primary" />
              پرسنل / پزشک:
            </span>
            <p className="font-semibold text-slate-200 truncate">
              {appointment.staff_name || 'اپراتور کلینیک'}
            </p>
          </div>
        </div>

        {/* Location & Price */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/70 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
            <span>{appointment.location_name || 'شعبه مرکزی'}</span>
          </div>
          <div className="text-left font-extrabold text-sm text-brand-primary">
            {formatToman(appointment.price)}
          </div>
        </div>

        {/* Notes */}
        {appointment.notes && (
          <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/70 space-y-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              توضیحات و سوابق پرونده:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{appointment.notes}</p>
          </div>
        )}

        {/* Status Action Buttons */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">
            تغییر سریع وضعیت توسط منشی:
          </span>

          <div className="grid grid-cols-2 gap-2">
            {appointment.status !== 'confirmed' && (
              <Button
                variant="primary"
                size="md"
                isLoading={isUpdating}
                onClick={() => handleStatusChange('confirmed')}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-500"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تأیید نوبت</span>
              </Button>
            )}

            {appointment.status !== 'completed' && (
              <Button
                variant="primary"
                size="md"
                isLoading={isUpdating}
                onClick={() => handleStatusChange('completed')}
                className="gap-1.5"
              >
                <CheckCheck className="w-4 h-4" />
                <span>انجام شد (تکمیل)</span>
              </Button>
            )}

            {appointment.status !== 'no_show' && (
              <Button
                variant="outline"
                size="md"
                isLoading={isUpdating}
                onClick={() => handleStatusChange('no_show')}
                className="gap-1.5 text-purple-400 border-purple-500/30 hover:bg-purple-950/40"
              >
                <AlertCircle className="w-4 h-4" />
                <span>عدم مراجعه مراجع</span>
              </Button>
            )}

            {appointment.status !== 'cancelled' && (
              <Button
                variant="destructive"
                size="md"
                isLoading={isUpdating}
                onClick={() => handleStatusChange('cancelled')}
                className="gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>لغو نوبت</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
