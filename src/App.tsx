import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import { useAppStore } from './stores/appStore';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { AppHeader } from './components/layout/AppHeader';
import { ToastContainer } from './components/common/ToastContainer';
import { NewAppointmentModal } from './features/appointments/NewAppointmentModal';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { AppointmentsPage } from './features/appointments/AppointmentsPage';
import { ServicesPage } from './features/services/ServicesPage';
import { StaffPage } from './features/staff/StaffPage';
import { LocationsPage } from './features/locations/LocationsPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { LoginPage } from './features/auth/LoginPage';

export default function App() {
  const { isAuthenticated } = useAuthStore();
  const { currentPalette, applyThemeToDOM } = useThemeStore();
  const { fetchInitialData } = useAppStore();

  const [isGlobalNewAppointmentOpen, setIsGlobalNewAppointmentOpen] = useState(false);

  // Initialize theme CSS variables & sync with backend on mount
  useEffect(() => {
    applyThemeToDOM(currentPalette);
    fetchInitialData();
  }, [currentPalette, applyThemeToDOM, fetchInitialData]);

  if (!isAuthenticated) {
    return (
      <div dir="rtl" className="dark bg-slate-950 min-h-screen text-slate-100 font-sans">
        <LoginPage />
        <ToastContainer />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div dir="rtl" className="dark bg-slate-950 text-slate-100 min-h-screen flex font-sans selection:bg-brand-primary/30 selection:text-white">
        {/* Desktop Collapsible Sidebar */}
        <Sidebar onOpenNewAppointment={() => setIsGlobalNewAppointmentOpen(true)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
          {/* Top Header */}
          <AppHeader onOpenNewAppointment={() => setIsGlobalNewAppointmentOpen(true)} />

          {/* Page Body */}
          <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Mobile Bottom Navigation Bar (5 tabs max, secretary touch-optimized) */}
          <MobileNav />
        </div>

        {/* Global Quick Phone Booking Modal */}
        <NewAppointmentModal
          isOpen={isGlobalNewAppointmentOpen}
          onClose={() => setIsGlobalNewAppointmentOpen(false)}
        />

        {/* Global Toast Notifications */}
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}
