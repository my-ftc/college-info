// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3ii1ZhdOxHF0qr_0q4ZqSZoS3NEXwE-U",
  authDomain: "kollege-ai-dev.firebaseapp.com",
  projectId: "kollege-ai-dev",
  storageBucket: "kollege-ai-dev.firebasestorage.app",
  messagingSenderId: "970048816039",
  appId: "1:970048816039:web:8e2714a36ebb6dbafe6c82",
  measurementId: "G-G0HDWM8YHB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
