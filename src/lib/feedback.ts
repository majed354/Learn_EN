export type FeedbackSignal = "success" | "retry" | "timeout";

const FEEDBACK_STORAGE_KEY = "english-reflex-feedback-enabled-v1";
let audioContext: AudioContext | null = null;

export function loadFeedbackEnabled() {
  try {
    return window.localStorage.getItem(FEEDBACK_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function saveFeedbackEnabled(enabled: boolean) {
  window.localStorage.setItem(FEEDBACK_STORAGE_KEY, enabled ? "on" : "off");
}

export function emitFeedbackSignal(signal: FeedbackSignal, enabled: boolean) {
  if (!enabled) return;
  playFeedbackTone(signal);
  vibrateFeedback(signal);
}

function getAudioContext() {
  audioContext ??= new AudioContext();
  return audioContext;
}

function playFeedbackTone(signal: FeedbackSignal) {
  try {
    const context = getAudioContext();
    void context.resume();
    const now = context.currentTime;

    if (signal === "success") {
      playTone(context, 587, now, 0.08, 0.045, "sine");
      playTone(context, 784, now + 0.085, 0.11, 0.05, "sine");
      return;
    }

    if (signal === "timeout") {
      playTone(context, 392, now, 0.07, 0.04, "triangle");
      playTone(context, 294, now + 0.075, 0.1, 0.04, "triangle");
      return;
    }

    playTone(context, 246, now, 0.12, 0.04, "sawtooth");
  } catch {
    // Audio feedback is optional; unsupported browsers should keep training normally.
  }
}

function playTone(
  context: AudioContext,
  frequency: number,
  startsAt: number,
  duration: number,
  volume: number,
  type: OscillatorType
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startsAt);
  gain.gain.setValueAtTime(0.0001, startsAt);
  gain.gain.exponentialRampToValueAtTime(volume, startsAt + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startsAt + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startsAt);
  oscillator.stop(startsAt + duration + 0.02);
}

function vibrateFeedback(signal: FeedbackSignal) {
  if (!navigator.vibrate) return;
  if (signal === "success") {
    navigator.vibrate(18);
    return;
  }
  if (signal === "timeout") {
    navigator.vibrate([24, 30, 24]);
    return;
  }
  navigator.vibrate(28);
}
