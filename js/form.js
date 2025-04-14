
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAGJMe_T-PwrP4pCAmlFtQflpBARYMP4s",
  authDomain: "cliftonhomecare-98f75.firebaseapp.com",
  projectId: "cliftonhomecare-98f75",
  storageBucket: "cliftonhomecare-98f75.firebasestorage.app",
  messagingSenderId: "938713106409",
  appId: "1:938713106409:web:e47cbc56fbf3e9cda2ed78",
  measurementId: "G-WZS9CJ6LBQ"
};

document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("currentDate");
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    dateInput.value = today;
  });
  
