import { Award, CalendarClock, Flame, Target } from "lucide-react";
import type { ProgressSummary } from "../lib/progress";
import { ProgressBar } from "./ProgressBar";

type ProgressDashboardProps = {
  summary: ProgressSummary;
  totalSituations: number;
};

export function ProgressDashboard({ summary, totalSituations }: ProgressDashboardProps) {
  return (
    <section className="progress-dashboard" aria-label="Progress">
      <div className="mastery-panel">
        <ProgressBar value={summary.mastery} label="Overall mastery" tone="green" />
      </div>
      <div className="metric-grid">
        <div className="metric">
          <Award size={18} aria-hidden="true" />
          <span>Automatic</span>
          <strong>
            {summary.automaticCount}/{totalSituations}
          </strong>
        </div>
        <div className="metric">
          <Target size={18} aria-hidden="true" />
          <span>Success</span>
          <strong>{summary.successRate}%</strong>
        </div>
        <div className="metric">
          <CalendarClock size={18} aria-hidden="true" />
          <span>Review</span>
          <strong>{summary.dueCount}</strong>
        </div>
        <div className="metric">
          <Flame size={18} aria-hidden="true" />
          <span>Best streak</span>
          <strong>{summary.currentStreak}</strong>
        </div>
      </div>
    </section>
  );
}
