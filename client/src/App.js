import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthChange } from './auth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import UserRegistration from './components/admin/UserRegistration'; 
import Verification from './components/Verification';
import DisputeCenter from './components/DisputeCenter';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          user ? <Dashboard user={user} /> : <Navigate to="/login" />
        }>
          <Route path="verify" element={<Verification />} />
          
          {/* Citizen routes */}
          <Route path="disputes" element={
            user?.role === 'citizen' ? <DisputeCenter /> : <Navigate to="/" />
          } />
          
          {/* Admin routes */}
          <Route path="admin" element={
            user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />
          } />
          
          <Route path="/admin/register-user" element={
           user?.role === 'admin' ? <UserRegistration /> : <Navigate to="/" />
          } />
          
          {/* Legal officer routes */}
          <Route path="legal" element={
            user?.role === 'legal' ? <DisputeCenter adminView /> : <Navigate to="/" />
          } />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;