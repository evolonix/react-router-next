import { useIsRoutePending } from "@evolonix/react-router-next";

export function ProgressBar() {
  const pending = useIsRoutePending();
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden"
    >
      <div
        className={`h-full origin-left bg-accent-routing transition-transform duration-300 ease-out ${
          pending ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </div>
  );
}
