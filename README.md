# Unitimely Admin Dashboard

A modern, mobile-first, dark-mode administration panel designed specifically for clinics and beauty service businesses. Built with React 19, TypeScript, and Tailwind CSS v4, it features full Persian (RTL) localization, dynamic theme customization, and a robust offline-first fallback system.

## ✨ Key Features

- **📊 Comprehensive Dashboard:** Real-time overview of today's appointments, revenue, pending bookings, and weekly trends (via Recharts).
- **📅 Appointment Management:** Full CRUD operations, status updates (Pending, Confirmed, Completed, Cancelled, No-show), and manual phone/walk-in booking.
- **💇 Service & Staff Management:** Grouped service categories, staff profiles with specialties, and branch/location management.
- **🎨 Dynamic Theming:** 10 predefined Tailwind color palettes (Indigo, Teal, Emerald, Rose, etc.) that can be switched instantly via CSS variables, persisted in local storage.
- **📱 Mobile-First & Responsive:** Optimized for secretaries using mobile phones, featuring a bottom navigation bar for small screens and a collapsible sidebar for desktop.
- **🛡️ Resilient Data Layer:** Intelligent fallback to realistic Persian mock data if the backend API is unreachable, ensuring the UI remains fully functional during development or outages.
- **🌙 Dark Mode Only:** Professionally tuned dark UI with glassmorphism effects, optimized contrast, and reduced eye strain.

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 (with `@tailwindcss/vite` plugin)
- **State Management:** Zustand (with `persist` middleware)
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios (with custom interceptors)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion)
- **Utilities:** `clsx`, `tailwind-merge`