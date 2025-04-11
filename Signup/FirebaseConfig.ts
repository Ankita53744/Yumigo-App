import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCLzumifXDXEy6vc-UV0Wfc1ZPppkSsjc0",
  authDomain: "yumigo-reactnative.firebaseapp.com",
  projectId: "yumigo-reactnative",
  storageBucket: "yumigo-reactnative.firebasestorage.app",
  messagingSenderId: "404966995060",
  appId: "1:404966995060:web:0f383577e1b97589f7cd21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Use getAuth instead of initializeAuth (No Persistence)
const auth = getAuth(app);

export { auth };
