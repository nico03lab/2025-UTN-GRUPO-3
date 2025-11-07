// src/utils/toast.js
export const showToast = (message, type = "success") => {
  const toast = document.getElementById("toast");
  const alert = document.getElementById("toast-alert");
  const msg = document.getElementById("toast-msg");

  if (!toast || !alert || !msg) {
    console.warn("⚠️ Elementos del toast no encontrados en el DOM.");
    return;
  }

  alert.className = "alert";

  const types = {
    success: "alert-success",
    error: "alert-error",
    info: "alert-info",
    warning: "alert-warning",
  };
  alert.classList.add(types[type] || "alert-success");
  msg.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3000);
};
