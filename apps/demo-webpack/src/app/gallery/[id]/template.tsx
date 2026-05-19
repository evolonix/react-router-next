import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

export default function GalleryItemTemplate() {
  const { pathname } = useLocation();
  useEffect(() => {
    console.log(`[template.tsx] mounted for ${pathname}`);
    return () => console.log(`[template.tsx] unmounted from ${pathname}`);
  }, [pathname]);
  return <Outlet />;
}
