import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEYg6_HWRD1ft1Z9uV2eJkRySrhcwoo5A",
  authDomain: "swmhackathon-16a3d.firebaseapp.com",
  projectId: "swmhackathon-16a3d",
  storageBucket: "swmhackathon-16a3d.firebasestorage.app",
  messagingSenderId: "480499575513",
  appId: "1:480499575513:web:4ef7e6f39856bd8c3fecc8",
  measurementId: "G-0PWR0C3BVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db }; 