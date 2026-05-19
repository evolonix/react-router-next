import type { ReactNode } from "react";
import { Outlet } from "react-router";

interface OverlayHostLayoutProps {
  overlay: ReactNode;
}

export default function OverlayHostLayout({ overlay }: OverlayHostLayoutProps) {
  return (
    <>
      <Outlet />
      {overlay}
    </>
  );
}
