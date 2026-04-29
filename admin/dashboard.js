import {
  auth,
  onAuthStateChanged,
  signOut,
  loadStudentsFromFirebase,
  approveStudent,
  rejectStudent,
  createStudentFromAdmin,
  updateStudentFromAdmin,
} from "../shared/firebase.js";

const authCheckLoader = document.getElementById("authCheckLoader");
const dashboardContent = document.getElementById("dashboardContent");
const logoutBtn = document.getElementById("logoutBtn");
const pendingGrid = document.getElementById("pending-grid");
const emptyState = document.getElementById("emptyState");
const approvedGrid = document.getElementById("approved-grid");
const emptyStateApproved = document.getElementById("emptyStateApproved");
const tabPending = document.getElementById("tab-pending");
const tabApproved = document.getElementById("tab-approved");
const pendingSection = document.getElementById("pending-section");
const approvedSection = document.getElementById("approved-section");
const addStudentBtn = document.getElementById("addStudentBtn");

const studentModal = document.getElementById("studentModal");
const studentModalOverlay = document.getElementById("studentModalOverlay");
const studentModalClose = document.getElementById("studentModalClose");
const studentModalCancel = document.getElementById("studentModalCancel");
const studentModalForm = document.getElementById("studentModalForm");
const studentModalTitle = document.getElementById("studentModalTitle");
const studentModalSave = document.getElementById("studentModalSave");
const studentModalError = document.getElementById("studentModalError");

const studentDocIdInput = document.getElementById("studentDocId");
const studentFullNameInput = document.getElementById("studentFullName");
const studentIdInput = document.getElementById("studentId");
const studentMatricInput = document.getElementById("studentMatric");
const studentGenderInput = document.getElementById("studentGender");
const studentEmailInput = document.getElementById("studentEmail");
const studentImageUrlInput = document.getElementById("studentImageUrl");
const studentPortfolioUrlInput = document.getElementById("studentPortfolioUrl");
const studentNotesInput = document.getElementById("studentNotes");
const studentApprovedInput = document.getElementById("studentApproved");

const fallbackAvatar =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='24' fill='%23dce1ff'/%3E%3Ccircle cx='60' cy='46' r='22' fill='%2300236f' opacity='0.85'/%3E%3Cpath d='M27 103c7-18 22-27 33-27s26 9 33 27' fill='%2300236f' opacity='0.85'/%3E%3C/svg%3E";

const isSafeHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

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

const getPortfolioDownloadUrl = (value) => {
  if (!isSafeHttpUrl(value)) return "#";

  try {
    const url = new URL(value);

    if (
      url.hostname === "res.cloudinary.com" &&
      url.pathname.includes("/upload/") &&
      !url.pathname.includes("/upload/fl_attachment/")
    ) {
      url.pathname = url.pathname.replace("/upload/", "/upload/fl_attachment/");
    }

    return url.toString();
  } catch {
    return value;
  }
};

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Not authenticated, redirect to login
    window.location.href = "./login.html";
    return;
  }

  // Authenticated
  authCheckLoader.classList.add("hidden");
  dashboardContent.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");

  await fetchAndRenderStudents();
});

let lastFocusedElement = null;

const isModalOpen = () => studentModal && !studentModal.classList.contains("hidden");

const hideStudentModalError = () => {
  if (!studentModalError) return;
  studentModalError.classList.add("hidden");
  studentModalError.textContent = "";
};

const showStudentModalError = (message) => {
  if (!studentModalError) return;
  studentModalError.textContent = message || "Something went wrong. Please try again.";
  studentModalError.classList.remove("hidden");
};

function openStudentModal({ mode, student }) {
  if (!studentModal || !studentModalForm) return;

  lastFocusedElement = document.activeElement;
  hideStudentModalError();
  studentModalForm.reset();

  const isEdit = mode === "edit";
  studentModalTitle.textContent = isEdit ? "Edit Student" : "Add Student";

  if (isEdit && student) {
    studentDocIdInput.value = student.id || "";
    studentFullNameInput.value = student.name || "";
    studentIdInput.value = student.student_id || "";
    studentMatricInput.value = student.matric || "";
    studentGenderInput.value = student.gender || "";
    studentEmailInput.value = student.email || "";
    studentImageUrlInput.value = student.imageUrl || "";
    studentPortfolioUrlInput.value = student.portfolioUrl || "";
    studentNotesInput.value = student.additional_info?.notes || "";
    studentApprovedInput.checked = Boolean(student.approved);
  } else {
    studentDocIdInput.value = "";
    studentApprovedInput.checked = false;
  }

  studentModal.classList.remove("hidden");
  studentModal.classList.add("flex");
  document.body.classList.add("overflow-hidden");

  setTimeout(() => {
    studentFullNameInput?.focus();
  }, 0);
}

function closeStudentModal() {
  if (!studentModal) return;
  studentModal.classList.add("hidden");
  studentModal.classList.remove("flex");
  document.body.classList.remove("overflow-hidden");
  hideStudentModalError();
  studentModalForm?.reset();

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

addStudentBtn?.addEventListener("click", () => {
  openStudentModal({ mode: "add" });
});

studentModalOverlay?.addEventListener("click", () => {
  closeStudentModal();
});

studentModalClose?.addEventListener("click", () => {
  closeStudentModal();
});

studentModalCancel?.addEventListener("click", () => {
  closeStudentModal();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isModalOpen()) {
    closeStudentModal();
  }
});

studentModalForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideStudentModalError();

  if (!studentModalForm.reportValidity()) return;

  const documentId = studentDocIdInput.value.trim();
  const isEditing = Boolean(documentId);

  const normalizedStudentId = normalizeStudentId(studentIdInput.value);
  const notesValue = normalizeWhitespace(studentNotesInput.value);

  const payload = {
    name: toNameCase(studentFullNameInput.value),
    student_id: normalizedStudentId,
    matric: normalizeWhitespace(studentMatricInput.value),
    gender: studentGenderInput.value,
    email: normalizeWhitespace(studentEmailInput.value),
    approved: studentApprovedInput.checked,
    imageUrl: normalizeWhitespace(studentImageUrlInput.value),
    portfolioUrl: normalizeWhitespace(studentPortfolioUrlInput.value),
    additional_info: notesValue ? { notes: notesValue } : {},
  };

  const originalSaveHTML = studentModalSave?.innerHTML;
  if (studentModalSave) {
    studentModalSave.innerHTML = `<span>${isEditing ? "Saving..." : "Creating..."}</span><span class="material-symbols-outlined animate-spin text-[18px]">sync</span>`;
    studentModalSave.disabled = true;
  }

  try {
    if (isEditing) {
      await updateStudentFromAdmin(documentId, payload);
    } else {
      await createStudentFromAdmin(payload);
    }
    closeStudentModal();
    fetchAndRenderStudents();
  } catch (err) {
    console.error(err);
    showStudentModalError(
      "Failed to save student. Please check Firebase permissions and try again.",
    );
  } finally {
    if (studentModalSave) {
      studentModalSave.innerHTML = originalSaveHTML;
      studentModalSave.disabled = false;
    }
  }
});

tabPending?.addEventListener("click", () => {
  tabPending.className =
    "px-6 py-3 font-semibold text-primary border-b-2 border-primary transition-colors focus:outline-none";
  tabApproved.className =
    "px-6 py-3 font-semibold text-on-surface-variant border-b-2 border-transparent hover:text-primary transition-colors focus:outline-none";
  pendingSection.classList.remove("hidden");
  approvedSection.classList.add("hidden");
});

tabApproved?.addEventListener("click", () => {
  tabApproved.className =
    "px-6 py-3 font-semibold text-primary border-b-2 border-primary transition-colors focus:outline-none";
  tabPending.className =
    "px-6 py-3 font-semibold text-on-surface-variant border-b-2 border-transparent hover:text-primary transition-colors focus:outline-none";
  approvedSection.classList.remove("hidden");
  pendingSection.classList.add("hidden");
});

logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "./login.html";
});

async function fetchAndRenderStudents() {
  // Show skeleton
  pendingGrid.replaceChildren();
  approvedGrid.replaceChildren();
  for (let i = 0; i < 3; i++) {
    const skeleton = document.createElement("div");
    skeleton.className =
      "h-[300px] animate-pulse rounded-[2rem] bg-surface-container-high/50";
    pendingGrid.append(skeleton.cloneNode(true));
    approvedGrid.append(skeleton.cloneNode(true));
  }
  emptyState.classList.add("hidden");
  emptyStateApproved.classList.add("hidden");

  try {
    const allStudents = await loadStudentsFromFirebase();
    const pendingStudents = allStudents.filter((s) => !s.approved);
    const approvedStudents = allStudents.filter((s) => s.approved);

    pendingGrid.replaceChildren();
    if (pendingStudents.length === 0) {
      emptyState.classList.remove("hidden");
    } else {
      emptyState.classList.add("hidden");
      pendingStudents.forEach((student) => {
        pendingGrid.append(createStudentCard(student, true));
      });
    }

    approvedGrid.replaceChildren();
    if (approvedStudents.length === 0) {
      emptyStateApproved.classList.remove("hidden");
    } else {
      emptyStateApproved.classList.add("hidden");
      approvedStudents.forEach((student) => {
        approvedGrid.append(createStudentCard(student, false));
      });
    }
  } catch (err) {
    console.error("Failed to load students:", err);
  }
}

function createStudentCard(student, isPending) {
  const card = document.createElement("article");
  card.className =
    "flex flex-col overflow-hidden rounded-[2rem] border border-primary/10 bg-[linear-gradient(180deg,rgba(220,225,255,0.5)_0%,rgba(255,255,255,0.98)_34%,rgba(236,243,255,0.92)_100%)] shadow-[0px_20px_48px_rgba(0,35,111,0.12)] backdrop-blur-sm";
  card.setAttribute("data-id", student.id);

  // Top Profile Section
  const topSection = document.createElement("div");
  topSection.className =
    "flex items-start justify-between gap-4 border-b border-primary/10 bg-primary/5 p-6";

  const profileWrap = document.createElement("div");
  profileWrap.className = "flex items-center gap-4";

  const image = document.createElement("img");
  image.className =
    "h-16 w-16 rounded-2xl object-cover border border-primary/10 shadow-sm bg-surface-container-high";
  image.alt = `${student.name} profile`;
  image.src = isSafeHttpUrl(student.imageUrl)
    ? student.imageUrl
    : fallbackAvatar;
  image.addEventListener("error", () => {
    image.src = fallbackAvatar;
  });

  const infoDiv = document.createElement("div");
  const name = document.createElement("h2");
  name.className = "font-headline text-xl font-bold text-primary";
  name.textContent = student.name;
  const meta = document.createElement("p");
  meta.className =
    "text-xs font-semibold uppercase tracking-wider text-on-surface-variant mt-1";
  meta.textContent = `${student.matric} • ID: ${student.student_id}`;

  const roleTag = document.createElement("span");
  roleTag.className = isPending
    ? "mt-3 inline-flex w-fit rounded-full bg-tertiary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-tertiary-fixed"
    : "mt-3 inline-flex w-fit rounded-full bg-secondary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-fixed";
  roleTag.textContent = isPending ? "Pending Review" : "Approved Record";

  infoDiv.append(name, meta, roleTag);
  profileWrap.append(image, infoDiv);

  const auditBadge = document.createElement("div");
  auditBadge.className =
    "rounded-2xl border border-primary/10 bg-white/80 px-4 py-3 text-right shadow-sm";
  auditBadge.innerHTML = `
            <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">Admin View</p>
            <p class="mt-1 text-sm font-semibold text-primary">${isPending ? "Awaiting decision" : "Visible on portal"}</p>
        `;

  topSection.append(profileWrap, auditBadge);

  // Content Section (Notes + Assets)
  const contentSection = document.createElement("div");
  contentSection.className = "flex-grow space-y-5 p-6";

  if (student.additional_info?.notes) {
    const notesWrap = document.createElement("div");
    const notesLabel = document.createElement("span");
    notesLabel.className =
      "mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-secondary";
    notesLabel.textContent = "Submission Notes";
    const notesBody = document.createElement("p");
    notesBody.className =
      "rounded-2xl bg-white/75 px-4 py-4 text-sm leading-relaxed text-on-surface shadow-sm ring-1 ring-primary/5";
    notesBody.textContent = student.additional_info.notes;
    notesWrap.append(notesLabel, notesBody);
    contentSection.append(notesWrap);
  }

  const assetsWrap = document.createElement("div");
  assetsWrap.className =
    "rounded-[1.5rem] bg-primary/5 p-4 ring-1 ring-primary/10";
  const assetsLabel = document.createElement("span");
  assetsLabel.className =
    "mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-secondary";
  assetsLabel.textContent = "Uploaded Assets";

  const assetsHint = document.createElement("p");
  assetsHint.className = "mb-4 text-sm text-on-surface-variant";
  assetsHint.textContent = isPending
    ? "Open the uploaded file and confirm it meets the review requirements before approval."
    : "Open the approved portfolio file exactly as students will access it from the public portal.";

  const assetAction = document.createElement("a");
  assetAction.href = isSafeHttpUrl(student.portfolioUrl)
    ? getPortfolioDownloadUrl(student.portfolioUrl)
    : "#";
  if (isSafeHttpUrl(student.portfolioUrl)) {
    assetAction.target = "_blank";
    assetAction.rel = "noopener noreferrer";
  }
  assetAction.className =
    "inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-secondary/20 bg-white px-4 py-3 text-sm font-semibold text-secondary shadow-sm transition-colors hover:bg-secondary/10";
  assetAction.innerHTML = `<span class="material-symbols-outlined text-[18px]">cloud_download</span> Download Portfolio File`;

  assetsWrap.append(assetsLabel, assetsHint, assetAction);
  contentSection.append(assetsWrap);

  // Action Section
  const actionSection = document.createElement("div");
  actionSection.className = "border-t border-primary/10 bg-white/50 p-6";

  const actionsWrap = document.createElement("div");
  actionsWrap.className = "grid grid-cols-1 gap-3";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className =
    "w-full flex items-center justify-center gap-2 rounded-xl border border-outline bg-white px-5 py-4 font-headline text-sm font-bold text-primary transition-colors hover:bg-surface-container disabled:opacity-50";
  editBtn.innerHTML = `<span>Edit Student</span><span class="material-symbols-outlined text-[18px]">edit</span>`;
  editBtn.addEventListener("click", () => {
    openStudentModal({ mode: "edit", student });
  });

  if (isPending) {
    const validateBtn = document.createElement("button");
    validateBtn.className =
      "w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 font-headline text-sm font-bold text-white transition-all hover:bg-primary/90 disabled:opacity-50";
    validateBtn.innerHTML = `<span>Approve Upload</span><span class="material-symbols-outlined text-[18px]">check_circle</span>`;

    validateBtn.addEventListener("click", async () => {
      const originalBtnHTML = validateBtn.innerHTML;
      validateBtn.innerHTML = `<span>Approving...</span><span class="material-symbols-outlined animate-spin text-[18px]">sync</span>`;
      validateBtn.disabled = true;

      try {
        await approveStudent(student.id);
        fetchAndRenderStudents();
      } catch (err) {
        alert(
          "Failed to approve student. Please check permissions or try again.",
        );
        validateBtn.innerHTML = originalBtnHTML;
        validateBtn.disabled = false;
      }
    });
    actionsWrap.append(validateBtn, editBtn);
  } else {
    const rejectBtn = document.createElement("button");
    rejectBtn.className =
      "w-full flex items-center justify-center gap-2 rounded-xl bg-error-container px-5 py-4 font-headline text-sm font-bold text-on-error-container transition-all hover:bg-error hover:text-white disabled:opacity-50";
    rejectBtn.innerHTML = `<span>Reject & Revoke</span><span class="material-symbols-outlined text-[18px]">cancel</span>`;

    rejectBtn.addEventListener("click", async () => {
      if (
        !confirm(`Are you sure you want to reject ${student.name}'s portfolio?`)
      )
        return;
      const originalBtnHTML = rejectBtn.innerHTML;
      rejectBtn.innerHTML = `<span>Rejecting...</span><span class="material-symbols-outlined animate-spin text-[18px]">sync</span>`;
      rejectBtn.disabled = true;

      try {
        await rejectStudent(student.id);
        fetchAndRenderStudents();
      } catch (err) {
        alert(
          "Failed to reject student. Please check permissions or try again.",
        );
        rejectBtn.innerHTML = originalBtnHTML;
        rejectBtn.disabled = false;
      }
    });
    actionsWrap.append(rejectBtn, editBtn);
  }

  actionSection.append(actionsWrap);
  card.append(topSection, contentSection, actionSection);
  return card;
}
