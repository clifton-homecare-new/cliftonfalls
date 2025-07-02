import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAGJMe_T-PwrP4pCAmlFtQflpBARYMP4s",
  authDomain: "cliftonhomecare-98f75.firebaseapp.com",
  projectId: "cliftonhomecare-98f75",
  storageBucket: "cliftonhomecare-98f75.appspot.com",
  messagingSenderId: "938713106409",
  appId: "1:938713106409:web:e47cbc56fbf3e9cda2ed78",
  measurementId: "G-WZS9CJ6LBQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("dateFilter");
  const today = new Date().toISOString().split("T")[0];
  if (dateInput) dateInput.value = today;

  const form = document.getElementById("assessmentForm");
  if (!form) {
    console.error("Form not found.");
    return;
  }

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert("You must be logged in to submit the form.");
      window.location.href = "index.html";
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const fileInput = document.getElementById("fileUpload");
      const file = fileInput?.files?.[0];
      let uploadedFilePath = "";

      try {
        if (file) {
          if (file.size > 10 * 1024 * 1024) {
            alert("File too large (max 10MB)");
            return;
          }
          if (!file.type.startsWith("image/")) {
            alert("Only image files are allowed.");
            return;
          }

          const fileRef = ref(storage, `uploads/${user.uid}/${file.name}`);
          await uploadBytes(fileRef, file);
          uploadedFilePath = await getDownloadURL(fileRef);
          console.log("File uploaded:", uploadedFilePath);
        }
      } catch (uploadError) {
        console.error("File upload failed:", uploadError);
        alert("File upload failed. Please try again.");
        return;
      }

      const formData = {
        uid: user.uid,
        name: document.getElementById("EmployeeName").value,
        date: dateInput.value,
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
        filePath: uploadedFilePath,
        timestamp: new Date()
      };

      if (!formData.name || !formData.PatientName || !formData.date) {
        alert("Please fill in all required fields.");
        return;
      }

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
