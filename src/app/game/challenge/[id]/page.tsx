"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Timer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { challengeCards } from "@/lib/game-data";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function ChallengeBriefingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const card = challengeCards.find((c) => c.id === id);

  if (!card) {
    return (
      <div className="min-h-screen bg-[#080812] flex items-center justify-center">
        <p className="text-white/50">Défi introuvable.</p>
      </div>
    );
  }

  const { aoData } = card;
  const Icon = card.Icon;

  const handleLaunch = () => {
    router.push("/tenders");
  };

  return (
    <div className="min-h-screen bg-[#080812] text-white relative overflow-x-hidden">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.9 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0.9 0 0) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow */}
      <div className={`fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-10 bg-gradient-to-br ${card.bgGradient}`} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        {/* Top nav */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => router.push("/game")}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux défis
          </button>

          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5">
            <Timer className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs text-amber-300/80 font-medium">Le chronomètre démarre à votre lancement</span>
          </div>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          {/* Header */}
          <motion.div variants={item} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg} border ${card.borderTw}`}>
                <Icon className={`h-6 w-6 ${card.accentTw}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={`${card.accentTw} border-current/30 text-xs uppercase tracking-wider`}>
                    {card.sector}
                  </Badge>
                  <Badge variant="outline" className="text-white/40 border-white/10 text-xs">
                    {aoData.reference}
                  </Badge>
                </div>
                <p className={`text-2xl font-bold ${card.accentTw} mt-1`}>{card.client}</p>
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-bold leading-snug text-white/90 font-[family-name:var(--font-heading)]">
              {aoData.fullTitle}
            </h1>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-3">
              {[
                { Icon: DollarSign, label: "Budget", value: aoData.budget },
                { Icon: Clock, label: "Durée", value: aoData.duration },
                { Icon: Users, label: "Équipe", value: aoData.teamSize },
                { Icon: Calendar, label: "Date limite", value: aoData.deadline },
              ].map((meta) => {
                const MetaIcon = meta.Icon;
                return (
                  <div key={meta.label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                    <MetaIcon className={`h-3.5 w-3.5 ${card.accentTw}`} />
                    <span className="text-xs text-white/40">{meta.label} :</span>
                    <span className="text-xs font-semibold text-white/80">{meta.value}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={item}>
            <Separator className="bg-white/5" />
          </motion.div>

          {/* Context */}
          <motion.div variants={item} className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className={`h-4 w-4 ${card.accentTw}`} />
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Contexte client</h2>
            </div>
            <p className="text-sm text-white/60 leading-relaxed bg-white/3 border border-white/5 rounded-xl p-4">
              {aoData.clientContext}
            </p>
          </motion.div>

          {/* Axes */}
          <motion.div variants={item} className="space-y-3">
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Axes de la mission</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {aoData.axes.map((axis, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border ${card.borderTw} bg-gradient-to-br ${card.bgGradient} p-4 space-y-2`}
                >
                  <p className={`text-xs font-bold ${card.accentTw} uppercase tracking-wide`}>{axis.title}</p>
                  <p className="text-xs text-white/55 leading-relaxed">{axis.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Requirements */}
          <motion.div variants={item} className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`h-4 w-4 ${card.accentTw}`} />
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Critères de sélection</h2>
            </div>
            <ul className="space-y-2">
              {aoData.keyRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-white/60">
                  <span className={`mt-0.5 h-4 w-4 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${card.iconBg} ${card.accentTw}`}>
                    {idx + 1}
                  </span>
                  {req}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Trap warning */}
          <motion.div variants={item}>
            <div className="flex items-start gap-3 rounded-xl bg-amber-500/8 border border-amber-500/20 p-4">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-400 mb-1">Attention — Faux amis</p>
                <p className="text-xs text-amber-300/70 leading-relaxed">{card.trapHint}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <Separator className="bg-white/5" />
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-10"
          >
            <p className="text-sm text-white/35 text-center sm:text-left">
              Vous avez <span className="text-white/60 font-semibold">3 minutes</span> pour identifier l&apos;AO mc2i correspondant dans la bibliothèque.
            </p>
            <Button
              size="lg"
              onClick={handleLaunch}
              className={`gap-3 font-semibold text-base px-8 shrink-0 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 pulse-glow`}
            >
              Lancer la mission
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
