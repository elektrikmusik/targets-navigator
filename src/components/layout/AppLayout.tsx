"use client";

import React from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import {
  IconDashboard,
  IconBuilding,
  IconChartBar,
  IconSettings,
  IconHome,
  IconUsers,
  IconTarget,
  IconPresentation,
} from "@tabler/icons-react";
import { motion } from "motion/react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigationLinks = [
  {
    label: "Home",
    href: "/",
    icon: <IconHome className="h-5 w-5" />,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <IconDashboard className="h-5 w-5" />,
  },
  {
    label: "Company Overview",
    href: "/overview",
    icon: <IconBuilding className="h-5 w-5" />,
  },
  {
    label: "Framework",
    href: "/framework",
    icon: <IconPresentation className="h-5 w-5" />,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: <IconChartBar className="h-5 w-5" />,
  },
  {
    label: "Targets",
    href: "/targets",
    icon: <IconTarget className="h-5 w-5" />,
  },
  {
    label: "Team",
    href: "/team",
    icon: <IconUsers className="h-5 w-5" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <IconSettings className="h-5 w-5" />,
  },
];

const SidebarContent = () => {
  const { open, animate } = useSidebar();

  return (
    <div className="flex h-full flex-col">
      {/* Logo/Brand */}
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600">
          <IconTarget className="h-5 w-5 text-white" />
        </div>
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
            width: animate ? (open ? "auto" : "0px") : "auto",
          }}
          className="overflow-hidden text-lg font-bold text-gray-900 dark:text-white"
        >
          Targets Navigator
        </motion.span>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-1 flex-col gap-2">
        {navigationLinks.map((link) => (
          <SidebarLink
            key={link.href}
            link={link}
            className="rounded-lg px-3 py-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
          />
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
        <div className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
            <IconUsers className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </div>
          <motion.div
            animate={{
              display: animate ? (open ? "flex" : "none") : "flex",
              opacity: animate ? (open ? 1 : 0) : 1,
              width: animate ? (open ? "auto" : "0px") : "auto",
            }}
            className="flex flex-col overflow-hidden"
          >
            <span className="text-sm font-medium text-gray-900 dark:text-white">User Name</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">user@example.com</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar>
        <SidebarBody className="border-r border-gray-200 dark:border-gray-700">
          <SidebarContent />
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
};
