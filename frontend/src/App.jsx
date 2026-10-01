import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { Login } from './pages/Login';

// Facility Pages
import { FacilityDashboard } from './pages/facility/FacilityDashboard';
import { FacilityShifts } from './pages/facility/FacilityShifts';
import { FacilityApplications } from './pages/facility/FacilityApplications';
import { FacilityProfessionals } from './pages/facility/FacilityProfessionals';

// Professional Pages
import { ProfessionalDashboard } from './pages/professional/ProfessionalDashboard';
import { ProfessionalShifts } from './pages/professional/ProfessionalShifts';
import { ProfessionalApplications } from './pages/professional/ProfessionalApplications';
import { ProfessionalProfile } from './pages/professional/ProfessionalProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminFacilities } from './pages/admin/AdminFacilities';
import { AdminProfessionals } from './pages/admin/AdminProfessionals';
import { AdminShifts } from './pages/admin/AdminShifts';
import { AdminApplications } from './pages/admin/AdminApplications';

// Root Redirect Component
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'FACILITY') return <Navigate to="/facility/dashboard" replace />;
  return <Navigate to="/professional/dashboard" replace />;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />

            {/* Facility Routes */}
            <Route
              path="/facility"
              element={
                <ProtectedRoute allowedRoles={['FACILITY', 'ADMIN']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<FacilityDashboard />} />
              <Route path="shifts" element={<FacilityShifts />} />
              <Route path="applications" element={<FacilityApplications />} />
              <Route path="professionals" element={<FacilityProfessionals />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Professional Routes */}
            <Route
              path="/professional"
              element={
                <ProtectedRoute allowedRoles={['PROFESSIONAL', 'ADMIN']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<ProfessionalDashboard />} />
              <Route path="shifts" element={<ProfessionalShifts />} />
              <Route path="applications" element={<ProfessionalApplications />} />
              <Route path="profile" element={<ProfessionalProfile />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="facilities" element={<AdminFacilities />} />
              <Route path="professionals" element={<AdminProfessionals />} />
              <Route path="shifts" element={<AdminShifts />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}
