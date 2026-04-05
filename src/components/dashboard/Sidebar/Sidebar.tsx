"use client";

import { useState } from "react";
import SidebarHeader from "./components/SidebarHeader";
import MainNavigation from "./components/MainNavigation";
import { SidebarProps } from "./types";

export default function Sidebar({
  isCollapsed = false,
  onToggle,
}: SidebarProps) {
  return (
    <aside
      className={`
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        transition-all duration-300 ease-in-out overflow-x-hidden
        ${isCollapsed ? "w-[50px]" : "w-64"}
      `}
    >
      <SidebarHeader
        isCollapsed={isCollapsed}
        onToggle={onToggle || (() => {})}
      />
      <div className="flex-1 overflow-x-hidden p-2">
        <MainNavigation isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}
