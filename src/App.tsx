import { BarChart3, CheckCircle2, Dumbbell, ListChecks, PlayCircle, RotateCcw, Trophy, XCircle } from "lucide-react";
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

type View = "train" | "test" | "review" | "stats";

const FAST_TEST_SECONDS_OPTIONS = [5, 8] as const;
const FAST_TEST_LIMIT = 20;
const FAST_TEST_MAX_MISTAKES = 3;
const FAST_TEST_FEEDBACK_MS = 750;
type FastTestSeconds = (typeof FAST_TEST_SECONDS_OPTIONS)[number];
type FastTestCategory = Situation["category"] | "all";

const fastTestCategories: FastTestCategory[] = [
  "all",
  ...Array.from(new Set(situations.map((situation) => situation.category)))
];

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
      const evaluation = await submitAnswer(audioBlob, currentSituation, responseTimeMs, targetMs);
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
          <button className={view === "test" ? "active" : ""} type="button" onClick={() => setView("test")}>
            <PlayCircle size={17} aria-hidden="true" />
            <span>Test</span>
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

      {view === "test" ? <FastTestView /> : null}

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

type TestRun = {
  status: "running" | "finished";
  queue: Situation[];
  index: number;
  correct: number;
  mistakes: number;
  attempts: number;
  lastResult: EvaluationResult | null;
  lastPassed: boolean | null;
  lastMessage: string | null;
};

function FastTestView() {
  const [seconds, setSeconds] = useState<FastTestSeconds>(5);
  const [category, setCategory] = useState<FastTestCategory>("all");
  const [run, setRun] = useState<TestRun>(() => createFastTestRun(getFastTestPool("all")));
  const [cueStartedAt, setCueStartedAt] = useState<number | null>(() => Date.now());
  const [testResetKey, setTestResetKey] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  const targetMs = seconds * 1000;
  const currentSituation = run.queue[run.index];
  const hasResultFlash = run.lastPassed !== null || Boolean(run.lastMessage || run.lastResult);
  const deadlineAt = run.status === "running" && cueStartedAt ? cueStartedAt + targetMs : null;
  const remainingMs = deadlineAt ? Math.max(0, deadlineAt - now) : targetMs;
  const score = run.attempts ? Math.round((run.correct / run.attempts) * 100) : 0;
  const autoStartKey =
    currentSituation && cueStartedAt && run.status === "running" && !isSubmitting && !hasResultFlash
      ? `${currentSituation.id}-${cueStartedAt}-${seconds}`
      : null;

  useEffect(() => {
    if (run.status !== "running" || !cueStartedAt) return;
    const interval = window.setInterval(() => setNow(Date.now()), 80);
    return () => window.clearInterval(interval);
  }, [run.status, cueStartedAt]);

  useEffect(() => {
    if (run.status !== "running" || !cueStartedAt || run.lastMessage || run.lastResult) return;

    const timeout = window.setTimeout(() => {
      if (!isRecording && !isSubmitting) {
        recordTestMistake(`Too slow. Answer inside ${seconds} seconds.`);
      }
    }, Math.max(0, cueStartedAt + targetMs - Date.now() + 80));

    return () => window.clearTimeout(timeout);
  }, [run.status, cueStartedAt, run.lastMessage, run.lastResult, isRecording, isSubmitting, seconds, targetMs]);

  useEffect(() => {
    if (run.status !== "running" || run.lastPassed === null) return;

    const timeout = window.setTimeout(() => {
      nextCue();
    }, FAST_TEST_FEEDBACK_MS);

    return () => window.clearTimeout(timeout);
  }, [run.status, run.lastPassed, run.attempts]);

  function startTest(nextSeconds = seconds, nextCategory = category) {
    const startedAt = Date.now();
    setRun(createFastTestRun(getFastTestPool(nextCategory)));
    setCueStartedAt(startedAt);
    setNow(startedAt);
    setIsRecording(false);
    setIsSubmitting(false);
    setError(null);
    setTestResetKey((key) => key + 1);
  }

  function handleSecondsChange(nextSeconds: FastTestSeconds) {
    setSeconds(nextSeconds);
    startTest(nextSeconds, category);
  }

  function handleCategoryChange(nextCategory: FastTestCategory) {
    setCategory(nextCategory);
    startTest(seconds, nextCategory);
  }

  async function handleTestRecordingStop(audioBlob: Blob, responseTimeMs: number) {
    setIsRecording(false);
    if (!currentSituation) return;

    if (responseTimeMs > targetMs + 400) {
      recordTestMistake(`Too slow. Answer inside ${seconds} seconds.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setCueStartedAt(null);

    try {
      const evaluation = await submitAnswer(audioBlob, currentSituation, responseTimeMs, targetMs);
      recordTestEvaluation(evaluation);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not evaluate this answer.");
      recordTestMistake("Could not evaluate this answer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function recordTestEvaluation(evaluation: EvaluationResult) {
    const passed = evaluation.passed && evaluation.speed >= 75;
    const message = passed
      ? "Accepted"
      : evaluation.error_type === "wrong_meaning"
        ? "Wrong meaning"
        : "Try a clearer phrase";
    setRun((previous) => advanceTestRun(previous, passed, message, evaluation));
  }

  function recordTestMistake(message: string) {
    setCueStartedAt(null);
    setIsRecording(false);
    setRun((previous) => advanceTestRun(previous, false, message, null));
  }

  function nextCue() {
    setRun((previous) => ({
      ...previous,
      index: previous.index + 1,
      lastResult: null,
      lastPassed: null,
      lastMessage: null
    }));
    setCueStartedAt(Date.now());
    setNow(Date.now());
    setError(null);
  }

  const controls = (
    <div className="test-controls" aria-label="Fast test settings">
      <div className="test-control-group">
        <span>Seconds</span>
        <div className="segmented-control" aria-label="Seconds per cue">
          {FAST_TEST_SECONDS_OPTIONS.map((option) => (
            <button
              className={seconds === option ? "active" : ""}
              key={option}
              type="button"
              onClick={() => handleSecondsChange(option)}
            >
              {option}s
            </button>
          ))}
        </div>
      </div>
      <label className="test-control-group">
        <span>Topic</span>
        <select value={category} onChange={(event) => handleCategoryChange(event.target.value as FastTestCategory)}>
          {fastTestCategories.map((item) => (
            <option key={item} value={item}>
              {formatCategoryLabel(item)} ({getFastTestPool(item).length})
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  if (!run.queue.length) {
    return (
      <section className="fast-test-layout">
        {controls}
        <section className="test-result-panel">
          <span className="eyebrow">Fast Test</span>
          <p>No cues are available for this topic yet.</p>
        </section>
      </section>
    );
  }

  if (run.status === "finished") {
    return (
      <section className="fast-test-layout">
        {controls}
        <section className="test-result-panel">
          <span className="eyebrow">Fast Test Score</span>
          <strong>{score}%</strong>
          <p>
            {run.correct} correct / {run.attempts} attempts. Mistakes: {run.mistakes}.
          </p>
          <button className="primary-button" type="button" onClick={() => startTest()}>
            Try again
          </button>
        </section>
      </section>
    );
  }

  return (
    <section className="fast-test-layout">
      {controls}
      <div className="test-score-strip">
        <span>
          Cue <strong>{run.index + 1}</strong>/{run.queue.length}
        </span>
        <span>
          Time <strong>{seconds}s</strong>
        </span>
        <span>
          Correct <strong>{run.correct}</strong>
        </span>
        <span>
          Mistakes <strong>{run.mistakes}/{FAST_TEST_MAX_MISTAKES}</strong>
        </span>
        <span>
          Score <strong>{score}%</strong>
        </span>
      </div>

      {currentSituation ? (
        <div className="test-card">
          <div className="test-image-wrap">
            <SituationImage className="test-image" situation={currentSituation} />
          </div>
          <div className="test-prompt">
            <span>{currentSituation.category.replace("-", " ")}</span>
            <h2>{currentSituation.prompt}</h2>
          </div>
          {isSubmitting ? (
            <div className="test-flash checking" aria-live="polite">
              <span>Checking...</span>
            </div>
          ) : null}
          {run.lastPassed !== null ? (
            <div className={`test-flash ${run.lastPassed ? "accepted" : "missed"}`} aria-live="polite">
              {run.lastPassed ? <CheckCircle2 size={58} aria-hidden="true" /> : <XCircle size={58} aria-hidden="true" />}
              <span>{run.lastPassed ? "Accepted" : "Mistake"}</span>
              <small>{run.lastMessage}</small>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="practice-panel test-practice-panel">
        <div className={`timer ${remainingMs === 0 ? "over" : ""}`}>
          <span>{(remainingMs / 1000).toFixed(1)}</span>
          <small>seconds</small>
        </div>
        <AudioRecorder
          autoStartKey={autoStartKey}
          resetKey={testResetKey}
          keepStreamAlive
          disabled={isSubmitting || hasResultFlash}
          responseStartedAt={cueStartedAt}
          stopAt={deadlineAt}
          onRecordingStart={() => setIsRecording(true)}
          onRecordingStop={handleTestRecordingStop}
        />
      </div>

      {error ? (
        <section className="test-message-panel">
          <h2>Check failed</h2>
          <p>{error}</p>
        </section>
      ) : null}
    </section>
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

function createFastTestRun(pool: Situation[]): TestRun {
  return {
    status: "running",
    queue: shuffleSituations(pool).slice(0, FAST_TEST_LIMIT),
    index: 0,
    correct: 0,
    mistakes: 0,
    attempts: 0,
    lastResult: null,
    lastPassed: null,
    lastMessage: null
  };
}

function getFastTestPool(category: FastTestCategory) {
  return category === "all" ? situations : situations.filter((situation) => situation.category === category);
}

function formatCategoryLabel(category: FastTestCategory) {
  if (category === "all") return "All topics";
  return category
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function advanceTestRun(
  previous: TestRun,
  passed: boolean,
  message: string | null,
  result: EvaluationResult | null
): TestRun {
  const attempts = previous.attempts + 1;
  const correct = previous.correct + (passed ? 1 : 0);
  const mistakes = previous.mistakes + (passed ? 0 : 1);
  const finished = mistakes >= FAST_TEST_MAX_MISTAKES || attempts >= previous.queue.length;

  return {
    ...previous,
    status: finished ? "finished" : "running",
    attempts,
    correct,
    mistakes,
    lastResult: result,
    lastPassed: passed,
    lastMessage: message
  };
}

function shuffleSituations(items: Situation[]) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
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
