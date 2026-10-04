import { create } from "zustand";
import { adminApi } from "../lib/api";
import {
  Appointment,
  AppointmentStatus,
  DashboardStats,
  Location,
  Service,
  ServiceCategory,
  Staff,
  Tenant,
} from "../types";

export interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface AppState {
  appointments: Appointment[];
  services: Service[];
  categories: ServiceCategory[];
  staff: Staff[];
  locations: Location[];
  tenant: Tenant | null;
  stats: DashboardStats;
  isLoading: boolean;
  isApiConnected: boolean;
  toasts: ToastNotification[];

  fetchInitialData: () => Promise<void>;
  updateAppointmentStatus: (
    id: string,
    status: AppointmentStatus,
  ) => Promise<boolean>;
  createAppointment: (data: Partial<Appointment>) => Promise<Appointment>;
  createService: (data: Omit<Service, "id" | "tenant_id">) => Promise<Service>;
  updateService: (id: string, data: Partial<Service>) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  createCategory: (data: Partial<ServiceCategory>) => Promise<ServiceCategory>;
  updateCategory: (
    id: string,
    data: Partial<ServiceCategory>,
  ) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  createStaff: (data: Omit<Staff, "id">) => Promise<Staff>;
  updateStaff: (id: string, data: Partial<Staff>) => Promise<boolean>;
  deleteStaff: (id: string) => Promise<boolean>;
  createLocation: (data: Omit<Location, "id">) => Promise<Location>;
  updateLocation: (id: string, data: Partial<Location>) => Promise<boolean>;
  deleteLocation: (id: string) => Promise<boolean>;
  updateTenant: (data: Partial<Tenant>) => Promise<boolean>;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  dismissToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  appointments: [],
  services: [],
  categories: [],
  staff: [],
  locations: [],
  tenant: null,
  stats: {
    today_appointments: 0,
    today_revenue: 0,
    pending_bookings: 0,
    completed_bookings: 0,
    total_customers: 0,
    weekly_stats: [],
  },
  isLoading: true,
  isApiConnected: false,
  toasts: [],

  showToast: (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    const id =
      Date.now().toString() + Math.random().toString(36).substring(2, 5);
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
    set({ isLoading: true, isApiConnected: false });
    try {
      const [appointmentsRes, servicesRes, staffRes, locationsRes, tenantRes] =
        await Promise.all([
          adminApi.getAppointments(),
          adminApi.getServices(),
          adminApi.getStaff(),
          adminApi.getLocations().catch(() => []),
          adminApi.getTenant().catch(() => null),
        ]);

      const normalizedAppointments = (appointmentsRes || []).map((apt: any) => {
        const staffMember = (staffRes || []).find(
          (s: any) => s.id === apt.staff_id,
        );
        const serviceObj = (servicesRes || []).find(
          (s: any) => s.id === apt.service_id,
        );
        const locationObj = (locationsRes || []).find(
          (l: any) => l.id === apt.location_id,
        );

        return {
          id: apt.id,
          reference_code: apt.reference || apt.reference_code || "UNKNOWN",
          starts_at: apt.starts_at,
          ends_at: apt.ends_at,
          status: apt.status,
          service_name: apt.service_name || serviceObj?.name || "خدمت نامشخص",
          price: Number(apt.service_price ?? apt.price ?? 0),
          staff_id: apt.staff_id,
          location_id: apt.location_id,
          service_id: apt.service_id || "unknown",
          customer_name: apt.customer_name || "مشتری",
          customer_phone: apt.customer_phone || "---",
          duration_minutes:
            apt.service_duration_minutes || serviceObj?.duration_minutes || 30,
          staff_name: staffMember?.name || apt.staff_name || "پرسنل کلینیک",
          location_name: locationObj?.name || apt.location_name || "شعبه",
        };
      });

      const normalizedServices = (servicesRes || []).map((svc: any) => ({
        ...svc,
        price: Number(svc.price || 0),
        is_active: svc.is_active !== undefined ? svc.is_active : true,
      }));

      set({
        appointments: normalizedAppointments,
        services: normalizedServices,
        staff: staffRes || [],
        locations: locationsRes || [],
        categories: [],
        tenant: tenantRes || undefined,
        isApiConnected: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("❌ خطای حیاتی در اتصال به سرور:", error);
      set({
        appointments: [],
        services: [],
        staff: [],
        locations: [],
        isApiConnected: false,
        isLoading: false,
      });
      get().showToast(
        "خطا در اتصال به سرور. لطفاً اتصال اینترنت یا سرور بک‌اند را بررسی کنید.",
        "error",
      );
    }
  },

  updateAppointmentStatus: async (id: string, status: AppointmentStatus) => {
    try {
      if (get().isApiConnected) {
        await adminApi.updateAppointmentStatus(id, status);
      }
    } catch (err) {
      console.warn("API sync warning:", err);
      get().showToast("خطا در برقراری ارتباط با سرور", "error");
      return false;
    }

    set((state) => {
      const updated = state.appointments.map((apt) =>
        apt.id === id ? { ...apt, status } : apt,
      );
      return { appointments: updated };
    });

    const statusLabels: Record<AppointmentStatus, string> = {
      confirmed: "تأیید شد",
      cancelled: "لغو شد",
      completed: "تکمیل شد",
      no_show: "عدم مراجعه ثبت شد",
      pending: "در انتظار تأیید",
    };
    get().showToast(
      `وضعیت نوبت به "${statusLabels[status]}" تغییر یافت.`,
      "success",
    );
    return true;
  },

  createAppointment: async (data: Partial<Appointment>) => {
    let created: Appointment;
    try {
      if (get().isApiConnected) {
        const rawRes = await adminApi.createAppointment(data);
        const staffMember = get().staff.find((s) => s.id === rawRes.staff_id);
        const service = get().services.find((s) => s.id === rawRes.service_id);
        const loc = get().locations.find((l) => l.id === rawRes.location_id);

        created = {
          ...rawRes,
          reference_code:
            (rawRes as any).reference ||
            rawRes.reference_code ||
            `APT-${Date.now()}`,
          customer_name: data.customer_name || rawRes.customer_name,
          customer_phone: data.customer_phone || rawRes.customer_phone,
          staff_name: staffMember?.name || rawRes.staff_name || "پرسنل کلینیک",
          location_name: loc?.name || rawRes.location_name || "شعبه",
          service_name: service?.name || rawRes.service_name || "خدمت",
          price: Number((rawRes as any).service_price ?? rawRes.price ?? 0),
        } as Appointment;
      } else {
        throw new Error("Offline");
      }
    } catch {
      get().showToast("خطا در ثبت نوبت. اتصال به سرور برقرار نیست.", "error");
      throw new Error("Failed to create appointment");
    }

    set((state) => ({
      appointments: [created, ...state.appointments],
    }));

    get().showToast(
      `نوبت "${created.customer_name}" با کد ${created.reference_code} ثبت شد.`,
      "success",
    );
    return created;
  },

  createService: async (data) => {
    let newService: Service;
    try {
      if (get().isApiConnected) {
        newService = await adminApi.createService(data);
      } else {
        throw new Error("Offline");
      }
    } catch {
      get().showToast("خطا در ثبت خدمت", "error");
      throw new Error("Failed");
    }
    set((state) => ({ services: [...state.services, newService] }));
    get().showToast(`خدمت "${newService.name}" افزوده شد.`, "success");
    return newService;
  },

  updateService: async (id, data) => {
    try {
      if (get().isApiConnected) await adminApi.updateService(id, data);
    } catch {
      get().showToast("خطا در ویرایش خدمت", "error");
      return false;
    }
    set((state) => ({
      services: state.services.map((s) =>
        s.id === id ? { ...s, ...data } : s,
      ),
    }));
    get().showToast("تغییرات خدمت ذخیره شد.", "success");
    return true;
  },

  deleteService: async (id) => {
    try {
      if (get().isApiConnected) await adminApi.deleteService(id);
    } catch {
      get().showToast("خطا در حذف خدمت", "error");
      return false;
    }
    set((state) => ({ services: state.services.filter((s) => s.id !== id) }));
    get().showToast("خدمت حذف شد.", "info");
    return true;
  },

  createCategory: async (data) => {
    let newCat: ServiceCategory;
    try {
      if (get().isApiConnected) {
        newCat = await adminApi.createCategory(data);
      } else {
        throw new Error("Offline");
      }
    } catch {
      get().showToast("خطا در ثبت دسته‌بندی", "error");
      throw new Error("Failed");
    }
    set((state) => ({ categories: [...state.categories, newCat] }));
    get().showToast(`دسته‌بندی "${newCat.name}" افزوده شد.`, "success");
    return newCat;
  },

  updateCategory: async (id, data) => {
    try {
      if (get().isApiConnected) await adminApi.updateCategory(id, data);
    } catch {
      get().showToast("خطا در ویرایش دسته‌بندی", "error");
      return false;
    }
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, ...data } : c,
      ),
    }));
    get().showToast("دسته‌بندی ویرایش شد.", "success");
    return true;
  },

  deleteCategory: async (id) => {
    try {
      if (get().isApiConnected) await adminApi.deleteCategory(id);
    } catch {
      get().showToast("خطا در حذف دسته‌بندی", "error");
      return false;
    }
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
    get().showToast("دسته‌بندی حذف شد.", "info");
    return true;
  },

  createStaff: async (data) => {
    let newStaff: Staff;
    try {
      if (get().isApiConnected) {
        newStaff = await adminApi.createStaff(data);
      } else {
        throw new Error("Offline");
      }
    } catch {
      get().showToast("خطا در ثبت پرسنل", "error");
      throw new Error("Failed");
    }
    set((state) => ({ staff: [...state.staff, newStaff] }));
    get().showToast(`پرسنل "${newStaff.name}" افزوده شد.`, "success");
    return newStaff;
  },

  updateStaff: async (id, data) => {
    try {
      if (get().isApiConnected) await adminApi.updateStaff(id, data);
    } catch {
      get().showToast("خطا در ویرایش پرسنل", "error");
      return false;
    }
    set((state) => ({
      staff: state.staff.map((s) => (s.id === id ? { ...s, ...data } : s)),
    }));
    get().showToast("اطلاعات پرسنل به‌روز شد.", "success");
    return true;
  },

  deleteStaff: async (id) => {
    try {
      if (get().isApiConnected) await adminApi.deleteStaff(id);
    } catch {
      get().showToast("خطا در حذف پرسنل", "error");
      return false;
    }
    set((state) => ({ staff: state.staff.filter((s) => s.id !== id) }));
    get().showToast("پرسنل حذف شد.", "info");
    return true;
  },

  createLocation: async (data) => {
    let newLoc: Location;
    try {
      if (get().isApiConnected) {
        newLoc = await adminApi.createLocation(data);
      } else {
        throw new Error("Offline");
      }
    } catch {
      get().showToast("خطا در ثبت شعبه", "error");
      throw new Error("Failed");
    }
    set((state) => ({ locations: [...state.locations, newLoc] }));
    get().showToast(`شعبه "${newLoc.name}" ثبت شد.`, "success");
    return newLoc;
  },

  updateLocation: async (id, data) => {
    try {
      if (get().isApiConnected) await adminApi.updateLocation(id, data);
    } catch {
      get().showToast("خطا در ویرایش شعبه", "error");
      return false;
    }
    set((state) => ({
      locations: state.locations.map((l) =>
        l.id === id ? { ...l, ...data } : l,
      ),
    }));
    get().showToast("اطلاعات شعبه به‌روز شد.", "success");
    return true;
  },

  deleteLocation: async (id) => {
    try {
      if (get().isApiConnected) await adminApi.deleteLocation(id);
    } catch {
      get().showToast("خطا در حذف شعبه", "error");
      return false;
    }
    set((state) => ({ locations: state.locations.filter((l) => l.id !== id) }));
    get().showToast("شعبه حذف شد.", "info");
    return true;
  },

  updateTenant: async (data) => {
    try {
      if (get().isApiConnected) {
        const updated = await adminApi.updateTenant(data);
        set({ tenant: updated });
      }
    } catch {
      get().showToast("خطا در ذخیره مشخصات کلینیک", "error");
      return false;
    }
    get().showToast("مشخصات کلینیک با موفقیت ذخیره شد.", "success");
    return true;
  },
}));
