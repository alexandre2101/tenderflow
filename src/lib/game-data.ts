import { Zap, Train, Gem, Leaf, Landmark, LucideIcon } from "lucide-react";

export interface AoAxis {
  title: string;
  description: string;
}

export interface AoData {
  reference: string;
  fullTitle: string;
  clientContext: string;
  budget: string;
  duration: string;
  teamSize: string;
  axes: AoAxis[];
  keyRequirements: string[];
  deadline: string;
}

export interface ChallengeCard {
  id: string;
  sector: string;
  Icon: LucideIcon;
  accentTw: string;
  borderTw: string;
  bgGradient: string;
  iconBg: string;
  client: string;
  title: string;
  description: string;
  trapHint: string;
  targetTenderId: string;
  sectorFilter: string;
  aoData: AoData;
}

export const challengeCards: ChallengeCard[] = [
  {
    id: "energie",
    sector: "Énergie",
    Icon: Zap,
    accentTw: "text-amber-400",
    borderTw: "border-amber-500/40",
    bgGradient: "from-amber-500/15 via-transparent to-orange-500/10",
    iconBg: "bg-amber-500/20",
    client: "ENGIE",
    title: "Défi Énergie",
    description:
      "ENGIE vient de publier un AO de dernière minute. Ils veulent une méthodologie sur le pilotage de la transition énergétique en Île-de-France. Tu as 3 minutes pour trouver si mc2i a déjà fait ça — sinon, tu dois tout réécrire de zéro.",
    trapHint:
      "Plusieurs AO « énergie » se ressemblent mais n'ont pas la même problématique technique.",
    targetTenderId: "AO-2025-005",
    sectorFilter: "Énergie",
    aoData: {
      reference: "ENGIE-DSI-2025-089",
      fullTitle: "Déploiement d'une infrastructure IoT & IA pour la gestion prédictive des actifs énergétiques renouvelables",
      clientContext:
        "ENGIE exploite plus de 4 200 actifs de production d'énergie renouvelable (parcs éoliens, solaires, hydrauliques) en France. Face à la croissance du parc et aux engagements de neutralité carbone 2045, la DSI lance une transformation numérique de la supervision et maintenance des actifs.",
      budget: "1,5 M€ – 3 M€ HT",
      duration: "30 mois",
      teamSize: "8–14 consultants",
      deadline: "15 juillet 2025",
      axes: [
        {
          title: "Axe 1 — Architecture IoT temps réel",
          description: "Déploiement de capteurs intelligents sur 800 actifs prioritaires, edge computing embarqué, protocoles MQTT/OPC-UA, pipeline de données vers data lake Azure.",
        },
        {
          title: "Axe 2 — Jumeaux numériques",
          description: "Création de jumeaux numériques pour simuler et anticiper la dégradation des équipements (éoliennes, onduleurs solaires), intégration des données météo en temps réel.",
        },
        {
          title: "Axe 3 — IA prédictive & maintenance",
          description: "Modèles ML pour la prévision de pannes (J+7, J+30), optimisation des tournées de maintenance, réduction de 30% des arrêts non planifiés visée.",
        },
        {
          title: "Axe 4 — Tableau de bord opérationnel",
          description: "Plateforme centralisée de supervision pour les équipes terrain et direction, alertes configurables, reporting ESG automatisé.",
        },
      ],
      keyRequirements: [
        "Expérience démontrable sur des projets IoT industriel à grande échelle (>500 capteurs)",
        "Maîtrise des architectures cloud Azure / AWS pour l'ingestion de données temps réel",
        "Références dans le secteur de l'énergie ou des utilities",
        "Capacité à déployer en mode agile avec des sprints de 3 semaines",
        "Conformité RGPD et cybersécurité NIS2 pour les systèmes OT",
      ],
    },
  },
  {
    id: "transport",
    sector: "Transport",
    Icon: Train,
    accentTw: "text-blue-400",
    borderTw: "border-blue-500/40",
    bgGradient: "from-blue-500/15 via-transparent to-cyan-500/10",
    iconBg: "bg-blue-500/20",
    client: "Île-de-France Mobilités",
    title: "Défi Transport",
    description:
      "IDFM cherche un partenaire pour refondre le système de traçage en temps réel du métro parisien. Données GTFS-RT, SIRI, NeTEx — tout y est. Prouve que mc2i peut livrer.",
    trapHint:
      "Transport maritime vs ferroviaire : des secteurs proches mais des besoins techniques radicalement différents.",
    targetTenderId: "AO-2025-002",
    sectorFilter: "Transport & Mobilité",
    aoData: {
      reference: "IDFM-DSI-2025-047",
      fullTitle: "Refonte du système de traçage et d'information voyageurs en temps réel sur le réseau métro",
      clientContext:
        "Île-de-France Mobilités coordonne 11 lignes de métro transportant 4,2 millions de voyageurs/jour. Le système de traçage actuel, vieux de 12 ans, ne supporte plus les volumes de données et génère des écarts d'information voyageurs. L'objectif est une refonte complète en 36 mois.",
      budget: "1,2 M€ – 2,5 M€ HT",
      duration: "36 mois",
      teamSize: "6–10 consultants",
      deadline: "30 juin 2025",
      axes: [
        {
          title: "Axe 1 — Ingestion données temps réel",
          description: "Collecte et normalisation des flux GTFS-RT, SIRI et NeTEx depuis les 16 opérateurs du réseau, latence cible < 2 secondes, volumétrie 50 000 événements/minute.",
        },
        {
          title: "Axe 2 — IA détection d'anomalies",
          description: "Modèles de détection d'incidents (retards, suppressions, surcharge) en temps réel, prédiction des perturbations en cascade, aide à la décision pour les régulateurs.",
        },
        {
          title: "Axe 3 — Plateforme information voyageurs",
          description: "API unifiée pour alimenter les applications IDFM, les panneaux d'affichage et les partenaires tiers, documentation OpenAPI, SLA 99,9%.",
        },
        {
          title: "Axe 4 — Migration & interopérabilité",
          description: "Plan de migration depuis le système legacy, maintien de la continuité de service pendant 18 mois de coexistence, tests d'intégration bout-en-bout.",
        },
      ],
      keyRequirements: [
        "Expertise prouvée sur les standards GTFS-RT, SIRI et NeTEx",
        "Expérience en traitement de flux événementiels à haute fréquence (Kafka, Spark Streaming)",
        "Références dans le transport public urbain ou ferroviaire",
        "Capacité de mobilisation d'une équipe en moins de 4 semaines",
        "Habilitation possible pour systèmes critiques d'infrastructure",
      ],
    },
  },
  {
    id: "luxe",
    sector: "Luxe",
    Icon: Gem,
    accentTw: "text-purple-400",
    borderTw: "border-purple-500/40",
    bgGradient: "from-purple-500/15 via-transparent to-violet-500/10",
    iconBg: "bg-purple-500/20",
    client: "LVMH",
    title: "Défi Luxe",
    description:
      "LVMH veut déployer un assistant IA conversationnel pour personnaliser l'expérience client sur 30 maisons de luxe. RAG, LLM, interface intuitive — ils veulent du mc2i. Montrez-leur ce qu'on sait faire.",
    trapHint:
      "\"Transformation digitale\" et \"IA\" apparaissent dans des dizaines d'AO. Cherchez la vraie correspondance technologique, pas sectorielle.",
    targetTenderId: "AO-2025-009",
    sectorFilter: "Administration Publique",
    aoData: {
      reference: "LVMH-DSI-2025-031",
      fullTitle: "Déploiement d'une plateforme blockchain de traçabilité & d'un CDP IA pour l'expérience client Vins & Spiritueux",
      clientContext:
        "La division Vins & Spiritueux de LVMH (Moët Hennessy) regroupe 27 maisons dont Dom Pérignon, Hennessy et Veuve Clicquot. Face à la contrefaçon croissante et aux attentes de personnalisation client haute gamme, LVMH lance une initiative technologique majeure sur 24 mois.",
      budget: "800 K€ – 1,8 M€ HT",
      duration: "24 mois",
      teamSize: "5–9 consultants",
      deadline: "1er août 2025",
      axes: [
        {
          title: "Axe 1 — Blockchain traçabilité",
          description: "Passeport numérique produit sur Ethereum/Polygon pour certifier l'authenticité de chaque bouteille, intégration NFC, auditabilité de la chaîne de custody de la cave au client.",
        },
        {
          title: "Axe 2 — Customer Data Platform",
          description: "CDP unifié agrégeant les données des 27 maisons, profils clients 360°, segmentation IA, respect RGPD et conformité des transferts internationaux de données.",
        },
        {
          title: "Axe 3 — IA vinicole prédictive",
          description: "Modèles de recommandation personnalisée (accords mets-vins, cuvées), prédiction des millésimes, chatbot sommelierIA multi-maisons en 6 langues.",
        },
        {
          title: "Axe 4 — E-commerce & expérience phygitale",
          description: "Refonte des parcours d'achat en ligne et en boutique, intégration de l'API blockchain pour la vérification d'authenticité à la caisse, personnalisation en temps réel.",
        },
      ],
      keyRequirements: [
        "Expérience en architecture blockchain (Ethereum, Polygon ou Hyperledger)",
        "Références en Customer Data Platform et personnalisation IA à grande échelle",
        "Sensibilité au secteur du luxe et aux enjeux de marque",
        "Capacité bilingue FR/EN pour les livrables et ateliers",
        "Certification cloud (AWS ou Azure) pour les équipes Data",
      ],
    },
  },
  {
    id: "agronomie",
    sector: "Agronomie",
    Icon: Leaf,
    accentTw: "text-emerald-400",
    borderTw: "border-emerald-500/40",
    bgGradient: "from-emerald-500/15 via-transparent to-green-500/10",
    iconBg: "bg-emerald-500/20",
    client: "Clugny Group",
    title: "Défi Agronomie",
    description:
      "Clugny Group, acteur de la transition F-Gaz, veut déployer une plateforme IoT de monitoring environnemental et d'optimisation de ses tournées de collecte de fluides frigorigènes. mc2i a-t-il déjà géré ce type de projet data & capteurs ?",
    trapHint:
      "IoT environnemental couvre l'agriculture, l'énergie, le satellite... Affinez vos critères de recherche.",
    targetTenderId: "AO-2025-013",
    sectorFilter: "Environnement",
    aoData: {
      reference: "CLGO-AO-2025-FROID-002",
      fullTitle: "Plateforme numérique de gestion de la transition F-Gaz et optimisation des tournées de collecte de fluides frigorigènes",
      clientContext:
        "Clugny Group opère 12 centres de collecte et régénération de fluides frigorigènes en France. La réglementation F-Gaz 2024 impose une traçabilité renforcée et une réduction progressive des HFC. Le groupe cherche à digitaliser l'ensemble de la chaîne — de la détection des fuites à la certification de destruction.",
      budget: "2,1 M€ HT",
      duration: "30 mois",
      teamSize: "7–12 consultants",
      deadline: "15 septembre 2025",
      axes: [
        {
          title: "Axe 1 — Monitoring IoT détection fuites",
          description: "Réseau de capteurs de détection de fuites F-Gaz sur sites industriels clients, dashboard temps réel, alertes réglementaires automatiques, intégration avec les registres officiels.",
        },
        {
          title: "Axe 2 — Optimisation tournées collecte",
          description: "Algorithme de tournées dynamiques pour les techniciens de collecte, prise en compte des contraintes réglementaires (délais d'intervention), optimisation CO₂ des déplacements.",
        },
        {
          title: "Axe 3 — Traçabilité réglementaire F-Gaz",
          description: "Registre numérique conforme F-Gaz 2024/573/EU, passeport fluide de la collecte à la régénération ou destruction, API vers les organismes de certification (COFRAC).",
        },
        {
          title: "Axe 4 — Reporting ESG & conformité",
          description: "Tableaux de bord RSE pour les clients industriels, calcul automatique des équivalents CO₂ évités, préparation aux audits réglementaires et certifications ISO 14001.",
        },
      ],
      keyRequirements: [
        "Connaissance des réglementations F-Gaz et environnementales françaises/européennes",
        "Expérience en optimisation de tournées et logistique (VRP, algorithmes génétiques)",
        "Maîtrise des architectures IoT pour les environnements industriels",
        "Références en projets de traçabilité réglementaire",
        "Capacité à intégrer avec des systèmes ERP industriels (SAP, Oracle)",
      ],
    },
  },
  {
    id: "finance",
    sector: "Finance",
    Icon: Landmark,
    accentTw: "text-sky-400",
    borderTw: "border-sky-500/40",
    bgGradient: "from-sky-500/15 via-transparent to-blue-500/10",
    iconBg: "bg-sky-500/20",
    client: "BNP Paribas",
    title: "Défi Finance",
    description:
      "BNP Paribas veut moderniser ses modèles de scoring crédit et renforcer sa conformité AML grâce à l'IA générative. Des dizaines de systèmes legacy à intégrer, une réglementation BÂLE IV en fond — mc2i peut-il tenir le rythme ?",
    trapHint:
      "Risque financier & conformité : ne confondez pas transformation Agile d'une banque et audit de sécurité cyber. Les besoins métier sont très différents.",
    targetTenderId: "AO-2025-007",
    sectorFilter: "Finance",
    aoData: {
      reference: "BNP-DSIG-2025-117",
      fullTitle: "Modernisation des modèles de risque crédit et déploiement d'une IA générative compliance (AML/KYC)",
      clientContext:
        "BNP Paribas Corporate & Institutional Banking gère un portefeuille de 1 200 milliards d'euros d'actifs. Dans le cadre de l'entrée en vigueur de BÂLE IV (2025) et des nouvelles exigences AMLD6, la banque doit refondre ses modèles de scoring crédit et déployer une IA pour la détection des transactions suspectes.",
      budget: "2 M€ – 4,5 M€ HT",
      duration: "36 mois",
      teamSize: "10–18 consultants",
      deadline: "31 octobre 2025",
      axes: [
        {
          title: "Axe 1 — Scoring crédit ML nouvelle génération",
          description: "Remplacement des modèles scorecards statiques par des modèles ML (XGBoost, LightGBM, réseaux de neurones), explicabilité SHAP pour conformité réglementaire, backtesting sur 5 ans d'historique.",
        },
        {
          title: "Axe 2 — IA générative compliance AML",
          description: "LLM fine-tuné sur les règles AMLD6 et FATF pour l'analyse automatique des alertes AML, réduction de 60% des faux positifs visée, piste d'audit complète pour les régulateurs.",
        },
        {
          title: "Axe 3 — KYC & vérification d'identité",
          description: "Automatisation du processus KYC par vision IA (OCR, biométrie), intégration avec les registres publics européens, conformité eIDAS 2.0, délai d'onboarding client réduit de 5 jours à 4h.",
        },
        {
          title: "Axe 4 — Data governance & MLOps",
          description: "Mise en place du Data Mesh pour les données risque, pipeline MLOps pour le re-entraînement continu des modèles, monitoring de dérive (data drift, concept drift), gouvernance conforme RGPD.",
        },
      ],
      keyRequirements: [
        "Expertise en modélisation du risque crédit et connaissance de BÂLE IV",
        "Références en projets AML/KYC dans le secteur bancaire européen",
        "Maîtrise des LLM et techniques de fine-tuning pour domaines réglementés",
        "Habilitation possible pour données financières sensibles",
        "Capacité à travailler dans un environnement on-premise sécurisé (pas de cloud public)",
      ],
    },
  },
];
