import type { ReactNode } from "react";
import { Outlet } from "react-router";

export default function FeedLayout({ modal }: { modal: ReactNode }) {
  return (
    <>
      <Outlet />
      {modal}
    </>
  );
}
