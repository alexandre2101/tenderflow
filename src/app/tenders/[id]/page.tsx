"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Brain,
  Users,
  DollarSign,
  Calendar,
  Tag,
  Sparkles,
  ChevronRight,
  Lightbulb,
  Target,
  BarChart3,
  ArrowLeft,
  Download,
  Presentation,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tenders, type TenderStatus } from "@/lib/data";
import { generateTenderPptx } from "@/lib/generate-pptx";

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

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TenderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const tender = tenders.find((t) => t.id === id);
  const similarTenders = tenders.filter((t) => t.id !== id && t.sector === tender?.sector).slice(0, 3);

  if (!tender) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">Appel d&apos;offres introuvable.</p>
      </div>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(price);

  const downloadDocumentPdf = () => {
    const content = `mc2i — APPEL D'OFFRES — CONFIDENTIEL
Référence : ${tender.id}
Date de soumission : ${new Date(tender.submissionDate).toLocaleDateString("fr-FR")}

════════════════════════════════════════

${tender.title}

CLIENT : ${tender.client}
SECTEUR : ${tender.sector}
BUDGET : ${formatPrice(tender.price)}
DURÉE : ${tender.duration}
CONSULTANTS : ${tender.consultantsNeeded}
STATUT : ${statusLabels[tender.status]}

────────────────────────────────────────
1. OBJET DE LA CONSULTATION
────────────────────────────────────────
${tender.description}

────────────────────────────────────────
2. CONTEXTE ET ENJEUX
────────────────────────────────────────
${tender.aiSummary}

────────────────────────────────────────
3. PÉRIMÈTRE DE LA MISSION
────────────────────────────────────────
La mission couvre l'ensemble des activités décrites dans le cahier des charges, incluant l'analyse, la conception, le développement, les tests, le déploiement et l'accompagnement au changement. Le prestataire devra mobiliser une équipe de ${tender.consultantsNeeded} consultants sur une durée de ${tender.duration}.

────────────────────────────────────────
4. TECHNOLOGIES ET TAGS
────────────────────────────────────────
Technologies : ${tender.technologies.join(", ")}
Mots-clés : ${tender.tags.join(", ")}

────────────────────────────────────────
5. BUDGET ESTIMATIF
────────────────────────────────────────
Budget maximum alloué : ${formatPrice(tender.price)} TTC

════════════════════════════════════════
Document généré par mc2i TenderFlow — ${new Date().toLocaleDateString("fr-FR")}`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tender.id}_document.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadResponsePdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = 210;
    const margin = 18;
    const contentW = pageW - margin * 2;
    let y = 20;

    const addText = (text: string, opts: { fontSize?: number; bold?: boolean; color?: [number, number, number]; wrap?: boolean; maxW?: number } = {}) => {
      const { fontSize = 10, bold = false, color = [30, 30, 50], wrap = false, maxW = contentW } = opts;
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setTextColor(...color);
      if (wrap) {
        const lines = doc.splitTextToSize(text, maxW);
        lines.forEach((line: string) => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(line, margin, y);
          y += fontSize * 0.45;
        });
      } else {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(text, margin, y);
        y += fontSize * 0.45;
      }
    };

    // Header bar
    doc.setFillColor(13, 27, 62);
    doc.rect(0, 0, 210, 14, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("mc2i", margin, 9.5);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("PROPOSITION TECHNIQUE — CONFIDENTIEL", 210 - margin, 9.5, { align: "right" });

    y = 24;
    // Red accent bar
    doc.setFillColor(197, 40, 28);
    doc.rect(margin, y, 3, 18, "F");

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(13, 27, 62);
    doc.text(tender.title, margin + 6, y + 7, { maxWidth: contentW - 6 });
    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text(`${tender.client} — ${tender.id}`, margin + 6, y + 4);
    y += 18;

    // Separator
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    const section = (title: string) => {
      y += 4;
      doc.setFillColor(232, 240, 254);
      doc.rect(margin, y - 4, contentW, 9, "F");
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(13, 27, 62);
      doc.text(title, margin + 3, y + 1.5);
      y += 9;
    };

    section("MÉTHODOLOGIE");
    addText(tender.methodology, { wrap: true, fontSize: 10 });
    y += 6;

    section("STAFFING");
    addText(tender.staffing, { wrap: true, fontSize: 10 });
    y += 6;

    section("ÉLÉMENTS DIFFÉRENCIANTS");
    addText(tender.differentiators, { wrap: true, fontSize: 10 });
    y += 10;

    // Metadata box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(199, 210, 254);
    doc.roundedRect(margin, y, contentW, 22, 2, 2, "FD");
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(13, 27, 62);
    doc.text("Budget AO :", margin + 4, y + 8);
    doc.text("Durée :", margin + 58, y + 8);
    doc.text("Consultants :", margin + 100, y + 8);
    doc.text("Score similarité :", margin + 140, y + 8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(79, 70, 229);
    doc.text(formatPrice(tender.price), margin + 4, y + 16);
    doc.text(tender.duration, margin + 58, y + 16);
    doc.text(`${tender.consultantsNeeded}`, margin + 100, y + 16);
    doc.text(`${tender.similarityScore}%`, margin + 140, y + 16);
    y += 28;

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFillColor(13, 27, 62);
      doc.rect(0, 285, 210, 12, "F");
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(156, 163, 175);
      doc.text(`mc2i TenderFlow — Proposition générée le ${new Date().toLocaleDateString("fr-FR")}`, margin, 291);
      doc.text(`Page ${p} / ${totalPages}`, 210 - margin, 291, { align: "right" });
    }

    doc.save(`${tender.id}_reponse_mc2i.pdf`);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <Link href="/tenders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Retour à la bibliothèque
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className={`${statusColors[tender.status]} border`} variant="outline">
                {statusLabels[tender.status]}
              </Badge>
              <span className="text-sm text-muted-foreground">{tender.id}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-heading)]">
              {tender.title}
            </h1>
            <p className="text-muted-foreground">{tender.client}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => generateTenderPptx(tender)}
            >
              <Presentation className="h-4 w-4" />
              Rédiger l&apos;AO
            </Button>
            <Link href={`/generate?tender=${tender.id}`}>
              <Button className="gap-2 pulse-glow">
                <Sparkles className="h-4 w-4" />
                Générer Réponse IA
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid gap-3 grid-cols-2 md:grid-cols-5">
        {[
          { icon: Tag, label: "Secteur", value: tender.sector },
          { icon: Users, label: "Consultants", value: String(tender.consultantsNeeded) },
          { icon: DollarSign, label: "Budget", value: formatPrice(tender.price) },
          { icon: Calendar, label: "Soumission", value: new Date(tender.submissionDate).toLocaleDateString("fr-FR") },
          { icon: BarChart3, label: "Similarité", value: `${tender.similarityScore}%` },
        ].map((meta) => {
          const Icon = meta.icon;
          return (
            <Card key={meta.label} className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Icon className="h-4 w-4" />
                <span className="text-xs">{meta.label}</span>
              </div>
              <p className="text-sm font-semibold">{meta.value}</p>
            </Card>
          );
        })}
      </motion.div>

      <motion.div variants={item} className="flex flex-wrap gap-2">
        {tender.tags.map((tag) => (<Badge key={tag} variant="secondary">{tag}</Badge>))}
      </motion.div>

      <motion.div variants={item}>
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary" className="gap-2"><Brain className="h-4 w-4" />Résumé IA</TabsTrigger>
            <TabsTrigger value="document" className="gap-2"><FileText className="h-4 w-4" />Document</TabsTrigger>
            <TabsTrigger value="response" className="gap-2"><Target className="h-4 w-4" />Réponse</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Brain className="h-5 w-5 text-primary" />
                    Analyse IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed">{tender.aiSummary}</p>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      Insights Gagnants
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {[
                        "Mettre en avant l'expérience sectorielle et les références similaires",
                        "Insister sur la méthodologie éprouvée et les certifications de l'équipe",
                        "Proposer un planning réaliste avec des jalons mesurables",
                        "Différencier par l'innovation technologique et la conduite du changement",
                      ].map((insight) => (
                        <li key={insight} className="flex items-start gap-2">
                          <ChevronRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Appels d&apos;Offres Similaires</CardTitle>
                  <CardDescription>Même secteur</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {similarTenders.map((st) => (
                    <Link key={st.id} href={`/tenders/${st.id}`}>
                      <div className="rounded-lg border p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                        <p className="text-sm font-medium truncate">{st.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{st.client}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Progress value={st.similarityScore} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground">{st.similarityScore}%</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {similarTenders.length === 0 && (
                    <p className="text-sm text-muted-foreground">Aucun appel d&apos;offres similaire trouvé.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="document">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Document officiel
                  </CardTitle>
                  <Button variant="outline" size="sm" className="gap-2" onClick={downloadDocumentPdf}>
                    <Download className="h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="mx-auto max-w-3xl space-y-6 rounded-lg border bg-card p-8">
                  <div className="text-center space-y-2">
                    <Badge variant="outline">DOCUMENT OFFICIEL</Badge>
                    <h2 className="text-xl font-bold">{tender.title}</h2>
                    <p className="text-sm text-muted-foreground">{tender.client}</p>
                  </div>
                  <Separator />
                  <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                    <h3 className="font-semibold text-foreground">1. Objet de la consultation</h3>
                    <p>{tender.description}</p>
                    <h3 className="font-semibold text-foreground">2. Contexte et enjeux</h3>
                    <p>{tender.aiSummary}</p>
                    <h3 className="font-semibold text-foreground">3. Périmètre de la mission</h3>
                    <p>La mission couvre l&apos;ensemble des activités décrites dans le cahier des charges, incluant l&apos;analyse, la conception, le développement, les tests, le déploiement et l&apos;accompagnement au changement. Le prestataire devra mobiliser une équipe de {tender.consultantsNeeded} consultants.</p>
                    <h3 className="font-semibold text-foreground">4. Budget estimatif</h3>
                    <p>Le budget maximum alloué pour cette prestation est de {formatPrice(tender.price)} TTC.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="response">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Réponse mc2i</CardTitle>
                    <CardDescription>Méthodologie et staffing proposés</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => generateTenderPptx(tender)}
                    >
                      <Presentation className="h-4 w-4" />
                      Rédiger (.pptx)
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" onClick={downloadResponsePdf}>
                      <Download className="h-4 w-4" />
                      Télécharger PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Méthodologie</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tender.methodology}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold mb-2">Staffing</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tender.staffing}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold mb-2">Éléments Différenciants</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tender.differentiators}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
