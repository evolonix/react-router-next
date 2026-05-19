import type { ReactNode } from "react";
import { Outlet } from "react-router";

interface InboxFolderLayoutProps {
  preview: ReactNode;
}

export default function InboxFolderLayout({ preview }: InboxFolderLayoutProps) {
  return (
    <>
      <Outlet />
      {preview}
    </>
  );
}
