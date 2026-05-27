"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Play,
  FileDown,
  BookOpen,
  Wrench,
  Users,
  Award,
  MessageSquare,
  Loader2,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tenders } from "@/lib/data";

const sections = [
  {
    id: "understanding",
    title: "Compréhension du Besoin & Exigences Clés",
    icon: BookOpen,
    content: `Notre analyse détaillée du cahier des charges (CCTP) met en évidence les enjeux critiques de votre projet de transformation. 

EXIGENCES CLÉS DÉTAILLÉES :
1. Continuité de Service Absolue : Le basculement vers la nouvelle infrastructure doit garantir un SLA de 99,99% sans aucune interruption des services critiques, avec un Plan de Reprise d'Activité (PRA) validé en amont.
2. Conformité Réglementaire Stricte : Le système doit respecter l'intégralité des directives RGPD, incluant une journalisation inaltérable des accès, le chiffrement de bout en bout des données sensibles et une politique stricte de gestion des consentements (privacy by design).
3. Interopérabilité et API First : Intégration transparente avec vos 15 SI existants via une architecture orientée services (Microservices/API RESTful) documentée via Swagger/OpenAPI.
4. Conduite du Changement : Déploiement d'un programme de formation certifiant pour les 500 utilisateurs clés, incluant des modules e-learning sur-mesure et un accompagnement de proximité (coaching) pendant la phase d'hypercare.`,
    reference: "AO-2025-001",
  },
  {
    id: "ccap",
    title: "Analyse et Détail du CCAP",
    icon: Wrench,
    content: `L'analyse du Cahier des Clauses Administratives Particulières (CCAP) nous permet de structurer une réponse parfaitement alignée avec vos contraintes contractuelles et financières.

POINTS D'ATTENTION ET ENGAGEMENTS :
• Modalités d'Exécution : Nous prenons acte des pénalités de retard fixées à l'Article 8 (1/1000 par jour de retard) et nous engageons fermement sur les jalons de livraison via une planification sécurisée avec marge de contingence.
• Propriété Intellectuelle (Art. 12) : Cession exclusive des droits d'exploitation et de modification sur les développements spécifiques, garantissant votre totale indépendance à l'issue du projet.
• Réversibilité (Art. 15) : Mise en œuvre d'un plan de réversibilité détaillé, incluant une période d'accompagnement de 3 mois et le transfert intégral des codes sources, documentations, et scripts de déploiement (IaC) sans surcoût.
• Facturation et Jalons : Facturation adossée aux livrables contractuels (20% au cadrage, 40% à la VABF, 30% à la VSR, 10% à la garantie).`,
    reference: "AO-2025-002",
  },
  {
    id: "extracts",
    title: "Extraits Réutilisables & Inspirations",
    icon: Award,
    content: `Basé sur nos réponses gagnantes, voici des paragraphes directement réutilisables pour votre proposition technique :

EXTRAIT 1 : ARCHITECTURE SÉCURISÉE (Score de pertinence: 95%)
"Notre conviction est que la sécurité ne doit pas être une surcouche ajoutée a posteriori, mais le fondement même de la conception (Secure by Design). Nous proposons une architecture en profondeur (Defense in Depth) combinant un filtrage réseau strict (WAF, Micro-segmentation), un modèle Zero Trust pour l'authentification des utilisateurs (MFA, SSO, IAM), et un chiffrement systématique des données au repos (AES-256) et en transit (TLS 1.3). Cette approche a fait ses preuves sur des environnements hautement sensibles, notamment lors de notre récente mission au Ministère des Armées, où nous avons obtenu l'homologation SecNumCloud en moins de 6 mois."

EXTRAIT 2 : GOUVERNANCE AGILE (Score de pertinence: 92%)
"Pour piloter efficacement cette transformation complexe, nous déployons une gouvernance à trois niveaux. Le niveau stratégique (Comité de Pilotage mensuel) garantit l'alignement avec vos objectifs métiers et valide les budgets. Le niveau tactique (Comité de Projet hebdomadaire) gère les risques, lève les obstacles et valide les sprints. Enfin, le niveau opérationnel (Daily Stand-up) assure la synchronisation quotidienne de l'équipe de réalisation. Cette comitologie s'appuie sur des tableaux de bord automatisés et partagés, offrant une transparence totale sur l'avancement, le budget consommé et la qualité des livrables (via des indicateurs tels que la vélocité, le taux de défauts et la couverture de tests)."`,
    reference: "AO-2025-003",
  },
  {
    id: "conclusion",
    title: "Conclusion",
    icon: MessageSquare,
    content: `Nous sommes convaincus que notre proposition répond pleinement à vos attentes en termes de qualité, d'expertise et d'engagement contractuel. Notre approche méthodique et notre maîtrise des clauses du CCAP garantissent une exécution sans risque de votre projet.

Nous serions ravis de vous présenter notre approche en détail lors d'une soutenance orale et de répondre à toutes vos questions.

Nous restons à votre entière disposition pour tout complément d'information.`,
    reference: "AO-2025-007",
  },
];

function GenerateContent() {
  const searchParams = useSearchParams();
  const preselectedTender = searchParams.get("tender") || "";
  const [selectedTender, setSelectedTender] = useState(preselectedTender);
  const [generating, setGenerating] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const [typingSection, setTypingSection] = useState<string | null>(null);
  const [typedChars, setTypedChars] = useState<Record<string, number>>({});

  const startGeneration = () => {
    setGenerating(true);
    setVisibleSections([]);
    setTypingSection(null);
    setTypedChars({});

    let sectionIndex = 0;

    const revealNext = () => {
      if (sectionIndex >= sections.length) {
        setTypingSection(null);
        setGenerating(false);
        return;
      }

      const currentSection = sections[sectionIndex];
      setTypingSection(currentSection.id);
      setVisibleSections((prev) => [...prev, currentSection.id]);

      let charIndex = 0;
      const content = currentSection.content;
      const speed = 2;

      const typeInterval = setInterval(() => {
        charIndex += speed;
        setTypedChars((prev) => ({ ...prev, [currentSection.id]: charIndex }));

        if (charIndex >= content.length) {
          clearInterval(typeInterval);
          sectionIndex++;
          setTimeout(revealNext, 400);
        }
      }, 10);
    };

    setTimeout(revealNext, 800);
  };

  const tender = tenders.find((t) => t.id === selectedTender);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-heading)]">
          Générateur IA de Réponse
        </h1>
        <p className="text-muted-foreground mt-1">
          Générez une proposition de conseil complète basée sur vos réponses gagnantes
        </p>
      </div>

      {/* Config */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[250px]">
              <label className="text-sm font-medium mb-2 block">
                Appel d&apos;Offres
              </label>
              <Select value={selectedTender} onValueChange={(v) => setSelectedTender(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un appel d'offres..." />
                </SelectTrigger>
                <SelectContent>
                  {tenders.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.id} — {t.title.substring(0, 50)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={startGeneration}
              disabled={!selectedTender || generating}
              className="gap-2"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {generating ? "Génération..." : "Générer la Réponse"}
            </Button>
          </div>

          {tender && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline">{tender.sector}</Badge>
              <Badge variant="outline">{tender.client}</Badge>
              {tender.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated sections */}
      <AnimatePresence>
        {visibleSections.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4 lg:grid-cols-4"
          >
            {/* Main content */}
            <div className="lg:col-span-3 space-y-4">
              {sections
                .filter((s) => visibleSections.includes(s.id))
                .map((section) => {
                  const Icon = section.icon;
                  const chars = typedChars[section.id] || 0;
                  const isTyping = typingSection === section.id;
                  const displayedContent = section.content.substring(0, chars);
                  const isDone = chars >= section.content.length;

                  return (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-base">
                              <Icon className="h-5 w-5 text-primary" />
                              {section.title}
                            </span>
                            {isDone && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                            {displayedContent}
                            {isTyping && (
                              <span className="typewriter-cursor" />
                            )}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
            </div>

            {/* Reference panel */}
            <div className="space-y-4">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Références Utilisées
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sections
                    .filter((s) => visibleSections.includes(s.id))
                    .map((section) => {
                      const refTender = tenders.find(
                        (t) => t.id === section.reference
                      );
                      return (
                        <div
                          key={section.id}
                          className="rounded-lg border p-3 text-xs space-y-1"
                        >
                          <p className="font-medium text-sm flex items-center gap-1">
                            <ChevronRight className="h-3 w-3 text-primary" />
                            {section.title}
                          </p>
                          <p className="text-muted-foreground">
                            Inspiré de :{" "}
                            <span className="font-medium text-foreground">
                              {section.reference}
                            </span>
                          </p>
                          {refTender && (
                            <p className="text-muted-foreground truncate">
                              {refTender.title}
                            </p>
                          )}
                        </div>
                      );
                    })}

                  {!generating && visibleSections.length === sections.length && (
                    <>
                      <Separator className="my-3" />
                      <div className="space-y-2">
                        <Button className="w-full gap-2" variant="outline" size="sm">
                          <FileDown className="h-4 w-4" />
                          Exporter en PDF
                        </Button>
                        <Button className="w-full gap-2" variant="outline" size="sm">
                          <FileDown className="h-4 w-4" />
                          Exporter en DOCX
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <GenerateContent />
    </Suspense>
  );
}
