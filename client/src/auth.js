import { supabase, auth } from './supabase';

// User roles
export const ROLES = {
  CITIZEN: 'citizen',
  ADMIN: 'admin',
  LEGAL: 'legal'
};

// Register new user with role
export const register = async (email, password, role, phone) => {
  try {
    // 1. Create auth account
    const { data: authData, error: authError } = await auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          phone
        }
      }
    });
    
    if (authError) throw authError;
    
    // 2. Add user data to profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        role,
        phone,
        created_at: new Date().toISOString()
      });
    
    if (profileError) throw profileError;
    
    return { success: true, user: authData.user };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: error.message };
  }
};

// Login with email/password
export const login = async (email, password) => {
  try {
    const { data, error } = await auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    return { success: true, user: data.user };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
};

// Logout
export const logout = async () => {
  try {
    const { error } = await auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};

// Get current user with role data
export const getCurrentUser = async () => {
  const { data: { user } } = await auth.getUser();
  if (!user) return null;
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    
    return {
      uid: user.id,
      email: user.email,
      ...profile
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// Get user data by Supabase user object
export const getUserData = async (supabaseUser) => {
  if (!supabaseUser) return null;
  
  console.log('🔍 Fetching user data for:', supabaseUser.email, 'ID:', supabaseUser.id);
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();
    
    console.log('📊 Profile query result:', { profile, error });
    
    // If no profile exists, create a basic user object
    if (error && error.code === 'PGRST116') {
      console.log('⚠️ No profile found, using basic user data');
      const basicUserData = {
        uid: supabaseUser.id,
        email: supabaseUser.email,
        role: 'citizen', // Default role
        created_at: new Date().toISOString()
      };
      console.log('✅ Basic user data:', basicUserData);
      return basicUserData;
    }
    
    if (error) throw error;
    
    const userData = {
      uid: supabaseUser.id,
      email: supabaseUser.email,
      ...profile
    };
    
    console.log('✅ User data constructed:', userData);
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    const fallbackData = {
      uid: supabaseUser.id,
      email: supabaseUser.email,
      role: 'citizen', // Default role
      created_at: new Date().toISOString()
    };
    console.log('⚠️ Using fallback user data:', fallbackData);
    return fallbackData;
  }
};

// Auth state listener
export const onAuthChange = (callback) => {
  console.log('🔧 Setting up Supabase auth listener...');
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('🔄 Auth state change event:', event, 'Session:', session ? 'exists' : 'null');
    
    try {
      if (session?.user) {
        console.log('👤 User found in session:', session.user.email);
        const userData = await getUserData(session.user);
        console.log('📊 User data fetched:', userData);
        callback(userData);
      } else {
        console.log('❌ No user in session');
        callback(null);
      }
    } catch (error) {
      console.error("Auth state change error:", error);
      callback(null);
    }
  });
  
  console.log('✅ Auth listener setup complete, subscription:', subscription ? 'exists' : 'null');
  return () => {
    console.log('🧹 Cleaning up auth listener...');
    subscription?.unsubscribe();
  };
};

// Reset password
export const resetPassword = async (email) => {
  try {
    const { error } = await auth.resetPasswordForEmail(email);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user profile
export const getUserProfile = async (uid) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Helper to get email by idNumber from backend (if needed)
export async function getEmailByIdNumber(idNumber) {
  const response = await fetch('/api/get-email-by-id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idNumber }),
  });
  if (!response.ok) throw new Error('ID number not found');
  const data = await response.json();
  return data.email;
}

// Login with idNumber and password (if needed)
export const loginWithIdNumber = async (idNumber, password) => {
  try {
    // 1. Get email from backend
    const email = await getEmailByIdNumber(idNumber);

    // 2. Authenticate with Supabase Auth
    const { data, error } = await auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return {
      uid: data.user.id,
      email,
      success: true
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};