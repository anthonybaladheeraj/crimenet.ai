import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/auth/LoginPage';
import OtpVerificationPage from './pages/auth/OtpVerificationPage';

import DashboardLayout from './components/layout/DashboardLayout';
import HomeDashboard from './pages/dashboard/HomeDashboard';
import GlobalSearchPage from './pages/search/GlobalSearchPage';
import ActiveCasesPage from './pages/cases/ActiveCasesPage';
import AddCasePage from './pages/cases/AddCasePage';
import UpdateCasePage from './pages/cases/UpdateCasePage';
import SolvedCasesPage from './pages/cases/SolvedCasesPage';
import FirRecordsPage from './pages/fir/FirRecordsPage';
import SuspectDetailsPage from './pages/suspects/SuspectDetailsPage';
import SettingsPage from './pages/settings/SettingsPage';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Login Route Guard (if already logged in, redirect to dashboard)
const PublicAuthRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={
              <PublicAuthRoute>
                <LoginPage />
              </PublicAuthRoute>
            }
          />
          <Route
            path="/otp"
            element={
              <PublicAuthRoute>
                <OtpVerificationPage />
              </PublicAuthRoute>
            }
          />

          {/* Protected Dashboard Shell */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomeDashboard />} />
            <Route path="search" element={<GlobalSearchPage />} />
            <Route path="active-cases" element={<ActiveCasesPage />} />
            <Route path="active-cases/new" element={<AddCasePage />} />
            <Route path="active-cases/update" element={<UpdateCasePage />} />
            <Route path="solved-cases" element={<SolvedCasesPage />} />
            <Route path="fir-records" element={<FirRecordsPage />} />
            <Route path="suspect-details" element={<SuspectDetailsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Default Redirection */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
