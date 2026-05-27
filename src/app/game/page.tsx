"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Timer, AlertTriangle, ChevronRight, Target, Trophy } from "lucide-react";
import { challengeCards } from "@/lib/game-data";
import { Badge } from "@/components/ui/badge";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function GamePage() {
  const router = useRouter();
  const [launching, setLaunching] = useState<string | null>(null);

  const handleCardClick = (card: (typeof challengeCards)[0]) => {
    if (launching) return;
    setLaunching(card.id);
    setTimeout(() => {
      router.push(`/game/challenge/${card.id}`);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#080812] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.9 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0.9 0 0) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center gap-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary tracking-widest uppercase">
              Trust2Process — mc2i
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-[family-name:var(--font-heading)]">
            Mission{" "}
            <span className="gradient-text">Réponse AO</span>
          </h1>
          <p className="text-base text-white/50 max-w-xl leading-relaxed">
            Choisissez votre secteur. Le chronomètre démarre dès votre sélection.
            Vous avez <span className="text-white/80 font-semibold">3 minutes</span> pour identifier
            l&apos;AO mc2i le plus pertinent et générer votre plan de réponse IA.
          </p>
        </motion.div>

        {/* Mission badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 text-xs"
        >
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/60">
            <Target className="h-3.5 w-3.5 text-primary" />
            Mission 1 — Identifier l&apos;AO similaire dans la base mc2i
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/60">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            Mission 2 — Générer le plan de réponse IA adapté
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/60">
            <Timer className="h-3.5 w-3.5 text-red-400" />
            Chronomètre : 3 minutes
          </div>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full"
        >
          {challengeCards.map((card) => {
            const Icon = card.Icon;
            const isLaunching = launching === card.id;
            return (
              <motion.div
                key={card.id}
                variants={cardAnim}
                whileHover={launching ? {} : { scale: 1.03, y: -4 }}
                whileTap={launching ? {} : { scale: 0.98 }}
                onClick={() => handleCardClick(card)}
                className={`relative cursor-pointer rounded-2xl border bg-gradient-to-br ${card.bgGradient} ${card.borderTw} p-6 flex flex-col gap-4 overflow-hidden transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/40 group`}
              >
                {/* Card header */}
                <div className="flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}>
                    <Icon className={`h-6 w-6 ${card.accentTw}`} />
                  </div>
                  <Badge
                    variant="outline"
                    className={`${card.accentTw} border-current/30 bg-transparent text-xs uppercase tracking-wider`}
                  >
                    {card.sector}
                  </Badge>
                </div>

                {/* Client + title */}
                <div>
                  <p className={`text-2xl font-bold ${card.accentTw} mb-1`}>{card.client}</p>
                  <p className="text-sm font-semibold text-white/80">{card.title}</p>
                </div>

                {/* Description */}
                <p className="text-xs text-white/50 leading-relaxed line-clamp-4">
                  {card.description}
                </p>

                {/* Trap warning */}
                <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-300/80 leading-relaxed">{card.trapHint}</p>
                </div>

                {/* CTA */}
                <AnimatePresence mode="wait">
                  {isLaunching ? (
                    <motion.div
                      key="launching"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 text-sm text-white font-medium"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                      />
                      Lancement de la mission...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="cta"
                      className={`flex items-center justify-between py-2 px-4 rounded-lg bg-white/5 border ${card.borderTw} group-hover:bg-white/10 transition-colors text-sm font-medium text-white/70 group-hover:text-white`}
                    >
                      <span>Accepter la mission</span>
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Shimmer on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-white/25 text-center"
        >
          Trust2Process · Plateforme interne mc2i · Gestion intelligente des appels d&apos;offres
        </motion.p>
      </div>
    </div>
  );
}
