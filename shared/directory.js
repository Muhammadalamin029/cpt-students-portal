// Import Firebase functions
import { subscribeToStudents } from "./firebase.js";

// Load students from Firebase
let students = [];

const directoryElements = {
  ascendingButton: document.querySelector(".ascending_button"),
  descendingButton: document.querySelector(".descending_button"),
  prevButton: document.querySelector(".pagination-prev"),
  nextButton: document.querySelector(".pagination-next"),
  pagesContainer: document.querySelector(".pagination-pages"),
  searchInput: document.querySelector("#studentSearch"),
  studentsGrid: document.querySelector(".students-grid"),
  summary: document.querySelector("#resultsSummary"),
  emptyState: document.querySelector("#emptyState"),
  totalCount: document.querySelector("#studentsCountTotal"),
  approvedCount: document.querySelector("#studentsCountApproved"),
  pendingCount: document.querySelector("#studentsCountPending"),
  cardStyleBtn: document.querySelector("#cardStyleToggle"),
};

// allow the check to pass even if cardStyleBtn is null (optional element)
const requiredElements = { ...directoryElements };
delete requiredElements.cardStyleBtn;

if (Object.values(requiredElements).every(Boolean)) {
  let isAscending = true;
  let currentPage = 1;
  let cardStyle = "classic"; // "classic" | "photo"
  const itemsPerPage = 15;
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

  const getFilteredStudents = () => {
    const query = directoryElements.searchInput.value.trim().toLowerCase();
    if (!query) return students;

    return students.filter((student) =>
      [student.name, student.student_id, student.gender]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  };

  const getSortedStudents = (list) =>
    [...list].sort((left, right) => {
      if (left.name < right.name) return isAscending ? -1 : 1;
      if (left.name > right.name) return isAscending ? 1 : -1;
      return 0;
    });

  const createTextElement = (tagName, className, text) => {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
  };

  // ── Classic card (original style) ──
  const createClassicCard = (student) => {
    const card = document.createElement("article");
    card.className =
      "group rounded-[2rem] bg-surface-container-lowest p-8 shadow-[0px_12px_32px_rgba(0,35,111,0.06)] transition-all duration-300 hover:-translate-y-1 hover:bg-surface-bright";
    card.setAttribute("role", "listitem");
    card.setAttribute("aria-label", `${student.name}, ${student.student_id}`);

    const topRow = document.createElement("div");
    topRow.className = "mb-6 flex items-start justify-between gap-4";

    const image = document.createElement("img");
    image.className =
      "h-20 w-20 rounded-2xl object-cover shadow-md transition-transform duration-500 group-hover:scale-105";
    image.alt = `${student.name} profile photo`;
    image.src = isSafeHttpUrl(student.imageUrl)
      ? student.imageUrl
      : fallbackAvatar;
    image.addEventListener("error", () => {
      image.src = fallbackAvatar;
    });

    const status = document.createElement("span");
    status.className = student.approved
      ? "status-pill rounded-full bg-secondary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-secondary-fixed"
      : "status-pill rounded-full bg-tertiary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-tertiary-fixed";
    status.textContent = student.approved ? "Approved" : "Review Required";
    topRow.append(image, status);

    const name = createTextElement(
      "h2",
      "mb-1 text-2xl font-extrabold text-primary",
      student.name,
    );
    const idText = createTextElement(
      "p",
      "mb-2 text-sm font-medium text-on-surface-variant",
      `ID: ${student.student_id}`,
    );
    const metaText = createTextElement(
      "p",
      "mb-4 text-xs uppercase tracking-wide text-outline",
      student.gender,
    );

    const action = buildAction(student);
    card.append(topRow, name, idText, metaText, action);
    return card;
  };

  // ── Photo-first card (large cover image) ──
  const createPhotoCard = (student) => {
    const card = document.createElement("article");
    card.className =
      "group overflow-hidden rounded-[2rem] border border-surface-container-highest bg-white shadow-[0px_14px_38px_rgba(15,23,45,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_22px_52px_rgba(15,23,45,0.14)]";
    card.setAttribute("role", "listitem");
    card.setAttribute("aria-label", `${student.name}, ${student.student_id}`);

    // Cover image area
    const imgWrap = document.createElement("div");
    imgWrap.className =
      "relative h-72 w-full overflow-hidden bg-surface-container-high";

    const image = document.createElement("img");
    image.className =
      "h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105";
    image.alt = `${student.name} profile photo`;
    image.src = isSafeHttpUrl(student.imageUrl)
      ? student.imageUrl
      : fallbackAvatar;
    image.addEventListener("error", () => {
      image.src = fallbackAvatar;
    });

    const statusOverlay = document.createElement("span");
    statusOverlay.className = student.approved
      ? "absolute right-3 top-3 rounded-full bg-secondary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-secondary-fixed shadow"
      : "absolute right-3 top-3 rounded-full bg-tertiary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-tertiary-fixed shadow";
    statusOverlay.textContent = student.approved
      ? "Approved"
      : "Review Required";

    const gradientOverlay = document.createElement("div");
    gradientOverlay.className =
      "absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent";

    imgWrap.append(image, gradientOverlay, statusOverlay);

    // Card body
    const body = document.createElement("div");
    body.className = "p-6 bg-surface-container-lowest";

    const details = document.createElement("div");
    details.className = "mb-6 space-y-2";

    const name = createTextElement(
      "h2",
      "text-2xl font-extrabold text-primary leading-snug",
      student.name,
    );
    const idText = createTextElement(
      "p",
      "text-sm font-medium text-on-surface-variant",
      `ID: ${student.student_id}`,
    );
    const metaText = createTextElement(
      "p",
      "text-xs uppercase tracking-wide text-outline",
      student.gender,
    );

    details.append(name, idText, metaText);
    const action = buildAction(student);
    body.append(details, action);
    card.append(imgWrap, body);
    return card;
  };

  // ── Shared action builder ──
  const buildAction = (student) => {
    if (student.approved && isSafeHttpUrl(student.portfolioUrl)) {
      const action = document.createElement("a");
      action.className =
        "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary px-6 py-4 font-semibold text-white shadow-lg shadow-secondary/30 transition-all duration-300 hover:bg-primary";
      action.href = `${encodeURIComponent(student.student_id.toUpperCase())}/index.html`;
      action.target = "_blank";
      action.rel = "noopener noreferrer";
      action.textContent = "Visit Portfolio";
      const icon = document.createElement("span");
      icon.className = "material-symbols-outlined text-[20px]";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "folder_open";
      action.prepend(icon);
      return action;
    }
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "w-full rounded-lg bg-secondary/20 px-6 py-4 font-semibold text-secondary";
    btn.disabled = true;
    btn.textContent = "Pending Review";
    btn.setAttribute(
      "aria-label",
      `${student.name} portfolio is still pending review`,
    );
    return btn;
  };

  const createStudentCard = (student) =>
    cardStyle === "photo"
      ? createPhotoCard(student)
      : createClassicCard(student);

  const updateSortButtons = () => {
    directoryElements.ascendingButton.setAttribute(
      "aria-pressed",
      String(isAscending),
    );
    directoryElements.descendingButton.setAttribute(
      "aria-pressed",
      String(!isAscending),
    );

    directoryElements.ascendingButton.classList.toggle(
      "text-primary",
      isAscending,
    );
    directoryElements.ascendingButton.classList.toggle(
      "bg-surface-container-lowest",
      isAscending,
    );
    directoryElements.descendingButton.classList.toggle(
      "text-primary",
      !isAscending,
    );
    directoryElements.descendingButton.classList.toggle(
      "bg-surface-container-lowest",
      !isAscending,
    );
  };

  const renderPagination = (totalPages) => {
    directoryElements.pagesContainer.replaceChildren();

    const maxButtons = 3;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxButtons) {
      if (currentPage <= 2) {
        startPage = 1;
        endPage = 3;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
        endPage = totalPages;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }
    }

    for (let pageNumber = startPage; pageNumber <= endPage; pageNumber += 1) {
      const pageButton = document.createElement("button");
      pageButton.type = "button";
      pageButton.className =
        "h-12 w-12 rounded-xl text-on-surface-variant transition-colors hover:bg-surface-container-high";
      pageButton.textContent = String(pageNumber);
      pageButton.setAttribute("aria-label", `Go to page ${pageNumber}`);

      if (pageNumber === currentPage) {
        pageButton.classList.add("bg-primary", "font-bold", "text-white");
        pageButton.setAttribute("aria-current", "page");
      }

      pageButton.addEventListener("click", () => {
        currentPage = pageNumber;
        updateView();
      });

      directoryElements.pagesContainer.append(pageButton);
    }

    directoryElements.prevButton.disabled = currentPage === 1;
    directoryElements.nextButton.disabled = currentPage === totalPages;
    directoryElements.prevButton.setAttribute(
      "aria-disabled",
      String(currentPage === 1),
    );
    directoryElements.nextButton.setAttribute(
      "aria-disabled",
      String(currentPage === totalPages),
    );
  };

  const updateSummary = (filteredStudents, visibleStudents, totalPages) => {
    if (filteredStudents.length === 0) {
      directoryElements.summary.textContent =
        "No students match your search right now.";
      return;
    }

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = start + visibleStudents.length - 1;
    const sortLabel = isAscending ? "ascending" : "descending";
    directoryElements.summary.textContent = `Showing ${start}-${end} of ${filteredStudents.length} students, sorted ${sortLabel}. ${totalPages} page${totalPages === 1 ? "" : "s"} total.`;
  };

  const updateCounts = () => {
    const total = students.length;
    const approved = students.filter((student) => student.approved).length;
    const pending = total - approved;

    directoryElements.totalCount.textContent = String(total);
    directoryElements.approvedCount.textContent = String(approved);
    directoryElements.pendingCount.textContent = String(pending);
  };

  const updateView = () => {
    updateCounts();

    const filteredStudents = getFilteredStudents();
    const sortedStudents = getSortedStudents(filteredStudents);
    const totalPages = Math.max(
      1,
      Math.ceil(sortedStudents.length / itemsPerPage),
    );

    currentPage = Math.min(currentPage, totalPages);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const visibleStudents = sortedStudents.slice(
      startIndex,
      startIndex + itemsPerPage,
    );

    directoryElements.studentsGrid.replaceChildren();

    if (visibleStudents.length === 0) {
      directoryElements.emptyState.classList.remove("hidden");
    } else {
      directoryElements.emptyState.classList.add("hidden");
      // Update grid columns for photo style (taller cards, fewer columns)
      if (cardStyle === "photo") {
        directoryElements.studentsGrid.classList.remove("lg:grid-cols-3");
        directoryElements.studentsGrid.classList.add("lg:grid-cols-3");
      } else {
        directoryElements.studentsGrid.classList.remove("lg:grid-cols-3");
        directoryElements.studentsGrid.classList.add("lg:grid-cols-3");
      }
      visibleStudents.forEach((student) => {
        directoryElements.studentsGrid.append(createStudentCard(student));
      });
    }

    updateSummary(filteredStudents, visibleStudents, totalPages);
    updateSortButtons();
    renderPagination(totalPages);
  };

  directoryElements.ascendingButton.addEventListener("click", () => {
    if (!isAscending) {
      isAscending = true;
      currentPage = 1;
      updateView();
    }
  });

  directoryElements.descendingButton.addEventListener("click", () => {
    if (isAscending) {
      isAscending = false;
      currentPage = 1;
      updateView();
    }
  });

  directoryElements.searchInput.addEventListener("input", () => {
    currentPage = 1;
    updateView();
  });

  directoryElements.prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage -= 1;
      updateView();
    }
  });

  directoryElements.nextButton.addEventListener("click", () => {
    const filteredStudents = getFilteredStudents();
    const totalPages = Math.max(
      1,
      Math.ceil(filteredStudents.length / itemsPerPage),
    );
    if (currentPage < totalPages) {
      currentPage += 1;
      updateView();
    }
  });

  // ── Card style toggle ──
  if (directoryElements.cardStyleBtn) {
    directoryElements.cardStyleBtn.addEventListener("click", () => {
      cardStyle = cardStyle === "classic" ? "photo" : "classic";
      const isPhoto = cardStyle === "photo";
      directoryElements.cardStyleBtn.setAttribute(
        "aria-pressed",
        String(isPhoto),
      );
      directoryElements.cardStyleBtn.querySelector(
        ".toggle-label",
      ).textContent = isPhoto ? "Classic View" : "Photo View";
      directoryElements.cardStyleBtn.querySelector(
        ".material-symbols-outlined",
      ).textContent = isPhoto ? "view_list" : "photo_library";
      currentPage = 1;
      updateView();
    });
  }

  let unsubscribeStudents = null;

  function initializeStudents() {
    // Show loading skeleton
    directoryElements.studentsGrid.replaceChildren();
    for (let i = 0; i < 6; i++) {
      const skeleton = document.createElement("div");
      skeleton.className =
        "h-[220px] animate-pulse rounded-[2rem] bg-surface-container-high/50";
      directoryElements.studentsGrid.append(skeleton);
    }
    directoryElements.emptyState.classList.add("hidden");

    unsubscribeStudents = subscribeToStudents(
      (nextStudents) => {
        students = nextStudents;
        console.log("Students updated:", students);
        updateView();
      },
      (error) => {
        console.error("Students subscription failed:", error);
      },
    );
  }

  // Load students from Firebase
  initializeStudents();
}
