import React, { useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import { Location } from '../../types';
import { formatPhone, toPersianDigits } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { MapPin, Plus, Phone, Edit2, Trash2, Building } from 'lucide-react';

export function LocationsPage() {
  const { locations, createLocation, updateLocation, deleteLocation } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deletingLocationId, setDeletingLocationId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('تهران');
  const [phone, setPhone] = useState('');

  const openAddModal = () => {
    setEditingLocation(null);
    setName('');
    setAddress('');
    setCity('تهران');
    setPhone('');
    setIsModalOpen(true);
  };

  const openEditModal = (loc: Location) => {
    setEditingLocation(loc);
    setName(loc.name);
    setAddress(loc.address || '');
    setCity(loc.city || 'تهران');
    setPhone(loc.phone || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingLocation) {
      await updateLocation(editingLocation.id, {
        name: name.trim(),
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        phone: phone.trim() || undefined,
      });
    } else {
      await createLocation({
        name: name.trim(),
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        phone: phone.trim() || undefined,
        is_active: true,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingLocationId) return;
    await deleteLocation(deletingLocationId);
    setDeletingLocationId(null);
  };

  return (
    <div className="space-y-4 pb-20 md:pb-6 text-right">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800/80 backdrop-blur-sm">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-100 flex items-center gap-2">
            <span>مدیریت شعب و موقعیت‌ها</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
              {toPersianDigits(locations.length)} شعبه
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تعیین آدرس، شماره تلفن و تفکیک نوبت‌ها بر اساس شعب فعال کلینیک
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openAddModal}
          className="h-11 px-4 sm:px-5 font-semibold text-xs sm:text-sm shadow-lg shadow-black/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>افزودن شعبه جدید</span>
        </Button>
      </div>

      {/* Locations List */}
      {locations.length === 0 ? (
        <EmptyState
          icon={<MapPin className="w-8 h-8" />}
          title="شعبه‌ای تعریف نشده است"
          description="حداقل یک شعبه برای تعیین محل ارائه خدمات و نوبت‌دهی نیاز است."
          actionLabel="ثبت اولین شعبه"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:border-slate-700 shadow-lg shadow-black/20"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm sm:text-base">{loc.name}</h3>
                      <span className="text-xs text-slate-400 mt-0.5 block">{loc.city}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    فعال
                  </span>
                </div>

                <div className="space-y-2 mt-3 text-xs text-slate-300">
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{loc.address || 'بدون آدرس ثبت‌شده'}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400">تلفن پذیرش:</span>
                    </div>
                    <span className="font-semibold dir-ltr text-slate-200">
                      {formatPhone(loc.phone || '')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(loc)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>ویرایش</span>
                </button>
                <button
                  onClick={() => setDeletingLocationId(loc.id)}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800 text-slate-400 hover:text-rose-400 transition-colors"
                  title="حذف شعبه"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Location Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLocation ? 'ویرایش شعبه' : 'ثبت شعبه جدید'}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-right">
          <Input
            label="نام شعبه *"
            placeholder="مثال: شعبه سعادت‌آباد"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="شهر *"
              placeholder="تهران"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <Input
              label="شماره تماس شعبه"
              placeholder="۰۲۱۲۲..."
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-medium text-slate-300">
              آدرس دقیق
            </label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="تهران، خیابان..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 text-sm transition-all focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none dir-rtl text-right"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              انصراف
            </Button>
            <Button type="submit" variant="primary" size="md">
              ذخیره اطلاعات شعبه
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingLocationId)}
        onClose={() => setDeletingLocationId(null)}
        onConfirm={handleDelete}
        title="حذف شعبه"
        description="آیا از حذف این شعبه اطمینان دارید؟ نوبت‌های قبلی بدون تغییر خواهند ماند."
        confirmText="بله، حذف شود"
      />
    </div>
  );
}
