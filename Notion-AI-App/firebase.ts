// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuBtJ9hoO1vU3fJdBmMWupVwV71ETG9KU",
  authDomain: "notion-ai-63b73.firebaseapp.com",
  projectId: "notion-ai-63b73",
  storageBucket: "notion-ai-63b73.firebasestorage.app",
  messagingSenderId: "491813754084",
  appId: "1:491813754084:web:d30e02bbc8599b6b5308f1"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };