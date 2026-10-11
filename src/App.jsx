import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Loading from './components/Loading';

// Layouts (direct import for fast shell rendering)
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Lazy Loaded Pages for Instant Initial Load & Code Splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));

// Beneficiary Pages
const BeneficiaryDashboard = lazy(() => import('./pages/beneficiary/BeneficiaryDashboard'));
const BookSlotPage = lazy(() => import('./pages/beneficiary/BookSlotPage'));
const BookingConfirmationPage = lazy(() => import('./pages/beneficiary/BookingConfirmationPage'));
const MyBookingsPage = lazy(() => import('./pages/beneficiary/MyBookingsPage'));
const BeneficiaryProfilePage = lazy(() => import('./pages/beneficiary/BeneficiaryProfilePage'));
const HelpFaqPage = lazy(() => import('./pages/beneficiary/HelpFaqPage'));

// Dealer Pages
const DealerDashboard = lazy(() => import('./pages/dealer/DealerDashboard'));
const ManageSlotsPage = lazy(() => import('./pages/dealer/ManageSlotsPage'));
const DealerProfilePage = lazy(() => import('./pages/dealer/DealerProfilePage'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const CreateDealerPage = lazy(() => import('./pages/admin/CreateDealerPage'));
const LinkShopPage = lazy(() => import('./pages/admin/LinkShopPage'));
const AdminPlaceholderPage = lazy(() => import('./pages/admin/AdminPlaceholderPage'));

const PageLoader = () => <Loading text="Loading..." />;

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Beneficiary Dashboard Suite */}
            <Route
              path="/beneficiary"
              element={
                <ProtectedRoute allowedRoles={['BENEFICIARY']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<BeneficiaryDashboard />} />
              <Route path="book-slot" element={<BookSlotPage />} />
              <Route path="booking-confirmed" element={<BookingConfirmationPage />} />
              <Route path="my-bookings" element={<MyBookingsPage />} />
              <Route path="profile" element={<BeneficiaryProfilePage />} />
              <Route path="help" element={<HelpFaqPage />} />
            </Route>

            {/* Dealer Dashboard Suite */}
            <Route
              path="/dealer"
              element={
                <ProtectedRoute allowedRoles={['DEALER']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DealerDashboard />} />
              <Route path="slots" element={<ManageSlotsPage />} />
              <Route path="profile" element={<DealerProfilePage />} />
              <Route path="today" element={<DealerDashboard />} />
              <Route path="stock" element={<DealerDashboard />} />
              <Route path="verify" element={<DealerDashboard />} />
            </Route>

            {/* Admin Dashboard Suite */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="create-dealer" element={<CreateDealerPage />} />
              <Route path="link-shop" element={<LinkShopPage />} />
              <Route
                path="fps"
                element={<AdminPlaceholderPage title="Manage Fair Price Shops" />}
              />
              <Route
                path="users"
                element={<AdminPlaceholderPage title="User Management & Role Assignment" />}
              />
              <Route
                path="reports"
                element={<AdminPlaceholderPage title="State PDS Reports & Analytics" />}
              />
              <Route
                path="settings"
                element={<AdminPlaceholderPage title="System Configuration & Quotas" />}
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
