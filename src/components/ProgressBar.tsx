type ProgressBarProps = {
  value: number;
  label?: string;
  tone?: "green" | "amber" | "red" | "blue";
};

export function ProgressBar({ value, label, tone = "green" }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className="progress-bar" aria-label={label}>
      {label ? (
        <div className="progress-label">
          <span>{label}</span>
          <strong>{safeValue}%</strong>
        </div>
      ) : null}
      <div className="progress-track">
        <div className={`progress-fill ${tone}`} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
