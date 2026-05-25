import type { Situation } from "../data/situations";
import type { SituationProgress } from "../lib/progress";
import { getSituationMastery } from "../lib/progress";
import { ProgressBar } from "./ProgressBar";
import { SituationImage } from "./SituationImage";

type SituationCardProps = {
  situation: Situation;
  progress: SituationProgress;
};

export function SituationCard({ situation, progress }: SituationCardProps) {
  const mastery = getSituationMastery(progress);

  return (
    <section className="scene-panel" aria-label="Training situation">
      <div className="scene-image-wrap">
        <SituationImage className="scene-image" situation={situation} />
      </div>
      <div className="scene-copy">
        <div className="situation-meta">
          <span>{situation.category.replace("-", " ")}</span>
          <span>{situation.level}</span>
          <span className={`status-badge ${progress.status}`}>{progress.status}</span>
        </div>
        <h1>{situation.prompt}</h1>
        <p>Say the right sentence.</p>
      </div>
      <ProgressBar value={mastery} label="This situation" tone={mastery >= 70 ? "green" : "amber"} />
    </section>
  );
}
