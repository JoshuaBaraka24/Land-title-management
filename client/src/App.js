import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserRegistration from './components/admin/UserRegistration'; 
import Verification from './components/Verification';
import DisputeCenter from './components/DisputeCenter';
import { useAuth } from './authContext';
import React, { lazy, Suspense } from 'react';

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
          <Route path="/login" element={<Login />} />
          
              <Route path="/" element={<Navigate to="/dashboard" />} />
              
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
            
            {/* Legal officer routes */}
            <Route path="legal" element={
                  currentUser?.role === 'legal' ? <DisputeCenter adminView /> : <Navigate to="/" />
            } />
          </Route>
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