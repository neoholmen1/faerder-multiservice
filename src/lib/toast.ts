export function showToast(message: string) {
  const el = document.createElement("div");
  el.textContent = message;
  el.className =
    "fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] rounded-full bg-text px-5 py-2.5 text-[14px] font-medium text-white shadow-lg";
  el.style.animation = "toast-in 0.3s ease-out both";
  document.body.appendChild(el);

  setTimeout(() => {
    el.style.animation = "toast-out 0.3s ease-in both";
    el.addEventListener("animationend", () => el.remove());
  }, 2000);
}

export async function copyAndToast(text: string, toastMessage = "Kopiert!") {
  try {
    await navigator.clipboard.writeText(text);
    showToast(toastMessage);
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    showToast(toastMessage);
  }
}
