// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCJK2ErC7rvr3PkgXHne1BIqEEU5wdb4qc",
    authDomain: "promptminds-46caa.firebaseapp.com",
    projectId: "promptminds-46caa",
    storageBucket: "promptminds-46caa.firebasestorage.app",
    messagingSenderId: "160969016494",
    appId: "1:160969016494:web:3b112482b2abefbf00193f",
    measurementId: "G-VCPPJHVREJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);