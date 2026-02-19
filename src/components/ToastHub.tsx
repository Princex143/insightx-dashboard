import { useUiStore } from "../store/uiStore";

export function ToastHub() {
  const toasts = useUiStore((s) => s.toasts);
  const dismiss = useUiStore((s) => s.dismissToast);

  return (
    <div className="toast-hub" aria-live="polite">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          className={`toast ${toast.kind}`}
          onClick={() => dismiss(toast.id)}
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}
