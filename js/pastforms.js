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

// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
    const employeeInput = document.getElementById("employeeFilter");
    const patientInput = document.getElementById("patientFilter");
    const dateInput = document.getElementById("dateFilter");
    const formList = document.getElementById("formList");
    const formDetailsContainer = document.getElementById("formDetailsContainer");
    const closeModalButton = document.getElementById("closeModalButton");

    // Make sure the required elements exist
    if (!employeeInput || !patientInput || !dateInput || !formList || !formDetailsContainer || !closeModalButton) {
        console.error("One or more required elements are missing in the DOM.");
        return;
    }

    // Display past forms
    const displayPastForms = async (user) => {
        try {
            const employeeName = employeeInput.value.trim();
            const patientName = patientInput.value.trim();
            const dateValue = dateInput.value;

            let q = query(collection(db, "assessments"), where("uid", "==", user.uid));

            if (employeeName) {
                q = query(q, where("name", "==", employeeName));
            }
            if (patientName) {
                q = query(q, where("PatientName", "==", patientName));
            }
            if (dateValue) {
                q = query(q, where("date", "==", dateValue));
            }

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
            formList.innerHTML = "<p>Error loading forms.</p>";
        }
    };

    // Show form details
    const showFormDetails = async (formId) => {
        try {
            const docRef = doc(db, "assessments", formId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                alert("Form not found.");
                return;
            }

            const data = docSnap.data();
            formDetailsContainer.innerHTML = `
                <div class="modal-content p-4 bg-light rounded">
                    <h4>Form Details</h4>
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Date:</strong> ${data.date}</p>
                    <p><strong>Patient:</strong> ${data.PatientName}</p>
                    <p><strong>Fall Notes:</strong> ${data.fallNotes}</p>
                    <p><strong>Conscious Notes:</strong> ${data.ConsciousNotes}</p>
                    <p><strong>Vision Notes:</strong> ${data.VisionNotes}</p>
                    <p><strong>Back Notes:</strong> ${data.BackNotes}</p>
                    <p><strong>Collar Bone Notes:</strong> ${data.CollarBoneNotes}</p>
                    <p><strong>Score:</strong> ${data.Score}</p>
                    <button id="closeModalButton" class="btn btn-danger mt-3">Close</button>
                </div>
            `;
            formDetailsContainer.style.display = "block";

            document.getElementById("closeModalButton").addEventListener("click", () => {
                formDetailsContainer.style.display = "none";
            });

        } catch (error) {
            console.error("Failed to load form:", error);
        }
    };

    // Event listeners for filters
    const bindFilters = (user) => {
        employeeInput.addEventListener("input", () => displayPastForms(user));
        patientInput.addEventListener("input", () => displayPastForms(user));
        dateInput.addEventListener("change", () => displayPastForms(user));

        // Handle "View Details" button click
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("view-button")) {
                const formId = e.target.closest(".form-item").getAttribute("data-id");
                if (formId) {
                    showFormDetails(formId);
                }
            }
        });
    };

    // Auth state check
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            alert("Please log in to view past forms.");
            return;
        }
        displayPastForms(user);
        bindFilters(user);
    });
});
