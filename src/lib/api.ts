import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../stores/authStore';
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

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1/admin';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach X-Admin-Api-Key to every request
apiClient.interceptors.request.use((config) => {
  const apiKey = useAuthStore.getState().apiKey;
  if (apiKey) {
    config.headers['X-Admin-Api-Key'] = apiKey;
  }
  return config;
});

// Admin API Services
export const adminApi = {
  // Appointments
  async getAppointments(params?: {
    status?: string;
    start_date?: string;
    end_date?: string;
    staff_id?: string;
    service_id?: string;
  }): Promise<Appointment[]> {
    const res = await apiClient.get('/appointments', { params });
    return res.data;
  },

  async getAppointment(id: string): Promise<Appointment> {
    const res = await apiClient.get(`/appointments/${id}`);
    return res.data;
  },

  async updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const res = await apiClient.patch(`/appointments/${id}/status`, { status });
    return res.data;
  },

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    const res = await apiClient.post('/appointments', data);
    return res.data;
  },

  // Services
  async getServices(): Promise<Service[]> {
    const res = await apiClient.get('/services');
    return res.data;
  },

  async createService(data: Omit<Service, 'id' | 'tenant_id'>): Promise<Service> {
    const res = await apiClient.post('/services', data);
    return res.data;
  },

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    const res = await apiClient.put(`/services/${id}`, data);
    return res.data;
  },

  async deleteService(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete(`/services/${id}`);
    return res.data;
  },

  // Service Categories
  async getCategories(): Promise<ServiceCategory[]> {
    const res = await apiClient.get('/service-categories');
    return res.data;
  },

  async createCategory(data: Partial<ServiceCategory>): Promise<ServiceCategory> {
    const res = await apiClient.post('/service-categories', data);
    return res.data;
  },

  async updateCategory(id: string, data: Partial<ServiceCategory>): Promise<ServiceCategory> {
    const res = await apiClient.put(`/service-categories/${id}`, data);
    return res.data;
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete(`/service-categories/${id}`);
    return res.data;
  },

  // Staff
  async getStaff(): Promise<Staff[]> {
    const res = await apiClient.get('/staff');
    return res.data;
  },

  async createStaff(data: Omit<Staff, 'id'>): Promise<Staff> {
    const res = await apiClient.post('/staff', data);
    return res.data;
  },

  async updateStaff(id: string, data: Partial<Staff>): Promise<Staff> {
    const res = await apiClient.put(`/staff/${id}`, data);
    return res.data;
  },

  async deleteStaff(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete(`/staff/${id}`);
    return res.data;
  },

  // Locations
  async getLocations(): Promise<Location[]> {
    const res = await apiClient.get('/locations');
    return res.data;
  },

  async createLocation(data: Omit<Location, 'id'>): Promise<Location> {
    const res = await apiClient.post('/locations', data);
    return res.data;
  },

  async updateLocation(id: string, data: Partial<Location>): Promise<Location> {
    const res = await apiClient.put(`/locations/${id}`, data);
    return res.data;
  },

  async deleteLocation(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete(`/locations/${id}`);
    return res.data;
  },

  // Tenant
  async getTenant(): Promise<Tenant> {
    const res = await apiClient.get('/tenant');
    return res.data;
  },

  async updateTenant(data: Partial<Tenant>): Promise<Tenant> {
    const res = await apiClient.put('/tenant', data);
    return res.data;
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await apiClient.get('/dashboard/stats');
    return res.data;
  },
};
