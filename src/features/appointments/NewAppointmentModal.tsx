import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useAppStore } from '../../stores/appStore';
import { AppointmentStatus } from '../../types';
import { formatToman } from '../../lib/utils';
import { Calendar, Clock, User, Phone, Sparkles, MapPin, FileText } from 'lucide-react';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewAppointmentModal({ isOpen, onClose }: NewAppointmentModalProps) {
  const { services, staff, locations, createAppointment } = useAppStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [staffId, setStaffId] = useState(staff[0]?.id || '');
  const [locationId, setLocationId] = useState(locations[0]?.id || '');
  
  // Default to today at current or next round hour
  const now = new Date();
  now.setMinutes(0, 0, 0);
  now.setHours(now.getHours() + 1);
  const defaultDateStr = now.toISOString().split('T')[0];
  const defaultTimeStr = `${now.getHours().toString().padStart(2, '0')}:00`;

  const [date, setDate] = useState(defaultDateStr);
  const [time, setTime] = useState(defaultTimeStr);
  const [status, setStatus] = useState<AppointmentStatus>('confirmed');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedService = services.find((s) => s.id === (serviceId || services[0]?.id));
  const price = selectedService ? selectedService.price : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    setIsSubmitting(true);
    try {
      // Build ISO starts_at & ends_at
      const [hour, minute] = time.split(':').map(Number);
      const startsDate = new Date(date);
      startsDate.setHours(hour, minute, 0, 0);

      const durationMinutes = selectedService?.duration_minutes || 60;
      const endsDate = new Date(startsDate.getTime() + durationMinutes * 60 * 1000);

      await createAppointment({
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        service_id: serviceId || services[0]?.id,
        staff_id: staffId || staff[0]?.id,
        location_id: locationId || locations[0]?.id,
        starts_at: startsDate.toISOString(),
        ends_at: endsDate.toISOString(),
        status,
        price,
        notes: notes.trim(),
      });

      // Reset form
      setCustomerName('');
      setCustomerPhone('');
      setNotes('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ثبت نوبت دستی (رزرو تلفنی یا حضوری)"
      description="مشخصات مراجعه‌کننده و خدمت درخواستی را وارد فرمایید."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-right">
        {/* Customer Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="نام و نام‌خانوادگی مراجعه‌کننده *"
            placeholder="مثال: مریم محمدی"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            icon={<User className="w-4 h-4" />}
          />
          <Input
            label="شماره تماس همراه *"
            placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
            required
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            icon={<Phone className="w-4 h-4" />}
          />
        </div>

        {/* Service and Staff selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Select
            label="خدمت درخواستی *"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.duration_minutes} دقیقه - {formatToman(s.price)})
              </option>
            ))}
          </Select>

          <Select
            label="پرسنل یا پزشک معالج *"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
          >
            {staff.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} {st.role ? `(${st.role})` : ''}
              </option>
            ))}
          </Select>
        </div>

        {/* Location and Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Select
            label="شعبه کلینیک *"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </Select>

          <Select
            label="وضعیت اولیه نوبت *"
            value={status}
            onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
          >
            <option value="confirmed">تأیید شده (قطعی)</option>
            <option value="pending">در انتظار بررسی</option>
          </Select>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="تاریخ نوبت *"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            icon={<Calendar className="w-4 h-4" />}
          />
          <Input
            label="ساعت شروع *"
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            icon={<Clock className="w-4 h-4" />}
          />
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-sm font-medium text-slate-300">
            توضیحات و نکات پرونده (اختیاری)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="مثال: حساسیت دارویی، جلسه پنجم، درخواست دستگاه ویژه..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 text-sm transition-all focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none dir-rtl text-right"
          />
        </div>

        {/* Price Summary Box */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">هزینه خدمت:</span>
            <span className="text-sm font-bold text-slate-200">
              {selectedService?.name || 'خدمت انتخابی'}
            </span>
          </div>
          <div className="text-left">
            <span className="text-base font-extrabold text-brand-primary">
              {formatToman(price)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isSubmitting}>
            انصراف
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
            ثبت و تأیید نوبت
          </Button>
        </div>
      </form>
    </Modal>
  );
}
