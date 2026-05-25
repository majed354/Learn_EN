import { RotateCcw, Volume2, ArrowRight } from "lucide-react";
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
        <h2>Speak fast, then stop.</h2>
        <p>Your score and progress will appear here after each attempt.</p>
      </section>
    );
  }

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
        <span>Your words</span>
        <p>{result.transcript}</p>
      </div>
      <div className="answer-block best-answer">
        <span>Say it like this</span>
        <p>{result.better_answer}</p>
        <button className="icon-button" type="button" onClick={() => onSpeak(result.better_answer)} title="Play answer">
          <Volume2 size={18} aria-hidden="true" />
        </button>
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
