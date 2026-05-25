import { useEffect, useMemo, useState } from "react";

type TimerProps = {
  isRunning: boolean;
  startedAt: number | null;
  targetMs: number;
};

export function Timer({ isRunning, startedAt, targetMs }: TimerProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!isRunning) {
      setNow(Date.now());
      return;
    }
    const timer = window.setInterval(() => setNow(Date.now()), 80);
    return () => window.clearInterval(timer);
  }, [isRunning]);

  const elapsed = startedAt ? Math.max(0, now - startedAt) : 0;
  const remaining = Math.max(0, targetMs - elapsed);
  const seconds = useMemo(() => (remaining / 1000).toFixed(1), [remaining]);
  const overTarget = elapsed > targetMs;

  return (
    <div className={`timer ${overTarget ? "over" : ""}`} aria-live="polite">
      <span>{isRunning ? seconds : (targetMs / 1000).toFixed(targetMs % 1000 === 0 ? 0 : 1)}</span>
      <small>{overTarget ? "slow" : "seconds"}</small>
    </div>
  );
}
