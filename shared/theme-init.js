(() => {
  const storageKey = "cs-scholar-theme";
  const root = document.documentElement;

  const getInitialTheme = () => {
    try {
      const storedTheme = window.localStorage.getItem(storageKey);
      if (storedTheme === "dark" || storedTheme === "light") {
        return storedTheme;
      }
    } catch {}

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const theme = getInitialTheme();
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.dataset.theme = theme;
})();
