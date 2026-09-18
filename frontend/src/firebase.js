// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD98nmYYsCy8Rdt4wnaOzN-zyYen8uvKss",
  authDomain: "webshield-ai-b4077.firebaseapp.com",
  projectId: "webshield-ai-b4077",
  storageBucket: "webshield-ai-b4077.firebasestorage.app",
  messagingSenderId: "812380559723",
  appId: "1:812380559723:web:d74f4f4edea2b56659542e",
  measurementId: "G-5W3Z6PBKPE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();