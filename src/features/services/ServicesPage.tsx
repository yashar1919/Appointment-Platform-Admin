import React, { useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import { Service, ServiceCategory } from '../../types';
import { formatToman, toPersianDigits } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Sparkles,
  Plus,
  Clock,
  Coins,
  Edit2,
  Trash2,
  Tag,
  FolderPlus,
} from 'lucide-react';

export function ServicesPage() {
  const {
    services,
    categories,
    createService,
    updateService,
    deleteService,
    createCategory,
    deleteCategory,
  } = useAppStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modals state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

  // Form states for service
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [duration, setDuration] = useState('45');
  const [price, setPrice] = useState('850000');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Form state for category
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const openAddServiceModal = () => {
    setEditingService(null);
    setName('');
    setCategoryId(categories[0]?.id || '');
    setDuration('45');
    setPrice('850000');
    setDescription('');
    setIsActive(true);
    setIsServiceModalOpen(true);
  };

  const openEditServiceModal = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setCategoryId(service.category_id || categories[0]?.id || '');
    setDuration(service.duration_minutes.toString());
    setPrice(service.price.toString());
    setDescription(service.description || '');
    setIsActive(service.is_active);
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingService) {
      await updateService(editingService.id, {
        name: name.trim(),
        category_id: categoryId || undefined,
        duration_minutes: Number(duration) || 30,
        price: Number(price) || 0,
        description: description.trim(),
        is_active: isActive,
      });
    } else {
      await createService({
        name: name.trim(),
        category_id: categoryId || undefined,
        duration_minutes: Number(duration) || 30,
        price: Number(price) || 0,
        description: description.trim(),
        is_active: isActive,
      });
    }

    setIsServiceModalOpen(false);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    await createCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim(),
    });

    setNewCatName('');
    setNewCatDesc('');
    setIsCategoryModalOpen(false);
  };

  const handleDeleteService = async () => {
    if (!deletingServiceId) return;
    await deleteService(deletingServiceId);
    setDeletingServiceId(null);
  };

  const filteredServices = services.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.category_id === selectedCategory;
  });

  return (
    <div className="space-y-4 pb-20 md:pb-6 text-right">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800/80 backdrop-blur-sm">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-100 flex items-center gap-2">
            <span>مدیریت خدمات و تعرفه‌ها</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
              {toPersianDigits(services.length)} خدمت فعال
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تعیین زمان‌بندی، قیمت‌ها و دسته‌بندی خدمات زیبایی و درمانی کلینیک
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsCategoryModalOpen(true)}
            className="h-11 px-3 sm:px-4 text-xs sm:text-sm"
          >
            <FolderPlus className="w-4 h-4 text-slate-400" />
            <span>دسته‌بندی جدید</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={openAddServiceModal}
            className="h-11 px-4 sm:px-5 font-semibold text-xs sm:text-sm shadow-lg shadow-black/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>افزودن خدمت جدید</span>
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all select-none min-h-[44px] ${
            selectedCategory === 'all'
              ? 'bg-brand-primary text-white shadow-md'
              : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <span>همه خدمات</span>
          <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-black/20">
            {toPersianDigits(services.length)}
          </span>
        </button>

        {categories.map((cat) => {
          const count = services.filter((s) => s.category_id === cat.id).length;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all select-none min-h-[44px] ${
                isSelected
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-black/20">
                {toPersianDigits(count)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Services List / Cards */}
      {filteredServices.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="w-8 h-8" />}
          title="خدمتی در این دسته‌بندی یافت نشد"
          description="می‌توانید خدمت جدیدی برای این دسته ایجاد نمایید."
          actionLabel="افزودن خدمت جدید"
          onAction={openAddServiceModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {filteredServices.map((service) => {
            const category = categories.find((c) => c.id === service.category_id);

            return (
              <div
                key={service.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:border-slate-700 shadow-lg shadow-black/20"
              >
                <div>
                  {/* Category & Active Toggle */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-md border border-brand-primary/20">
                      <Tag className="w-3 h-3" />
                      <span>{category?.name || 'خدمت عمومی'}</span>
                    </span>

                    <Switch
                      checked={service.is_active}
                      onCheckedChange={(checked) =>
                        updateService(service.id, { is_active: checked })
                      }
                    />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-slate-100 text-base mb-1.5">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {service.description || 'بدون توضیحات تکمیلی'}
                  </p>

                  {/* Details pill box */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-4 h-4 text-brand-primary" />
                      <span>{toPersianDigits(service.duration_minutes)} دقیقه</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Coins className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-emerald-400">
                        {formatToman(service.price)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span
                    className={`text-[11px] font-semibold ${
                      service.is_active ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {service.is_active ? 'فعال و قابل رزرو' : 'غیرفعال (موقتی)'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditServiceModal(service)}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                      title="ویرایش خدمت"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingServiceId(service.id)}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800 text-slate-400 hover:text-rose-400 transition-colors"
                      title="حذف خدمت"
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

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        title={editingService ? 'ویرایش خدمت' : 'افزودن خدمت جدید به کلینیک'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveService} className="space-y-4 text-right">
          <Input
            label="عنوان خدمت *"
            placeholder="مثال: لیزر فول بادی بانوان"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Select
            label="دسته‌بندی خدمت"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="مدت زمان (دقیقه) *"
              type="number"
              min="5"
              step="5"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />

            <Input
              label="تعرفه و قیمت (تومان) *"
              type="number"
              min="0"
              step="10000"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-medium text-slate-300">
              توضیحات و جزئیات پکیج
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="نواحی تحت پوشش، نوع دستگاه، مراقبت‌های لازم..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 text-sm transition-all focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none dir-rtl text-right"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-300">
              وضعیت در فرم رزرو آنلاین مشتریان:
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
              onClick={() => setIsServiceModalOpen(false)}
            >
              انصراف
            </Button>
            <Button type="submit" variant="primary" size="md">
              ذخیره اطلاعات خدمت
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="ایجاد دسته‌بندی جدید"
        description="مثال: خدمات فیشیال، مزوتراپی، لیزر موهای زائد"
        maxWidth="sm"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4 text-right">
          <Input
            label="نام دسته‌بندی *"
            placeholder="مثال: کاشت و ترمیم ناخن"
            required
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
          />

          <Input
            label="توضیح کوتاه (اختیاری)"
            placeholder="مثال: انواع خدمات پودر و ژل"
            value={newCatDesc}
            onChange={(e) => setNewCatDesc(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsCategoryModalOpen(false)}
            >
              انصراف
            </Button>
            <Button type="submit" variant="primary" size="md">
              ایجاد دسته‌بندی
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingServiceId)}
        onClose={() => setDeletingServiceId(null)}
        onConfirm={handleDeleteService}
        title="حذف خدمت کلینیک"
        description="آیا از حذف این خدمت از سامانه اطمینان دارید؟ نوبت‌های پیشین ثبت شده با این خدمت دست‌نخورده باقی می‌مانند."
        confirmText="بله، حذف شود"
      />
    </div>
  );
}
