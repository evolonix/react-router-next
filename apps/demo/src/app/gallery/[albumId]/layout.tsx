import type { ReactNode } from "react";
import { Outlet } from "react-router";

export default function AlbumLayout({ modal }: { modal: ReactNode }) {
  return (
    <>
      <Outlet />
      {modal}
    </>
  );
}
