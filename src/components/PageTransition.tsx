"use client";

import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Skip wrapping on /admin — animasjonen kan i sjeldne tilfeller henge på opacity:0
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
