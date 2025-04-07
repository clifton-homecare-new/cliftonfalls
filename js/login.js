import bcrypt from 'bcryptjs';
import { getFirestore, setDoc, doc } from "firebase/firestore";

const db = getFirestore(app);

const storePassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store the hashed password in Firestore
    await setDoc(doc(db, "passwords", "user_password"), { password: hashedPassword });
};

const verifyPassword = async (inputPassword) => {
  const docRef = doc(db, "passwords", "user_password");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
      const hashedPassword = docSnap.data().password;

      const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
      if (isMatch) {
          console.log("Password is correct!");
      } else {
          console.log("Invalid password.");
      }
  } else {
      console.log("No password found.");
  }
};

