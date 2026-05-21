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
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
      />
      <div className="relative z-50 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3 dark:border-zinc-700">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            Close (Esc)
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
