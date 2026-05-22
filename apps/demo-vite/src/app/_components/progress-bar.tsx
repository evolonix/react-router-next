import { useIsRoutePending } from "@evolonix/react-router-next";
import { useEffect, useRef, useState } from "react";

export function ProgressBar() {
  const pending = useIsRoutePending();
  const [progress, setProgress] = useState(0);
  const wasPendingRef = useRef(false);

  useEffect(() => {
    if (pending) {
      wasPendingRef.current = true;
      setProgress(8);
      const id = setInterval(() => {
        setProgress((p) => (p >= 90 ? p : p + Math.max(0.5, (90 - p) * 0.08)));
      }, 200);
      return () => clearInterval(id);
    }

    if (!wasPendingRef.current) return;
    wasPendingRef.current = false;
    setProgress(100);
    const id = setTimeout(() => setProgress(0), 300);
    return () => clearTimeout(id);
  }, [pending]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden"
    >
      <div
        className="h-full origin-left bg-linear-to-r from-blue-500 to-sky-400 transition-[transform,opacity] duration-300 ease-out"
        style={{
          transform: `scaleX(${progress / 100})`,
          opacity: progress === 0 || progress >= 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
