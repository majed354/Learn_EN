import type { Situation } from "../data/situations";
import type { EvaluationResult } from "./scoring";
import { clampScore, speedScore } from "./scoring";

export async function submitAnswer(
  audioBlob: Blob,
  situation: Situation,
  responseTimeMs: number
): Promise<EvaluationResult> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "answer.webm");
  formData.append(
    "situation",
    JSON.stringify({
      id: situation.id,
      prompt: situation.prompt,
      targetMeaning: situation.targetMeaning,
      acceptableAnswers: situation.acceptableAnswers,
      responseTimeMs
    })
  );

  const response = await fetch("/.netlify/functions/evaluate", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    if (import.meta.env.DEV) {
      return demoEvaluation(situation, responseTimeMs);
    }
    const message = await response.text();
    throw new Error(message || "Could not evaluate the answer.");
  }

  const result = (await response.json()) as EvaluationResult;
  return {
    ...result,
    meaning: clampScore(result.meaning),
    grammar: clampScore(result.grammar),
    naturalness: clampScore(result.naturalness),
    speed: clampScore(result.speed),
    overall: clampScore(result.overall)
  };
}

function demoEvaluation(situation: Situation, responseTimeMs: number): EvaluationResult {
  const speed = speedScore(responseTimeMs);
  const meaning = 82;
  const grammar = 78;
  const naturalness = 76;
  const overall = Math.round(meaning * 0.45 + grammar * 0.2 + naturalness * 0.2 + speed * 0.15);

  return {
    transcript: "Demo transcript. Connect API keys for live speech recognition.",
    meaning,
    grammar,
    naturalness,
    speed,
    overall,
    passed: meaning >= 70 && overall >= 65,
    perfect: meaning >= 85 && speed >= 75,
    better_answer: situation.acceptableAnswers[0],
    feedback_en: "Demo mode is active. The full evaluator will use your spoken answer after Netlify keys are set.",
    error_type: speed < 50 ? "too_slow" : "none",
    mode: "demo"
  };
}
