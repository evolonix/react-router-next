import { useEffect, useId, useRef } from "react";
import { useNavigate } from "react-router";

import { useBodyScrollLock } from "../../_lib/use-body-scroll-lock";

export interface DialogProps {
  title: string;
  closeTo: string;
  /**
   * When true (default), show a control that reloads the current URL. Because
   * this dialog is rendered by an intercepting route, a fresh load bypasses the
   * interceptor and renders the full-page route instead — handy on mobile /
   * installed PWAs where there is no browser reload button to escape the modal.
   */
  fullScreen?: boolean;
  children: React.ReactNode;
}

export function Dialog({
  title,
  closeTo,
  fullScreen = true,
  children,
}: DialogProps) {
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // Native `showModal()` does not reliably stop the page behind from scrolling,
  // so lock the body for as long as this route-driven dialog is mounted.
  useBodyScrollLock(true);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    // Remember the element that opened the dialog (the triggering grid/list
    // link) so focus can be restored to it on close — WCAG 2.4.3 Focus Order.
    // This modal is route-driven and unmounts on navigate, so the browser's
    // native dialog focus-restoration can't be relied on.
    openerRef.current = document.activeElement as HTMLElement | null;
    el.showModal();
    const onCancel = (event: Event) => {
      event.preventDefault();
      navigate(closeTo, { preventScrollReset: true });
    };
    const onClick = (event: MouseEvent) => {
      // The dialog's own padding reports the same target as the backdrop, so a
      // click on the card's edges would otherwise close it. Close only when the
      // click lands outside the dialog box, on the real backdrop.
      if (event.target !== el) return;
      const r = el.getBoundingClientRect();
      const outside =
        event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom;
      if (outside) navigate(closeTo, { preventScrollReset: true });
    };
    el.addEventListener("cancel", onCancel);
    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("cancel", onCancel);
      el.removeEventListener("click", onClick);
      if (el.open) el.close();
      // Restore focus to the trigger for a11y, but `preventScroll` so closing
      // the dialog never scrolls the page back to it — the close navigation
      // already keeps the scroll position via `preventScrollReset`.
      const opener = openerRef.current;
      if (opener && document.contains(opener)) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [navigate, closeTo]);

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby={titleId}
      className="m-auto w-full overflow-auto bg-white p-0 backdrop:bg-zinc-950/70 backdrop:backdrop-blur-sm max-sm:h-dvh max-sm:max-h-dvh max-sm:max-w-none max-sm:rounded-none sm:max-h-[85vh] sm:max-w-lg sm:rounded-2xl sm:shadow-2xl sm:ring-1 sm:ring-zinc-200 dark:bg-zinc-950 sm:dark:bg-zinc-900 sm:dark:ring-zinc-800"
    >
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(1.25rem,env(safe-area-inset-right))] pb-3 pl-[max(1.25rem,env(safe-area-inset-left))] dark:border-zinc-700">
        <h2
          id={titleId}
          className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
        >
          {title}
        </h2>
        <div className="flex items-center gap-1">
          {fullScreen && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              aria-label="Open full screen"
              title="Open full screen"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
          )}
          <button
            type="button"
            autoFocus
            onClick={() => navigate(closeTo, { preventScrollReset: true })}
            aria-label="Close dialog"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="pt-5 pr-[max(1.25rem,env(safe-area-inset-right))] pb-[max(1.25rem,env(safe-area-inset-bottom))] pl-[max(1.25rem,env(safe-area-inset-left))]">
        {children}
      </div>
    </dialog>
  );
}
