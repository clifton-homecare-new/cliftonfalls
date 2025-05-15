// Firebase CDN Imports (as ES module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDAGJMe_T-PwrP4pCAmlFtQflpBARYMP4s",
  authDomain: "cliftonhomecare-98f75.firebaseapp.com",
  projectId: "cliftonhomecare-98f75",
  storageBucket: "cliftonhomecare-98f75.firebasestorage.app",
  messagingSenderId: "938713106409",
  appId: "1:938713106409:web:e47cbc56fbf3e9cda2ed78",
  measurementId: "G-WZS9CJ6LBQ"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Wait for page to load
document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submit");

  if (!submitBtn) {
    console.error("Submit button not found");
    return;
  }

  submitBtn.addEventListener("click", () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorDiv = document.getElementById("error-message");

    if (!emailInput || !passwordInput) {
      console.error("Email or password field is missing in the HTML");
      return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Success – redirect
        window.location.href = "form.html";
      })
      .catch((error) => {
        console.error("Login failed:", error);
        errorDiv.style.display = "block";
        errorDiv.textContent = "Incorrect email or password.";
      });
  });
});
