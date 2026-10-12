import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { GaragePage } from './pages/GaragePage';
import { MaintenancePage } from './pages/MaintenancePage';
import { DocumentsPage } from './pages/DocumentsPage';
import { BookingsPage } from './pages/BookingsPage';
import { ServicesPage } from './pages/ServicesPage';
import { SosPage } from './pages/SosPage';
import { PartsPage } from './pages/PartsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProviderPortalPage } from './pages/ProviderPortalPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { TermsPrivacyPage } from './pages/TermsPrivacyPage';
import { VeteranSuitePage } from './pages/VeteranSuitePage';
import { MarketplacePage } from './pages/MarketplacePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({
  children,
  requiredRole,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (
    requiredRole === 'provider' &&
    user.role !== 'workshop' &&
    user.role !== 'roadside' &&
    user.role !== 'admin'
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      <Navbar />
      <div className="flex-1">{children}</div>
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/terms" element={<TermsPrivacyPage />} />

              {/* Protected Customer Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/garage"
                element={
                  <ProtectedRoute>
                    <GaragePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/intelligence"
                element={
                  <ProtectedRoute>
                    <VeteranSuitePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/maintenance"
                element={
                  <ProtectedRoute>
                    <MaintenancePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents"
                element={
                  <ProtectedRoute>
                    <DocumentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <BookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/services"
                element={
                  <ProtectedRoute>
                    <ServicesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sos"
                element={
                  <ProtectedRoute>
                    <SosPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parts"
                element={
                  <ProtectedRoute>
                    <PartsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/marketplace"
                element={
                  <ProtectedRoute>
                    <MarketplacePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Privileged Provider Portal */}
              <Route
                path="/provider"
                element={
                  <ProtectedRoute requiredRole="provider">
                    <ProviderPortalPage />
                  </ProtectedRoute>
                }
              />

              {/* Privileged Admin Portal */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPortalPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
