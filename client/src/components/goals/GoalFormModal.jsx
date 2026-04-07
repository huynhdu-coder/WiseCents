import { useEffect } from "react";
import CreateGoalForm from "./CreateGoalForm";

export default function GoalFormModal({ open, onClose, onCreated }) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg rounded-xl2 border border-app-border bg-app-surface p-5 shadow-card sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-app-text sm:text-2xl">
              Create Goal
            </h2>
            <p className="mt-1 text-sm text-app-muted">
              Add a savings goal and start tracking your progress.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-app-border bg-app-surface px-3 py-1.5 text-sm font-semibold text-app-text transition hover:bg-app-soft"
          >
            Close
          </button>
        </div>

        <CreateGoalForm
          onCreated={() => {
            onCreated?.();
            onClose();
          }}
        />
      </div>
    </div>
  );
}