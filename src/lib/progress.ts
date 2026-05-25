import type { Situation, SituationCategory } from "../data/situations";
import type { EvaluationResult } from "./scoring";

export type ProgressStatus = "new" | "learning" | "weak" | "automatic";

export type SituationProgress = {
  situationId: string;
  attempts: number;
  successes: number;
  failures: number;
  lastScore: number;
  bestScore: number;
  streak: number;
  successDays: string[];
  lastPracticedAt?: string;
  nextReviewAt?: string;
  status: ProgressStatus;
};

export type ProgressState = Record<string, SituationProgress>;

export type ProgressSummary = {
  mastery: number;
  automaticCount: number;
  weakCount: number;
  dueCount: number;
  attempts: number;
  successRate: number;
  currentStreak: number;
  categories: Record<SituationCategory, number>;
};

const STORAGE_KEY = "english-reflex-progress-v1";

export function emptyProgressFor(situationId: string): SituationProgress {
  return {
    situationId,
    attempts: 0,
    successes: 0,
    failures: 0,
    lastScore: 0,
    bestScore: 0,
    streak: 0,
    successDays: [],
    status: "new"
  };
}

export function loadProgress(): ProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressState;
  } catch {
    return {};
  }
}

export function saveProgress(progress: ProgressState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function updateSituationProgress(
  progress: ProgressState,
  situationId: string,
  evaluation: EvaluationResult
): ProgressState {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const previous = progress[situationId] ?? emptyProgressFor(situationId);
  const passed = evaluation.passed;
  const successDays = passed
    ? Array.from(new Set([...previous.successDays, today]))
    : previous.successDays;

  const attempts = previous.attempts + 1;
  const successes = previous.successes + (passed ? 1 : 0);
  const failures = previous.failures + (passed ? 0 : 1);
  const streak = passed ? previous.streak + 1 : 0;
  const nextReviewAt = getNextReviewAt(now, passed, evaluation.overall);
  const status = getProgressStatus({
    ...previous,
    attempts,
    successes,
    failures,
    streak,
    successDays,
    lastScore: evaluation.overall,
    bestScore: Math.max(previous.bestScore, evaluation.overall)
  });

  return {
    ...progress,
    [situationId]: {
      ...previous,
      attempts,
      successes,
      failures,
      lastScore: evaluation.overall,
      bestScore: Math.max(previous.bestScore, evaluation.overall),
      streak,
      successDays,
      lastPracticedAt: now.toISOString(),
      nextReviewAt,
      status
    }
  };
}

export function getProgressSummary(situations: Situation[], progress: ProgressState): ProgressSummary {
  const categoryBuckets = {} as Record<SituationCategory, number[]>;
  let totalMastery = 0;
  let automaticCount = 0;
  let weakCount = 0;
  let dueCount = 0;
  let attempts = 0;
  let successes = 0;
  let currentStreak = 0;

  for (const situation of situations) {
    const item = progress[situation.id] ?? emptyProgressFor(situation.id);
    const mastery = getSituationMastery(item);
    totalMastery += mastery;
    attempts += item.attempts;
    successes += item.successes;
    currentStreak = Math.max(currentStreak, item.streak);
    if (item.status === "automatic") automaticCount += 1;
    if (item.status === "weak") weakCount += 1;
    if (isDue(item)) dueCount += 1;
    categoryBuckets[situation.category] ??= [];
    categoryBuckets[situation.category].push(mastery);
  }

  const categories = Object.fromEntries(
    Object.entries(categoryBuckets).map(([category, scores]) => [
      category,
      Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length)
    ])
  ) as Record<SituationCategory, number>;

  return {
    mastery: situations.length ? Math.round(totalMastery / situations.length) : 0,
    automaticCount,
    weakCount,
    dueCount,
    attempts,
    successRate: attempts ? Math.round((successes / attempts) * 100) : 0,
    currentStreak,
    categories
  };
}

export function getSituationMastery(item: SituationProgress) {
  if (item.status === "automatic") return 100;
  if (item.attempts === 0) return 0;
  const dayCredit = Math.min(30, item.successDays.length * 10);
  const streakCredit = Math.min(15, item.streak * 5);
  const scoreCredit = Math.round(item.bestScore * 0.55);
  const penalty = item.status === "weak" ? 15 : 0;
  return Math.max(0, Math.min(99, scoreCredit + dayCredit + streakCredit - penalty));
}

export function isDue(item: SituationProgress) {
  if (!item.nextReviewAt) return false;
  return new Date(item.nextReviewAt).getTime() <= Date.now();
}

export function resetProgress() {
  window.localStorage.removeItem(STORAGE_KEY);
}

function getProgressStatus(item: SituationProgress): ProgressStatus {
  if (item.successDays.length >= 3 && item.bestScore >= 85) return "automatic";
  if (item.failures > item.successes && item.attempts >= 2) return "weak";
  if (item.attempts > 0) return "learning";
  return "new";
}

function getNextReviewAt(now: Date, passed: boolean, overall: number) {
  const next = new Date(now);
  if (!passed) next.setMinutes(next.getMinutes() + 3);
  else if (overall < 75) next.setDate(next.getDate() + 1);
  else if (overall < 88) next.setDate(next.getDate() + 3);
  else next.setDate(next.getDate() + 7);
  return next.toISOString();
}
