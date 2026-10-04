// import axios from "axios";
// import { useAuthStore } from "../stores/authStore";
// import {
//   Appointment,
//   AppointmentStatus,
//   DashboardStats,
//   Location,
//   Service,
//   ServiceCategory,
//   Staff,
//   Tenant,
// } from "../types";

// const BASE_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/admin";
// const TENANT_SLUG = import.meta.env.VITE_TENANT_SLUG || "yasaman-raesi";

// export const apiClient = axios.create({
//   baseURL: BASE_URL,
//   timeout: 8000,
//   headers: {
//     "Content-Type": "application/json",
//     // اصلاح ۱: نام هدر دقیقاً مطابق با مستندات بک‌اند
//     "x-admin-key": useAuthStore.getState().apiKey || "",
//   },
// });

// // اینترسپتور برای اطمینان از ارسال کلید در هر درخواست
// apiClient.interceptors.request.use((config) => {
//   const apiKey = useAuthStore.getState().apiKey;
//   if (apiKey) {
//     config.headers["x-admin-key"] = apiKey;
//   }
//   return config;
// });

// export const adminApi = {
//   // اصلاح ۲: اضافه کردن TENANT_SLUG به تمام مسیرها
//   async getAppointments(params?: {
//     date?: string;
//     status?: string;
//   }): Promise<Appointment[]> {
//     const res = await apiClient.get(`/${TENANT_SLUG}/appointments`, { params });
//     return res.data;
//   },

//   async getAppointment(id: string): Promise<Appointment> {
//     const res = await apiClient.get(`/${TENANT_SLUG}/appointments/${id}`);
//     return res.data;
//   },

//   async updateAppointmentStatus(
//     id: string,
//     status: AppointmentStatus,
//   ): Promise<Appointment> {
//     // توجه: اگر بک‌اند شما اندپوینت جداگانه برای کنسل کردن دارد، از آن استفاده می‌کنیم
//     // در غیر این صورت این PATCH باید کار کند. اگر ارور داد، بگویید تا اصلاح کنیم.
//     const res = await apiClient.patch(
//       `/${TENANT_SLUG}/appointments/${id}/cancel`,
//     );
//     return res.data;
//   },

//   async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
//     const res = await apiClient.post(`/${TENANT_SLUG}/appointments`, data);
//     return res.data;
//   },

//   async getServices(): Promise<Service[]> {
//     const res = await apiClient.get(`/${TENANT_SLUG}/services`);
//     return res.data;
//   },

//   async createService(
//     data: Omit<Service, "id" | "tenant_id">,
//   ): Promise<Service> {
//     const res = await apiClient.post(`/${TENANT_SLUG}/services`, data);
//     return res.data;
//   },

//   async updateService(id: string, data: Partial<Service>): Promise<Service> {
//     const res = await apiClient.put(`/${TENANT_SLUG}/services/${id}`, data);
//     return res.data;
//   },

//   async deleteService(id: string): Promise<{ success: boolean }> {
//     const res = await apiClient.delete(`/${TENANT_SLUG}/services/${id}`);
//     return res.data;
//   },

//   async getStaff(): Promise<Staff[]> {
//     const res = await apiClient.get(`/${TENANT_SLUG}/staff`);
//     return res.data;
//   },

//   async createStaff(data: Omit<Staff, "id">): Promise<Staff> {
//     const res = await apiClient.post(`/${TENANT_SLUG}/staff`, data);
//     return res.data;
//   },

//   async updateStaff(id: string, data: Partial<Staff>): Promise<Staff> {
//     const res = await apiClient.put(`/${TENANT_SLUG}/staff/${id}`, data);
//     return res.data;
//   },

//   async deleteStaff(id: string): Promise<{ success: boolean }> {
//     const res = await apiClient.delete(`/${TENANT_SLUG}/staff/${id}`);
//     return res.data;
//   },

//   async getLocations(): Promise<Location[]> {
//     const res = await apiClient.get(`/${TENANT_SLUG}/locations`);
//     return res.data;
//   },

//   async getTenant(): Promise<Tenant> {
//     // اگر بک‌اند اندپوینت tenant دارد، وگرنه می‌توان از public استفاده کرد
//     const res = await apiClient.get(`/public/${TENANT_SLUG}/tenant`); // یا /admin/{slug}/tenant اگر وجود دارد
//     return res.data;
//   },

//   async getDashboardStats(): Promise<DashboardStats> {
//     // اگر بک‌اند این اندپوینت را ندارد، فرانت‌اند آن را از لیست نوبت‌ها محاسبه می‌کند (که همین الان هم انجام می‌دهد)
//     const res = await apiClient.get(`/${TENANT_SLUG}/dashboard/stats`);
//     return res.data;
//   },

//   // --- Service Categories (اگر بک‌اند نداشته باشد، 404 می‌گیرد و appStore مدیریت می‌کند) ---
//   async getCategories(): Promise<ServiceCategory[]> {
//     const res = await apiClient.get(`/${TENANT_SLUG}/service-categories`);
//     return res.data;
//   },

//   async createCategory(
//     data: Partial<ServiceCategory>,
//   ): Promise<ServiceCategory> {
//     const res = await apiClient.post(
//       `/${TENANT_SLUG}/service-categories`,
//       data,
//     );
//     return res.data;
//   },

//   async updateCategory(
//     id: string,
//     data: Partial<ServiceCategory>,
//   ): Promise<ServiceCategory> {
//     const res = await apiClient.put(
//       `/${TENANT_SLUG}/service-categories/${id}`,
//       data,
//     );
//     return res.data;
//   },

//   async deleteCategory(id: string): Promise<void> {
//     await apiClient.delete(`/${TENANT_SLUG}/service-categories/${id}`);
//   },

//   // --- Locations (اگر بک‌اند نداشته باشد، 404 می‌گیرد و appStore مدیریت می‌کند) ---
//   async createLocation(data: Partial<Location>): Promise<Location> {
//     const res = await apiClient.post(`/${TENANT_SLUG}/locations`, data);
//     return res.data;
//   },

//   async updateLocation(id: string, data: Partial<Location>): Promise<Location> {
//     const res = await apiClient.put(`/${TENANT_SLUG}/locations/${id}`, data);
//     return res.data;
//   },

//   async deleteLocation(id: string): Promise<void> {
//     await apiClient.delete(`/${TENANT_SLUG}/locations/${id}`);
//   },

//   // --- Tenant ---
//   async updateTenant(data: Partial<Tenant>): Promise<Tenant> {
//     // اگر بک‌اند این مسیر را ندارد، از public استفاده می‌کنیم یا خالی می‌گذاریم
//     const res = await apiClient.put(`/public/${TENANT_SLUG}/tenant`, data);
//     return res.data;
//   },
// };

import axios from "axios";
import { useAuthStore } from "../stores/authStore";
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

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/admin";
const TENANT_SLUG = import.meta.env.VITE_TENANT_SLUG || "yasaman-raesi";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
    "x-admin-key": useAuthStore.getState().apiKey || "", // هماهنگ با بک‌اند جدید
  },
});

// اینترسپتور برای اطمینان از ارسال کلید در هر درخواست
apiClient.interceptors.request.use((config) => {
  const apiKey = useAuthStore.getState().apiKey;
  if (apiKey) {
    config.headers["x-admin-key"] = apiKey;
  }
  return config;
});

export const adminApi = {
  // --- Appointments ---
  async getAppointments(params?: {
    date?: string;
    status?: string;
  }): Promise<Appointment[]> {
    const res = await apiClient.get(`/${TENANT_SLUG}/appointments`, { params });
    return res.data;
  },

  async updateAppointmentStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    // مسیر جدید PATCH برای تغییر وضعیت
    const res = await apiClient.patch(
      `/${TENANT_SLUG}/appointments/${id}/status`,
      { status },
    );
    return res.data;
  },

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    const res = await apiClient.post(`/${TENANT_SLUG}/appointments`, data);
    return res.data;
  },

  // --- Services ---
  async getServices(): Promise<Service[]> {
    const res = await apiClient.get(`/${TENANT_SLUG}/services`);
    return res.data;
  },

  async createService(
    data: Omit<Service, "id" | "tenant_id">,
  ): Promise<Service> {
    const res = await apiClient.post(`/${TENANT_SLUG}/services`, data);
    return res.data;
  },

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    const res = await apiClient.put(`/${TENANT_SLUG}/services/${id}`, data);
    return res.data;
  },

  async deleteService(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete(`/${TENANT_SLUG}/services/${id}`);
    return res.data;
  },

  // --- Categories (مسیر جدید: categories به جای service-categories) ---
  async getCategories(): Promise<ServiceCategory[]> {
    const res = await apiClient.get(`/${TENANT_SLUG}/categories`);
    return res.data;
  },

  async createCategory(
    data: Partial<ServiceCategory>,
  ): Promise<ServiceCategory> {
    const res = await apiClient.post(`/${TENANT_SLUG}/categories`, data);
    return res.data;
  },

  async updateCategory(
    id: string,
    data: Partial<ServiceCategory>,
  ): Promise<ServiceCategory> {
    const res = await apiClient.put(`/${TENANT_SLUG}/categories/${id}`, data);
    return res.data;
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete(`/${TENANT_SLUG}/categories/${id}`);
    return res.data;
  },

  // --- Staff ---
  async getStaff(): Promise<Staff[]> {
    const res = await apiClient.get(`/${TENANT_SLUG}/staff`);
    return res.data;
  },

  async createStaff(data: Omit<Staff, "id">): Promise<Staff> {
    const res = await apiClient.post(`/${TENANT_SLUG}/staff`, data);
    return res.data;
  },

  async updateStaff(id: string, data: Partial<Staff>): Promise<Staff> {
    const res = await apiClient.put(`/${TENANT_SLUG}/staff/${id}`, data);
    return res.data;
  },

  async deleteStaff(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete(`/${TENANT_SLUG}/staff/${id}`);
    return res.data;
  },

  // --- Locations ---
  async getLocations(): Promise<Location[]> {
    const res = await apiClient.get(`/${TENANT_SLUG}/locations`);
    return res.data;
  },

  async createLocation(data: Omit<Location, "id">): Promise<Location> {
    const res = await apiClient.post(`/${TENANT_SLUG}/locations`, data);
    return res.data;
  },

  async updateLocation(id: string, data: Partial<Location>): Promise<Location> {
    const res = await apiClient.put(`/${TENANT_SLUG}/locations/${id}`, data);
    return res.data;
  },

  async deleteLocation(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete(`/${TENANT_SLUG}/locations/${id}`);
    return res.data;
  },

  // --- Tenant / Profile (مسیر جدید: profile به جای tenant) ---
  async getTenant(): Promise<Tenant> {
    const res = await apiClient.get(`/${TENANT_SLUG}/profile`);
    return res.data;
  },

  async updateTenant(data: Partial<Tenant>): Promise<Tenant> {
    const res = await apiClient.put(`/${TENANT_SLUG}/profile`, data);
    return res.data;
  },

  // --- Dashboard ---
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await apiClient.get(`/${TENANT_SLUG}/dashboard/stats`);
    return res.data;
  },
};
