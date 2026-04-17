import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { CONFIG } from "./config.js";

// Initialize Firebase
const app = initializeApp(CONFIG.FIREBASE);
const db = getFirestore(app);
const auth = getAuth(app);

async function addStudent(studentData) {
  try {
    await addDoc(collection(db, "students"), {
      name: studentData.full_name,
      matric: studentData.matric,
      student_id: studentData.id,
      gender: studentData.gender,
      email: studentData.email,
      approved: false,
      portfolioUrl: studentData.portfolio_url,
      imageUrl: studentData.profile_picture_url,
      submission_date: Timestamp.now(),
      additional_info: studentData.additional_info || {},
    });
    console.log("Student added successfully");
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
}

async function loadStudentsFromFirebase() {
  try {
    const querySnapshot = await getDocs(collection(db, "students"));
    const students = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id, // Ensure we have the actual document ID for updating
      student_id: doc.data().student_id || doc.data().id,
    }));
    return students;
  } catch (error) {
    console.error("Error loading students:", error);
    return [];
  }
}

async function approveStudent(documentId) {
  try {
    const studentRef = doc(db, "students", documentId);
    await updateDoc(studentRef, {
      approved: true
    });
    return true;
  } catch (error) {
    console.error("Error approving student:", error);
    throw error;
  }
}

async function rejectStudent(documentId) {
  try {
    const studentRef = doc(db, "students", documentId);
    await updateDoc(studentRef, {
      approved: false
    });
    return true;
  } catch (error) {
    console.error("Error approving student:", error);
    throw error;
  }
}

// Export functions
export { 
  addStudent, 
  loadStudentsFromFirebase, 
  approveStudent,
  rejectStudent,
  auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
