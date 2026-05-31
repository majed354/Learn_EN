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
  const response = Math.max(0, responseTimeMs);
  const fastLimit = target * 0.45;

  if (response <= fastLimit) return 100;

  if (response <= target) {
    const progress = (response - fastLimit) / (target - fastLimit);
    return clampScore(100 - progress * 25);
  }

  if (response <= target * 1.4) {
    const progress = (response - target) / (target * 0.4);
    return clampScore(75 - progress * 25);
  }

  const progress = Math.min(1, (response - target * 1.4) / (target * 0.8));
  return clampScore(50 - progress * 30);
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
