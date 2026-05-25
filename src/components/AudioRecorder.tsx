import { Mic, Square } from "lucide-react";
import { useRef, useState } from "react";

type AudioRecorderProps = {
  disabled?: boolean;
  onRecordingStart: (startedAt: number) => void;
  onRecordingStop: (audioBlob: Blob, responseTimeMs: number) => void;
};

export function AudioRecorder({ disabled, onRecordingStart, onRecordingStop }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  async function startRecording() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Microphone recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      streamRef.current = stream;
      recorderRef.current = recorder;
      startedAtRef.current = Date.now();

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const type = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(chunksRef.current, { type });
        const responseTimeMs = Date.now() - startedAtRef.current;
        streamRef.current?.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        onRecordingStop(audioBlob, responseTimeMs);
      };

      recorder.start();
      setIsRecording(true);
      onRecordingStart(startedAtRef.current);
    } catch {
      setError("Microphone permission is needed to train.");
    }
  }

  function stopRecording() {
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
