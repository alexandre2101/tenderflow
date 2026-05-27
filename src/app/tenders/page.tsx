"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { tenders, sectors, type TenderStatus } from "@/lib/data";

const statusColors: Record<TenderStatus, string> = {
  won: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  lost: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20",
  pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

const statusLabels: Record<TenderStatus, string> = {
  won: "Gagné",
  lost: "Perdu",
  pending: "En cours",
};

const budgetLabels: Record<string, string> = {
  "<1M": "< 1M€",
  "1M-5M": "1M€ – 5M€",
  ">5M": "> 5M€",
};

const allTechs = Array.from(new Set(tenders.flatMap((t) => t.technologies || []))).sort();
const allDurations = Array.from(new Set(tenders.map((t) => t.duration || "N/A"))).sort();

export default function TendersPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [techFilter, setTechFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [consultantFilter, setConsultantFilter] = useState("all");
  const [sortField, setSortField] = useState<string>("similarityScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let result = [...tenders];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.client.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    if (sectorFilter !== "all") result = result.filter((t) => t.sector === sectorFilter);
    if (statusFilter !== "all") result = result.filter((t) => t.status === statusFilter);
    if (durationFilter !== "all") result = result.filter((t) => t.duration === durationFilter);
    if (techFilter !== "all") result = result.filter((t) => t.technologies?.includes(techFilter));
    if (budgetFilter !== "all") {
      result = result.filter((t) => {
        if (budgetFilter === "<1M") return t.price < 1000000;
        if (budgetFilter === "1M-5M") return t.price >= 1000000 && t.price <= 5000000;
        if (budgetFilter === ">5M") return t.price > 5000000;
        return true;
      });
    }
    if (consultantFilter !== "all") {
      result = result.filter((t) => {
        if (consultantFilter === "<5") return t.consultantsNeeded < 5;
        if (consultantFilter === "5-10") return t.consultantsNeeded >= 5 && t.consultantsNeeded <= 10;
        if (consultantFilter === ">10") return t.consultantsNeeded > 10;
        return true;
      });
    }
    result.sort((a, b) => {
      const aVal = a[sortField as keyof typeof a];
      const bVal = b[sortField as keyof typeof b];
      if (typeof aVal === "number" && typeof bVal === "number")
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return result;
  }, [search, sectorFilter, statusFilter, durationFilter, techFilter, budgetFilter, consultantFilter, sortField, sortDir]);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const formatPrice = (price: number) =>
    price >= 1000000 ? `${(price / 1000000).toFixed(1)}M€` : `${(price / 1000).toFixed(0)}K€`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-heading)]">
          Bibliothèque
        </h1>
        <p className="text-muted-foreground mt-1">
          {tenders.length} appels d&apos;offres · {filtered.length} affichés
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4">
          {/* Primary filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par titre, client ou tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Secteurs */}
            <Select value={sectorFilter} onValueChange={(v) => setSectorFilter(v ?? "all")}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm">
                  {sectorFilter === "all" ? "Secteurs" : sectorFilter}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les secteurs</SelectItem>
                {sectors.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>

            {/* Statut */}
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
              <SelectTrigger className="w-[140px]">
                <span className="truncate text-sm">
                  {statusFilter === "all" ? "Statut" : statusLabels[statusFilter as TenderStatus]}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="won">Gagné</SelectItem>
                <SelectItem value="lost">Perdu</SelectItem>
                <SelectItem value="pending">En cours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced filters */}
          <div className="flex flex-wrap items-center gap-3 border-t border-border/50 pt-3">
            <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Filter className="h-3 w-3" /> Filtres avancés :
            </span>

            {/* Technologie */}
            <Select value={techFilter} onValueChange={(v) => setTechFilter(v ?? "all")}>
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <span className="truncate">
                  {techFilter === "all" ? "Technologie" : techFilter}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes technologies</SelectItem>
                {allTechs.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
              </SelectContent>
            </Select>

            {/* Durée */}
            <Select value={durationFilter} onValueChange={(v) => setDurationFilter(v ?? "all")}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <span className="truncate">
                  {durationFilter === "all" ? "Durée" : durationFilter}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes durées</SelectItem>
                {allDurations.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
              </SelectContent>
            </Select>

            {/* Budget */}
            <Select value={budgetFilter} onValueChange={(v) => setBudgetFilter(v ?? "all")}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <span className="truncate">
                  {budgetFilter === "all" ? "Budget" : budgetLabels[budgetFilter]}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous budgets</SelectItem>
                <SelectItem value="<1M">Moins de 1M€</SelectItem>
                <SelectItem value="1M-5M">1M€ à 5M€</SelectItem>
                <SelectItem value=">5M">Plus de 5M€</SelectItem>
              </SelectContent>
            </Select>

            {/* Équipe */}
            <Select value={consultantFilter} onValueChange={(v) => setConsultantFilter(v ?? "all")}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <span className="truncate">
                  {consultantFilter === "all" ? "Équipe" : consultantFilter === "<5" ? "< 5 cons." : consultantFilter === "5-10" ? "5–10 cons." : "> 10 cons."}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes tailles</SelectItem>
                <SelectItem value="<5">Moins de 5</SelectItem>
                <SelectItem value="5-10">De 5 à 10</SelectItem>
                <SelectItem value=">10">Plus de 10</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[260px]">
                <Button variant="ghost" size="sm" onClick={() => toggleSort("title")} className="gap-1 -ml-3">
                  Titre <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Secteur</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => toggleSort("status")} className="gap-1 -ml-3">
                  Statut <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-center">Équipe & Durée</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => toggleSort("price")} className="gap-1 -ml-3">
                  Prix <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => toggleSort("similarityScore")} className="gap-1 -ml-3">
                  Similarité <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((tender) => (
              <TableRow
                key={tender.id}
                className="cursor-pointer transition-colors hover:bg-accent/50"
                onClick={() => router.push(`/tenders/${tender.id}`)}
              >
                <TableCell className="font-medium">
                  <div>
                    <p className="truncate max-w-[240px]">{tender.title}</p>
                    <p className="text-xs text-muted-foreground">{tender.id}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{tender.client}</TableCell>
                <TableCell><Badge variant="outline" className="text-xs whitespace-nowrap">{tender.sector}</Badge></TableCell>
                <TableCell>
                  <Badge className={`${statusColors[tender.status]} border text-xs`} variant="outline">
                    {statusLabels[tender.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <span>{tender.consultantsNeeded} cons.</span>
                    <span className="text-xs text-muted-foreground">{tender.duration}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{formatPrice(tender.price)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {tender.technologies?.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                    ))}
                    {(tender.technologies?.length || 0) > 2 && (
                      <Badge variant="secondary" className="text-[10px]">+{tender.technologies!.length - 2}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={tender.similarityScore} className="h-2 w-16" />
                    <span className="text-xs text-muted-foreground">{tender.similarityScore}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  Aucun appel d&apos;offres ne correspond à ces critères.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </motion.div>
  );
}
