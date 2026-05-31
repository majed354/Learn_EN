import { ArrowRight, CheckCircle2, RotateCcw, Volume2 } from "lucide-react";
import type { EvaluationResult } from "../lib/scoring";
import { ProgressBar } from "./ProgressBar";

type FeedbackPanelProps = {
  result: EvaluationResult | null;
  isSubmitting: boolean;
  error: string | null;
  onRetry: () => void;
  onNext: () => void;
  onSpeak: (text: string) => void;
};

export function FeedbackPanel({
  result,
  isSubmitting,
  error,
  onRetry,
  onNext,
  onSpeak
}: FeedbackPanelProps) {
  if (isSubmitting) {
    return (
      <section className="feedback-panel loading" aria-live="polite">
        <div className="spinner" />
        <h2>Checking your answer...</h2>
        <p>Keep the phrase in your mouth. Do not translate.</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="feedback-panel">
        <h2>Could not check this attempt</h2>
        <p>{error}</p>
        <button className="secondary-button" type="button" onClick={onRetry}>
          <RotateCcw size={18} aria-hidden="true" />
          Retry
        </button>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="feedback-panel empty">
        <h2>Speak fast.</h2>
        <p>Recording stops automatically. Your score and progress will appear here after each attempt.</p>
      </section>
    );
  }

  const cleanAnswer =
    result.passed && result.error_type === "none" && result.grammar >= 85 && result.naturalness >= 80;
  const betterAnswers = getBetterAnswers(result);
  const spokenWords = result.transcript?.trim() || "No speech detected.";
  const correctedWords = result.corrected_answer?.trim();
  const showCorrection = correctedWords
    ? correctedWords.toLowerCase() !== spokenWords.toLowerCase()
    : false;

  return (
    <section className={`feedback-panel ${result.passed ? "passed" : "retry"}`} aria-live="polite">
      <div className="feedback-heading">
        <span className="result-pill">{result.passed ? "Good response" : "Not automatic yet"}</span>
        {result.mode ? <span className="mode-pill">{result.mode}</span> : null}
      </div>
      <div className="score-stack">
        <ProgressBar value={result.meaning} label="Meaning" tone={result.meaning >= 70 ? "green" : "red"} />
        <ProgressBar value={result.grammar} label="Grammar" tone={result.grammar >= 70 ? "green" : "amber"} />
        <ProgressBar
          value={result.naturalness}
          label="Naturalness"
          tone={result.naturalness >= 70 ? "green" : "amber"}
        />
        <ProgressBar value={result.speed} label="Speed" tone={result.speed >= 75 ? "green" : "amber"} />
      </div>
      <div className="answer-block">
        <span className="answer-label">
          Your words
          {cleanAnswer ? <CheckCircle2 size={16} aria-label="Correct answer" /> : null}
        </span>
        <p>{spokenWords}</p>
      </div>
      {showCorrection ? (
        <div className="answer-block corrected-answer">
          <span>Corrected</span>
          <p>{correctedWords}</p>
        </div>
      ) : null}
      <div className="answer-block best-answer">
        <span>Say it like this</span>
        <div className="answer-options">
          {betterAnswers.map((answer, index) => (
            <div className="answer-option" key={`${answer}-${index}`}>
              <p>{answer}</p>
              <button
                className="answer-play-button"
                type="button"
                onClick={() => onSpeak(answer)}
                title={`Play option ${index + 1}`}
              >
                <Volume2 size={17} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <p className="coach-tip">{result.feedback_en}</p>
      <div className="feedback-actions">
        <button className="secondary-button" type="button" onClick={onRetry}>
          <RotateCcw size={18} aria-hidden="true" />
          Retry
        </button>
        <button className="primary-button" type="button" onClick={onNext}>
          <span>Next</span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function getBetterAnswers(result: EvaluationResult) {
  const answers = [...(result.better_answers ?? []), result.better_answer].filter(Boolean);
  const unique: string[] = [];

  for (const answer of answers) {
    if (unique.some((item) => item.toLowerCase() === answer.toLowerCase())) continue;
    unique.push(answer);
    if (unique.length === 3) break;
  }

  return unique.length ? unique : [result.better_answer];
}
