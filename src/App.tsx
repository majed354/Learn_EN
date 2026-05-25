import { BarChart3, Dumbbell, ListChecks, RotateCcw, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AudioRecorder } from "./components/AudioRecorder";
import { FeedbackPanel } from "./components/FeedbackPanel";
import { ProgressBar } from "./components/ProgressBar";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { SituationCard } from "./components/SituationCard";
import { SituationImage } from "./components/SituationImage";
import { Timer } from "./components/Timer";
import { situations } from "./data/situations";
import type { Situation } from "./data/situations";
import { submitAnswer } from "./lib/api";
import {
  emptyProgressFor,
  getProgressSummary,
  getSituationMastery,
  isDue,
  loadProgress,
  resetProgress,
  saveProgress,
  updateSituationProgress
} from "./lib/progress";
import type { ProgressState } from "./lib/progress";
import { getTargetMs, trainingModes } from "./lib/scoring";
import type { EvaluationResult, TrainingMode } from "./lib/scoring";

type View = "train" | "review" | "stats";

function App() {
  const [view, setView] = useState<View>("train");
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [currentId, setCurrentId] = useState(situations[0].id);
  const [mode, setMode] = useState<TrainingMode>("normal");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentSituation = useMemo(
    () => situations.find((situation) => situation.id === currentId) ?? situations[0],
    [currentId]
  );
  const currentProgress = progress[currentSituation.id] ?? emptyProgressFor(currentSituation.id);
  const summary = useMemo(() => getProgressSummary(situations, progress), [progress]);
  const targetMs = getTargetMs(mode);
  const dueSituations = useMemo(
    () =>
      situations.filter((situation) => {
        const item = progress[situation.id] ?? emptyProgressFor(situation.id);
        return isDue(item) || item.status === "weak";
      }),
    [progress]
  );

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  function handleRecordingStart(startTime: number) {
    setStartedAt(startTime);
    setIsRecording(true);
    setResult(null);
    setError(null);
  }

  async function handleRecordingStop(audioBlob: Blob, responseTimeMs: number) {
    setIsRecording(false);
    setIsSubmitting(true);
    setError(null);

    try {
      const evaluation = await submitAnswer(audioBlob, currentSituation, responseTimeMs);
      setResult(evaluation);
      setProgress((previous) => updateSituationProgress(previous, currentSituation.id, evaluation));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not evaluate this attempt.");
    } finally {
      setIsSubmitting(false);
      setStartedAt(null);
    }
  }

  function handleNext() {
    setResult(null);
    setError(null);
    setStartedAt(null);
    setCurrentId(getNextSituation(currentSituation, progress).id);
  }

  function handleRetry() {
    setResult(null);
    setError(null);
    setStartedAt(null);
  }

  function handleResetProgress() {
    resetProgress();
    setProgress({});
    setResult(null);
    setError(null);
  }

  function speak(text: string) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">English Reflex Trainer</span>
          <h1>Visual cue. Fast English response.</h1>
        </div>
        <nav className="view-tabs" aria-label="Sections">
          <button className={view === "train" ? "active" : ""} type="button" onClick={() => setView("train")}>
            <Dumbbell size={17} aria-hidden="true" />
            <span>Train</span>
          </button>
          <button className={view === "review" ? "active" : ""} type="button" onClick={() => setView("review")}>
            <ListChecks size={17} aria-hidden="true" />
            <span>Review</span>
          </button>
          <button className={view === "stats" ? "active" : ""} type="button" onClick={() => setView("stats")}>
            <BarChart3 size={17} aria-hidden="true" />
            <span>Stats</span>
          </button>
        </nav>
      </header>

      <ProgressDashboard summary={summary} totalSituations={situations.length} />

      {view === "train" ? (
        <section className="training-layout">
          <div className="left-column">
            <SituationCard situation={currentSituation} progress={currentProgress} />
            <div className="mode-row" aria-label="Training speed">
              {trainingModes.map((trainingMode) => (
                <button
                  className={trainingMode.id === mode ? "active" : ""}
                  key={trainingMode.id}
                  type="button"
                  onClick={() => setMode(trainingMode.id)}
                >
                  <span>{trainingMode.label}</span>
                  <strong>{trainingMode.seconds}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="right-column">
            <div className="practice-panel">
              <Timer isRunning={isRecording} startedAt={startedAt} targetMs={targetMs} />
              <AudioRecorder
                disabled={isSubmitting}
                onRecordingStart={handleRecordingStart}
                onRecordingStop={handleRecordingStop}
              />
            </div>
            <FeedbackPanel
              result={result}
              isSubmitting={isSubmitting}
              error={error}
              onRetry={handleRetry}
              onNext={handleNext}
              onSpeak={speak}
            />
          </div>
        </section>
      ) : null}

      {view === "review" ? (
        <ReviewView
          dueSituations={dueSituations}
          progress={progress}
          onTrain={(situation) => {
            setCurrentId(situation.id);
            setResult(null);
            setView("train");
          }}
        />
      ) : null}

      {view === "stats" ? (
        <StatsView progress={progress} onReset={handleResetProgress} />
      ) : null}
    </main>
  );
}

function ReviewView({
  dueSituations,
  progress,
  onTrain
}: {
  dueSituations: Situation[];
  progress: ProgressState;
  onTrain: (situation: Situation) => void;
}) {
  const reviewItems = dueSituations.length ? dueSituations : situations.slice(0, 8);

  return (
    <section className="list-view">
      <div className="section-title">
        <Trophy size={22} aria-hidden="true" />
        <h2>{dueSituations.length ? "Ready for review" : "Build your first review queue"}</h2>
      </div>
      <div className="situation-list">
        {reviewItems.map((situation) => {
          const item = progress[situation.id] ?? emptyProgressFor(situation.id);
          const mastery = getSituationMastery(item);
          return (
            <button className="situation-row" key={situation.id} type="button" onClick={() => onTrain(situation)}>
              <SituationImage situation={situation} />
              <span>
                <strong>{situation.prompt}</strong>
                <small>{item.status}</small>
              </span>
              <b>{mastery}%</b>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function StatsView({ progress, onReset }: { progress: ProgressState; onReset: () => void }) {
  const summary = getProgressSummary(situations, progress);
  const categoryEntries = Object.entries(summary.categories).sort((a, b) => b[1] - a[1]);

  return (
    <section className="stats-view">
      <div className="section-title">
        <BarChart3 size={22} aria-hidden="true" />
        <h2>Progress by situation type</h2>
      </div>
      <div className="category-grid">
        {categoryEntries.map(([category, score]) => (
          <div className="category-item" key={category}>
            <ProgressBar value={score} label={category.replace("-", " ")} tone={score >= 70 ? "green" : "amber"} />
          </div>
        ))}
      </div>
      <button className="secondary-button reset-button" type="button" onClick={onReset}>
        <RotateCcw size={18} aria-hidden="true" />
        Reset progress
      </button>
    </section>
  );
}

function getNextSituation(current: Situation, progress: ProgressState) {
  const weakOrDue = situations.find((situation) => {
    if (situation.id === current.id) return false;
    const item = progress[situation.id] ?? emptyProgressFor(situation.id);
    return item.status === "weak" || isDue(item);
  });

  if (weakOrDue) return weakOrDue;
  const currentIndex = situations.findIndex((situation) => situation.id === current.id);
  return situations[(currentIndex + 1) % situations.length];
}

export default App;
