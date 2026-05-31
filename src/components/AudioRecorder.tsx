import { Mic, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type AudioRecorderProps = {
  disabled?: boolean;
  autoStartKey?: string | number | null;
  resetKey?: string | number | null;
  keepStreamAlive?: boolean;
  responseStartedAt?: number | null;
  stopAt?: number | null;
  autoStopAfterMs?: number | null;
  manualStopEnabled?: boolean;
  onRecordingStart: (startedAt: number) => void;
  onRecordingStop: (audioBlob: Blob, responseTimeMs: number) => void;
};

export function AudioRecorder({
  disabled,
  autoStartKey,
  resetKey,
  keepStreamAlive,
  responseStartedAt,
  stopAt,
  autoStopAfterMs,
  manualStopEnabled = true,
  onRecordingStart,
  onRecordingStop
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const startedAtRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const autoStopRef = useRef<number | null>(null);
  const autoStartedKeyRef = useRef<string | number | null>(null);
  const isStartingRef = useRef(false);
  const sendOnStopRef = useRef(true);
  const recordingSessionRef = useRef(0);
  const autoStopResponseTimeRef = useRef<number | null>(null);
  const voiceContextRef = useRef<AudioContext | null>(null);
  const voiceFrameRef = useRef<number | null>(null);
  const voiceDetectedRef = useRef(false);
  const lastVoiceAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (resetKey == null) return;
    autoStartedKeyRef.current = null;
    autoStopResponseTimeRef.current = null;
    stopVoiceTiming();
    sendOnStopRef.current = false;
    if (autoStopRef.current) {
      window.clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    setIsRecording(false);
  }, [resetKey]);

  useEffect(() => {
    if (!autoStartKey || disabled || isRecording || autoStartedKeyRef.current === autoStartKey) return;
    autoStartedKeyRef.current = autoStartKey;
    void startRecording();
  }, [autoStartKey, disabled, isRecording]);

  useEffect(() => {
    return () => {
      sendOnStopRef.current = false;
      if (autoStopRef.current) window.clearTimeout(autoStopRef.current);
      stopVoiceTiming();
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function startRecording() {
    if (isRecording || isStartingRef.current) return;
    isStartingRef.current = true;
    sendOnStopRef.current = true;
    setError(null);
    if (stopAt && Date.now() >= stopAt) {
      setError("Time is up. Go to the next cue.");
      isStartingRef.current = false;
      return;
    }

    if (!window.isSecureContext) {
      setError("Open the site with HTTPS. Browsers block microphone access on insecure pages.");
      isStartingRef.current = false;
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Microphone recording is not supported in this browser.");
      isStartingRef.current = false;
      return;
    }

    try {
      const permissionState = await getMicrophonePermissionState();
      if (permissionState === "denied") {
        setError("Microphone is blocked in site settings. Change it to Allow, then reload.");
        isStartingRef.current = false;
        return;
      }

      const reusableStream = getActiveAudioStream(streamRef.current);
      const stream =
        reusableStream ??
        (await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true
          }
        }));
      const recorder = createRecorder(stream);
      const sessionId = recordingSessionRef.current + 1;
      recordingSessionRef.current = sessionId;
      const chunks: Blob[] = [];
      streamRef.current = stream;
      recorderRef.current = recorder;
      startedAtRef.current = Date.now();
      autoStopResponseTimeRef.current = null;
      voiceDetectedRef.current = false;
      lastVoiceAtRef.current = null;
      startVoiceTiming(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = () => {
        const isCurrentSession = recordingSessionRef.current === sessionId;
        if (isCurrentSession && autoStopRef.current) {
          window.clearTimeout(autoStopRef.current);
          autoStopRef.current = null;
        }
        const type = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(chunks, { type });
        stopVoiceTiming();
        const responseTimeMs =
          getDetectedResponseTime(responseStartedAt ?? startedAtRef.current) ??
          autoStopResponseTimeRef.current ??
          Date.now() - (responseStartedAt ?? startedAtRef.current);
        autoStopResponseTimeRef.current = null;
        if (!keepStreamAlive && isCurrentSession) streamRef.current?.getTracks().forEach((track) => track.stop());
        if (isCurrentSession) setIsRecording(false);
        if (sendOnStopRef.current && isCurrentSession) {
          onRecordingStop(audioBlob, responseTimeMs);
        }
      };

      recorder.start();
      isStartingRef.current = false;
      setIsRecording(true);
      onRecordingStart(startedAtRef.current);

      const responseBase = responseStartedAt ?? startedAtRef.current;
      const plannedResponseTimeMs = stopAt ? Math.max(0, stopAt - responseBase) : autoStopAfterMs;
      const autoStopDelay = stopAt ? Math.max(250, stopAt - Date.now()) : autoStopAfterMs;
      if (autoStopDelay) {
        autoStopRef.current = window.setTimeout(() => {
          autoStopResponseTimeRef.current = Math.round(plannedResponseTimeMs ?? autoStopDelay);
          stopRecording();
        }, autoStopDelay);
      }
    } catch (caught) {
      if (autoStopRef.current) {
        window.clearTimeout(autoStopRef.current);
        autoStopRef.current = null;
      }
      stopVoiceTiming();
      if (!keepStreamAlive) streamRef.current?.getTracks().forEach((track) => track.stop());
      isStartingRef.current = false;
      setIsRecording(false);
      setError(getMicrophoneErrorMessage(caught));
    }
  }

  function stopRecording() {
    if (autoStopRef.current) {
      window.clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }

    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }

  function startVoiceTiming(stream: MediaStream) {
    stopVoiceTiming();

    try {
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      const data = new Uint8Array(analyser.fftSize);
      let noiseRms = 0.008;
      let noisePeak = 0.04;
      source.connect(analyser);
      if (context.state === "suspended") void context.resume();

      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        let peak = 0;

        for (const value of data) {
          const normalized = (value - 128) / 128;
          const absolute = Math.abs(normalized);
          sum += normalized * normalized;
          peak = Math.max(peak, absolute);
        }

        const rms = Math.sqrt(sum / data.length);
        const elapsed = Date.now() - startedAtRef.current;
        const enoughTimePassed = elapsed > 180;
        const learningNoiseFloor = elapsed < 650 && !voiceDetectedRef.current;
        const rmsThreshold = Math.max(0.012, noiseRms * 2.6);
        const peakThreshold = Math.max(0.055, noisePeak * 1.9);

        if (learningNoiseFloor) {
          noiseRms = noiseRms * 0.86 + rms * 0.14;
          noisePeak = noisePeak * 0.86 + peak * 0.14;
        }

        if (enoughTimePassed && (rms > rmsThreshold || peak > peakThreshold)) {
          voiceDetectedRef.current = true;
          lastVoiceAtRef.current = Date.now();
        }

        voiceFrameRef.current = window.requestAnimationFrame(tick);
      };

      voiceContextRef.current = context;
      voiceFrameRef.current = window.requestAnimationFrame(tick);
    } catch {
      voiceContextRef.current = null;
      voiceFrameRef.current = null;
    }
  }

  function stopVoiceTiming() {
    if (voiceFrameRef.current) {
      window.cancelAnimationFrame(voiceFrameRef.current);
      voiceFrameRef.current = null;
    }

    if (voiceContextRef.current && voiceContextRef.current.state !== "closed") {
      void voiceContextRef.current.close();
    }
    voiceContextRef.current = null;
  }

  function getDetectedResponseTime(responseBase: number) {
    if (!voiceDetectedRef.current || !lastVoiceAtRef.current) return null;
    return Math.max(250, Math.round(lastVoiceAtRef.current - responseBase));
  }

  return (
    <div className="recorder">
      <button
        className={`record-button ${isRecording ? "recording" : ""}`}
        type="button"
        onClick={isRecording && manualStopEnabled ? stopRecording : startRecording}
        disabled={disabled || (isRecording && !manualStopEnabled)}
        title={isRecording ? "Recording" : "Start speaking"}
      >
        {isRecording ? <Square size={26} aria-hidden="true" /> : <Mic size={30} aria-hidden="true" />}
        <span>{isRecording ? "Recording..." : "Start speaking"}</span>
      </button>
      {error ? <p className="inline-error">{error}</p> : null}
    </div>
  );
}

async function getMicrophonePermissionState() {
  if (!navigator.permissions?.query) return "unknown";

  try {
    const status = await navigator.permissions.query({ name: "microphone" as PermissionName });
    return status.state;
  } catch {
    return "unknown";
  }
}

function createRecorder(stream: MediaStream) {
  const supportedType = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/aac"
  ].find((type) => MediaRecorder.isTypeSupported(type));

  return supportedType ? new MediaRecorder(stream, { mimeType: supportedType }) : new MediaRecorder(stream);
}

function getActiveAudioStream(stream: MediaStream | null) {
  if (!stream) return null;
  return stream.getAudioTracks().some((track) => track.readyState === "live") ? stream : null;
}

function getMicrophoneErrorMessage(error: unknown) {
  if (!(error instanceof DOMException)) {
    return "The microphone could not start. Try a different browser or close other audio apps.";
  }

  if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
    return "Microphone is still blocked. Open site settings, allow microphone, then reload.";
  }

  if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
    return "No microphone was found on this device.";
  }

  if (error.name === "NotReadableError" || error.name === "TrackStartError") {
    return "The microphone is busy. Close other apps using it, then try again.";
  }

  if (error.name === "SecurityError") {
    return "Microphone access requires HTTPS and browser permission.";
  }

  return `${error.name}: ${error.message || "The microphone could not start."}`;
}
