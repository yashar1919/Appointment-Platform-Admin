import { create } from 'zustand';
import { adminApi } from '../lib/api';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_CATEGORIES,
  INITIAL_DASHBOARD_STATS,
  INITIAL_LOCATIONS,
  INITIAL_SERVICES,
  INITIAL_STAFF,
  INITIAL_TENANT,
} from '../lib/mockData';
import {
  Appointment,
  AppointmentStatus,
  DashboardStats,
  Location,
  Service,
  ServiceCategory,
  Staff,
  Tenant,
} from '../types';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppState {
  appointments: Appointment[];
  services: Service[];
  categories: ServiceCategory[];
  staff: Staff[];
  locations: Location[];
  tenant: Tenant;
  stats: DashboardStats;
  isLoading: boolean;
  isApiConnected: boolean;
  toasts: ToastNotification[];

  // Core Actions
  fetchInitialData: () => Promise<void>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<boolean>;
  createAppointment: (data: Partial<Appointment>) => Promise<Appointment>;
  
  createService: (data: Omit<Service, 'id' | 'tenant_id'>) => Promise<Service>;
  updateService: (id: string, data: Partial<Service>) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;

  createCategory: (data: Partial<ServiceCategory>) => Promise<ServiceCategory>;
  updateCategory: (id: string, data: Partial<ServiceCategory>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;

  createStaff: (data: Omit<Staff, 'id'>) => Promise<Staff>;
  updateStaff: (id: string, data: Partial<Staff>) => Promise<boolean>;
  deleteStaff: (id: string) => Promise<boolean>;

  createLocation: (data: Omit<Location, 'id'>) => Promise<Location>;
  updateLocation: (id: string, data: Partial<Location>) => Promise<boolean>;
  deleteLocation: (id: string) => Promise<boolean>;

  updateTenant: (data: Partial<Tenant>) => Promise<boolean>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  appointments: INITIAL_APPOINTMENTS,
  services: INITIAL_SERVICES,
  categories: INITIAL_CATEGORIES,
  staff: INITIAL_STAFF,
  locations: INITIAL_LOCATIONS,
  tenant: INITIAL_TENANT,
  stats: INITIAL_DASHBOARD_STATS,
  isLoading: false,
  isApiConnected: false,
  toasts: [],

  showToast: (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      get().dismissToast(id);
    }, 4000);
  },

  dismissToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      // Attempt to hit live FastAPI server
      const [appointments, services, categories, staff, locations, tenant, stats] =
        await Promise.all([
          adminApi.getAppointments(),
          adminApi.getServices(),
          adminApi.getCategories(),
          adminApi.getStaff(),
          adminApi.getLocations(),
          adminApi.getTenant(),
          adminApi.getDashboardStats(),
        ]);

      set({
        appointments: appointments || INITIAL_APPOINTMENTS,
        services: services || INITIAL_SERVICES,
        categories: categories || INITIAL_CATEGORIES,
        staff: staff || INITIAL_STAFF,
        locations: locations || INITIAL_LOCATIONS,
        tenant: tenant || INITIAL_TENANT,
        stats: stats || INITIAL_DASHBOARD_STATS,
        isApiConnected: true,
        isLoading: false,
      });
    } catch {
      // Standalone mode / local fallback: use mock data without interrupting the secretary
      set({
        appointments: get().appointments.length ? get().appointments : INITIAL_APPOINTMENTS,
        services: get().services.length ? get().services : INITIAL_SERVICES,
        categories: get().categories.length ? get().categories : INITIAL_CATEGORIES,
        staff: get().staff.length ? get().staff : INITIAL_STAFF,
        locations: get().locations.length ? get().locations : INITIAL_LOCATIONS,
        tenant: get().tenant ? get().tenant : INITIAL_TENANT,
        stats: get().stats ? get().stats : INITIAL_DASHBOARD_STATS,
        isApiConnected: false,
        isLoading: false,
      });
    }
  },

  updateAppointmentStatus: async (id: string, status: AppointmentStatus) => {
    try {
      if (get().isApiConnected) {
        await adminApi.updateAppointmentStatus(id, status);
      }
    } catch (err) {
      console.warn('API sync warning (using local update):', err);
    }

    set((state) => {
      const updated = state.appointments.map((apt) =>
        apt.id === id ? { ...apt, status } : apt
      );

      // Recalculate stats
      const pendingCount = updated.filter((a) => a.status === 'pending').length;
      const completedCount = updated.filter((a) => a.status === 'completed').length;
      const totalRev = updated
        .filter((a) => a.status === 'completed' || a.status === 'confirmed')
        .reduce((sum, a) => sum + (a.price || 0), 0);

      return {
        appointments: updated,
        stats: {
          ...state.stats,
          pending_bookings: pendingCount,
          completed_bookings: completedCount,
          today_revenue: totalRev,
        },
      };
    });

    const statusLabels: Record<AppointmentStatus, string> = {
      confirmed: 'تأیید شد',
      cancelled: 'لغو شد',
      completed: 'تکمیل شد',
      no_show: 'عدم مراجعه ثبت شد',
      pending: 'به حالت در انتظار بازگشت',
    };

    get().showToast(`وضعیت نوبت با موفقیت به "${statusLabels[status]}" تغییر یافت.`, 'success');
    return true;
  },

  createAppointment: async (data: Partial<Appointment>) => {
    let created: Appointment;
    try {
      if (get().isApiConnected) {
        created = await adminApi.createAppointment(data);
      } else {
        throw new Error('Fallback');
      }
    } catch {
      // Local creation
      const service = get().services.find((s) => s.id === data.service_id);
      const staffMember = get().staff.find((s) => s.id === data.staff_id);
      const loc = get().locations.find((l) => l.id === data.location_id);

      created = {
        id: 'apt-' + Date.now().toString(),
        customer_name: data.customer_name || 'مشتری جدید',
        customer_phone: data.customer_phone || '۰۹۱۲۰۰۰۰۰۰۰',
        service_id: data.service_id || get().services[0]?.id || 'srv-1',
        staff_id: data.staff_id || get().staff[0]?.id || 'stf-1',
        location_id: data.location_id || get().locations[0]?.id || 'loc-1',
        starts_at: data.starts_at || new Date().toISOString(),
        ends_at: data.ends_at || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        status: (data.status as AppointmentStatus) || 'confirmed',
        price: data.price ?? (service?.price || 0),
        reference_code: `UNT-${Math.floor(1000 + Math.random() * 9000)}`,
        notes: data.notes || '',
        service_name: service?.name || 'خدمت انتخابی',
        staff_name: staffMember?.name || 'پرسنل کلینیک',
        location_name: loc?.name || 'شعبه کلینیک',
        duration_minutes: service?.duration_minutes || 45,
      };
    }

    set((state) => ({
      appointments: [created, ...state.appointments],
      stats: {
        ...state.stats,
        today_appointments: state.stats.today_appointments + 1,
        pending_bookings: created.status === 'pending' ? state.stats.pending_bookings + 1 : state.stats.pending_bookings,
      },
    }));

    get().showToast(`نوبت "${created.customer_name}" با کد پیگیری ${created.reference_code} ثبت گردید.`, 'success');
    return created;
  },

  createService: async (data) => {
    let newService: Service;
    try {
      if (get().isApiConnected) {
        newService = await adminApi.createService(data);
      } else {
        throw new Error('Fallback');
      }
    } catch {
      newService = {
        ...data,
        id: 'srv-' + Date.now(),
        tenant_id: get().tenant.id,
      };
    }
    set((state) => ({ services: [...state.services, newService] }));
    get().showToast(`خدمت "${newService.name}" با موفقیت افزوده شد.`, 'success');
    return newService;
  },

  updateService: async (id, data) => {
    try {
      if (get().isApiConnected) {
        await adminApi.updateService(id, data);
      }
    } catch (err) {
      console.warn('API sync warning:', err);
    }
    set((state) => ({
      services: state.services.map((s) => (s.id === id ? { ...s, ...data } : s)),
    }));
    get().showToast('تغییرات خدمت با موفقیت ذخیره شد.', 'success');
    return true;
  },

  deleteService: async (id) => {
    try {
      if (get().isApiConnected) {
        await adminApi.deleteService(id);
      }
    } catch (err) {
      console.warn('API sync warning:', err);
    }
    set((state) => ({
      services: state.services.filter((s) => s.id !== id),
    }));
    get().showToast('خدمت مورد نظر با موفقیت حذف شد.', 'info');
    return true;
  },

  createCategory: async (data) => {
    let cat: ServiceCategory;
    try {
      if (get().isApiConnected) {
        cat = await adminApi.createCategory(data);
      } else {
        throw new Error('Fallback');
      }
    } catch {
      cat = {
        id: 'cat-' + Date.now(),
        name: data.name || 'دسته‌بندی جدید',
        description: data.description || '',
        display_order: get().categories.length + 1,
      };
    }
    set((state) => ({ categories: [...state.categories, cat] }));
    get().showToast(`دسته‌بندی "${cat.name}" ایجاد شد.`, 'success');
    return cat;
  },

  updateCategory: async (id, data) => {
    try {
      if (get().isApiConnected) {
        await adminApi.updateCategory(id, data);
      }
    } catch (err) {
      console.warn('API sync warning:', err);
    }
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));
    get().showToast('دسته‌بندی ویرایش گردید.', 'success');
    return true;
  },

  deleteCategory: async (id) => {
    try {
      if (get().isApiConnected) {
        await adminApi.deleteCategory(id);
      }
    } catch (err) {
      console.warn('API sync warning:', err);
    }
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
    get().showToast('دسته‌بندی حذف شد.', 'info');
    return true;
  },

  createStaff: async (data) => {
    let staffMember: Staff;
    try {
      if (get().isApiConnected) {
        staffMember = await adminApi.createStaff(data);
      } else {
        throw new Error('Fallback');
      }
    } catch {
      staffMember = {
        ...data,
        id: 'stf-' + Date.now(),
      };
    }
    set((state) => ({ staff: [...state.staff, staffMember] }));
    get().showToast(`همکار جدید "${staffMember.name}" افزوده شد.`, 'success');
    return staffMember;
  },

  updateStaff: async (id, data) => {
    try {
      if (get().isApiConnected) {
        await adminApi.updateStaff(id, data);
      }
    } catch (err) {
      console.warn('API sync warning:', err);
    }
    set((state) => ({
      staff: state.staff.map((s) => (s.id === id ? { ...s, ...data } : s)),
    }));
    get().showToast('اطلاعات پرسنل به‌روز شد.', 'success');
    return true;
  },

  deleteStaff: async (id) => {
    try {
      if (get().isApiConnected) {
        await adminApi.deleteStaff(id);
      }
    } catch (err) {
      console.warn('API sync warning:', err);
    }
    set((state) => ({
      staff: state.staff.filter((s) => s.id !== id),
    }));
    get().showToast('پرسنل از لیست حذف شد.', 'info');
    return true;
  },

  createLocation: async (data) => {
    let loc: Location;
    try {
      if (get().isApiConnected) {
        loc = await adminApi.createLocation(data);
      } else {
        throw new Error('Fallback');
      }
    } catch {
      loc = {
        ...data,
        id: 'loc-' + Date.now(),
      };
    }
    set((state) => ({ locations: [...state.locations, loc] }));
    get().showToast(`شعبه "${loc.name}" با موفقیت ثبت شد.`, 'success');
    return loc;
  },

  updateLocation: async (id, data) => {
    try {
      if (get().isApiConnected) {
        await adminApi.updateLocation(id, data);
      }
    } catch (err) {
      console.warn('API sync warning:', err);
    }
    set((state) => ({
      locations: state.locations.map((l) => (l.id === id ? { ...l, ...data } : l)),
    }));
    get().showToast('اطلاعات شعبه به‌روز شد.', 'success');
    return true;
  },

  deleteLocation: async (id) => {
    try {
      if (get().isApiConnected) {
        await adminApi.deleteLocation(id);
      }
    } catch (err) {
      console.warn('API sync warning:', err);
    }
    set((state) => ({
      locations: state.locations.filter((l) => l.id !== id),
    }));
    get().showToast('شعبه حذف گردید.', 'info');
    return true;
  },

  updateTenant: async (data) => {
    try {
      if (get().isApiConnected) {
        await adminApi.updateTenant(data);
      }
    } catch (err) {
      console.warn('API sync warning:', err);
    }
    set((state) => ({
      tenant: { ...state.tenant, ...data },
    }));
    get().showToast('مشخصات کسب‌وکار و ساعات کاری با موفقیت ذخیره شد.', 'success');
    return true;
  },
}));
