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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("currentDate");
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;

  const form = document.getElementById("assessmentForm");

  const btnYes = document.getElementById("btnYes");
  const btnNo = document.getElementById("btnNo");
  const fallAnswerInput = document.getElementById("fallAnswer");

  const btnYes1 = document.getElementById("btnYes1");
  const btnNo1 = document.getElementById("btnNo1");
  const ConsciousAnswerInput = document.getElementById("ConsciousAnswer");

  const btnYes2 = document.getElementById("btnYes2");
  const btnNo2 = document.getElementById("btnNo2");
  const VisionAnswerInput = document.getElementById("VisionAnswer");

  // Fall Question Logic
  btnYes.addEventListener("click", () => {
    fallAnswerInput.value = "Yes";
    btnYes.classList.add("active", "btn-success");
    btnYes.classList.remove("btn-outline-success");
    btnNo.classList.remove("active", "btn-danger");
    btnNo.classList.add("btn-outline-danger");
  });

  btnNo.addEventListener("click", () => {
    fallAnswerInput.value = "No";
    btnNo.classList.add("active", "btn-danger");
    btnNo.classList.remove("btn-outline-danger");
    btnYes.classList.remove("active", "btn-success");
    btnYes.classList.add("btn-outline-success");
  });

  // Consciousness Question Logic
  btnYes1.addEventListener("click", () => {
    ConsciousAnswerInput.value = "Yes";
    btnYes1.classList.add("active", "btn-success");
    btnYes1.classList.remove("btn-outline-success");
    btnNo1.classList.remove("active", "btn-danger");
    btnNo1.classList.add("btn-outline-danger");
  });

  btnNo1.addEventListener("click", () => {
    ConsciousAnswerInput.value = "No";
    btnNo1.classList.add("active", "btn-danger");
    btnNo1.classList.remove("btn-outline-danger");
    btnYes1.classList.remove("active", "btn-success");
    btnYes1.classList.add("btn-outline-success");
  });

  btnYes2.addEventListener("click", () => {
    VisionAnswerInput.value = "Yes";
    btnYes2.classList.add("active", "btn-success");
    btnYes2.classList.remove("btn-outline-success");
    btnNo2.classList.remove("active", "btn-danger");
    btnNo2.classList.add("btn-outline-danger");
  });

  btnNo2.addEventListener("click", () => {
    VisionAnswerInput.value = "No";
    btnNo2.classList.add("active", "btn-danger");
    btnNo2.classList.remove("btn-outline-danger");
    btnYes2.classList.remove("active", "btn-success");
    btnYes2.classList.add("btn-outline-success");
  });


  // Auth + Submit
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert("You must be logged in to submit the form.");
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("EmployeeName").value;
      const date = document.getElementById("currentDate").value;
      const fallAnswer = fallAnswerInput.value;
      const fallNotes = document.getElementById("fallNotes").value;
      const ConsciousAnswer = ConsciousAnswerInput.value;
      const ConsciousNotes = document.getElementById("ConsciousNotes").value;
      const VisionAnswer = VisionAnswerInput.value;
      const VisionNotes = document.getElementById("VisionNotes").value;

      if (!fallAnswer || !ConsciousAnswer) {
        alert("Please answer all questions.");
        return;
      }

      try {
        await addDoc(collection(db, "assessments"), {
          uid: user.uid,
          name,
          date,
          fallAnswer,
          fallNotes,
          ConsciousAnswer,
          ConsciousNotes,
          VisionAnswer,
          VisionNotes,
          timestamp: new Date()
        });

        alert("Form submitted successfully!");
        form.reset();
        dateInput.value = today;
        fallAnswerInput.value = "";
        ConsciousAnswerInput.value = "";

        // Reset buttons UI
        [btnYes, btnNo, btnYes1, btnNo1, btnYes2, btnNo2].forEach((btn) => {
          btn.classList.remove("active", "btn-success", "btn-danger");
          btn.classList.add(btn.id.includes("Yes") ? "btn-outline-success" : "btn-outline-danger");
        });

      } catch (error) {
        console.error("Error saving form:", error);
        alert("Failed to submit form.");
      }
    });
  });
});

