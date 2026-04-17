const portalConfig = {
  home: {
    pageLabel: "Home",
    brandHref: "index.html",
    actionHref: "#school-details",
    actionLabel: "Explore",
    navLinks: [
      { label: "Home", href: "index.html", current: true },
      { label: "Students", href: "../students/index.html" },
      { label: "Portfolio Submission", href: "../students/submit.html" },
    ],
    footerLinks: [
      { label: "Home", href: "index.html" },
      { label: "Students", href: "../students/index.html" },
      { label: "Submit Portfolio", href: "../students/submit.html" },
      { label: "Access Admin Portal", href: "../admin/index.html" },
    ],
    pageLinks: [
      { label: "School Details", href: "#school-details" },
      { label: "Faculty Highlights", href: "#faculty-details" },
      { label: "Back to Top", href: "#page-top" },
    ],
  },
  students: {
    pageLabel: "Students",
    brandHref: "../home/index.html",
    actionHref: "#directory-controls",
    actionLabel: "Find Students",
    navLinks: [
      { label: "Home", href: "../home/index.html" },
      { label: "Students", href: "index.html", current: true },
      { label: "Portfolio Submission", href: "submit.html" },
    ],
    footerLinks: [
      { label: "Home", href: "../home/index.html" },
      { label: "Students", href: "index.html" },
      { label: "Submit Portfolio", href: "submit.html" },
      { label: "Access Admin Portal", href: "../admin/index.html" },
    ],
    pageLinks: [
      { label: "Directory Controls", href: "#directory-controls" },
      { label: "Student Directory", href: "#student-directory" },
      { label: "Back to Top", href: "#page-top" },
    ],
  },
  submit: {
    pageLabel: "Portfolio Submission",
    brandHref: "../home/index.html",
    actionHref: "#submission-form",
    actionLabel: "Open Form",
    navLinks: [
      { label: "Home", href: "../home/index.html" },
      { label: "Students", href: "index.html" },
      { label: "Portfolio Submission", href: "submit.html", current: true },
    ],
    footerLinks: [
      { label: "Home", href: "../home/index.html" },
      { label: "Students", href: "index.html" },
      { label: "Submit Portfolio", href: "submit.html" },
      { label: "Access Admin Portal", href: "../admin/index.html" },
    ],
    pageLinks: [
      { label: "Submission Guide", href: "#submission-guide" },
      { label: "Submission Form", href: "#submission-form" },
      { label: "Back to Top", href: "#page-top" },
    ],
  },
};

const renderLinkList = (links, listClass = "") =>
  links
    .map((link) => {
      const current = link.current ? ' aria-current="page"' : "";
      const activeClasses = link.current
        ? "text-blue-700 dark:text-blue-400 border-b-2 border-blue-700 dark:border-blue-400 pb-1"
        : "text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-200 transition-colors";

      return `<a class="font-headline font-bold tracking-tight ${activeClasses}" href="${link.href}"${current}>${link.label}</a>`;
    })
    .join("");

const renderFooterItems = (links) =>
  links
    .map(
      (link) =>
        `<li><a class="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" href="${link.href}">${link.label}</a></li>`,
    )
    .join("");

const storageKey = "cs-scholar-theme";
const root = document.documentElement;
const headerSlot = document.querySelector("[data-portal-header]");
const footerSlot = document.querySelector("[data-portal-footer]");
const page = document.body.dataset.page || "home";
const config = portalConfig[page];

const getPreferredTheme = () => {
  const storedTheme = window.localStorage.getItem(storageKey);
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const updateThemeToggle = (theme) => {
  const themeToggle = document.querySelector("[data-theme-toggle]");
  if (!themeToggle) return;

  const nextTheme = theme === "dark" ? "light" : "dark";
  const icon = themeToggle.querySelector("[data-theme-icon]");
  const label = themeToggle.querySelector("[data-theme-label]");

  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
  themeToggle.setAttribute("title", `Switch to ${nextTheme} theme`);
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));

  if (icon) {
    icon.textContent = theme === "dark" ? "light_mode" : "dark_mode";
  }

  if (label) {
    label.textContent = theme === "dark" ? "Light" : "Dark";
  }
};

const applyTheme = (theme, persist = false) => {
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.dataset.theme = theme;

  if (persist) {
    window.localStorage.setItem(storageKey, theme);
  }

  updateThemeToggle(theme);
};

if (config && headerSlot) {
  headerSlot.innerHTML = `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="fixed top-0 z-50 w-full bg-white/80 shadow-[0px_12px_32px_rgba(0,35,111,0.06)] glass-nav dark:bg-slate-900/80">
      <nav aria-label="Primary" class="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
        <a class="font-headline text-xl font-extrabold tracking-tighter text-blue-900 dark:text-blue-50" href="${config.brandHref}">
          CS Scholar Portal
        </a>
        <div class="hidden items-center space-x-8 md:flex">
          ${renderLinkList(config.navLinks)}
        </div>
        <div class="flex items-center gap-3">
          <button
            aria-label="Switch theme"
            aria-pressed="false"
            class="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/70 px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-primary hover:text-white dark:bg-slate-900/70 dark:text-blue-100"
            data-theme-toggle=""
            type="button"
          >
            <span class="material-symbols-outlined text-[18px]" data-theme-icon="" aria-hidden="true">dark_mode</span>
            <span class="hidden sm:inline" data-theme-label="">Dark</span>
          </button>
          <a class="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/70 px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-primary hover:text-white dark:bg-slate-900/70 dark:text-blue-100" href="${config.actionHref}">
            <span class="material-symbols-outlined text-[18px]">arrow_outward</span>
            <span>${config.actionLabel}</span>
          </a>
        </div>
      </nav>
    </header>
  `;
}

applyTheme(root.classList.contains("dark") ? "dark" : getPreferredTheme());

const themeToggle = document.querySelector("[data-theme-toggle]");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.classList.contains("dark") ? "light" : "dark";
    applyTheme(nextTheme, true);
  });
}

const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
systemTheme.addEventListener("change", ({ matches }) => {
  const storedTheme = window.localStorage.getItem(storageKey);
  if (storedTheme === "dark" || storedTheme === "light") {
    return;
  }

  applyTheme(matches ? "dark" : "light");
});

if (config && footerSlot) {
  footerSlot.innerHTML = `
    <footer id="site-footer" class="mt-auto border-t-0 bg-slate-50 dark:bg-slate-950">
      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-8 md:grid-cols-3">
        <div>
          <div class="mb-4 font-headline text-xl font-bold text-blue-900 dark:text-blue-50">
            CS Scholar Portal
          </div>
          <p class="max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            A focused Computer Science portfolio portal for discovering students, reviewing submissions, and keeping the CPT journey organized.
          </p>
        </div>
        <div>
          <h2 class="mb-3 font-headline text-sm font-bold uppercase tracking-[0.12em] text-primary">
            Portal Links
          </h2>
          <ul class="space-y-3 text-sm leading-relaxed">
            ${renderFooterItems(config.footerLinks)}
          </ul>
        </div>
        <div>
          <h2 class="mb-3 font-headline text-sm font-bold uppercase tracking-[0.12em] text-primary">
            On This Page
          </h2>
          <ul class="space-y-3 text-sm leading-relaxed">
            ${renderFooterItems(config.pageLinks)}
          </ul>
          <p class="mt-6 text-xs text-slate-500 dark:text-slate-400">
            &copy; 2026 CS Scholar Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  `;
}
