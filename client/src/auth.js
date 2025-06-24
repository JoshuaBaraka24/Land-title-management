import { 
  auth, 
  db,
} from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    
    // 2. Add user data to Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      role,
      phone,
      createdAt: new Date()
    });
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Login with email/password
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Logout
export const logout = async () => {
  await signOut(auth);
};

// Get current user with role data
export const getCurrentUser = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return {
        uid: user.uid,
        email: user.email,
        ...userDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// Auth state listener
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userData = await getCurrentUser();
      callback(userData);
    } else {
      callback(null);
    }
  });
};