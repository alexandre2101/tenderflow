import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/app-shell";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-heading", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trust2Process — Gestion Intelligente des Appels d'Offres",
  description:
    "Plateforme SaaS premium pour la gestion, l'analyse et la réponse aux appels d'offres publics. Propulsé par l'IA.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ThemeProvider>
          <TooltipProvider>
            <AppShell>{children}</AppShell>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
