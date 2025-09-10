import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqANEf5aVIzc9OgwsE3Oe39dfRgXZr_wE",
  authDomain: "shopper-app-4519a.firebaseapp.com",
  projectId: "shopper-app-4519a",
  storageBucket: "shopper-app-4519a.firebasestorage.app",
  messagingSenderId: "1058979770023",
  appId: "1:1058979770023:web:bbf933065f27984f637582",
  measurementId: "G-NBM7ZM6DGE",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Настройка Google Provider для лучшей совместимости
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Проверка инициализации
console.log("Firebase initialized:", app.name);
console.log("Auth initialized:", !!auth);
console.log("Firestore initialized:", !!db);
