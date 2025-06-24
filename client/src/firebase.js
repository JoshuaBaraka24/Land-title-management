import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCfRWeDdQv_0d_ZrDGRKABvbGbFliXhYlc",
  authDomain: "land-title-system.firebaseapp.com",
  projectId: "land-title-system",
  storageBucket: "land-title-system.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);