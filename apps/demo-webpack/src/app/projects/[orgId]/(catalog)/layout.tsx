import type { ReactNode } from "react";
import { Outlet } from "react-router";

interface CatalogLayoutProps {
  modal: ReactNode;
}

export default function CatalogLayout({ modal }: CatalogLayoutProps) {
  return (
    <>
      <Outlet />
      {modal}
    </>
  );
}
