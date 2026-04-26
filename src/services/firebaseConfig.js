import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGM-CchDATr1bPumCiK-ksyTcUZw2S8lc",
  authDomain: "chatbot-707c7.firebaseapp.com",
  projectId: "chatbot-707c7",
  storageBucket: "chatbot-707c7.firebasestorage.app",
  messagingSenderId: "902249558770",
  appId: "1:902249558770:web:4dc945be328c9a257b166b"
};

const app        = initializeApp(firebaseConfig);
export const db  = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();