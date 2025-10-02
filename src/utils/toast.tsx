/**
 * Toast utility functions
 * Centralized toast notifications with consistent styling
 */
import toast from "react-hot-toast";

export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: "top-right",
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    duration: 5000,
    position: "top-right",
  });
};

export const showInfo = (message: string) => {
  toast(message, {
    duration: 4000,
    position: "top-right",
    icon: "ℹ️",
  });
};

export const showConfirmation = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  // Create a modal-like backdrop
  const backdrop = document.createElement("div");
  backdrop.className =
    "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center";
  backdrop.style.pointerEvents = "auto";

  // Create the confirmation dialog
  const dialog = document.createElement("div");
  dialog.className = "bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 z-50";
  dialog.style.pointerEvents = "auto";

  dialog.innerHTML = `
    <div class="flex flex-col space-y-4">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-medium text-gray-900">Confirm Action</h3>
          <p class="text-sm text-gray-500">${message}</p>
        </div>
      </div>
      <div class="flex space-x-3 justify-end">
        <button id="cancel-btn" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">
          Cancel
        </button>
        <button id="confirm-btn" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
          Yes, Delete
        </button>
      </div>
    </div>
  `;

  backdrop.appendChild(dialog);
  document.body.appendChild(backdrop);

  // Add event listeners
  const confirmBtn = dialog.querySelector("#confirm-btn");
  const cancelBtn = dialog.querySelector("#cancel-btn");

  const cleanup = () => {
    document.body.removeChild(backdrop);
  };

  confirmBtn?.addEventListener("click", () => {
    cleanup();
    onConfirm();
  });

  cancelBtn?.addEventListener("click", () => {
    cleanup();
    onCancel?.();
  });

  // Close on backdrop click
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      cleanup();
      onCancel?.();
    }
  });

  // Close on Escape key
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      cleanup();
      onCancel?.();
      document.removeEventListener("keydown", handleEscape);
    }
  };

  document.addEventListener("keydown", handleEscape);
};
