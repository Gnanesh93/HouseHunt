import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './modules/common/Toast';

// Common Pages
import Home from './modules/common/Home';
import Login from './modules/common/Login';
import Register from './modules/common/Register';
import ForgotPassword from './modules/common/ForgotPassword';
import PropertyDetails from './modules/common/PropertyDetails';
import Profile from './modules/common/Profile';
import Unauthorized from './modules/common/Unauthorized';
import NotFound from './modules/common/NotFound';

// Renter (user) pages
import RenterHome from './modules/user/renter/RenterHome';
import RenterAllProperties from './modules/user/renter/AllProperties';
import RenterBookings from './modules/user/renter/RenterBookings';

// Owner pages
import OwnerHome from './modules/user/owner/OwnerHome';
import AddProperty from './modules/user/owner/AddProperty';
import OwnerAllProperties from './modules/user/owner/AllProperties';
import OwnerAllBookings from './modules/user/owner/AllBookings';

// Admin pages
import AdminHome from './modules/admin/AdminHome';
import AdminAllUsers from './modules/admin/AllUsers';
import AdminAllProperty from './modules/admin/AllProperty';
import AdminAllBookings from './modules/admin/AllBookings';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toast />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Shared Authenticated Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Renter (User) Protected Routes */}
          <Route
            path="/user/home"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <RenterHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/properties"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <RenterAllProperties />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/bookings"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <RenterBookings />
              </ProtectedRoute>
            }
          />

          {/* Owner Protected Routes */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/add-property"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <AddProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/edit-property/:id"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <AddProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/properties"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerAllProperties />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/bookings"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerAllBookings />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAllUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/properties"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAllProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAllBookings />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
