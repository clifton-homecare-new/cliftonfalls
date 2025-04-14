import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase config and init
const firebaseConfig = {
  apiKey: "AIzaSyDAGJMe_T-PwrP4pCAmlFtQflpBARYMP4s",
  authDomain: "cliftonhomecare-98f75.firebaseapp.com",
  projectId: "cliftonhomecare-98f75",
  storageBucket: "cliftonhomecare-98f75.firebasestorage.app",
  messagingSenderId: "938713106409",
  appId: "1:938713106409:web:e47cbc56fbf3e9cda2ed78",
  measurementId: "G-WZS9CJ6LBQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("currentDate");
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;

  const form = document.getElementById("assessmentForm");
  const yesBtn = document.getElementById("btnYes");
  const noBtn = document.getElementById("btnNo");
  const fallAnswerInput = document.getElementById("fallAnswer");

  // Yes/No button logic
  yesBtn.addEventListener("click", () => {
    fallAnswerInput.value = "Yes";
    yesBtn.classList.add("active", "btn-success");
    yesBtn.classList.remove("btn-outline-success");
    noBtn.classList.remove("active", "btn-danger");
    noBtn.classList.add("btn-outline-danger");
  });

  noBtn.addEventListener("click", () => {
    fallAnswerInput.value = "No";
    noBtn.classList.add("active", "btn-danger");
    noBtn.classList.remove("btn-outline-danger");
    yesBtn.classList.remove("active", "btn-success");
    yesBtn.classList.add("btn-outline-success");
  });

  // Check if user is logged in
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert("You must be logged in to submit the form.");
      return;
    }

    // Submit handler
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("EmployeeName").value;
      const date = document.getElementById("currentDate").value;
      const fallAnswer = document.getElementById("fallAnswer").value;
      const fallNotes = document.getElementById("fallNotes").value;

      if (!fallAnswer) {
        alert("Please select Yes or No for the fall question.");
        return;
      }

      try {
        await addDoc(collection(db, "assessments"), {
          uid: user.uid,
          name,
          date,
          fallAnswer,
          fallNotes,
          timestamp: new Date()
        });

        alert("Form submitted successfully!");
        form.reset();
        dateInput.value = today; // reset date again after reset
        fallAnswerInput.value = ""; // clear hidden input
        yesBtn.classList.remove("active", "btn-success");
        yesBtn.classList.add("btn-outline-success");
        noBtn.classList.remove("active", "btn-danger");
        noBtn.classList.add("btn-outline-danger");

      } catch (error) {
        console.error("Error saving form:", error);
        alert("Failed to submit form.");
      }
    });
  });
});
