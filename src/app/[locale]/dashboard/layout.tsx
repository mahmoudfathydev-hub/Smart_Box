"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setIsCollapsed(true);
        localStorage.setItem("sidebarCollapsed", "true");
      } else {

        const savedState = localStorage.getItem("sidebarCollapsed");
        if (savedState !== null) {
          setIsCollapsed(savedState === "true");
        }
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (mounted && !isMobile) {
      localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
    }
  }, [isCollapsed, isMobile, mounted]);
  if (!mounted) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <div className="w-[50px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700"></div>
        <div className="flex-1"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => { if (!isMobile) { setIsCollapsed(!isCollapsed); } }} />
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
