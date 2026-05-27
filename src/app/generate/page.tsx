"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  Users,
  DollarSign,
  Calendar,
  Clock,
  BarChart3,
  Layers,
  Brain,
  BookOpen,
  Copy,
  Download,
  Presentation,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateTenderPptx } from "@/lib/generate-pptx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const engieAO = {
  reference: "ENGIE-DSI-2025-089",
  title: "Transformation Data & IA pour la gestion des actifs énergétiques renouvelables",
  client: "ENGIE SA",
  budget: "1,5M€ – 3M€ HT",
  duration: "30 mois",
  deadline: "18 avril 2025",
  sector: "Énergie et utilities",
  consultantsNeeded: "6 à 10 ETP",
  axes: [
    { title: "Collecte & Unification données", description: "Consolidation de l'ensemble des flux IoT (éolien, solaire, hydro) dans un data lake unifié sous Azure Synapse." },
    { title: "Jumeaux Numériques", description: "Modélisation des actifs physiques via jumeaux numériques temps réel pour la supervision prédictive des parcs." },
    { title: "IA & Prédiction", description: "Modèles prédictifs de production (J+1, H+4) sur actifs éoliens et solaires avec RMSE cible < 5%." },
    { title: "Maintenance prédictive", description: "Détection d'anomalies et planification des interventions de maintenance pour réduire les coûts d'exploitation." },
  ],
  requirements: [
    "Maîtrise des normes sectorielles IEC 61968, IEC 61970, IEC 61850",
    "Infrastructure Azure certifiée SecNumCloud",
    "RMSE < 5% pour les prévisions J+1",
    "SLA de disponibilité plateforme ≥ 99,9%",
    "Conformité RGPD et NIS2 sur l'ensemble des traitements",
  ],
  technologies: ["Azure Synapse", "Azure IoT Hub", "Kafka", "Kubernetes", "MLflow", "Power BI"],
  keywords: ["Data Lake", "Jumeaux Numériques", "Prédiction éolien", "Maintenance prédictive", "IoT industriel", "MLOps", "SecNumCloud", "IEC 61970"],
};

const mc2iResponse = {
  reference: "MC2I-ENGIE-2025-089",
  methodology: "EnergyDigital360",
  phases: "5 phases sur 52 semaines",
  totalBudget: "1 528 380 € HT",
  modules: [
    { id: "IA-1", title: "Prédiction éolienne & solaire", description: "Modèles LSTM + XGBoost, RMSE < 4% sur horizon J+1 et H+4. Données Météo-France & capteurs IoT SCADA.", accuracy: "RMSE < 4%" },
    { id: "IA-2", title: "Maintenance prédictive", description: "Détection d'anomalies vibratoires et thermiques sur éoliennes. Réduction du MTTR de 30%.", accuracy: "30% MTTR réduit" },
    { id: "IA-3", title: "Dispatch & trading", description: "Optimisation du dispatch temps réel entre parcs et marchés day-ahead. Gain estimé : +2,1M€/an.", accuracy: "+2,1M€/an" },
    { id: "IA-4", title: "Jumeaux numériques", description: "Réplique digitale de 47 parcs éoliens et 12 centrales solaires. Synchronisation temps réel via Azure Digital Twins.", accuracy: "47 parcs" },
  ],
  differentiators: "Seul cabinet à combiner expertise IEC 61968/61970 et MLOps industriel certifié SecNumCloud. Référence client : RTE (2023), EDF Renouvelables (2024). Framework propriétaire EnergyDigital360 déployé en 6 mois.",
  methodologyText: "Notre approche EnergyDigital360 s'articule en 5 phases : (1) Audit & cartographie des flux IoT existants, (2) Architecture cible Azure Synapse + Data Mesh, (3) Développement des modèles IA et jumeaux numériques, (4) Intégration & tests de performance (RMSE, SLA), (5) Déploiement progressif et transfert de compétences. Chaque phase est jalonnée par un comité de pilotage mensuel avec le COMEX énergie ENGIE.",
  staffingText: "Équipe pluridisciplinaire de 8 consultants mc2i : 1 Directeur (Pierre LAMBERT, 14 ans énergie), 1 Manager senior (Julie RENARD), 1 Architecte IoT/Azure (Antoine MOREAU, certifié IEC 61970), 1 Data Scientist senior (Yasmine KADI, expertise LSTM/XGBoost), 1 Expert jumeaux numériques (Théo GARNIER), 1 Ingénieure maintenance prédictive (Laure SIMON), 1 DevOps/MLOps (Nicolas DUPONT, certifié Kubernetes), 1 Consultante change (Emma FORESTIER). Continuité garantie sur 30 mois avec plan de back-up.",
};

const similarAOs = [
  { id: "AO-2025-016", title: "Plateforme Data & IA pour actifs renouvelables — Assystem/Exodigo", client: "ENGIE SA", score: 92, budget: "1,7M€", status: "lost" },
  { id: "AO-2025-005", title: "Transformation digitale des réseaux de distribution GRTgaz", client: "GRTgaz", score: 85, budget: "2,1M€", status: "won" },
  { id: "AO-2025-017", title: "Plateforme Data & IA pour actifs renouvelables — Capgemini Invent", client: "ENGIE SA", score: 75, budget: "1,8M€", status: "lost" },
];

const reusableExtracts = [
  { label: "Méthodologie EnergyDigital360", source: "MC2I-ENGIE-2025-089", preview: mc2iResponse.methodologyText },
  { label: "Staffing type — projets data énergie", source: "MC2I-ENGIE-2025-089", preview: mc2iResponse.staffingText },
  { label: "Éléments différenciants mc2i", source: "MC2I-ENGIE-2025-089", preview: mc2iResponse.differentiators },
];

const statusColors: Record<string, string> = {
  won: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  lost: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20",
};
const statusLabels: Record<string, string> = { won: "Gagné", lost: "Perdu" };

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function GeneratePage() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  const downloadMc2iPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const margin = 18;
    const contentW = 210 - margin * 2;
    let y = 18;

    doc.setFillColor(13, 27, 62);
    doc.rect(0, 0, 210, 14, "F");
    doc.setFillColor(197, 40, 28);
    doc.rect(0, 0, 6, 14, "F");
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
    doc.text("mc2i", margin, 9.5);
    doc.setFontSize(8); doc.setFont("helvetica", "normal");
    doc.text("PROPOSITION TECHNIQUE — CONFIDENTIEL", 210 - margin, 9.5, { align: "right" });
    y = 22;

    doc.setFillColor(197, 40, 28); doc.rect(margin, y, 3, 16, "F");
    doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(13, 27, 62);
    doc.text(engieAO.title, margin + 6, y + 6, { maxWidth: contentW - 6 });
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(107, 114, 128);
    doc.text(`${engieAO.client} — Réf. ${mc2iResponse.reference}`, margin + 6, y + 13);
    y += 24;

    doc.setFillColor(232, 240, 254); doc.setDrawColor(199, 210, 254);
    doc.roundedRect(margin, y, contentW, 16, 2, 2, "FD");
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(13, 27, 62);
    doc.text("Méthodologie :", margin + 3, y + 6); doc.text("Planning :", margin + 60, y + 6); doc.text("Budget :", margin + 110, y + 6);
    doc.setFont("helvetica", "normal"); doc.setTextColor(79, 70, 229);
    doc.text(mc2iResponse.methodology, margin + 3, y + 12);
    doc.text(mc2iResponse.phases, margin + 60, y + 12);
    doc.text(mc2iResponse.totalBudget, margin + 110, y + 12);
    y += 22;

    const section = (title: string) => {
      doc.setFillColor(232, 240, 254);
      doc.rect(margin, y, contentW, 8, "F");
      doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(13, 27, 62);
      doc.text(title, margin + 3, y + 5.5);
      y += 11;
    };

    const bodyText = (text: string) => {
      doc.setFontSize(9.5); doc.setFont("helvetica", "normal"); doc.setTextColor(55, 65, 81);
      const lines = doc.splitTextToSize(text, contentW);
      lines.forEach((line: string) => {
        if (y > 272) { doc.addPage(); y = 20; }
        doc.text(line, margin, y); y += 4.8;
      });
      y += 4;
    };

    section("MODULES IA PROPOSÉS");
    mc2iResponse.modules.forEach((mod) => {
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(79, 70, 229);
      if (y > 272) { doc.addPage(); y = 20; }
      doc.text(`${mod.id} — ${mod.title} (${mod.accuracy})`, margin, y); y += 5;
      bodyText(mod.description);
    });

    section("MÉTHODOLOGIE");
    bodyText(mc2iResponse.methodologyText);
    section("STAFFING");
    bodyText(mc2iResponse.staffingText);
    section("ÉLÉMENTS DIFFÉRENCIANTS");
    bodyText(mc2iResponse.differentiators);

    const pages = doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setFillColor(13, 27, 62); doc.rect(0, 285, 210, 12, "F");
      doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(156, 163, 175);
      doc.text(`mc2i TenderFlow — ${new Date().toLocaleDateString("fr-FR")}`, margin, 291);
      doc.text(`Page ${p} / ${pages}`, 210 - margin, 291, { align: "right" });
    }

    doc.save(`mc2i_${mc2iResponse.reference}_reponse.pdf`);
  };

  const handleGeneratePptx = () => {
    const syntheticTender = {
      id: engieAO.reference,
      title: engieAO.title,
      client: engieAO.client,
      sector: engieAO.sector,
      status: "pending" as const,
      consultantsNeeded: 8,
      price: 1528380,
      tags: engieAO.keywords,
      similarityScore: 88,
      submissionDate: "2025-04-18",
      responseDate: "2025-05-15",
      description: engieAO.axes.map((a) => `${a.title} : ${a.description}`).join(" "),
      aiSummary: `Transformation Data & IA pour la gestion des actifs énergétiques renouvelables ENGIE. ${engieAO.requirements.join(" ")}`,
      methodology: mc2iResponse.methodologyText,
      staffing: mc2iResponse.staffingText,
      differentiators: mc2iResponse.differentiators,
      duration: engieAO.duration,
      technologies: engieAO.technologies,
    };
    generateTenderPptx(syntheticTender);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={itemAnim}>
        <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-heading)]">
          Réponse AO
        </h1>
        <p className="text-muted-foreground mt-1">
          Suggestion de réponse mc2i — <span className="font-mono font-medium text-foreground">{mc2iResponse.reference}</span>
        </p>
      </motion.div>

      {/* Meta cards */}
      <motion.div variants={itemAnim} className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {[
          { icon: FileText, label: "Client", value: engieAO.client },
          { icon: DollarSign, label: "Budget", value: engieAO.budget },
          { icon: Clock, label: "Durée", value: engieAO.duration },
          { icon: Calendar, label: "Date limite", value: engieAO.deadline },
          { icon: Users, label: "Équipe", value: engieAO.consultantsNeeded },
          { icon: Layers, label: "Secteur", value: engieAO.sector },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} className="p-4">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-xs">{m.label}</span>
              </div>
              <p className="text-sm font-semibold leading-tight">{m.value}</p>
            </Card>
          );
        })}
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemAnim}>
        <Tabs defaultValue="pdf" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pdf" className="gap-2">
              <Download className="h-4 w-4" />
              Télécharger le PDF
            </TabsTrigger>
            <TabsTrigger value="pptx" className="gap-2">
              <Presentation className="h-4 w-4" />
              Rédiger l&apos;AO
            </TabsTrigger>
          </TabsList>

          {/* Tab 1 — PDF */}
          <TabsContent value="pdf" className="space-y-5">
            <div className="grid gap-3 grid-cols-3">
              {[
                { label: "Méthodologie", value: mc2iResponse.methodology },
                { label: "Planning", value: mc2iResponse.phases },
                { label: "Budget proposé", value: mc2iResponse.totalBudget },
              ].map((m) => (
                <Card key={m.label} className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                  <p className="text-sm font-bold">{m.value}</p>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" /> Modules IA proposés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {mc2iResponse.modules.map((mod) => (
                    <div key={mod.id} className="rounded-lg border bg-muted/20 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px] font-mono">{mod.id}</Badge>
                        <span className="text-xs font-semibold text-primary">{mod.accuracy}</span>
                      </div>
                      <p className="text-sm font-semibold">{mod.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{mod.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/3">
              <CardContent className="p-5">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Éléments différenciants mc2i</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{mc2iResponse.differentiators}</p>
              </CardContent>
            </Card>

            <Button className="gap-2" onClick={downloadMc2iPdf}>
              <Download className="h-4 w-4" />
              Télécharger la proposition en PDF
            </Button>
          </TabsContent>

          {/* Tab 2 — PPTX */}
          <TabsContent value="pptx" className="space-y-6">
            <Card className="border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <p className="font-semibold text-base">Template PowerPoint mc2i</p>
                    <p className="text-sm text-muted-foreground">7 slides : couverture, présentation, contexte AO, forces, faiblesses, organisation, budget</p>
                    <p className="text-xs text-muted-foreground mt-1">Référence : <span className="font-mono">{engieAO.reference}</span></p>
                  </div>
                  <Button className="gap-2 shrink-0" onClick={handleGeneratePptx}>
                    <Presentation className="h-4 w-4" />
                    Générer le .pptx
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-base font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Appels d&apos;offres similaires
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {similarAOs.map((ao) => (
                  <Link key={ao.id} href={`/tenders/${ao.id}`}>
                    <Card className="p-4 hover:border-primary/40 transition-colors cursor-pointer group h-full">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <Badge className={`${statusColors[ao.status]} border text-xs`} variant="outline">
                          {statusLabels[ao.status]}
                        </Badge>
                        <span className="text-xs font-bold text-primary">{ao.score}%</span>
                      </div>
                      <p className="text-sm font-semibold leading-snug mb-1 group-hover:text-primary transition-colors">{ao.title}</p>
                      <p className="text-xs text-muted-foreground mb-3">{ao.client} · {ao.budget}</p>
                      <Progress value={ao.score} className="h-1.5" />
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-base font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Extraits réutilisables
              </h3>
              <div className="space-y-3">
                {reusableExtracts.map((extract, idx) => (
                  <Card key={idx} className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-semibold">{extract.label}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{extract.source}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 shrink-0"
                        onClick={() => handleCopy(extract.preview, idx)}
                      >
                        {copiedIdx === idx ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        {copiedIdx === idx ? "Copié" : "Copier"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed bg-muted/40 rounded-lg p-3">
                      {extract.preview}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

