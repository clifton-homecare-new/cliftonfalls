import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase config (ensure this matches your Firebase project config)
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

// Function to retrieve and display past submissions after confirming the user is logged in
const displayPastForms = async (user) => {
    try {
        const employeeName = document.getElementById("employeeFilter").value.trim().toLowerCase();
        const patientName = document.getElementById("patientFilter").value.trim().toLowerCase();
        const dateFilter = document.getElementById("dateFilter").value;
        
        // Create a query based on the user input
        let q = query(collection(db, "assessments"), where("uid", "==", user.uid));

        // Apply filters to the query
        if (employeeName) {
            q = query(q, where("name", "==", employeeName));
        }
        if (patientName) {
            q = query(q, where("PatientName", "==", patientName));
        }
        if (dateFilter) {
            q = query(q, where("date", "==", dateFilter));
        }

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Clear previous results before displaying new ones
        const pastFormsContainer = document.getElementById("formList");
        pastFormsContainer.innerHTML = "";

        // Loop through the results and display them
        querySnapshot.forEach((doc) => {
            const formData = doc.data();
            const formElement = document.createElement("div");
            formElement.classList.add("form-item");
            formElement.setAttribute("data-id", doc.id); // Store the Firestore doc ID for later use

            formElement.innerHTML = `
                <div class="d-flex align-items-center justify-content-between">
                    <div>
                        <h3>${formData.name}</h3>
                    </div>
                    <div>
                        <p>Date: ${formData.date}</p>
                    </div>
                    <div>
                        <p>${formData.PatientName}</p>
                    </div>
                    <button class="view-button btn btn-info">View Details</button>
                </div>
            `;

            // Append the form element to the container
            pastFormsContainer.appendChild(formElement);
        });
    } catch (error) {
        console.error("Error retrieving past forms:", error);
        alert("Failed to load past forms.");
    }
};

// Check for changes in the filters and reload the list
document.getElementById("employeeFilter").addEventListener("input", () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            displayPastForms(user);
        }
    });
});

document.getElementById("patientFilter").addEventListener("input", () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            displayPastForms(user);
        }
    });
});

document.getElementById("dateFilter").addEventListener("change", () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            displayPastForms(user);
        }
    });
});


// Check the authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in, display past forms
        displayPastForms(user);
    } else {
        // User is not logged in, show an alert
        alert("You must be logged in to view your past submissions.");
    }
});

// Show form details when clicking "View Details"
document.addEventListener("click", async (e) => {
    if (e.target && e.target.classList.contains("view-button")) {
        const formItem = e.target.closest(".form-item");
        const formId = formItem.getAttribute("data-id");  // Get the Firestore doc ID

        // Fetch the form data from Firestore
        try {
            const docRef = doc(db, "assessments", formId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const formData = docSnap.data();
                displayFormDetails(formData, formId); // Pass formId to identify the form
            } else {
                alert("Form not found!");
            }
        } catch (error) {
            console.error("Error fetching form details:", error);
            alert("Failed to fetch form details.");
        }
    }
});

// Function to display the form details
const displayFormDetails = (formData, formId) => {
    const detailsContainer = document.getElementById("formDetails");
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

    // Show the modal with form details
    const modal = document.getElementById("formDetailsContainer");
    modal.style.display = "block";

    // Optionally, add an Edit button to allow the user to update the form
    const editButton = document.getElementById("editButton");
    editButton.addEventListener("click", () => {
        prefillEditForm(formData, formId);
    });
};

// Close modal when the close button is clicked
const closeModalButton = document.getElementById("closeModalButton");
closeModalButton.addEventListener("click", () => {
    const modal = document.getElementById("formDetailsContainer");
    modal.style.display = "none";
});
