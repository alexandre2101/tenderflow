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

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemAnim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

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
    const W = 210, H = 297, M = 18, CW = 174;
    let y = 0;

    // color helpers
    const navy = () => doc.setTextColor(13, 27, 62);
    const red = () => doc.setTextColor(197, 40, 28);
    const grayC = () => doc.setTextColor(107, 114, 128);
    const bodyC = () => doc.setTextColor(55, 65, 81);
    const white = () => doc.setTextColor(255, 255, 255);
    const lightText = () => doc.setTextColor(180, 200, 230);

    const footer = (pg: number) => {
      doc.setFillColor(13, 27, 62);
      doc.rect(0, H - 11, W, 11, "F");
      doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); lightText();
      doc.text("mc2i — Réf. MC2I-ENGIE-2025-089 — Confidentiel", M, H - 4);
      doc.text(`Page ${pg} / 5 | MC2I-ENGIE-2025-089`, W - M, H - 4, { align: "right" });
    };

    const sectionTitle = (num: string, title: string) => {
      doc.setFontSize(11); doc.setFont("helvetica", "bold"); navy();
      doc.text(`${num}. ${title}`, M, y);
      doc.setDrawColor(197, 40, 28); doc.setLineWidth(0.5);
      doc.line(M, y + 2.5, W - M, y + 2.5);
      y += 10;
    };

    const para = (text: string) => {
      doc.setFontSize(9); doc.setFont("helvetica", "normal"); bodyC();
      const lines = doc.splitTextToSize(text, CW);
      lines.forEach((line: string) => { doc.text(line, M, y); y += 5; });
      y += 3;
    };

    const tableHeader = (cols: { label: string; x: number }[], maxW = CW) => {
      doc.setFillColor(41, 65, 122);
      doc.rect(M, y, maxW, 8, "F");
      doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); white();
      cols.forEach(c => doc.text(c.label, M + c.x, y + 5.5));
      y += 8;
    };

    const tableRow = (cells: { text: string; x: number; maxW?: number }[], rowIdx: number, maxW = CW, bold = false) => {
      doc.setFillColor(rowIdx % 2 === 0 ? 247 : 255, rowIdx % 2 === 0 ? 249 : 255, 255);
      doc.rect(M, y, maxW, 8, "F");
      doc.setDrawColor(215, 225, 240); doc.setLineWidth(0.1);
      doc.line(M, y + 8, M + maxW, y + 8);
      doc.setFontSize(8.5); doc.setFont("helvetica", bold ? "bold" : "normal"); bodyC();
      cells.forEach(c => doc.text(c.text, M + c.x, y + 5.5, { maxWidth: c.maxW ?? 60 }));
      y += 8;
    };

    // ─────────────────────────────────────
    // PAGE 1 — COUVERTURE
    // ─────────────────────────────────────
    doc.setFillColor(13, 27, 62);
    doc.rect(0, 0, W, 22, "F");
    doc.setFontSize(15); doc.setFont("helvetica", "bold"); white();
    doc.text("mc2i | Conseil en Transformation Numérique", M, 10);
    doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); lightText();
    doc.text("Réf. : MC2I-ENGIE-2025-089 — Confidentiel", M, 18);
    y = 34;

    doc.setFontSize(30); doc.setFont("helvetica", "bold"); red();
    doc.text("mc2i", M, y + 7);
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); grayC();
    doc.text("Conseil en Transformation Numérique Spécialiste Énergie & Utilities", M + 28, y + 7);
    y += 14;

    doc.setDrawColor(197, 40, 28); doc.setLineWidth(0.6);
    doc.line(M, y, W - M, y);
    y += 9;

    doc.setFontSize(9); doc.setFont("helvetica", "normal"); bodyC();
    doc.text("À l'attention d'ENGIE SA — Direction Innovation Digitale & SI", M, y); y += 5.5;
    doc.text("Appel d'offres réf. ENGIE-DSI-2025-089", M, y); y += 14;

    doc.setFillColor(232, 240, 254);
    doc.rect(M, y, CW, 38, "F");
    doc.setDrawColor(197, 40, 28); doc.setLineWidth(0.8);
    doc.line(M, y, W - M, y); doc.line(M, y + 38, W - M, y + 38);
    doc.setFontSize(18); doc.setFont("helvetica", "bold"); navy();
    doc.text("PROPOSITION COMMERCIALE", W / 2, y + 13, { align: "center" });
    doc.setFontSize(12);
    doc.text("Accélération de la Transformation Digitale des Énergies", W / 2, y + 24, { align: "center" });
    doc.text("Renouvelables ENGIE", W / 2, y + 32, { align: "center" });
    y += 48;

    const infoRows = [
      ["Référence interne", "MC2I-ENGIE-2025-089"],
      ["Date de remise", "18 avril 2025"],
      ["Validité de l'offre", "120 jours à compter de la date de remise"],
      ["Interlocuteur principal", "Pierre LAMBERT, Directeur Associé — Pôle Énergie & Utilities"],
      ["Contact", "p.lambert@mc2i.fr | +33 1 47 67 01 40"],
      ["Version", "V1.0 — Document confidentiel"],
    ];
    const cs = 60;
    infoRows.forEach((row, i) => {
      doc.setFillColor(i % 2 === 0 ? 245 : 252, i % 2 === 0 ? 247 : 252, 255);
      doc.rect(M, y, CW, 10, "F");
      doc.setFillColor(232, 240, 254); doc.rect(M, y, cs, 10, "F");
      doc.setDrawColor(210, 220, 240); doc.setLineWidth(0.15);
      doc.rect(M, y, CW, 10, "S");
      doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); navy();
      doc.text(row[0], M + 3, y + 6.5);
      doc.setFont("helvetica", "normal"); bodyC();
      doc.text(row[1], M + cs + 3, y + 6.5, { maxWidth: CW - cs - 4 });
      y += 10;
    });

    footer(1);

    // ─────────────────────────────────────
    // PAGE 2 — PRÉSENTATION + ENJEUX + MÉTHODOLOGIE
    // ─────────────────────────────────────
    doc.addPage(); y = M;

    sectionTitle("1", "PRÉSENTATION DE MC2I");
    para("mc2i est un cabinet de conseil indépendant en transformation numérique fondé en 1989. Notre pôle Énergie & Utilities regroupe 75 consultants spécialisés ayant travaillé pour EDF, TotalEnergies, RTE, Enedis, Vattenfall et Iberdrola. Nous maîtrisons les spécificités du secteur de l'énergie : standards IEC, contraintes réglementaires (NIS2, RGPD), systèmes SCADA, marchés de l'électricité et enjeux de la transition énergétique.");
    para("mc2i s'est engagé dans sa propre transition vers la neutralité carbone : bilan carbone annuel certifié, compensation via reforestation, politique de télétravail et recours exclusif à des hébergements cloud alimentés par des énergies renouvelables (Azure France Central — 100% renouvelable).");

    sectionTitle("2", "COMPRÉHENSION DES ENJEUX ENGIE");
    tableHeader([{ label: "Enjeu identifié", x: 3 }, { label: "Notre lecture", x: 76 }]);
    [
      ["Hétérogénéité des systèmes SCADA", "Chaque parc dispose de son propre système — absence de vision unifiée du parc"],
      ["Prédiction de production incertaine", "La variabilité météo rend le trading d'électricité sous-optimal sans IA avancée"],
      ["Coûts de maintenance élevés", "20-30% des coûts évitables avec une maintenance prédictive bien calibrée"],
      ["Absence de jumeaux numériques", "Optimisation empirique des paramètres — pas de simulation avant intervention"],
      ["Intégration du Grand Paris Green", "Nouveaux actifs solaires urbains à intégrer dans l'écosystème existant"],
    ].forEach((row, i) => {
      doc.setFillColor(i % 2 === 0 ? 247 : 255, i % 2 === 0 ? 249 : 255, 255);
      doc.rect(M, y, CW, 8, "F");
      doc.setDrawColor(215, 225, 240); doc.setLineWidth(0.1);
      doc.line(M, y + 8, W - M, y + 8); doc.line(M + 73, y, M + 73, y + 8);
      doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); bodyC();
      doc.text(row[0], M + 3, y + 5.5, { maxWidth: 68 });
      doc.text(row[1], M + 76, y + 5.5, { maxWidth: CW - 79 });
      y += 8;
    });
    y += 6;

    sectionTitle("3", "APPROCHE MÉTHODOLOGIQUE — EnergyDigital360");
    para("mc2i propose EnergyDigital360, notre méthodologie propriétaire développée sur 20 projets dans le secteur de l'énergie et des utilities. Elle s'appuie sur une architecture de référence IoT-Data-IA spécifiquement adaptée aux contraintes opérationnelles des actifs de production renouvelable.");

    tableHeader([
      { label: "Phase", x: 3 },
      { label: "Intitulé", x: 22 },
      { label: "Durée", x: 98 },
      { label: "Livrables clés", x: 125 },
    ]);
    [
      ["Phase 1", "Audit & Cartographie", "Sem. 1–8", "Inventaire actifs, flux SCADA, gaps data"],
      ["Phase 2", "Architecture IoT & Data", "Sem. 9–14", "Schéma IoT, Data Lake EnR, specs API"],
      ["Phase 3", "Jumeaux Numériques pilote", "Sem. 15–24", "3 parcs éoliens modélisés et validés"],
      ["Phase 4", "Modèles IA production", "Sem. 20–32", "Prédiction J+1 à J+90, maint. prédictive"],
      ["Phase 5", "Déploiement & Transfert", "Sem. 40–52", "Go-live, formation, documentation"],
    ].forEach((row, i) => {
      doc.setFillColor(i % 2 === 0 ? 247 : 255, i % 2 === 0 ? 249 : 255, 255);
      doc.rect(M, y, CW, 8, "F");
      doc.setDrawColor(215, 225, 240); doc.setLineWidth(0.1);
      doc.line(M, y + 8, W - M, y + 8);
      doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); bodyC();
      doc.text(row[0], M + 3, y + 5.5);
      doc.text(row[1], M + 22, y + 5.5, { maxWidth: 72 });
      doc.text(row[2], M + 98, y + 5.5);
      doc.text(row[3], M + 125, y + 5.5, { maxWidth: CW - 128 });
      y += 8;
    });

    footer(2);

    // ─────────────────────────────────────
    // PAGE 3 — MODULES IA + ÉQUIPE
    // ─────────────────────────────────────
    doc.addPage(); y = M;

    sectionTitle("4", "MODULES IA PROPOSÉS POUR ENGIE");
    [
      { title: "Module IA-1 : Prédiction de production éolienne & solaire", desc: "Modèles hybrides combinant réseaux de neurones récurrents (LSTM), gradient boosting (XGBoost) et données NWP haute résolution. Entraînement sur 10 ans de données historiques de production. RMSE cible < 4% sur horizon J+1, < 8% sur horizon J+7. Ré-entraînement automatique mensuel." },
      { title: "Module IA-2 : Maintenance prédictive éoliennes", desc: "Analyse des signaux vibratoires, thermiques et électriques des composants critiques (multiplicateur, générateur, roulements, pales). Modèles de détection d'anomalies (Isolation Forest, Autoencoder LSTM). Réduction estimée des pannes non planifiées : 25 à 40%. Intégration CMMS existant (SAP PM)." },
      { title: "Module IA-3 : Optimisation du dispatch et trading", desc: "Algorithme d'optimisation de la stratégie d'offre sur les marchés day-ahead et intraday intégrant les prédictions de production, les prix de marché anticipés et les contraintes de réseau. Simulation par apprentissage par renforcement. Gain estimé sur le revenue de trading : +3 à 5%." },
      { title: "Module IA-4 : Jumeaux numériques des parcs éoliens", desc: "Modélisation physique haute-fidélité des éoliennes (aérodynamique, thermique, mécanique) couplée à des modèles de machine learning pour la calibration continue. Simulation en temps réel des conditions d'exploitation pour optimiser le pitch et l'yaw des turbines. Gain de production estimé : +2 à 4%." },
    ].forEach((mod) => {
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); navy();
      doc.text(mod.title, M, y); y += 5;
      para(mod.desc); y += 1;
    });

    sectionTitle("5", "COMPOSITION DE L'ÉQUIPE PROJET");
    const tc = [36, 46, 16, 62, 14];
    tableHeader([
      { label: "Consultant", x: 3 },
      { label: "Rôle", x: 39 },
      { label: "Exp.", x: 87 },
      { label: "Compétences clés", x: 105 },
      { label: "Taux", x: 162 },
    ]);
    [
      ["Pierre LAMBERT", "Directeur de mission", "14 ans", "Énergie, SI, EDF, RTE, gestion de programme", "100%"],
      ["Julie RENARD", "Chef de projet senior", "10 ans", "PMP, ITIL, Agile, énergie renouvelable", "100%"],
      ["Antoine MOREAU", "Architecte IoT & Data", "8 ans", "Azure IoT, Kafka, IEC 61968, SCADA", "100%"],
      ["Yasmine KADI", "Data Scientist Énergie", "7 ans", "PhD ML, time series, NWP, PyTorch", "80%"],
      ["Théo GARNIER", "Expert Jumeaux Numériques", "7 ans", "Modelica, MATLAB, simulation CFD", "80%"],
      ["Laure SIMON", "Experte Maintenance Préd.", "6 ans", "Condition monitoring, CMMS, SAP PM, FMEA", "80%"],
      ["Nicolas DUPONT", "DevOps / Cloud", "5 ans", "Azure, Kubernetes, CI/CD, Terraform", "80%"],
      ["Emma FORESTIER", "Consultant Change Mgmt", "6 ans", "Formation, documentation technique", "60%"],
    ].forEach((row, ri) => {
      doc.setFillColor(ri % 2 === 0 ? 247 : 255, ri % 2 === 0 ? 249 : 255, 255);
      doc.rect(M, y, CW, 8, "F");
      doc.setDrawColor(215, 225, 240); doc.setLineWidth(0.1);
      doc.line(M, y + 8, W - M, y + 8);
      doc.setFontSize(8); doc.setFont("helvetica", "normal"); bodyC();
      let cx = M + 3;
      row.forEach((cell, i) => {
        doc.text(cell, cx, y + 5.5, { maxWidth: tc[i] - 3 });
        cx += tc[i];
      });
      y += 8;
    });

    footer(3);

    // ─────────────────────────────────────
    // PAGE 4 — RÉFÉRENCES + OFFRE + CONCLUSION
    // ─────────────────────────────────────
    doc.addPage(); y = M;

    sectionTitle("6", "RÉFÉRENCES SECTORIELLES");
    [
      { title: "EDF Renouvelables — Plateforme de prédiction de production (2022–2024)", desc: "Conception et déploiement d'une plateforme de prédiction de production pour 120 parcs éoliens et 45 centrales solaires en France. Modèles ML intégrant données météo ECMWF. RMSE J+1 : 3,8%. Budget : 5,8M€ — 20 consultants mc2i" },
      { title: "RTE — Optimisation du réseau de transport (2021–2023)", desc: "Développement d'algorithmes d'optimisation du dispatch pour le gestionnaire du réseau de transport français. Réduction des coûts de congestion de 12% sur les corridors prioritaires. Budget : 4,2M€ — 16 consultants mc2i" },
      { title: "Vattenfall — Maintenance prédictive parc offshore (2023–2024)", desc: "Déploiement d'une solution de maintenance prédictive pour 80 éoliennes offshore en mer du Nord. Réduction des arrêts non planifiés de 32%. ROI atteint en 14 mois. Budget : 3,9M€ — 14 consultants mc2i" },
      { title: "TotalEnergies — Jumeaux numériques solaires (2024)", desc: "Modélisation de 15 centrales solaires en France et en Espagne. Optimisation du tracking des panneaux via simulation. Gain de production de 3,2% sur le pilote. Budget : 2,1M€ — 9 consultants mc2i" },
    ].forEach((ref) => {
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); red();
      doc.text(ref.title, M, y); y += 5;
      para(ref.desc); y += 1;
    });

    sectionTitle("7", "OFFRE FINANCIÈRE");
    tableHeader([
      { label: "Phase", x: 3 },
      { label: "Jours/hommes", x: 91 },
      { label: "TJM moyen", x: 121 },
      { label: "Montant HT", x: 150 },
    ]);
    [
      ["Phase 1 — Audit & Cartographie", "140 j/h", "1 050 €", "147 000 €"],
      ["Phase 2 — Architecture IoT & Data", "200 j/h", "1 100 €", "220 000 €"],
      ["Phase 3 — Jumeaux Numériques", "280 j/h", "1 150 €", "322 000 €"],
      ["Phase 4 — Modèles IA & Déploiement", "380 j/h", "1 200 €", "456 000 €"],
      ["Phase 5 — Formation & Transfert", "220 j/h", "980 €", "215 600 €"],
      ["Infrastructure Cloud & Licences", "—", "—", "95 000 €"],
      ["Frais de gestion de projet (5%)", "—", "—", "72 780 €"],
    ].forEach((row, i) => {
      tableRow([
        { text: row[0], x: 3, maxW: 85 },
        { text: row[1], x: 91, maxW: 28 },
        { text: row[2], x: 121, maxW: 28 },
        { text: row[3], x: 150, maxW: 22 },
      ], i);
    });
    // Total row — navy background
    doc.setFillColor(13, 27, 62); doc.rect(M, y, CW, 8, "F");
    doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); white();
    doc.text("TOTAL HT", M + 3, y + 5.5);
    doc.text("1 220 j/h", M + 91, y + 5.5);
    doc.text("—", M + 121, y + 5.5);
    doc.text("1 528 380 €", M + 150, y + 5.5);
    y += 12;

    sectionTitle("8", "CONCLUSION");
    para("mc2i partage avec ENGIE la conviction que la transition énergétique et la transition numérique sont deux accélérateurs indissociables. Notre expertise sectorielle éprouvée, notre méthodologie EnergyDigital360 et notre équipe disponible dès juillet 2025 font de mc2i le partenaire idéal pour accompagner ENGIE dans cette transformation stratégique.");
    [
      "Réponse à toute demande de clarification dans les 48h",
      "Présentation orale lors des auditions (mai 2025)",
      "Signature du contrat et kick-off en juillet 2025",
      "Démarrage Phase 1 — Audit & Cartographie des actifs renouvelables",
    ].forEach((b) => {
      doc.setFontSize(9); doc.setFont("helvetica", "normal"); red();
      doc.text("•", M, y); bodyC();
      doc.text(b, M + 5, y, { maxWidth: CW - 5 }); y += 6;
    });

    footer(4);

    // ─────────────────────────────────────
    // PAGE 5 — SIGNATURE
    // ─────────────────────────────────────
    doc.addPage(); y = M + 50;
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); red();
    doc.text("Pierre LAMBERT — mc2i, Issy-les-Moulineaux, le 18 avril 2025", M, y); y += 6;
    grayC();
    doc.text("Directeur Associé — Pôle Énergie & Utilities | p.lambert@mc2i.fr | +33 1 47 67 01 40", M, y); y += 14;
    doc.text("mc2i SAS — 22 rue du Gouverneur Général Éboué, 92130 Issy-les-Moulineaux | SIRET : 399 882 320 00087 | www.mc2i.fr", M, y, { maxWidth: CW });
    footer(5);

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

  const ExtractsSection = () => (
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
              <Button size="sm" variant="outline" className="gap-1.5 shrink-0" onClick={() => handleCopy(extract.preview, idx)}>
                {copiedIdx === idx ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedIdx === idx ? "Copié" : "Copier"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed bg-muted/40 rounded-lg p-3">{extract.preview}</p>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={itemAnim}>
        <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-heading)]">Réponse AO</h1>
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
                <Icon className="h-3.5 w-3.5" /><span className="text-xs">{m.label}</span>
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

          {/* ── Tab PDF ── */}
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

            <Separator />
            <ExtractsSection />
          </TabsContent>

          {/* ── Tab PPTX ── */}
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
                        <Badge className={`${statusColors[ao.status]} border text-xs`} variant="outline">{statusLabels[ao.status]}</Badge>
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
            <ExtractsSection />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
