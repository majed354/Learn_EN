export type ErrorType =
  | "none"
  | "too_slow"
  | "wrong_meaning"
  | "grammar"
  | "unnatural"
  | "unclear_audio";

export type EvaluationResult = {
  transcript: string;
  corrected_answer: string;
  meaning: number;
  grammar: number;
  naturalness: number;
  speed: number;
  overall: number;
  passed: boolean;
  perfect: boolean;
  better_answer: string;
  better_answers: string[];
  feedback_en: string;
  error_type: ErrorType;
  mode?: "live" | "demo" | "heuristic";
};

export function speedScore(responseTimeMs: number, targetMs = 5000) {
  const target = Math.max(2500, targetMs);
  if (responseTimeMs <= target * 0.6) return 100;
  if (responseTimeMs <= target) return 75;
  if (responseTimeMs <= target * 1.4) return 50;
  return 20;
}

export function clampScore(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getTargetMs(mode: TrainingMode) {
  if (mode === "comfort") return 7000;
  if (mode === "normal") return 5000;
  if (mode === "reflex") return 3000;
  return 2500;
}

export type TrainingMode = "comfort" | "normal" | "reflex" | "challenge";

export const trainingModes: Array<{
  id: TrainingMode;
  label: string;
  seconds: string;
}> = [
  { id: "comfort", label: "Comfort", seconds: "7s" },
  { id: "normal", label: "A2 Normal", seconds: "5s" },
  { id: "reflex", label: "Reflex", seconds: "3s" },
  { id: "challenge", label: "Challenge", seconds: "2.5s" }
];
