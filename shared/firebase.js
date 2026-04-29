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

const normalizeWhitespace = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

const normalizeStudentId = (value) =>
  String(value ?? "")
    .replace(/\s+/g, "")
    .trim()
    .toUpperCase();

const toNameCase = (value) =>
  normalizeWhitespace(value)
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());

async function addStudent(studentData) {
  try {
    const notes = normalizeWhitespace(studentData.additional_info?.notes || "");
    await addDoc(collection(db, "students"), {
      name: toNameCase(studentData.full_name),
      matric: normalizeWhitespace(studentData.matric),
      student_id: normalizeStudentId(studentData.id),
      gender: normalizeWhitespace(studentData.gender),
      email: normalizeWhitespace(studentData.email),
      approved: false,
      portfolioUrl: normalizeWhitespace(studentData.portfolio_url),
      imageUrl: normalizeWhitespace(studentData.profile_picture_url),
      submission_date: Timestamp.now(),
      additional_info: notes ? { ...(studentData.additional_info || {}), notes } : (studentData.additional_info || {}),
    });
    console.log("Student added successfully");
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
}

async function createStudentFromAdmin(studentData) {
  try {
    const notes = normalizeWhitespace(studentData.additional_info?.notes || "");
    await addDoc(collection(db, "students"), {
      name: toNameCase(studentData.name),
      matric: normalizeWhitespace(studentData.matric),
      student_id: normalizeStudentId(studentData.student_id),
      gender: normalizeWhitespace(studentData.gender),
      email: normalizeWhitespace(studentData.email),
      approved: Boolean(studentData.approved),
      portfolioUrl: normalizeWhitespace(studentData.portfolioUrl || ""),
      imageUrl: normalizeWhitespace(studentData.imageUrl || ""),
      submission_date: Timestamp.now(),
      additional_info: notes ? { ...(studentData.additional_info || {}), notes } : (studentData.additional_info || {}),
    });
    return true;
  } catch (error) {
    console.error("Error creating student (admin):", error);
    throw error;
  }
}

async function updateStudentFromAdmin(documentId, studentData) {
  try {
    const studentRef = doc(db, "students", documentId);
    const notes = normalizeWhitespace(studentData.additional_info?.notes || "");
    await updateDoc(studentRef, {
      name: toNameCase(studentData.name),
      matric: normalizeWhitespace(studentData.matric),
      student_id: normalizeStudentId(studentData.student_id),
      gender: normalizeWhitespace(studentData.gender),
      email: normalizeWhitespace(studentData.email),
      approved: Boolean(studentData.approved),
      portfolioUrl: normalizeWhitespace(studentData.portfolioUrl || ""),
      imageUrl: normalizeWhitespace(studentData.imageUrl || ""),
      additional_info: notes ? { ...(studentData.additional_info || {}), notes } : (studentData.additional_info || {}),
    });
    return true;
  } catch (error) {
    console.error("Error updating student (admin):", error);
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
  createStudentFromAdmin,
  updateStudentFromAdmin,
  loadStudentsFromFirebase, 
  approveStudent,
  rejectStudent,
  auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
