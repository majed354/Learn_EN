import { Mic, Square } from "lucide-react";
import { useRef, useState } from "react";

type AudioRecorderProps = {
  disabled?: boolean;
  responseStartedAt?: number | null;
  stopAt?: number | null;
  onRecordingStart: (startedAt: number) => void;
  onRecordingStop: (audioBlob: Blob, responseTimeMs: number) => void;
};

export function AudioRecorder({
  disabled,
  responseStartedAt,
  stopAt,
  onRecordingStart,
  onRecordingStop
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const autoStopRef = useRef<number | null>(null);

  async function startRecording() {
    setError(null);
    if (stopAt && Date.now() >= stopAt) {
      setError("Time is up. Go to the next cue.");
      return;
    }

    if (!window.isSecureContext) {
      setError("Open the site with HTTPS. Browsers block microphone access on insecure pages.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Microphone recording is not supported in this browser.");
      return;
    }

    try {
      const permissionState = await getMicrophonePermissionState();
      if (permissionState === "denied") {
        setError("Microphone is blocked in site settings. Change it to Allow, then reload.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      const recorder = createRecorder(stream);
      chunksRef.current = [];
      streamRef.current = stream;
      recorderRef.current = recorder;
      startedAtRef.current = Date.now();

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        if (autoStopRef.current) {
          window.clearTimeout(autoStopRef.current);
          autoStopRef.current = null;
        }
        const type = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(chunksRef.current, { type });
        const responseTimeMs = Date.now() - (responseStartedAt ?? startedAtRef.current);
        streamRef.current?.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        onRecordingStop(audioBlob, responseTimeMs);
      };

      recorder.start();
      setIsRecording(true);
      onRecordingStart(startedAtRef.current);

      if (stopAt) {
        const remainingMs = Math.max(250, stopAt - Date.now());
        autoStopRef.current = window.setTimeout(() => stopRecording(), remainingMs);
      }
    } catch (caught) {
      if (autoStopRef.current) {
        window.clearTimeout(autoStopRef.current);
        autoStopRef.current = null;
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
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

  return (
    <div className="recorder">
      <button
        className={`record-button ${isRecording ? "recording" : ""}`}
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        title={isRecording ? "Stop recording" : "Start speaking"}
      >
        {isRecording ? <Square size={26} aria-hidden="true" /> : <Mic size={30} aria-hidden="true" />}
        <span>{isRecording ? "Stop" : "Start speaking"}</span>
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
