import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
apiKey: "AIzaSyCfRWeDdQv_0d_ZrDGRKABvbGbFliXhYlc",
  authDomain: "landtitlesystem.firebaseapp.com",
  projectId: "landtitlesystem",
  storageBucket: "landtitlesystem.firebasestorage.app",
  messagingSenderId: "221865771145",
  appId: "1:221865771145:web:826bb54f87535c7f71c658",
  measurementId: "G-GKX2ZF4T1N"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);