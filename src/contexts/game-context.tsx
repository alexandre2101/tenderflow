"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { ChallengeCard } from "@/lib/game-data";

export const GAME_DURATION = 180;

export type GameStatus = "idle" | "playing" | "won" | "timeup";

interface GameContextType {
  status: GameStatus;
  challenge: ChallengeCard | null;
  timeLeft: number;
  startChallenge: (card: ChallengeCard) => void;
  triggerWin: () => void;
  reset: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [challenge, setChallenge] = useState<ChallengeCard | null>(null);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startChallenge = useCallback((card: ChallengeCard) => {
    clearTimer();
    setChallenge(card);
    setTimeLeft(GAME_DURATION);
    setStatus("playing");

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setStatus("timeup");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const triggerWin = useCallback(() => {
    clearTimer();
    setStatus("won");
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setStatus("idle");
    setChallenge(null);
    setTimeLeft(GAME_DURATION);
  }, []);

  useEffect(() => () => clearTimer(), []);

  return (
    <GameContext.Provider
      value={{ status, challenge, timeLeft, startChallenge, triggerWin, reset }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
