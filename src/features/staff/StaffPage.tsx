import React, { useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import { Staff } from '../../types';
import { formatPhone, toPersianDigits } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Users,
  Plus,
  Phone,
  Edit2,
  Trash2,
  Award,
  Sparkles,
  UserCheck,
} from 'lucide-react';

export function StaffPage() {
  const { staff, appointments, createStaff, updateStaff, deleteStaff } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deletingStaffId, setDeletingStaffId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [specialtiesStr, setSpecialtiesStr] = useState('');
  const [isActive, setIsActive] = useState(true);

  const openAddModal = () => {
    setEditingStaff(null);
    setName('');
    setRole('');
    setPhone('');
    setAvatar('');
    setBio('');
    setSpecialtiesStr('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (st: Staff) => {
    setEditingStaff(st);
    setName(st.name);
    setRole(st.role || '');
    setPhone(st.phone || '');
    setAvatar(st.avatar || '');
    setBio(st.bio || '');
    setSpecialtiesStr(st.specialties ? st.specialties.join('، ') : '');
    setIsActive(st.is_active);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const specialties = specialtiesStr
      .split(/[،,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingStaff) {
      await updateStaff(editingStaff.id, {
        name: name.trim(),
        role: role.trim() || undefined,
        phone: phone.trim() || undefined,
        avatar: avatar.trim() || undefined,
        bio: bio.trim() || undefined,
        specialties,
        is_active: isActive,
      });
    } else {
      await createStaff({
        name: name.trim(),
        role: role.trim() || undefined,
        phone: phone.trim() || undefined,
        avatar:
          avatar.trim() ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: bio.trim() || undefined,
        specialties,
        is_active: isActive,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingStaffId) return;
    await deleteStaff(deletingStaffId);
    setDeletingStaffId(null);
  };

  return (
    <div className="space-y-4 pb-20 md:pb-6 text-right">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800/80 backdrop-blur-sm">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-100 flex items-center gap-2">
            <span>مدیریت پرسنل و کادر درمان</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
              {toPersianDigits(staff.length)} نفر
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مشاهده سوابق، تخصص‌ها، انتصاب نوبت‌ها و تغییر وضعیت فعالیت همکاران
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openAddModal}
          className="h-11 px-4 sm:px-5 font-semibold text-xs sm:text-sm shadow-lg shadow-black/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>افزودن پرسنل جدید</span>
        </Button>
      </div>

      {/* Staff Grid */}
      {staff.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title="هنوز پرسنلی تعریف نشده است"
          description="با تعریف همکاران و پزشکان، مشتریان می‌توانند هنگام رزرو متخصص مورد نظر را انتخاب کنند."
          actionLabel="ثبت اولین پرسنل"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {staff.map((st) => {
            const staffAppointments = appointments.filter((a) => a.staff_id === st.id);

            return (
              <div
                key={st.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:border-slate-700 shadow-lg shadow-black/20"
              >
                <div>
                  {/* Top: Avatar, Role, Active Switch */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={
                            st.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                          }
                          alt={st.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow-md"
                        />
                        <span
                          className={`absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                            st.is_active ? 'bg-emerald-400' : 'bg-slate-600'
                          }`}
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                          {st.name}
                        </h3>
                        <span className="text-xs text-brand-primary font-medium block mt-0.5">
                          {st.role || 'عضو کادر درمان'}
                        </span>
                      </div>
                    </div>

                    <Switch
                      checked={st.is_active}
                      onCheckedChange={(checked) =>
                        updateStaff(st.id, { is_active: checked })
                      }
                    />
                  </div>

                  {/* Bio */}
                  {st.bio && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {st.bio}
                    </p>
                  )}

                  {/* Specialties Tags */}
                  {st.specialties && st.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {st.specialties.map((spec, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-800"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Phone & Stats pill */}
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="dir-ltr">{formatPhone(st.phone || '۰۹۱۲۰۰۰۰۰۰۰')}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-400">نوبت‌های ثبت‌شده:</span>
                      <span className="font-bold text-brand-primary">
                        {toPersianDigits(staffAppointments.length)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span
                    className={`text-[11px] font-semibold ${
                      st.is_active ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {st.is_active ? 'در دسترس برای پذیرش' : 'غیرفعال (مرخصی)'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(st)}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                      title="ویرایش پرسنل"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingStaffId(st.id)}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800 text-slate-400 hover:text-rose-400 transition-colors"
                      title="حذف پرسنل"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStaff ? 'ویرایش مشخصات پرسنل' : 'افزودن همکار جدید'}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-right">
          <Input
            label="نام و نام خانوادگی *"
            placeholder="مثال: دکتر سارا رضوانی"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="سمت و تخصص *"
            placeholder="مثال: متخصص پوست و مو، اپراتور ارشد"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <Input
            label="شماره تماس مستقیم"
            placeholder="مثال: ۰۹۱۲۱۱۱۴۴۵۵"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            label="آدرس اینترنتی تصویر پرسنل (URL)"
            placeholder="https://..."
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />

          <Input
            label="مهارت‌ها و خدمات اصلی (با کاما یا ویرگول جدا کنید)"
            placeholder="مثال: لیزر الکس، فیشیال، تزریق ژل"
            value={specialtiesStr}
            onChange={(e) => setSpecialtiesStr(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-medium text-slate-300">
              سوابق و بیوگرافی کوتاه
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="توضیحاتی درباره تجربیات و مدارک تخصصی..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 text-sm transition-all focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none dir-rtl text-right"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-300">
              وضعیت فعالیت در تقویم نوبت‌دهی:
            </span>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              label={isActive ? 'فعال' : 'غیرفعال'}
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
              ذخیره اطلاعات
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingStaffId)}
        onClose={() => setDeletingStaffId(null)}
        onConfirm={handleDelete}
        title="حذف همکار"
        description="آیا از حذف این پرسنل از سامانه نوبت‌دهی اطمینان دارید؟"
        confirmText="بله، حذف شود"
      />
    </div>
  );
}
