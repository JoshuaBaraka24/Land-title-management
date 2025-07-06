import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfile, logout, onAuthChange, updateUserProfile } from './auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add logout function to context
  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Add update profile function to context
  const handleUpdateProfile = async (profileData) => {
    try {
      if (!currentUser?.uid) {
        throw new Error('No user logged in');
      }
      
      const result = await updateUserProfile(currentUser.uid, profileData);
      
      if (result.success) {
        setProfile(result.data);
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Update profile error:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    let unsubscribe = null;
    
    const setupAuth = async () => {
      try {
        unsubscribe = onAuthChange(async (user) => {
          setCurrentUser(user);
          
          if (user && user.uid) {
            try {
              const userProfile = await getUserProfile(user.uid);
              setProfile(userProfile);
            } catch (profileError) {
              console.error('Error fetching profile:', profileError);
              setProfile(null);
            }
          } else {
            setProfile(null);
          }
          
          setLoading(false);
          setError(null);
        });
      } catch (err) {
        console.error('❌ Error setting up auth listener:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    setupAuth();

    // Return cleanup function
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Expose logout function in context value
  const value = {
    currentUser,
    profile,
    loading,
    error,
    logout: handleLogout,
    updateProfile: handleUpdateProfile
  };

  // Always render children, but show error if there is one
  return (
    <AuthContext.Provider value={value}>
      {error ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>🚨 Authentication Error</h1>
          <p>There was an error setting up authentication:</p>
          <pre style={{ background: '#f0f0f0', padding: '10px' }}>
            {error}
          </pre>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}