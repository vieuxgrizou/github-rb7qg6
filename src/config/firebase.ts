import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCP_ptZDJ9A62D90GTNDKMjX0QVnmTy_hk",
  authDomain: "intensify-api.firebaseapp.com",
  projectId: "intensify-api",
  storageBucket: "intensify-api.firebasestorage.app",
  messagingSenderId: "758001542257",
  appId: "1:758001542257:web:a219515b5db4c077a967d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;