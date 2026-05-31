import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Dumbbell,
  ListChecks,
  Mic,
  PlayCircle,
  RotateCcw,
  Trophy,
  XCircle
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AudioRecorder } from "./components/AudioRecorder";
import { FeedbackPanel } from "./components/FeedbackPanel";
import { ProgressBar } from "./components/ProgressBar";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { SituationCard } from "./components/SituationCard";
import { SituationImage } from "./components/SituationImage";
import { Timer } from "./components/Timer";
import { situations } from "./data/situations";
import type { Situation, SituationCategory } from "./data/situations";
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
import { getTargetMs, speedScore, trainingModes } from "./lib/scoring";
import type { EvaluationResult, TrainingMode } from "./lib/scoring";

type View = "train" | "test" | "review" | "stats";

const TRAINING_QUESTION_OPTIONS = [1, 5, 10, 15, 20, 25, 50, 100, 250] as const;
const FAST_TEST_SECONDS_OPTIONS = [5, 8] as const;
const FAST_TEST_QUESTION_OPTIONS = [10, 20, 50, 100, 250] as const;
const FAST_TEST_MAX_MISTAKES = 3;
const FAST_TEST_FEEDBACK_MS = 750;
const FAST_TEST_CUE_INTRO_MS = 850;
type TrainingSetMode = "path" | "custom";
type FastTestSeconds = (typeof FAST_TEST_SECONDS_OPTIONS)[number];
type FastTestCategory = Situation["category"] | "all";
type FastTestMode = "normal" | "challenge";
type MicrophoneStatus = "idle" | "checking" | "ready" | "blocked";

type TrainingLesson = {
  id: string;
  title: string;
  description: string;
  categories: SituationCategory[];
  count: number;
};

const fastTestCategories: FastTestCategory[] = [
  "all",
  ...Array.from(new Set(situations.map((situation) => situation.category)))
];

const trainingLessons: TrainingLesson[] = [
  {
    id: "arrival-basics",
    title: "Arrival basics",
    description: "Airport, passport, taxi, and first hotel check-in.",
    categories: ["airport", "passport", "taxi", "hotel"],
    count: 20
  },
  {
    id: "hotel-stay",
    title: "Hotel stay",
    description: "Check-in, room issues, payment, and simple help requests.",
    categories: ["hotel", "payment", "directions", "emergency"],
    count: 20
  },
  {
    id: "food-and-service",
    title: "Food and service",
    description: "Restaurant orders, bills, polite requests, and small talk.",
    categories: ["restaurant", "payment", "small-talk"],
    count: 20
  },
  {
    id: "moving-around",
    title: "Moving around",
    description: "Taxi rides, directions, places, prices, and arrival phrases.",
    categories: ["taxi", "directions", "payment"],
    count: 20
  },
  {
    id: "shopping-and-paying",
    title: "Shopping and paying",
    description: "Finding items, asking prices, paying, returns, and receipts.",
    categories: ["shopping", "payment", "small-talk"],
    count: 20
  },
  {
    id: "help-and-emergency",
    title: "Help and emergency",
    description: "Getting help clearly without freezing under pressure.",
    categories: ["emergency", "directions", "hotel", "taxi"],
    count: 20
  },
  {
    id: "polite-daily-replies",
    title: "Polite daily replies",
    description: "Short natural answers for common everyday exchanges.",
    categories: ["small-talk", "restaurant", "hotel", "shopping"],
    count: 20
  },
  {
    id: "full-travel-day",
    title: "Full travel day",
    description: "A mixed route from airport arrival to dinner and payment.",
    categories: ["airport", "passport", "taxi", "hotel", "restaurant", "payment"],
    count: 30
  }
];

function App() {
  const [view, setView] = useState<View>("train");
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [trainingSetMode, setTrainingSetMode] = useState<TrainingSetMode>("path");
  const [trainingLessonId, setTrainingLessonId] = useState(trainingLessons[0].id);
  const [trainingCategory, setTrainingCategory] = useState<FastTestCategory>("all");
  const [trainingCount, setTrainingCount] = useState<number>(20);
  const [trainingQueue, setTrainingQueue] = useState<Situation[]>(() =>
    createTrainingQueue("path", trainingLessons[0].id, "all", 20)
  );
  const [trainingIndex, setTrainingIndex] = useState(0);
  const [mode, setMode] = useState<TrainingMode>("normal");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentSituation = trainingQueue[trainingIndex] ?? situations[0];
  const currentProgress = progress[currentSituation.id] ?? emptyProgressFor(currentSituation.id);
  const summary = useMemo(() => getProgressSummary(situations, progress), [progress]);
  const targetMs = getTargetMs(mode);
  const activeTrainingLesson = getTrainingLesson(trainingLessonId);
  const trainingPool = getFastTestPool(trainingCategory);
  const selectedTrainingCount = Math.min(trainingCount, trainingPool.length);
  const trainingCountOptions = getTrainingCountOptions(trainingPool.length);
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
    setTrainingIndex((previous) => (trainingQueue.length ? (previous + 1) % trainingQueue.length : 0));
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

  function resetTrainingSession(
    nextMode = trainingSetMode,
    nextLessonId = trainingLessonId,
    nextCategory = trainingCategory,
    nextCount = trainingCount
  ) {
    setTrainingQueue(createTrainingQueue(nextMode, nextLessonId, nextCategory, nextCount));
    setTrainingIndex(0);
    setResult(null);
    setError(null);
    setStartedAt(null);
  }

  function handleTrainingSetModeChange(nextMode: TrainingSetMode) {
    setTrainingSetMode(nextMode);
    resetTrainingSession(nextMode, trainingLessonId, trainingCategory, trainingCount);
  }

  function handleTrainingLessonChange(nextLessonId: string) {
    setTrainingLessonId(nextLessonId);
    resetTrainingSession("path", nextLessonId, trainingCategory, trainingCount);
  }

  function handleTrainingCategoryChange(nextCategory: FastTestCategory) {
    setTrainingCategory(nextCategory);
    resetTrainingSession("custom", trainingLessonId, nextCategory, trainingCount);
  }

  function handleTrainingCountChange(nextCount: number) {
    setTrainingCount(nextCount);
    resetTrainingSession("custom", trainingLessonId, trainingCategory, nextCount);
  }

  function refreshTrainingSession() {
    resetTrainingSession(trainingSetMode, trainingLessonId, trainingCategory, trainingCount);
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
            <div className={`training-controls ${trainingSetMode}`} aria-label="Training set settings">
              <div className="test-control-group">
                <span>Plan</span>
                <div className="segmented-control" aria-label="Training plan">
                  <button
                    className={trainingSetMode === "path" ? "active" : ""}
                    type="button"
                    onClick={() => handleTrainingSetModeChange("path")}
                    disabled={isRecording || isSubmitting}
                  >
                    Lessons
                  </button>
                  <button
                    className={trainingSetMode === "custom" ? "active" : ""}
                    type="button"
                    onClick={() => handleTrainingSetModeChange("custom")}
                    disabled={isRecording || isSubmitting}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {trainingSetMode === "path" ? (
                <label className="test-control-group lesson-select">
                  <span>Lesson</span>
                  <select
                    value={trainingLessonId}
                    onChange={(event) => handleTrainingLessonChange(event.target.value)}
                    disabled={isRecording || isSubmitting}
                  >
                    {trainingLessons.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.title} ({lesson.count})
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <>
                  <label className="test-control-group">
                    <span>Topic</span>
                    <select
                      value={trainingCategory}
                      onChange={(event) => handleTrainingCategoryChange(event.target.value as FastTestCategory)}
                      disabled={isRecording || isSubmitting}
                    >
                      {fastTestCategories.map((item) => (
                        <option key={item} value={item}>
                          {formatCategoryLabel(item)} ({getFastTestPool(item).length})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="test-control-group">
                    <span>Cues</span>
                    <select
                      value={selectedTrainingCount}
                      onChange={(event) => handleTrainingCountChange(Number(event.target.value))}
                      disabled={isRecording || isSubmitting}
                    >
                      {trainingCountOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              )}

              <div className="training-set-status">
                <span>{trainingSetMode === "path" ? "Lesson cue" : "Custom set"}</span>
                <strong>
                  {trainingQueue.length ? trainingIndex + 1 : 0}/{trainingQueue.length}
                </strong>
              </div>
              <button
                className="secondary-button training-refresh"
                type="button"
                onClick={refreshTrainingSession}
                disabled={isRecording || isSubmitting}
              >
                {trainingSetMode === "path" ? "Restart" : "Shuffle"}
              </button>
              {trainingSetMode === "path" ? (
                <p className="training-lesson-copy">{activeTrainingLesson.description}</p>
              ) : null}
            </div>
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
                autoStopAfterMs={targetMs}
                manualStopEnabled={false}
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

      {view === "test" ? (
        <FastTestView
          onEvaluation={(situationId, evaluation) => {
            setProgress((previous) => updateSituationProgress(previous, situationId, evaluation));
          }}
        />
      ) : null}

      {view === "review" ? (
        <ReviewView
          dueSituations={dueSituations}
          progress={progress}
          onTrain={(situation) => {
            setTrainingSetMode("custom");
            setTrainingCategory(situation.category);
            setTrainingCount(1);
            setTrainingQueue([situation]);
            setTrainingIndex(0);
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
  status: "ready" | "running" | "finished";
  queue: Situation[];
  index: number;
  correct: number;
  mistakes: number;
  attempts: number;
  history: TestAttempt[];
  lastResult: EvaluationResult | null;
  lastPassed: boolean | null;
  lastMessage: string | null;
};

type TestAttempt = {
  situation: Situation;
  passed: boolean;
  message: string;
  result: EvaluationResult | null;
  responseTimeMs: number | null;
};

function FastTestView({
  onEvaluation
}: {
  onEvaluation: (situationId: string, evaluation: EvaluationResult) => void;
}) {
  const [testMode, setTestMode] = useState<FastTestMode>("normal");
  const [seconds, setSeconds] = useState<FastTestSeconds>(5);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [category, setCategory] = useState<FastTestCategory>("all");
  const [run, setRun] = useState<TestRun>(() => createReadyTestRun(getFastTestPool("all"), 20));
  const [cueStartedAt, setCueStartedAt] = useState<number | null>(null);
  const [cueIntroUntil, setCueIntroUntil] = useState<number | null>(null);
  const [testResetKey, setTestResetKey] = useState(0);
  const [micStatus, setMicStatus] = useState<MicrophoneStatus>("idle");
  const [micMessage, setMicMessage] = useState("Check the microphone before the timer starts.");
  const [reviewingMistakes, setReviewingMistakes] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  const targetMs = seconds * 1000;
  const currentPool = getFastTestPool(category);
  const selectedQuestionCount = Math.min(questionCount, currentPool.length);
  const questionCountOptions = getQuestionCountOptions(currentPool.length);
  const currentSituation = run.queue[run.index];
  const hasResultFlash = run.lastPassed !== null || Boolean(run.lastMessage || run.lastResult);
  const deadlineAt = run.status === "running" && cueStartedAt ? cueStartedAt + targetMs : null;
  const remainingMs = deadlineAt ? Math.max(0, deadlineAt - now) : targetMs;
  const score = run.attempts ? Math.round((run.correct / run.attempts) * 100) : 0;
  const missedAttempts = run.history.filter((attempt) => !attempt.passed);
  const testReport = useMemo(() => getTestReport(run.history), [run.history]);
  const introIsVisible = run.status === "running" && cueIntroUntil !== null;
  const autoStartKey =
    currentSituation && cueStartedAt && run.status === "running" && !introIsVisible && !isSubmitting && !hasResultFlash
      ? `${currentSituation.id}-${cueStartedAt}-${seconds}`
      : null;

  useEffect(() => {
    if (run.status !== "running" || (!cueStartedAt && !cueIntroUntil)) return;
    const interval = window.setInterval(() => setNow(Date.now()), 80);
    return () => window.clearInterval(interval);
  }, [run.status, cueStartedAt, cueIntroUntil]);

  useEffect(() => {
    if (run.status !== "running" || !cueIntroUntil) return;

    const timeout = window.setTimeout(() => {
      const startedAt = Date.now();
      setCueStartedAt(startedAt);
      setCueIntroUntil(null);
      setNow(startedAt);
    }, Math.max(0, cueIntroUntil - Date.now()));

    return () => window.clearTimeout(timeout);
  }, [run.status, cueIntroUntil]);

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

  async function checkMicrophone() {
    if (!window.isSecureContext) {
      setMicStatus("blocked");
      setMicMessage("Open the site with HTTPS to use the microphone.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setMicStatus("blocked");
      setMicMessage("This browser does not support microphone recording.");
      return;
    }

    setMicStatus("checking");
    setMicMessage("Listening for permission...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      stream.getTracks().forEach((track) => track.stop());
      setMicStatus("ready");
      setMicMessage("Microphone is ready. Start when you are ready.");
    } catch (caught) {
      setMicStatus("blocked");
      setMicMessage(getMicrophoneCheckMessage(caught));
    }
  }

  function startTest(nextSeconds = seconds, nextCategory = category, nextQuestionCount = questionCount) {
    const startedAt = Date.now();
    setRun(createFastTestRun(getFastTestPool(nextCategory), nextQuestionCount));
    setCueStartedAt(null);
    setCueIntroUntil(startedAt + FAST_TEST_CUE_INTRO_MS);
    setNow(startedAt);
    setIsRecording(false);
    setIsSubmitting(false);
    setError(null);
    setReviewingMistakes(false);
    setTestResetKey((key) => key + 1);
  }

  function handleSecondsChange(nextSeconds: FastTestSeconds) {
    setSeconds(nextSeconds);
    resetTest(nextSeconds, category, questionCount);
  }

  function handleCategoryChange(nextCategory: FastTestCategory) {
    setCategory(nextCategory);
    resetTest(seconds, nextCategory, questionCount);
  }

  function handleQuestionCountChange(nextQuestionCount: number) {
    setQuestionCount(nextQuestionCount);
    resetTest(seconds, category, nextQuestionCount);
  }

  function handleTestModeChange(nextMode: FastTestMode) {
    setTestMode(nextMode);
    resetTest(seconds, category, questionCount);
  }

  function resetTest(nextSeconds = seconds, nextCategory = category, nextQuestionCount = questionCount) {
    setRun(createReadyTestRun(getFastTestPool(nextCategory), nextQuestionCount));
    setCueStartedAt(null);
    setCueIntroUntil(null);
    setNow(Date.now());
    setIsRecording(false);
    setIsSubmitting(false);
    setError(null);
    setReviewingMistakes(false);
    setTestResetKey((key) => key + 1);
  }

  async function handleTestRecordingStop(audioBlob: Blob, responseTimeMs: number) {
    setIsRecording(false);
    if (!currentSituation) return;

    if (responseTimeMs > targetMs + 400) {
      recordTestMistake(`Too slow. Answer inside ${seconds} seconds.`, responseTimeMs);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setCueStartedAt(null);

    try {
      const evaluation = await submitAnswer(audioBlob, currentSituation, responseTimeMs, targetMs);
      onEvaluation(currentSituation.id, evaluation);
      recordTestEvaluation(evaluation, responseTimeMs);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not evaluate this answer.");
      recordTestMistake("Could not evaluate this answer.", responseTimeMs, false);
    } finally {
      setIsSubmitting(false);
    }
  }

  function recordTestEvaluation(evaluation: EvaluationResult, responseTimeMs: number) {
    const passed = evaluation.passed && evaluation.speed >= 75;
    const message = passed
      ? "Accepted"
      : evaluation.error_type === "wrong_meaning"
        ? "Wrong meaning"
        : "Try a clearer phrase";
    setRun((previous) => advanceTestRun(previous, passed, message, evaluation, responseTimeMs, testMode));
  }

  function recordTestMistake(message: string, responseTimeMs: number | null = null, updatesProgress = true) {
    const syntheticResult =
      currentSituation && updatesProgress
        ? createFastTestMistakeEvaluation(currentSituation, message, responseTimeMs, targetMs)
        : null;

    if (currentSituation && syntheticResult) {
      onEvaluation(currentSituation.id, syntheticResult);
    }

    setCueStartedAt(null);
    setCueIntroUntil(null);
    setIsRecording(false);
    setRun((previous) => advanceTestRun(previous, false, message, syntheticResult, responseTimeMs, testMode));
  }

  function nextCue() {
    setRun((previous) => ({
      ...previous,
      index: previous.index + 1,
      lastResult: null,
      lastPassed: null,
      lastMessage: null
    }));
    const introStartedAt = Date.now();
    setCueStartedAt(null);
    setCueIntroUntil(introStartedAt + FAST_TEST_CUE_INTRO_MS);
    setNow(introStartedAt);
    setError(null);
  }

  function practiceMissedCues() {
    const missedSituations = getUniqueMissedSituations(missedAttempts);
    if (!missedSituations.length) return;
    const startedAt = Date.now();
    setRun(createFastTestRun(missedSituations, missedSituations.length));
    setCueStartedAt(null);
    setCueIntroUntil(startedAt + FAST_TEST_CUE_INTRO_MS);
    setNow(startedAt);
    setIsRecording(false);
    setIsSubmitting(false);
    setError(null);
    setReviewingMistakes(false);
    setTestResetKey((key) => key + 1);
  }

  const controls = (
    <div className="test-controls" aria-label="Fast test settings">
      <div className="test-control-group">
        <span>Mode</span>
        <div className="segmented-control" aria-label="Test mode">
          <button
            className={testMode === "normal" ? "active" : ""}
            type="button"
            onClick={() => handleTestModeChange("normal")}
          >
            Normal
          </button>
          <button
            className={testMode === "challenge" ? "active" : ""}
            type="button"
            onClick={() => handleTestModeChange("challenge")}
          >
            Challenge
          </button>
        </div>
      </div>
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
        <span>Questions</span>
        <select
          value={selectedQuestionCount}
          onChange={(event) => handleQuestionCountChange(Number(event.target.value))}
        >
          {questionCountOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
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

  if (run.status === "ready") {
    return (
      <section className="fast-test-layout">
        {controls}
        <section className="test-start-panel">
          <div>
            <span className="eyebrow">Fast Test</span>
            <h2>Ready for {run.queue.length} random cues.</h2>
            <p>
              {seconds} seconds each.{" "}
              {testMode === "challenge"
                ? `Challenge stops after ${FAST_TEST_MAX_MISTAKES} mistakes.`
                : "Normal test continues to the final cue."}
            </p>
          </div>
          <div className={`mic-check ${micStatus}`}>
            <div>
              <Mic size={22} aria-hidden="true" />
              <span>Microphone</span>
              <strong>{getMicrophoneStatusLabel(micStatus)}</strong>
              <p>{micMessage}</p>
            </div>
            <button className="secondary-button" type="button" onClick={checkMicrophone} disabled={micStatus === "checking"}>
              {micStatus === "ready" ? "Check again" : "Check microphone"}
            </button>
          </div>
          <button className="primary-button" type="button" onClick={() => startTest()} disabled={micStatus !== "ready"}>
            <PlayCircle size={18} aria-hidden="true" />
            Start test
          </button>
        </section>
      </section>
    );
  }

  if (run.status === "finished") {
    if (reviewingMistakes) {
      return (
        <section className="fast-test-layout">
          {controls}
          <section className="mistake-review-panel">
            <div className="section-title">
              <ClipboardList size={22} aria-hidden="true" />
              <h2>Review missed cues</h2>
            </div>
            {missedAttempts.length ? (
              <div className="mistake-list">
                {missedAttempts.map((attempt, index) => (
                  <article className="mistake-card" key={`${attempt.situation.id}-${index}`}>
                    <SituationImage situation={attempt.situation} />
                    <div>
                      <span>
                        Cue {index + 1} / {missedAttempts.length}
                      </span>
                      <h3>{attempt.situation.prompt}</h3>
                      <p>{attempt.message}</p>
                      {attempt.result?.corrected_answer ? (
                        <small>Your words: {attempt.result.corrected_answer}</small>
                      ) : null}
                      <strong>{attempt.result?.better_answer ?? attempt.situation.acceptableAnswers[0]}</strong>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="review-empty">No missed cues in this test.</p>
            )}
            <div className="report-actions">
              <button className="secondary-button" type="button" onClick={() => setReviewingMistakes(false)}>
                Back to report
              </button>
              <button className="primary-button" type="button" onClick={practiceMissedCues} disabled={!missedAttempts.length}>
                Practice missed cues
              </button>
            </div>
          </section>
        </section>
      );
    }

    return (
      <section className="fast-test-layout">
        {controls}
        <section className="test-report-panel">
          <div className="report-hero">
            <span className="eyebrow">Fast Test Score</span>
            <strong>{score}%</strong>
            <p>{getReportMessage(score, missedAttempts.length)}</p>
          </div>
          <div className="report-metrics">
            <div>
              <span>Correct</span>
              <strong>{run.correct}</strong>
            </div>
            <div>
              <span>Mistakes</span>
              <strong>{run.mistakes}</strong>
            </div>
            <div>
              <span>Avg speed</span>
              <strong>{testReport.averageSeconds}s</strong>
            </div>
            <div>
              <span>Weakest topic</span>
              <strong>{testReport.weakestTopic}</strong>
            </div>
          </div>
          <div className="report-actions">
            <button className="secondary-button" type="button" onClick={() => setReviewingMistakes(true)} disabled={!missedAttempts.length}>
              <ClipboardList size={18} aria-hidden="true" />
              Review mistakes
            </button>
            <button className="primary-button" type="button" onClick={() => startTest()}>
              Try again
            </button>
          </div>
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
          Mistakes{" "}
          <strong>
            {testMode === "challenge" ? `${run.mistakes}/${FAST_TEST_MAX_MISTAKES}` : run.mistakes}
          </strong>
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
          {introIsVisible ? (
            <div className="test-flash cue-intro" aria-live="polite">
              <small>Next cue</small>
              <span>{run.index + 1}</span>
              <strong>of {run.queue.length}</strong>
            </div>
          ) : null}
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
          disabled={run.status !== "running" || introIsVisible || isSubmitting || hasResultFlash}
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

function createTrainingQueue(
  mode: TrainingSetMode,
  lessonId: string,
  category: FastTestCategory,
  count: number
) {
  if (mode === "path") {
    const lesson = getTrainingLesson(lessonId);
    return createLessonQueue(lesson);
  }

  const pool = getFastTestPool(category);
  return shuffleSituations(pool).slice(0, Math.min(count, pool.length));
}

function getTrainingLesson(lessonId: string) {
  return trainingLessons.find((lesson) => lesson.id === lessonId) ?? trainingLessons[0];
}

function createLessonQueue(lesson: TrainingLesson) {
  const buckets = lesson.categories.map((category) =>
    situations.filter((situation) => situation.category === category)
  );
  const queue: Situation[] = [];
  let cursor = 0;

  while (queue.length < lesson.count && buckets.some((bucket) => cursor < bucket.length)) {
    for (const bucket of buckets) {
      const situation = bucket[cursor];
      if (situation && queue.length < lesson.count) queue.push(situation);
    }
    cursor += 1;
  }

  return queue;
}

function createFastTestRun(pool: Situation[], questionCount: number): TestRun {
  return {
    status: "running",
    queue: shuffleSituations(pool).slice(0, Math.min(questionCount, pool.length)),
    index: 0,
    correct: 0,
    mistakes: 0,
    attempts: 0,
    history: [],
    lastResult: null,
    lastPassed: null,
    lastMessage: null
  };
}

function createReadyTestRun(pool: Situation[], questionCount: number): TestRun {
  return {
    ...createFastTestRun(pool, questionCount),
    status: "ready"
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

function getQuestionCountOptions(poolLength: number) {
  return Array.from(new Set([...FAST_TEST_QUESTION_OPTIONS.filter((option) => option <= poolLength), poolLength]))
    .filter((option) => option > 0)
    .sort((a, b) => a - b);
}

function getTrainingCountOptions(poolLength: number) {
  return Array.from(new Set([...TRAINING_QUESTION_OPTIONS.filter((option) => option <= poolLength), poolLength]))
    .filter((option) => option > 0)
    .sort((a, b) => a - b);
}

function getMicrophoneStatusLabel(status: MicrophoneStatus) {
  if (status === "checking") return "Checking...";
  if (status === "ready") return "Ready";
  if (status === "blocked") return "Needs attention";
  return "Not checked";
}

function getMicrophoneCheckMessage(error: unknown) {
  if (!(error instanceof DOMException)) return "The microphone could not start. Try another browser or close audio apps.";
  if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
    return "Microphone is blocked. Allow microphone access in site settings, then check again.";
  }
  if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") return "No microphone was found on this device.";
  if (error.name === "NotReadableError" || error.name === "TrackStartError") {
    return "The microphone is busy. Close other apps using it, then check again.";
  }
  if (error.name === "SecurityError") return "Microphone access requires HTTPS and browser permission.";
  return `${error.name}: ${error.message || "The microphone could not start."}`;
}

function getReportMessage(score: number, mistakes: number) {
  if (mistakes === 0) return "Clean run. Your responses stayed automatic.";
  if (score >= 80) return "Strong run. Review the missed cues, then repeat them.";
  if (score >= 60) return "Good pressure practice. The missed cues need one focused pass.";
  return "This topic needs a slower review before another fast test.";
}

function createFastTestMistakeEvaluation(
  situation: Situation,
  message: string,
  responseTimeMs: number | null,
  targetMs: number
): EvaluationResult {
  const speed = responseTimeMs === null ? 0 : speedScore(responseTimeMs, targetMs);
  const overall = Math.min(25, Math.round(speed * 0.2));

  return {
    transcript: "",
    corrected_answer: situation.acceptableAnswers[0],
    meaning: 0,
    grammar: 0,
    naturalness: 0,
    speed,
    overall,
    passed: false,
    perfect: false,
    better_answer: situation.acceptableAnswers[0],
    feedback_en: message,
    error_type: "too_slow",
    mode: "heuristic"
  };
}

function getTestReport(history: TestAttempt[]) {
  const timedAttempts = history.filter((attempt) => typeof attempt.responseTimeMs === "number");
  const averageMs = timedAttempts.length
    ? timedAttempts.reduce((total, attempt) => total + (attempt.responseTimeMs ?? 0), 0) / timedAttempts.length
    : 0;
  const topicMistakes = new Map<string, number>();

  for (const attempt of history) {
    if (!attempt.passed) {
      const topic = formatCategoryLabel(attempt.situation.category);
      topicMistakes.set(topic, (topicMistakes.get(topic) ?? 0) + 1);
    }
  }

  const weakestTopic = [...topicMistakes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "None";

  return {
    averageSeconds: averageMs ? (averageMs / 1000).toFixed(1) : "0.0",
    weakestTopic
  };
}

function getUniqueMissedSituations(attempts: TestAttempt[]) {
  const seen = new Set<string>();
  const unique: Situation[] = [];
  for (const attempt of attempts) {
    if (attempt.passed || seen.has(attempt.situation.id)) continue;
    seen.add(attempt.situation.id);
    unique.push(attempt.situation);
  }
  return unique;
}

function advanceTestRun(
  previous: TestRun,
  passed: boolean,
  message: string | null,
  result: EvaluationResult | null,
  responseTimeMs: number | null,
  testMode: FastTestMode
): TestRun {
  const attempts = previous.attempts + 1;
  const correct = previous.correct + (passed ? 1 : 0);
  const mistakes = previous.mistakes + (passed ? 0 : 1);
  const finished =
    attempts >= previous.queue.length || (testMode === "challenge" && mistakes >= FAST_TEST_MAX_MISTAKES);
  const situation = previous.queue[previous.index];
  const history = situation
    ? [
        ...previous.history,
        {
          situation,
          passed,
          message: message ?? (passed ? "Accepted" : "Mistake"),
          result,
          responseTimeMs
        }
      ]
    : previous.history;

  return {
    ...previous,
    status: finished ? "finished" : "running",
    attempts,
    correct,
    mistakes,
    history,
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

export default App;
