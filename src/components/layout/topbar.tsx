"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tenders": "Bibliothèque AO",
  "/upload": "Analyser & Upload",
  "/generate": "Réponse AO",
};

export function Topbar() {
  const pathname = usePathname();

  const isDetailPage = pathname.startsWith("/tenders/") && pathname !== "/tenders";
  const currentPage = isDetailPage
    ? "Détail de l'Appel d'Offres"
    : breadcrumbMap[pathname] || "Page";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-6 gap-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm min-w-0">
        <span className="text-muted-foreground shrink-0">Trust2Process</span>
        <span className="text-muted-foreground">/</span>
        {isDetailPage && (
          <>
            <span className="text-muted-foreground shrink-0">Bibliothèque AO</span>
            <span className="text-muted-foreground">/</span>
          </>
        )}
        <span className="font-medium truncate">{currentPage}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Rechercher...</span>
          <kbd className="pointer-events-none hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
            ⌘K
          </kbd>
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center">
            3
          </Badge>
        </Button>
      </div>
    </header>
  );
}
