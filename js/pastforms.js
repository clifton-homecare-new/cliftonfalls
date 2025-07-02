import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDAGJMe_T-PwrP4pCAmlFtQflpBARYMP4s",
  authDomain: "cliftonhomecare-98f75.firebaseapp.com",
  projectId: "cliftonhomecare-98f75",
  storageBucket: "cliftonhomecare-98f75.appspot.com",
  messagingSenderId: "938713106409",
  appId: "1:938713106409:web:e47cbc56fbf3e9cda2ed78",
  measurementId: "G-WZS9CJ6LBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const employeeInput = document.getElementById("employeeFilter");
  const patientInput = document.getElementById("patientFilter");
  const dateInput = document.getElementById("dateFilter");
  const formList = document.getElementById("formList");
  const formDetailsContainer = document.getElementById("formDetailsContainer");
  const closeModalButton = document.getElementById("closeModalButton");

  if (!employeeInput || !patientInput || !dateInput || !formList || !formDetailsContainer || !closeModalButton) {
    console.error("Missing required elements in DOM.");
    return;
  }

  const displayPastForms = async (user) => {
  try {
    const employeeName = employeeInput.value.trim();
    const patientName = patientInput.value.trim();
    const dateValue = dateInput.value;

    // Start with uid filter
    const conditions = [where("uid", "==", user.uid)];

    // Add filters if they have values
    if (employeeName) {
      conditions.push(where("name", "==", employeeName));
    }
    if (patientName) {
      conditions.push(where("PatientName", "==", patientName));
    }
    if (dateValue) {
      conditions.push(where("date", "==", dateValue));
    }

    // Create one query with all filters
    const q = query(collection(db, "assessments"), ...conditions);

    const snapshot = await getDocs(q);

    formList.innerHTML = "";

    if (snapshot.empty) {
      formList.innerHTML = "<p>No results found.</p>";
      return;
    }

    snapshot.forEach((docSnap) => {
      const formData = docSnap.data();
      const id = docSnap.id;

      const div = document.createElement("div");
      div.classList.add("form-item");
      div.setAttribute("data-id", id);
      div.innerHTML = `
        <div class="d-flex align-items-center justify-content-between">
          <div><h5>${formData.name}</h5></div>
          <div><p>${formData.date}</p></div>
          <div><p>${formData.PatientName}</p></div>
          <button class="view-button btn btn-info">View Details</button>
        </div>
      `;
      formList.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching forms:", err);
    formList.innerHTML = `<p>Error loading forms: ${err.message}</p>`;
  }
};

  const showFormDetails = async (formId) => {
    try {
      const docRef = doc(db, "assessments", formId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        alert("Form not found.");
        return;
      }

      const data = docSnap.data();

      document.getElementById("formDetails").innerHTML = `
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Patient:</strong> ${data.PatientName}</p>
        <p><strong>Q1:</strong> ${data.fallNotes}</p>
        <p><strong>Q2:</strong> ${data.ConsciousNotes}</p>
        <p><strong>Q3:</strong> ${data.LieStillNotes}</p>
        <p><strong>Q4:</strong> ${data.VisionNotes}</p>
        <p><strong>Q5:</strong> ${data.BackNotes}</p>
        <p><strong>Q6:</strong> ${data.CollarBoneNotes}</p>
        <p><strong>Q7:</strong> ${data.ArmNotes}</p>
        <p><strong>Q8:</strong> ${data.ChestNotes}</p>
        <p><strong>Q9:</strong> ${data.HipNotes}</p>
        <p><strong>Q10:</strong> ${data.LegNotes}</p>
        <p><strong>Q11:</strong> ${data.SpineNotes}</p>
        <p><strong>Q12:</strong> ${data.HardFloorNotes}</p>
        <p><strong>Q13:</strong> ${data.SitUpNotes}</p>
        <p><strong>Q14:</strong> ${data.SelfHelpNotes}</p>
        <p><strong>Q15:</strong> ${data.LeftAtHomeNotes}</p>
        <p><strong>Q16:</strong> ${data.HospitalTransportNotes}</p>
        <p><strong>Q17:</strong> ${data.LeavingHouseNotes}</p>
        <p><strong>Q18:</strong> ${data.SecureNotes}</p>
        <p><strong>Score:</strong> ${data.Score}</p>
      `;

      formDetailsContainer.classList.remove("d-none");
    } catch (error) {
      console.error("Failed to load form:", error);
    }
  };

  closeModalButton.addEventListener("click", () => {
    formDetailsContainer.classList.add("d-none");
  });

  const bindFilters = (user) => {
    employeeInput.addEventListener("input", () => displayPastForms(user));
    patientInput.addEventListener("input", () => displayPastForms(user));
    dateInput.addEventListener("change", () => displayPastForms(user));

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("view-button")) {
        const formId = e.target.closest(".form-item").getAttribute("data-id");
        if (formId) showFormDetails(formId);
      }
    });
  };

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert("Please log in to view past forms.");
      window.location.href = "index.html";
      return;
    }
    displayPastForms(user);
    bindFilters(user);
  });
});
