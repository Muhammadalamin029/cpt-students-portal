import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
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

const getSubmissionMillis = (docSnapshot) => {
  const ts = docSnapshot.data()?.submission_date;
  if (ts && typeof ts.toMillis === "function") return ts.toMillis();
  return 0;
};

const findStudentDocsByStudentId = async (studentId) => {
  const normalizedId = normalizeStudentId(studentId);
  if (!normalizedId) return [];

  const byStudentIdQuery = query(
    collection(db, "students"),
    where("student_id", "==", normalizedId),
  );

  // Backwards compatibility: older records might store the student id in `id`.
  const byLegacyIdQuery = query(
    collection(db, "students"),
    where("id", "==", normalizedId),
  );

  const [byStudentIdSnap, byLegacyIdSnap] = await Promise.all([
    getDocs(byStudentIdQuery),
    getDocs(byLegacyIdQuery),
  ]);

  const unique = new Map();
  for (const snap of [byStudentIdSnap, byLegacyIdSnap]) {
    snap.docs.forEach((docSnap) => unique.set(docSnap.id, docSnap));
  }

  return [...unique.values()];
};

async function addStudent(studentData) {
  try {
    const normalizedStudentIdValue = normalizeStudentId(studentData.id);
    const notes = normalizeWhitespace(studentData.additional_info?.notes || "");
    const payload = {
      name: toNameCase(studentData.full_name),
      matric: normalizeWhitespace(studentData.matric),
      student_id: normalizedStudentIdValue,
      gender: normalizeWhitespace(studentData.gender),
      email: normalizeWhitespace(studentData.email),
      approved: false,
      portfolioUrl: normalizeWhitespace(studentData.portfolio_url),
      imageUrl: normalizeWhitespace(studentData.profile_picture_url),
      submission_date: Timestamp.now(),
      additional_info: notes
        ? { ...(studentData.additional_info || {}), notes }
        : studentData.additional_info || {},
    };

    const matches = await findStudentDocsByStudentId(normalizedStudentIdValue);

    if (matches.length > 0) {
      const canonical = matches
        .map((docSnap) => ({ docSnap, millis: getSubmissionMillis(docSnap) }))
        .sort((a, b) => b.millis - a.millis)[0].docSnap;

      await updateDoc(doc(db, "students", canonical.id), payload);
      console.log("Student updated successfully");
      return;
    }

    await addDoc(collection(db, "students"), payload);
    console.log("Student added successfully");
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
}

async function createStudentFromAdmin(studentData) {
  try {
    const normalizedStudentIdValue = normalizeStudentId(studentData.student_id);
    const notes = normalizeWhitespace(studentData.additional_info?.notes || "");
    const payload = {
      name: toNameCase(studentData.name),
      matric: normalizeWhitespace(studentData.matric),
      student_id: normalizedStudentIdValue,
      gender: normalizeWhitespace(studentData.gender),
      email: normalizeWhitespace(studentData.email),
      approved: Boolean(studentData.approved),
      portfolioUrl: normalizeWhitespace(studentData.portfolioUrl || ""),
      imageUrl: normalizeWhitespace(studentData.imageUrl || ""),
      submission_date: Timestamp.now(),
      additional_info: notes
        ? { ...(studentData.additional_info || {}), notes }
        : studentData.additional_info || {},
    };

    const matches = await findStudentDocsByStudentId(normalizedStudentIdValue);
    if (matches.length > 0) {
      const canonical = matches
        .map((docSnap) => ({ docSnap, millis: getSubmissionMillis(docSnap) }))
        .sort((a, b) => b.millis - a.millis)[0].docSnap;
      await updateDoc(doc(db, "students", canonical.id), payload);
      return true;
    }

    await addDoc(collection(db, "students"), payload);
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

function subscribeToStudents(onChange, onError) {
  try {
    const unsubscribe = onSnapshot(
      collection(db, "students"),
      (querySnapshot) => {
        const students = querySnapshot.docs.map((snapshot) => ({
          ...snapshot.data(),
          id: snapshot.id,
          student_id: snapshot.data().student_id || snapshot.data().id,
        }));
        onChange(students);
      },
      (error) => {
        console.error("Error subscribing to students:", error);
        onError?.(error);
      },
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up students subscription:", error);
    onError?.(error);
    return () => {};
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

async function deleteStudent(documentId) {
  try {
    const studentRef = doc(db, "students", documentId);
    await deleteDoc(studentRef);
    return true;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
}

// Export functions
export { 
  addStudent, 
  createStudentFromAdmin,
  updateStudentFromAdmin,
  subscribeToStudents,
  approveStudent,
  rejectStudent,
  deleteStudent,
  auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
