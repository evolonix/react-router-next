import type { ReactNode } from "react";
import { Outlet } from "react-router";

interface GalleryLayoutProps {
  modal: ReactNode;
}

export default function GalleryLayout({ modal }: GalleryLayoutProps) {
  return (
    <>
      <Outlet />
      {modal}
    </>
  );
}
