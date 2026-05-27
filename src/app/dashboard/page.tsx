"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  XCircle,
  TrendingUp,
  DollarSign,
  FileText,
  Upload,
  Sparkles,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  tenders,
  sectors,
  monthlyEvolution,
  sectorDistribution,
  recentActivity,
} from "@/lib/data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const CHART_COLORS = [
  "oklch(0.62 0.2 264)",
  "oklch(0.62 0.19 145)",
  "oklch(0.75 0.18 80)",
  "oklch(0.65 0.2 330)",
  "oklch(0.55 0.15 200)",
  "oklch(0.7 0.15 30)",
  "oklch(0.5 0.2 290)",
  "oklch(0.6 0.15 160)",
];

const activityIcons: Record<string, React.ElementType> = {
  submit: FileText,
  won: Trophy,
  upload: Upload,
  ai: Sparkles,
  lost: AlertCircle,
};

const activityColors: Record<string, string> = {
  submit: "text-blue-500",
  won: "text-emerald-500",
  upload: "text-violet-500",
  ai: "text-amber-500",
  lost: "text-red-400",
};

const statusColors: Record<string, string> = {
  won: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  lost: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20",
  pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

const statusLabels: Record<string, string> = {
  won: "Gagné",
  lost: "Perdu",
  pending: "En cours",
};

export default function DashboardPage() {
  const [sectorFilter, setSectorFilter] = useState("all");

  const filteredTenders = useMemo(() => {
    if (sectorFilter === "all") return tenders;
    return tenders.filter((t) => t.sector === sectorFilter);
  }, [sectorFilter]);

  const dashboardStats = useMemo(() => {
    const won = filteredTenders.filter((t) => t.status === "won").length;
    const lost = filteredTenders.filter((t) => t.status === "lost").length;
    const pending = filteredTenders.filter((t) => t.status === "pending").length;
    const totalFinished = won + lost;
    const successRate = totalFinished > 0 ? Math.round((won / totalFinished) * 100) : 0;
    const estimatedRevenue = filteredTenders
      .filter((t) => t.status === "won")
      .reduce((sum, t) => sum + t.price, 0);
    return { won, lost, pending, successRate, estimatedRevenue };
  }, [filteredTenders]);

  const statCards = [
    { title: "Appels d'Offres Gagnés", value: dashboardStats.won, icon: Trophy, trend: "+23%", trendUp: true, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Appels d'Offres Perdus", value: dashboardStats.lost, icon: XCircle, trend: "-12%", trendUp: false, color: "text-red-400", bg: "bg-red-500/10" },
    { title: "Taux de Réussite", value: `${dashboardStats.successRate}%`, icon: TrendingUp, trend: "+5pts", trendUp: true, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Revenu Estimé Gagné", value: `${(dashboardStats.estimatedRevenue / 1000000).toFixed(1)}M€`, icon: DollarSign, trend: "+18%", trendUp: true, color: "text-violet-500", bg: "bg-violet-500/10" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-heading)]">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Vue d&apos;ensemble de vos appels d&apos;offres et performances</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 p-2 rounded-lg">
          <Filter className="h-4 w-4 text-primary ml-2" />
          <Select value={sectorFilter} onValueChange={(v) => setSectorFilter(v ?? "all")}>
            <SelectTrigger className="w-[200px] border-none bg-transparent focus:ring-0 shadow-none font-medium text-primary">
              <SelectValue placeholder="Filtrer par secteur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les secteurs</SelectItem>
              {sectors.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} variants={item}>
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`rounded-lg p-2.5 ${stat.bg}`}><Icon className={`h-5 w-5 ${stat.color}`} /></div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendUp ? "text-emerald-500" : "text-red-400"}`}>
                      {stat.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {stat.trend}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <motion.div variants={item} className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Évolution Gains / Pertes</CardTitle>
              <CardDescription>12 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyEvolution}>
                  <defs>
                    <linearGradient id="wonGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.62 0.19 145)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="oklch(0.62 0.19 145)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="lostGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.65 0.2 25)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="oklch(0.65 0.2 25)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 10%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="oklch(0.5 0 0 / 30%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.5 0 0 / 30%)" />
                  <Tooltip contentStyle={{ backgroundColor: "oklch(0.17 0.012 264)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: "8px", color: "oklch(0.93 0 0)" }} />
                  <Area type="monotone" dataKey="won" stroke="oklch(0.62 0.19 145)" fill="url(#wonGrad)" strokeWidth={2} name="Gagnés" />
                  <Area type="monotone" dataKey="lost" stroke="oklch(0.65 0.2 25)" fill="url(#lostGrad)" strokeWidth={2} name="Perdus" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Répartition par Secteur</CardTitle>
              <CardDescription>Nombre d&apos;appels d&apos;offres</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={sectorDistribution.filter((s) => s.value > 0)} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                    {sectorDistribution.filter((s) => s.value > 0).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "oklch(0.17 0.012 264)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: "8px", color: "oklch(0.93 0 0)" }} />
                  <Legend verticalAlign="bottom" height={36} formatter={(value: string) => (
                    <span style={{ color: "oklch(0.65 0.01 264)", fontSize: "11px" }}>{value}</span>
                  )} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Activité Récente</CardTitle>
              <CardDescription>Dernières actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activityIcons[activity.type];
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`mt-0.5 ${activityColors[activity.type]}`}><Icon className="h-4 w-4" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className="text-xs">{activity.tender}</Badge>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">Appels d&apos;Offres {sectorFilter !== "all" ? `- ${sectorFilter}` : ""}</CardTitle>
              <CardDescription>Derniers dossiers liés au secteur actif</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Similarité</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenders.slice(0, 5).map((tender) => (
                    <TableRow key={tender.id}>
                      <TableCell className="font-medium">
                        <Link href={`/tenders/${tender.id}`} className="hover:underline">
                          <p className="truncate max-w-[200px]">{tender.title}</p>
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm">{tender.client}</TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[tender.status]} border text-xs`} variant="outline">
                          {statusLabels[tender.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={tender.similarityScore} className="h-2 w-12" />
                          <span className="text-xs text-muted-foreground">{tender.similarityScore}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredTenders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                        Aucun appel d&apos;offres trouvé pour ce secteur.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
