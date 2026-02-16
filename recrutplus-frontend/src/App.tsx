import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import JobOffersListPage from './pages/joboffer/JobOffersListPage';
import JobOfferDetailPage from './pages/joboffer/JobOfferDetailPage';
import ApplicationListPage from './pages/application/ApplicationListPage';
import ApplicationDetailPage from './pages/application/ApplicationDetailPage';
import InterviewListPage from './pages/interview/InterviewListPage';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types/User';
import ChangePassword from './pages/profile/ChangePassword';
import Profile from './pages/profile/Profile';
import MyApplicationsPage from './pages/application/MyApplicationsPage';
import MyInterviewsPage from './pages/interview/MyInterviewsPage';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/job-offers" element={<JobOffersListPage />} />
          <Route path="/job-offers/:id" element={<JobOfferDetailPage />} />


          {/* Protected routes */}


          {/* Profile routes (accessible to all authenticated users) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CANDIDAT, UserRole.RH, UserRole.ADMIN]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CANDIDAT, UserRole.RH, UserRole.ADMIN]}>
                <ChangePassword />
              </ProtectedRoute>
              }
          />
          
          {/* RH/ADMIN routes */}
          <Route
            path="/job-offers-management"
            element={
              <ProtectedRoute allowedRoles={[UserRole.RH, UserRole.ADMIN]}>
                <div>Job Offers Management</div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/applications"
            element={
              <ProtectedRoute allowedRoles={[UserRole.RH, UserRole.ADMIN]}>
                < ApplicationListPage/>
              </ProtectedRoute>
            }
          />

          <Route 
            path="/application/:id"
            element={
              <ProtectedRoute allowedRoles={[UserRole.RH, UserRole.ADMIN]}>
                < ApplicationDetailPage/>
              </ProtectedRoute>
            }

          />

          <Route
            path="/interviews"
            element={
              <ProtectedRoute allowedRoles={[UserRole.RH, UserRole.ADMIN]}>
                < InterviewListPage/>
              </ProtectedRoute>
            }
          />


          {/* ADMIN routes */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <div>Users Management</div>
              </ProtectedRoute>
            }
          />

          {/* CANDIDAT routes */}
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CANDIDAT]}>
                < MyApplicationsPage/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-interviews"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CANDIDAT]}>
                < MyInterviewsPage/>
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <div>Administration</div>
              </ProtectedRoute>
            }
          />




          {/* Fallback */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
        <Footer/>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;