/**
 * Unitimely Admin - TypeScript Type Definitions
 */

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface Appointment {
  id: string;
  customer_name: string;
  customer_phone: string;
  service_id: string;
  staff_id: string;
  location_id: string;
  starts_at: string; // ISO datetime string
  ends_at: string;
  status: AppointmentStatus;
  price: number;
  reference_code: string;
  notes?: string;
  // Extended populated fields for fast UI rendering
  service_name?: string;
  staff_name?: string;
  location_name?: string;
  duration_minutes?: number;
}

export interface ServiceCategory {
  id: string;
  tenant_id?: string;
  name: string;
  description?: string;
  display_order?: number;
}

export interface Service {
  id: string;
  tenant_id: string;
  category_id?: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
}

export interface Staff {
  id: string;
  name: string;
  role?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  is_active: boolean;
  specialties?: string[];
}

export interface Location {
  id: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  is_active?: boolean;
}

export interface WorkingDay {
  day: string; // 'saturday', 'sunday', etc.
  day_label: string; // Persian label
  is_open: boolean;
  open_time: string; // e.g. "09:00"
  close_time: string; // e.g. "20:00"
}

export interface Tenant {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  logo?: string;
  working_hours?: WorkingDay[];
  instagram?: string;
  description?: string;
}

export interface WeeklyStat {
  day: string;
  day_name: string;
  count: number;
  revenue: number;
}

export interface DashboardStats {
  today_appointments: number;
  today_revenue: number;
  pending_bookings: number;
  completed_bookings: number;
  total_customers?: number;
  weekly_stats?: WeeklyStat[];
}

export type ThemePaletteName =
  | 'sky'
  | 'teal'
  | 'indigo'
  | 'purple'
  | 'violet'
  | 'emerald'
  | 'cyan'
  | 'fuchsia'
  | 'rose'
  | 'slate';

export interface ThemePalette {
  name: ThemePaletteName;
  label: string; // Persian name
  rgb: string;
  hover: string;
  light: string;
  colorCode: string; // Hex for swatch preview
}
