// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDAGJMe_T-PwrP4pCAmlFtQflpBARYMP4s",
  authDomain: "cliftonhomecare-98f75.firebaseapp.com",
  projectId: "cliftonhomecare-98f75",
  storageBucket: "cliftonhomecare-98f75.firebasestorage.app",
  messagingSenderId: "938713106409",
  appId: "1:938713106409:web:e47cbc56fbf3e9cda2ed78",
  measurementId: "G-WZS9CJ6LBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// On DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("currentDate");
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;

  const form = document.getElementById("assessmentForm");

  // Firebase Auth - Check User
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert("You must be logged in to submit the form.");
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Collect form data
      const formData = {
        uid: user.uid,
        name: document.getElementById("EmployeeName").value,
        date: document.getElementById("currentDate").value,
        PatientName: document.getElementById("PatientName").value,

        fallNotes: document.getElementById("fallNotes").value,
        ConsciousNotes: document.getElementById("ConsciousNotes").value,
        LieStillNotes: document.getElementById("LieStillNotes").value,
        VisionNotes: document.getElementById("VisionNotes").value,
        BackNotes: document.getElementById("BackNotes").value,
        CollarBoneNotes: document.getElementById("CollarBoneNotes").value,
        ArmNotes: document.getElementById("ArmNotes").value,
        ChestNotes: document.getElementById("ChestNotes").value,
        HipNotes: document.getElementById("HipNotes").value,
        LegNotes: document.getElementById("LegNotes").value,
        SpineNotes: document.getElementById("SpineNotes").value,
        HardFloorNotes: document.getElementById("HardFloorNotes").value,
        SitUpNotes: document.getElementById("SitUpNotes").value,
        SelfHelpNotes: document.getElementById("SelfHelpNotes").value,
        LeftAtHomeNotes: document.getElementById("LeftAtHomeNotes").value,
        HospitalTransportNotes: document.getElementById("HospitalTransportNotes").value,
        LeavingHouseNotes: document.getElementById("LeavingHouseNotes").value,
        SecureNotes: document.getElementById("SecureNotes").value,
        Score: document.getElementById("Score").value,

        timestamp: new Date()
      };

      // Submit to Firestore
      try {
        await addDoc(collection(db, "assessments"), formData);

        alert("Form submitted successfully!");
        form.reset();
        dateInput.value = today;
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to submit the form.");
      }
    });
  });
});
