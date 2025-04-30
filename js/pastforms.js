import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDAGJMe_T-PwrP4pCAmlFtQflpBARYMP4s",
    authDomain: "cliftonhomecare-98f75.firebaseapp.com",
    projectId: "cliftonhomecare-98f75",
    storageBucket: "cliftonhomecare-98f75.appspot.com", // corrected
    messagingSenderId: "938713106409",
    appId: "1:938713106409:web:e47cbc56fbf3e9cda2ed78",
    measurementId: "G-WZS9CJ6LBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Wait for DOM to be ready
window.addEventListener("DOMContentLoaded", () => {
    const employeeInput = document.getElementById("employeeFilter");
    const patientInput = document.getElementById("patientFilter");
    const dateInput = document.getElementById("dateFilter");

    const pastFormsContainer = document.getElementById("formList");
    const detailsContainer = document.getElementById("formDetails");
    const modal = document.getElementById("formDetailsContainer");
    const closeModalButton = document.getElementById("closeModalButton");
    const editButton = document.getElementById("editButton");

    if (!employeeInput || !patientInput || !dateInput || !pastFormsContainer || !detailsContainer || !modal || !closeModalButton || !editButton) {
        console.error("Missing DOM elements.");
        return;
    }

    const displayPastForms = async (user) => {
        try {
            const employeeName = employeeInput.value.trim();
            const patientName = patientInput.value.trim();
            const dateFilter = dateInput.value;

            let q = query(collection(db, "assessments"), where("uid", "==", user.uid));

            if (employeeName) {
                q = query(q, where("name", "==", employeeName));
            }
            if (patientName) {
                q = query(q, where("PatientName", "==", patientName));
            }
            if (dateFilter) {
                q = query(q, where("date", "==", dateFilter));
            }

            const querySnapshot = await getDocs(q);

            pastFormsContainer.innerHTML = "";

            if (querySnapshot.empty) {
                pastFormsContainer.innerHTML = "<p>No matching forms found.</p>";
                return;
            }

            querySnapshot.forEach((doc) => {
                const formData = doc.data();
                const formElement = document.createElement("div");
                formElement.classList.add("form-item");
                formElement.setAttribute("data-id", doc.id);

                formElement.innerHTML = `
                    <div class="d-flex align-items-center justify-content-between">
                        <div><h3>${formData.name}</h3></div>
                        <div><p>Date: ${formData.date}</p></div>
                        <div><p>${formData.PatientName}</p></div>
                        <button class="view-button btn btn-info">View Details</button>
                    </div>
                `;

                pastFormsContainer.appendChild(formElement);
            });
        } catch (error) {
            console.error("Error retrieving past forms:", error);
            alert("Failed to load past forms.");
        }
    };

    const displayFormDetails = (formData, formId) => {
        detailsContainer.innerHTML = `
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Date:</strong> ${formData.date}</p>
            <p><strong>Q1:</strong> ${formData.fallNotes}</p>
            <p><strong>Q2:</strong> ${formData.ConsciousNotes}</p>
            <p><strong>Q3:</strong> ${formData.VisionNotes}</p>
            <p><strong>Q4:</strong> ${formData.BackNotes}</p>
            <p><strong>Q5:</strong> ${formData.CollBoneNotes}</p>
            <p><strong>Q6:</strong> ${formData.ArmNotes}</p>
            <p><strong>Q7:</strong> ${formData.ChestNotes}</p>
            <p><strong>Q8:</strong> ${formData.HipNotes}</p>
            <p><strong>Q9:</strong> ${formData.LegNotes}</p>
            <p><strong>Q10:</strong> ${formData.SpineNotes}</p>
            <p><strong>Q11:</strong> ${formData.HardFloorNotes}</p>
            <p><strong>Q12:</strong> ${formData.SitUpNotes}</p>
            <p><strong>Q13:</strong> ${formData.SelfHelpNotes}</p>
            <p><strong>Q14:</strong> ${formData.LeftAtHomeNotes}</p>
            <p><strong>Q15:</strong> ${formData.HospitalTransportNotes}</p>
            <p><strong>Q16:</strong> ${formData.LeavingHouseNotes}</p>
            <p><strong>Q17:</strong> ${formData.SecureNotes}</p>
            <p><strong>Score:</strong> ${formData.Score}</p>
        `;
        modal.style.display = "block";

        editButton.onclick = () => {
            prefillEditForm(formData, formId);
        };
    };

    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("view-button")) {
            const formItem = e.target.closest(".form-item");
            const formId = formItem.getAttribute("data-id");

            try {
                const docRef = doc(db, "assessments", formId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    displayFormDetails(docSnap.data(), formId);
                } else {
                    alert("Form not found.");
                }
            } catch (error) {
                console.error("Error fetching form details:", error);
                alert("Failed to fetch form details.");
            }
        }
    });

    closeModalButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    const reloadOnInputChange = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                displayPastForms(user);
            }
        });
    };

    employeeInput.addEventListener("input", reloadOnInputChange);
    patientInput.addEventListener("input", reloadOnInputChange);
    dateInput.addEventListener("change", reloadOnInputChange);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            displayPastForms(user);
        } else {
            alert("You must be logged in to view your past submissions.");
        }
    });
});
