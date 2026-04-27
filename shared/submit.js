import { addStudent } from "./firebase.js";
import { CONFIG } from "./config.js";
const submissionForm = document.querySelector("#portfolio-form");

if (submissionForm) {
  const profileInput = document.querySelector("#profilePicture");
  const portfolioInput = document.querySelector("#portfolioFiles");
  const profileStatus = document.querySelector("#profileStatus");
  const portfolioStatus = document.querySelector("#portfolioStatus");
  const submissionStatus = document.querySelector("#submissionStatus");

  const formatFileList = (files) => {
    if (!files || files.length === 0) return "No file selected yet.";
    if (files.length === 1) return files[0].name;
    return `${files.length} files selected`;
  };

  profileInput?.addEventListener("change", () => {
    profileStatus.textContent = formatFileList(profileInput.files);
  });

  portfolioInput?.addEventListener("change", () => {
    portfolioStatus.textContent = formatFileList(portfolioInput.files);
  });

  async function uploadToCloudinary(file, fileName) {
    const CLOUDINARY_CLOUD_NAME = CONFIG.CLOUDINARY.CLOUD_NAME;
    const CLOUDINARY_UPLOAD_PRESET = CONFIG.CLOUDINARY.UPLOAD_PRESET;
    const isImage = file.type.startsWith("image/");
    const resourceType = isImage ? "image" : "raw";

    if (CLOUDINARY_CLOUD_NAME === "YOUR_CLOUD_NAME" || CLOUDINARY_UPLOAD_PRESET === "YOUR_UPLOAD_PRESET") {
        throw new Error("Missing Cloudinary configuration. Please update CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in shared/submit.js");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    if (fileName) {
      formData.append("public_id", fileName);
    }
    
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!isImage && data.secure_url) {
      return data.secure_url.replace("/upload/", "/upload/fl_attachment/");
    }

    return data.secure_url;
  }

  submissionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!submissionForm.reportValidity()) {
      submissionStatus.className =
        "rounded-2xl bg-error-container px-5 py-4 text-sm font-medium text-on-error-container";
      submissionStatus.textContent =
        "Please complete the required fields before submitting.";
      return;
    }

    const profileFile = profileInput.files[0];
    const portfolioFile = portfolioInput.files[0];

    if (!profileFile || !portfolioFile) {
        submissionStatus.className =
          "rounded-2xl bg-error-container px-5 py-4 text-sm font-medium text-on-error-container";
        submissionStatus.textContent =
          "Please select both a profile picture and at least one portfolio file.";
        return;
    }

    const submitBtn = submissionForm.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Uploading...</span><span class="material-symbols-outlined animate-spin text-[20px]" style="animation: spin 1s linear infinite;">sync</span><style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>`;
    submitBtn.disabled = true;

    try {
      submissionStatus.className =
        "rounded-2xl bg-surface-container-low px-5 py-4 text-sm text-on-surface-variant";
      submissionStatus.textContent = "Uploading profile picture to Cloudinary...";

      const matricNumber = submissionForm.matricNumber.value;
      
      const getExt = (file) => file.name.includes('.') ? file.name.substring(file.name.lastIndexOf('.')) : '';
      const profileExt = getExt(profileFile);
      const portfolioExt = getExt(portfolioFile);

      const profileUrl = await uploadToCloudinary(profileFile, `${matricNumber}_profile${profileExt}`);
      
      submissionStatus.textContent = "Uploading portfolio files to Cloudinary...";
      const portfolioUrl = await uploadToCloudinary(portfolioFile, `${matricNumber}_portfolio${portfolioExt}`);

      submissionStatus.textContent = "Saving student record...";

      await addStudent({
        full_name: submissionForm.fullName.value,
        email: submissionForm.emailAddress.value,
        matric: submissionForm.matricNumber.value,
        id: submissionForm.studentId.value,
        gender: submissionForm.gender.value,
        profile_picture_url: profileUrl,
        portfolio_url: portfolioUrl,
        additional_info: {
          notes: submissionForm.submissionNotes.value,
        },
      });

      submissionStatus.className =
        "rounded-2xl bg-secondary-fixed px-5 py-4 text-sm font-medium text-on-secondary-fixed";
      submissionStatus.textContent =
        "Success! Your portfolio has been submitted with Cloudinary links.";
        
      submissionForm.reset();
      profileStatus.textContent = "No file selected yet.";
      portfolioStatus.textContent = "No file selected yet.";
    } catch (error) {
      console.error("Submission error:", error);
      submissionStatus.className =
        "rounded-2xl bg-error-container px-5 py-4 text-sm font-medium text-on-error-container";
      submissionStatus.textContent = error.message || "Error submitting portfolio. Please try again.";
    } finally {
      submitBtn.innerHTML = originalBtnHTML;
      submitBtn.disabled = false;
    }
  });
}
