import { useEffect, useId, useRef } from "react";
import { useNavigate } from "react-router";

export interface DialogProps {
  title: string;
  closeTo: string;
  children: React.ReactNode;
}

export function Dialog({ title, closeTo, children }: DialogProps) {
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    el.showModal();
    const onCancel = (event: Event) => {
      event.preventDefault();
      navigate(closeTo, { preventScrollReset: true });
    };
    const onClick = (event: MouseEvent) => {
      if (event.target === el) navigate(closeTo, { preventScrollReset: true });
    };
    el.addEventListener("cancel", onCancel);
    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("cancel", onCancel);
      el.removeEventListener("click", onClick);
      if (el.open) el.close();
    };
  }, [navigate, closeTo]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="m-auto max-h-[85vh] w-full max-w-lg overflow-hidden rounded-xl bg-white p-0 shadow-2xl backdrop:bg-zinc-900/60 backdrop:backdrop-blur-sm dark:bg-zinc-800"
    >
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3 dark:border-zinc-700">
        <h2
          id={titleId}
          className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
        >
          {title}
        </h2>
        <button
          type="button"
          autoFocus
          onClick={() => navigate(closeTo, { preventScrollReset: true })}
          className="rounded-md px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
        >
          Close (Esc)
        </button>
      </div>
      <div className="p-5">{children}</div>
    </dialog>
  );
}
