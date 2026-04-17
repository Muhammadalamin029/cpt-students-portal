import { auth, signInWithEmailAndPassword, onAuthStateChanged } from "../shared/firebase.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorBox = document.getElementById("loginError");
const submitBtn = loginForm?.querySelector("button[type='submit']");

// If already logged in, redirect to dashboard
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "./index.html";
  }
});

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // reset UI
    errorBox.classList.add("hidden");
    errorBox.textContent = "";
    
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Authenticating...</span><span class="material-symbols-outlined animate-spin text-[20px]" style="animation: spin 1s linear infinite;">sync</span><style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>`;
    submitBtn.disabled = true;

    try {
      await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
      // Let the onAuthStateChanged handle the redirect
    } catch (error) {
      console.error(error);
      errorBox.classList.remove("hidden");
      switch (error.code) {
        case 'auth/invalid-credential':
          errorBox.textContent = "Invalid email or password.";
          break;
        case 'auth/too-many-requests':
          errorBox.textContent = "Too many failed attempts. Try again later.";
          break;
        default:
          errorBox.textContent = "An error occurred during sign in.";
      }
      submitBtn.innerHTML = originalBtnContent;
      submitBtn.disabled = false;
    }
  });
}
