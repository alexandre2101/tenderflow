"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Upload,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/tenders", label: "Bibliothèque", icon: FileText },
  { href: "/upload", label: "Analyser & Upload", icon: Upload },
  { href: "/generate", label: "Générateur IA", icon: Sparkles },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar"
    >
      {/* Logo */}
      <div className="flex h-16 items-center px-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {collapsed ? (
            <motion.div
              key="collapsed-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1a3a8f]"
            >
              <span className="text-sm font-black text-white leading-none">T<span className="text-[#cc2222]">2</span></span>
            </motion.div>
          ) : (
            <motion.div
              key="expanded-logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="shrink-0"
            >
              <Image
                src="/trust2process-logo.svg"
                alt="Trust2Process"
                width={160}
                height={80}
                className="h-10 w-auto object-contain"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="mx-3 w-auto" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/tenders"
              ? pathname === "/tenders" || (pathname.startsWith("/tenders/") && pathname !== "/tenders")
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          const linkContent = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              )}
              <Icon className={cn("relative z-10 h-5 w-5 shrink-0", isActive && "text-primary")} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }
          return linkContent;
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-2 px-3 pb-4">
        <Separator className="mb-3" />

        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn("w-full justify-start gap-3", collapsed && "justify-center")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
          {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </Button>

        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className={cn("w-full justify-start gap-3", collapsed && "justify-center")}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Button>

        <Separator className="my-2" />

        <div className={cn("flex items-center gap-3 rounded-lg px-3 py-2", collapsed && "justify-center px-0")}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
            <User className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Marie Dupont</p>
              <p className="truncate text-xs text-muted-foreground">Senior Consultant</p>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="mx-auto mt-2 flex"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </motion.aside>
  );
}
