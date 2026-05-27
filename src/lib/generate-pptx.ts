import type { Tender } from "./data";

const NAVY = "0d1b3e";
const RED = "c5281c";
const LIGHT_BG = "f5f7fa";
const DARK_TEXT = "1a1a2e";
const MID_TEXT = "4b5563";
const PLACEHOLDER_BG = "fff8e1";
const PLACEHOLDER_BORDER = "f59e0b";
const SECTION_HEADER_BG = "e8f0fe";

function placeholder(text: string) {
  return `[ ${text} ]`;
}

function formatPrice(price: number) {
  return price >= 1_000_000
    ? `${(price / 1_000_000).toFixed(1)} M€ HT`
    : `${(price / 1_000).toFixed(0)} K€ HT`;
}

export async function generateTenderPptx(tender: Tender) {
  const pptxgen = (await import("pptxgenjs")).default;
  const prs = new pptxgen();
  prs.layout = "LAYOUT_WIDE";

  const W = 13.33;

  // ── SLIDE 1 — Couverture ─────────────────────────────────────────────────
  const s1 = prs.addSlide();
  s1.background = { color: NAVY };

  // Red top strip
  s1.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.45, fill: { color: RED }, line: { color: RED } });
  s1.addText("mc2i", { x: 0.4, y: 0.07, w: 2, h: 0.3, fontSize: 16, bold: true, color: "FFFFFF" });
  s1.addText("CONFIDENTIEL", { x: W - 2.5, y: 0.1, w: 2.1, h: 0.25, fontSize: 9, color: "FFFFFF", align: "right" });

  // Label
  s1.addText("RÉPONSE À L'APPEL D'OFFRES", { x: 0.6, y: 1.2, w: W - 1.2, h: 0.45, fontSize: 13, color: "9ca3af", bold: false, charSpacing: 2 });

  // AO Title
  s1.addText(tender.title, { x: 0.6, y: 1.7, w: W - 1.2, h: 1.5, fontSize: 28, bold: true, color: "FFFFFF", wrap: true });

  // Meta chips row
  const chips = [
    { label: "CLIENT", value: tender.client },
    { label: "RÉFÉRENCE", value: tender.id },
    { label: "BUDGET", value: formatPrice(tender.price) },
    { label: "DURÉE", value: tender.duration },
  ];
  chips.forEach((chip, i) => {
    const cx = 0.6 + i * 3.2;
    s1.addShape(prs.ShapeType.rect, { x: cx, y: 3.6, w: 3.0, h: 0.65, fill: { color: "1e3a5f" }, line: { color: "3b82f6", pt: 0.5 } });
    s1.addText(chip.label, { x: cx + 0.12, y: 3.64, w: 2.8, h: 0.22, fontSize: 8, color: "9ca3af", bold: true, charSpacing: 1 });
    s1.addText(chip.value, { x: cx + 0.12, y: 3.86, w: 2.8, h: 0.3, fontSize: 10, color: "FFFFFF", bold: false });
  });

  // Tags
  const tagStr = tender.tags.slice(0, 6).join("  ·  ");
  s1.addText(tagStr, { x: 0.6, y: 4.55, w: W - 1.2, h: 0.3, fontSize: 10, color: "6b7280" });

  // Sector badge
  s1.addShape(prs.ShapeType.rect, { x: 0.6, y: 5.1, w: 3.5, h: 0.4, fill: { color: RED }, line: { color: RED } });
  s1.addText(tender.sector, { x: 0.6, y: 5.14, w: 3.5, h: 0.32, fontSize: 10, color: "FFFFFF", align: "center", bold: true });

  // Similarity
  s1.addText(`Indice de similarité mc2i : ${tender.similarityScore}%`, { x: 4.4, y: 5.14, w: 5, h: 0.32, fontSize: 10, color: "60a5fa" });

  // Bottom bar
  s1.addShape(prs.ShapeType.rect, { x: 0, y: 6.9, w: W, h: 0.6, fill: { color: "060e1f" }, line: { color: "060e1f" } });
  const year = new Date().getFullYear();
  s1.addText(`mc2i — Document confidentiel © ${year}`, { x: 0.4, y: 6.95, w: 8, h: 0.35, fontSize: 9, color: "6b7280" });
  s1.addText("mc2i.fr", { x: W - 1.8, y: 6.95, w: 1.5, h: 0.35, fontSize: 9, color: "6b7280", align: "right" });

  // ── SLIDE 2 — Présentation mc2i ──────────────────────────────────────────
  const s2 = prs.addSlide();
  s2.background = { color: "FFFFFF" };
  addSlideHeader(s2, prs, "Présentation de l'entreprise", W, NAVY, RED);

  // Two columns
  // Left column: mc2i facts
  s2.addText("Qui sommes-nous ?", { x: 0.5, y: 0.9, w: 5.5, h: 0.35, fontSize: 13, bold: true, color: DARK_TEXT });
  const facts = [
    "Fondé en 2000 — cabinet français de conseil en transformation digitale",
    "1 600+ consultants — 11 bureaux en France",
    "Leader sectoriel : Énergie, Banque & Finance, Transport, Santé, Secteur public",
    "4 domaines clés : Transformation SI · Data & IA · Cybersécurité · Management",
    "Certifications : ISO 27001 · SecNumCloud · SAP Gold Partner · AWS Partner",
  ];
  facts.forEach((fact, i) => {
    s2.addText(`• ${fact}`, { x: 0.5, y: 1.32 + i * 0.42, w: 5.8, h: 0.38, fontSize: 10, color: MID_TEXT, wrap: true });
  });

  // Right column: key numbers
  const numbers = [
    { n: "1 600+", label: "consultants" },
    { n: "25 ans", label: "d'expérience" },
    { n: "11", label: "bureaux France" },
    { n: "Top 10", label: "cabinets français" },
  ];
  numbers.forEach((kpi, i) => {
    const nx = 6.8 + (i % 2) * 3.2;
    const ny = 1.1 + Math.floor(i / 2) * 1.3;
    s2.addShape(prs.ShapeType.rect, { x: nx, y: ny, w: 2.9, h: 1.1, fill: { color: SECTION_HEADER_BG }, line: { color: "c7d2fe" } });
    s2.addText(kpi.n, { x: nx, y: ny + 0.12, w: 2.9, h: 0.55, fontSize: 22, bold: true, color: NAVY, align: "center" });
    s2.addText(kpi.label, { x: nx, y: ny + 0.65, w: 2.9, h: 0.3, fontSize: 10, color: MID_TEXT, align: "center" });
  });

  // Placeholder boxes
  addPlaceholder(s2, placeholder("Mettre à jour les chiffres clés et certifications actuels"), 0.5, 4.05, W - 1, 0.5);
  addPlaceholder(s2, placeholder("Ajouter les 2–3 références clients les plus pertinentes pour ce secteur"), 0.5, 4.65, W - 1, 0.5);

  addSlideFooter(s2, prs, W, NAVY);

  // ── SLIDE 3 — Contexte de l'AO ───────────────────────────────────────────
  const s3 = prs.addSlide();
  s3.background = { color: "FFFFFF" };
  addSlideHeader(s3, prs, "Contexte de l'appel d'offres", W, NAVY, RED);

  // Metadata chips
  const meta = [
    { l: "CLIENT", v: tender.client },
    { l: "BUDGET", v: formatPrice(tender.price) },
    { l: "DURÉE", v: tender.duration },
    { l: "SECTEUR", v: tender.sector },
    { l: "SOUMISSION", v: new Date(tender.submissionDate).toLocaleDateString("fr-FR") },
  ];
  meta.forEach((m, i) => {
    const cx = 0.5 + i * 2.57;
    s3.addShape(prs.ShapeType.rect, { x: cx, y: 0.85, w: 2.45, h: 0.62, fill: { color: SECTION_HEADER_BG }, line: { color: "c7d2fe" } });
    s3.addText(m.l, { x: cx + 0.1, y: 0.88, w: 2.3, h: 0.2, fontSize: 7.5, color: "6b7280", bold: true, charSpacing: 0.8 });
    s3.addText(m.v, { x: cx + 0.1, y: 1.1, w: 2.3, h: 0.28, fontSize: 9.5, color: DARK_TEXT, bold: true });
  });

  // Description
  s3.addText("Description de la mission", { x: 0.5, y: 1.65, w: 8, h: 0.32, fontSize: 11, bold: true, color: DARK_TEXT });
  s3.addText(tender.description, { x: 0.5, y: 2.0, w: W - 1, h: 0.6, fontSize: 10, color: MID_TEXT, wrap: true });

  // AI Summary
  s3.addText("Analyse IA — Résumé", { x: 0.5, y: 2.72, w: 8, h: 0.32, fontSize: 11, bold: true, color: DARK_TEXT });
  const summaryLines = tender.aiSummary.length > 320 ? tender.aiSummary.slice(0, 317) + "..." : tender.aiSummary;
  s3.addText(summaryLines, { x: 0.5, y: 3.07, w: W - 1, h: 0.75, fontSize: 10, color: MID_TEXT, wrap: true });

  // Technologies
  s3.addText("Technologies clés : " + tender.technologies.join("  ·  "), { x: 0.5, y: 3.9, w: W - 1, h: 0.32, fontSize: 10, color: "4f46e5", italic: true });

  addPlaceholder(s3, placeholder("Votre analyse du contexte stratégique client et des enjeux non explicités dans l'AO"), 0.5, 4.35, W - 1, 0.5);
  addPlaceholder(s3, placeholder("Enjeux spécifiques identifiés lors des échanges préliminaires avec le client"), 0.5, 4.95, W - 1, 0.5);

  addSlideFooter(s3, prs, W, NAVY);

  // ── SLIDE 4 — Nos forces ─────────────────────────────────────────────────
  const s4 = prs.addSlide();
  s4.background = { color: "FFFFFF" };
  addSlideHeader(s4, prs, "Nos forces sur cette mission", W, "065f46", "10b981");

  const forces = [
    `Expertise sectorielle confirmée — indice de similarité mc2i : ${tender.similarityScore}%`,
    "Méthodologie éprouvée et adaptée aux enjeux de transformation data / SI",
    "Équipe dédiée avec expérience avérée dans le secteur " + tender.sector,
    "Références clients comparables disponibles sur demande",
    "Conformité réglementaire maîtrisée (RGPD, NIS2, SecNumCloud)",
    "Capacité à mobiliser les ressources dès la notification du marché",
  ];
  forces.forEach((f, i) => {
    s4.addShape(prs.ShapeType.rect, { x: 0.5, y: 0.85 + i * 0.52, w: 0.32, h: 0.32, fill: { color: "10b981" }, line: { color: "10b981" } });
    s4.addText("✓", { x: 0.5, y: 0.85 + i * 0.52, w: 0.32, h: 0.32, fontSize: 10, color: "FFFFFF", align: "center", valign: "middle" });
    s4.addText(f, { x: 0.95, y: 0.87 + i * 0.52, w: W - 1.4, h: 0.3, fontSize: 10.5, color: DARK_TEXT });
  });

  addPlaceholder(s4, placeholder("Référence client spécifique la plus impactante pour ce dossier — à détailler avec chiffres"), 0.5, 4.2, W - 1, 0.5);
  addPlaceholder(s4, placeholder("Argument technique différenciant principal — pourquoi mc2i plutôt qu'un concurrent"), 0.5, 4.82, W - 1, 0.5);
  addPlaceholder(s4, placeholder("Avantage prix, délai ou qualité si pertinent — à valider avec le Directeur de mission"), 0.5, 5.44, W - 1, 0.5);

  addSlideFooter(s4, prs, W, NAVY);

  // ── SLIDE 5 — Faiblesses / Points de vigilance ───────────────────────────
  const s5 = prs.addSlide();
  s5.background = { color: "FFFFFF" };
  addSlideHeader(s5, prs, "Points de vigilance", W, "78350f", "f59e0b");

  const risks = [
    "Périmètre fonctionnel à cadrer précisément — vérifier les livrables attendus par phase",
    "Disponibilité et rétention des profils clés sur la durée totale du marché",
    "Dépendances techniques avec les systèmes existants du client (interfaces, legacy)",
    "Conformité réglementaire complète à valider (RGPD, NIS2, CSRD selon contexte)",
    "Gestion du changement : adhésion des utilisateurs finaux à anticiper dès le démarrage",
  ];
  risks.forEach((r, i) => {
    s5.addShape(prs.ShapeType.rect, { x: 0.5, y: 0.85 + i * 0.52, w: 0.32, h: 0.32, fill: { color: "f59e0b" }, line: { color: "f59e0b" } });
    s5.addText("!", { x: 0.5, y: 0.85 + i * 0.52, w: 0.32, h: 0.32, fontSize: 11, bold: true, color: "FFFFFF", align: "center", valign: "middle" });
    s5.addText(r, { x: 0.95, y: 0.87 + i * 0.52, w: W - 1.4, h: 0.3, fontSize: 10.5, color: DARK_TEXT });
  });

  addPlaceholder(s5, placeholder("Risques spécifiques identifiés à ce projet — à compléter avec le Directeur de mission"), 0.5, 3.65, W - 1, 0.5);
  addPlaceholder(s5, placeholder("Points de négociation à aborder avec le client avant signature"), 0.5, 4.27, W - 1, 0.5);
  addPlaceholder(s5, placeholder("Conditions de réussite et pré-requis à contractualiser impérativement"), 0.5, 4.89, W - 1, 0.5);

  addSlideFooter(s5, prs, W, NAVY);

  // ── SLIDE 6 — Organisation & Planning ────────────────────────────────────
  const s6 = prs.addSlide();
  s6.background = { color: "FFFFFF" };
  addSlideHeader(s6, prs, "Organisation & Planning", W, NAVY, RED);

  s6.addText("Cette section est à compléter par le Directeur de mission.", {
    x: 0.5, y: 0.9, w: W - 1, h: 0.35, fontSize: 11, italic: true, color: "9ca3af",
  });

  const orgPlaceholders = [
    { label: "Organigramme de l'équipe projet", hint: "Insérer ici le schéma d'organisation avec rôles et taux d'implication" },
    { label: "Planning général en phases", hint: "Insérer ici le Gantt ou le tableau de phases avec jalons et livrables" },
    { label: "Modalités de pilotage", hint: "Instances de gouvernance, reporting, fréquence des revues de projet" },
  ];
  orgPlaceholders.forEach((p, i) => {
    const py = 1.35 + i * 1.75;
    s6.addShape(prs.ShapeType.rect, { x: 0.5, y: py, w: W - 1, h: 1.55, fill: { color: PLACEHOLDER_BG }, line: { color: PLACEHOLDER_BORDER, pt: 1, dashType: "dash" } });
    s6.addText(placeholder(`INSÉRER : ${p.label}`), { x: 0.5, y: py + 0.25, w: W - 1, h: 0.4, fontSize: 12, bold: true, color: "92400e", align: "center" });
    s6.addText(p.hint, { x: 0.8, y: py + 0.75, w: W - 1.6, h: 0.55, fontSize: 9.5, color: "b45309", align: "center", italic: true, wrap: true });
  });

  addSlideFooter(s6, prs, W, NAVY);

  // ── SLIDE 7 — Budget ─────────────────────────────────────────────────────
  const s7 = prs.addSlide();
  s7.background = { color: "FFFFFF" };
  addSlideHeader(s7, prs, "Budget et modalités commerciales", W, NAVY, RED);

  s7.addText(`Budget indicatif de l'AO : ${formatPrice(tender.price)}`, {
    x: 0.5, y: 0.85, w: W - 1, h: 0.38, fontSize: 12, bold: true, color: DARK_TEXT,
  });

  const budgetPlaceholders = [
    "Décomposition budgétaire détaillée par profil et par phase",
    "Modalités de facturation (jalons, mensuel, T&M, forfait...)",
    "Conditions particulières, garanties et pénalités proposées",
    "Synthèse comparative par rapport au budget AO",
  ];
  budgetPlaceholders.forEach((bp, i) => {
    const by = 1.38 + i * 1.3;
    s7.addShape(prs.ShapeType.rect, { x: 0.5, y: by, w: W - 1, h: 1.1, fill: { color: PLACEHOLDER_BG }, line: { color: PLACEHOLDER_BORDER, pt: 1, dashType: "dash" } });
    s7.addText(placeholder(`INSÉRER : ${bp}`), { x: 0.5, y: by + 0.35, w: W - 1, h: 0.4, fontSize: 11, bold: true, color: "92400e", align: "center" });
  });

  addSlideFooter(s7, prs, W, NAVY);

  await prs.writeFile({ fileName: `mc2i_AO_${tender.id}.pptx` });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addSlideHeader(slide: any, prs: any, title: string, W: number, bgColor: string, accentColor: string) {
  slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.6, fill: { color: bgColor }, line: { color: bgColor } });
  slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 0.18, h: 0.6, fill: { color: accentColor }, line: { color: accentColor } });
  slide.addText(title, { x: 0.35, y: 0.1, w: W - 2, h: 0.4, fontSize: 16, bold: true, color: "FFFFFF" });
  slide.addText("mc2i", { x: W - 1.3, y: 0.1, w: 1.1, h: 0.38, fontSize: 13, bold: true, color: accentColor === RED ? accentColor : "FFFFFF", align: "right" });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addPlaceholder(slide: any, text: string, x: number, y: number, w: number, h: number) {
  slide.addShape("rect", { x, y, w, h, fill: { color: PLACEHOLDER_BG }, line: { color: PLACEHOLDER_BORDER, pt: 1, dashType: "dash" } });
  slide.addText(text, { x: x + 0.15, y: y + (h - 0.22) / 2, w: w - 0.3, h: 0.22, fontSize: 9.5, color: "92400e", italic: true, wrap: false });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addSlideFooter(slide: any, prs: any, W: number, bgColor: string) {
  slide.addShape(prs.ShapeType.rect, { x: 0, y: 7.25, w: W, h: 0.25, fill: { color: bgColor }, line: { color: bgColor } });
  slide.addText("mc2i — Document confidentiel", { x: 0.3, y: 7.27, w: 5, h: 0.2, fontSize: 7, color: "6b7280" });
}
