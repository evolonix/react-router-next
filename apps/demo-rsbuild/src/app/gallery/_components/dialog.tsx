import { useEffect } from "react";
import { useNavigate } from "react-router";

export interface DialogProps {
  title: string;
  children: React.ReactNode;
}

export function Dialog({ title, children }: DialogProps) {
  const navigate = useNavigate();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") navigate(-1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={() => navigate(-1)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <div className="relative z-50 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            Close (Esc)
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
