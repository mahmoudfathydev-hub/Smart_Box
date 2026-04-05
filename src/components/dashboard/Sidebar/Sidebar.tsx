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
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-16" : "w-64"}
      `}
    >
      {/* Header */}
      <SidebarHeader
        isCollapsed={isCollapsed}
        onToggle={onToggle || (() => {})}
      />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <MainNavigation />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {isCollapsed ? "© SB" : "© SmartBox Dashboard"}
        </div>
      </div>
    </aside>
  );
}
