import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './authContext';
import About from './components/About';
import UserRegistration from './components/admin/UserRegistration';
import Dashboard from './components/Dashboard';
import DisputeCenter from './components/DisputeCenter';
import './components/GlobalStyles.css';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Verification from './components/Verification';

// Profile Components
import AdminProfile from './components/profiles/AdminProfile';
import CitizenProfile from './components/profiles/CitizenProfile';
import LegalProfile from './components/profiles/LegalProfile';

// Edit Profile Components
import EditAdminProfile from './components/profiles/EditAdminProfile';
import EditCitizenProfile from './components/profiles/EditCitizenProfile';
import EditLegalProfile from './components/profiles/EditLegalProfile';

// Admin Management Components
import ManageLandRecords from './components/admin/ManageLandRecords';
import ManageUsers from './components/admin/ManageUsers';

const AdminPanelLazy = lazy(() => import('./components/admin/AdminPanel'));

function App() {
  const { currentUser, loading } = useAuth();

  try {
    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={currentUser ? <Homepage /> : <Navigate to="/login" />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="dashboard" element={
            currentUser ? <Dashboard user={currentUser} /> : <Navigate to="/login" />
          }>
            <Route path="verify" element={<Verification />} />
            
            {/* Citizen routes */}
            <Route path="disputes" element={<DisputeCenter />} />
           
            {/* Admin routes */}
            <Route path="admin" element={
                  currentUser?.role === 'admin' ? <AdminPanelLazy /> : <Navigate to="/" />
            } />
            
            <Route path="admin/register-user" element={
                  currentUser?.role === 'admin' ? <UserRegistration /> : <Navigate to="/" />
            } />
            
            <Route path="admin/manage-land-records" element={
                  currentUser?.role === 'admin' ? <ManageLandRecords /> : <Navigate to="/" />
            } />
            
            <Route path="admin/manage-users" element={
                  currentUser?.role === 'admin' ? <ManageUsers /> : <Navigate to="/" />
            } />
            
            {/* Legal officer routes */}
            <Route path="legal" element={
                  currentUser?.role === 'legal' ? <DisputeCenter adminView /> : <Navigate to="/" />
            } />
            
            {/* Profile routes - Role-based */}
            <Route path="profile" element={
              currentUser?.role === 'admin' ? <AdminProfile /> :
              currentUser?.role === 'legal' ? <LegalProfile /> :
              <CitizenProfile />
            } />
            
            {/* Edit Profile routes - Role-based */}
            <Route path="profile/edit" element={
              currentUser?.role === 'admin' ? <EditAdminProfile /> :
              currentUser?.role === 'legal' ? <EditLegalProfile /> :
              <EditCitizenProfile />
            } />
          </Route>
          
          {/* Catch all route - redirect to homepage */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
          </Suspense>
      </BrowserRouter>
    );
  } catch (error) {
    console.error('❌ Error in App component:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>🚨 App Error</h1>
        <p>There was an error loading the application.</p>
        <pre style={{ background: '#f0f0f0', padding: '10px', textAlign: 'left' }}>
          {error.message}
        </pre>
      </div>
    );
  }
}

export default App;