import { auth, onAuthStateChanged, signOut, loadStudentsFromFirebase, approveStudent, rejectStudent } from "../shared/firebase.js";

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

const fallbackAvatar = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='24' fill='%23dce1ff'/%3E%3Ccircle cx='60' cy='46' r='22' fill='%2300236f' opacity='0.85'/%3E%3Cpath d='M27 103c7-18 22-27 33-27s26 9 33 27' fill='%2300236f' opacity='0.85'/%3E%3C/svg%3E";

const isSafeHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const getPortfolioDownloadUrl = (value) => {
    if (!isSafeHttpUrl(value)) return "#";

    try {
        const url = new URL(value);

        if (
            url.hostname === "res.cloudinary.com" &&
            url.pathname.includes("/upload/") &&
            !url.pathname.includes("/upload/fl_attachment/")
        ) {
            url.pathname = url.pathname.replace(
                "/upload/",
                "/upload/fl_attachment/",
            );
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

tabPending?.addEventListener("click", () => {
    tabPending.className = "px-6 py-3 font-semibold text-primary border-b-2 border-primary transition-colors focus:outline-none";
    tabApproved.className = "px-6 py-3 font-semibold text-on-surface-variant border-b-2 border-transparent hover:text-primary transition-colors focus:outline-none";
    pendingSection.classList.remove("hidden");
    approvedSection.classList.add("hidden");
});

tabApproved?.addEventListener("click", () => {
    tabApproved.className = "px-6 py-3 font-semibold text-primary border-b-2 border-primary transition-colors focus:outline-none";
    tabPending.className = "px-6 py-3 font-semibold text-on-surface-variant border-b-2 border-transparent hover:text-primary transition-colors focus:outline-none";
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
    for(let i=0; i<3; i++) {
        const skeleton = document.createElement("div");
        skeleton.className = "h-[300px] animate-pulse rounded-[2rem] bg-surface-container-high/50";
        pendingGrid.append(skeleton.cloneNode(true));
        approvedGrid.append(skeleton.cloneNode(true));
    }
    emptyState.classList.add("hidden");
    emptyStateApproved.classList.add("hidden");

    try {
        const allStudents = await loadStudentsFromFirebase();
        const pendingStudents = allStudents.filter(s => !s.approved);
        const approvedStudents = allStudents.filter(s => s.approved);
        
        pendingGrid.replaceChildren();
        if (pendingStudents.length === 0) {
            emptyState.classList.remove("hidden");
        } else {
            emptyState.classList.add("hidden");
            pendingStudents.forEach(student => {
                pendingGrid.append(createStudentCard(student, true));
            });
        }

        approvedGrid.replaceChildren();
        if (approvedStudents.length === 0) {
            emptyStateApproved.classList.remove("hidden");
        } else {
            emptyStateApproved.classList.add("hidden");
            approvedStudents.forEach(student => {
                approvedGrid.append(createStudentCard(student, false));
            });
        }
    } catch(err) {
        console.error("Failed to load students:", err);
    }
}

function createStudentCard(student, isPending) {
    const card = document.createElement("article");
    card.className = "flex flex-col overflow-hidden rounded-[2rem] bg-surface-container-lowest border border-outline/10 shadow-[0px_12px_32px_rgba(0,35,111,0.06)]";
    card.setAttribute("data-id", student.id);
    
    // Top Profile Section
    const topSection = document.createElement("div");
    topSection.className = "p-6 border-b border-outline/10 flex items-center gap-4 bg-surface-bright";
    
    const image = document.createElement("img");
    image.className = "h-16 w-16 rounded-xl object-cover shadow-sm bg-surface-container-high";
    image.alt = `${student.name} profile`;
    image.src = isSafeHttpUrl(student.imageUrl) ? student.imageUrl : fallbackAvatar;
    image.addEventListener("error", () => { image.src = fallbackAvatar; });
    
    const infoDiv = document.createElement("div");
    const name = document.createElement("h2");
    name.className = "font-headline text-xl font-bold text-primary";
    name.textContent = student.name;
    const meta = document.createElement("p");
    meta.className = "text-xs font-semibold uppercase tracking-wider text-on-surface-variant mt-1";
    meta.textContent = `${student.matric} • ID: ${student.student_id}`;
    
    infoDiv.append(name, meta);
    topSection.append(image, infoDiv);
    
    // Content Section (Notes + Assets)
    const contentSection = document.createElement("div");
    contentSection.className = "p-6 flex-grow flex flex-col gap-5";
    
    if (student.additional_info?.notes) {
        const notesWrap = document.createElement("div");
        const notesLabel = document.createElement("span");
        notesLabel.className = "text-xs font-bold text-secondary uppercase tracking-widest mb-1 block";
        notesLabel.textContent = "Submission Notes";
        const notesBody = document.createElement("p");
        notesBody.className = "text-sm text-on-surface line-clamp-3";
        notesBody.textContent = student.additional_info.notes;
        notesWrap.append(notesLabel, notesBody);
        contentSection.append(notesWrap);
    }
    
    const assetsWrap = document.createElement("div");
    const assetsLabel = document.createElement("span");
    assetsLabel.className = "text-xs font-bold text-secondary uppercase tracking-widest mb-2 block";
    assetsLabel.textContent = "Uploaded Assets";
    
    const assetAction = document.createElement("a");
        assetAction.href = isSafeHttpUrl(student.portfolioUrl)
            ? getPortfolioDownloadUrl(student.portfolioUrl)
            : "#";
    if (isSafeHttpUrl(student.portfolioUrl)) {
        assetAction.target = "_blank";
        assetAction.rel = "noopener noreferrer";
    }
    assetAction.className = "inline-flex items-center gap-2 rounded-xl border border-secondary/20 bg-secondary/5 px-4 py-3 text-sm font-semibold text-secondary transition-colors hover:bg-secondary/10 w-full";
    assetAction.innerHTML = `<span class="material-symbols-outlined text-[18px]">cloud_download</span> Download Portfolio File`;
    
    assetsWrap.append(assetsLabel, assetAction);
    contentSection.append(assetsWrap);
    
    // Action Section
    const actionSection = document.createElement("div");
    actionSection.className = "p-6 bg-gradient-to-b from-transparent to-surface-container-low/50 pt-0";
    
    if (isPending) {
        const validateBtn = document.createElement("button");
        validateBtn.className = "w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 font-headline text-sm font-bold text-white transition-all hover:bg-primary/90 disabled:opacity-50";
        validateBtn.innerHTML = `<span>Approve Upload</span><span class="material-symbols-outlined text-[18px]">check_circle</span>`;
        
        validateBtn.addEventListener("click", async () => {
            const originalBtnHTML = validateBtn.innerHTML;
            validateBtn.innerHTML = `<span>Approving...</span><span class="material-symbols-outlined animate-spin text-[18px]">sync</span>`;
            validateBtn.disabled = true;
            
            try {
                await approveStudent(student.id);
                fetchAndRenderStudents();
            } catch (err) {
                alert("Failed to approve student. Please check permissions or try again.");
                validateBtn.innerHTML = originalBtnHTML;
                validateBtn.disabled = false;
            }
        });
        actionSection.append(validateBtn);
    } else {
        const rejectBtn = document.createElement("button");
        rejectBtn.className = "w-full flex items-center justify-center gap-2 rounded-xl bg-error-container px-5 py-4 font-headline text-sm font-bold text-on-error-container transition-all hover:bg-error hover:text-white disabled:opacity-50";
        rejectBtn.innerHTML = `<span>Reject & Revoke</span><span class="material-symbols-outlined text-[18px]">cancel</span>`;
        
        rejectBtn.addEventListener("click", async () => {
            if(!confirm(`Are you sure you want to reject ${student.name}'s portfolio?`)) return;
            const originalBtnHTML = rejectBtn.innerHTML;
            rejectBtn.innerHTML = `<span>Rejecting...</span><span class="material-symbols-outlined animate-spin text-[18px]">sync</span>`;
            rejectBtn.disabled = true;
            
            try {
                await rejectStudent(student.id);
                fetchAndRenderStudents();
            } catch (err) {
                alert("Failed to reject student. Please check permissions or try again.");
                rejectBtn.innerHTML = originalBtnHTML;
                rejectBtn.disabled = false;
            }
        });
        actionSection.append(rejectBtn);
    }
    
    card.append(topSection, contentSection, actionSection);
    return card;
}
