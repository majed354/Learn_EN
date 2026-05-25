import { useEffect, useState } from "react";
import type { Situation } from "../data/situations";
import type { SituationProgress } from "../lib/progress";
import { getSituationMastery } from "../lib/progress";
import { ProgressBar } from "./ProgressBar";

type SituationCardProps = {
  situation: Situation;
  progress: SituationProgress;
};

export function SituationCard({ situation, progress }: SituationCardProps) {
  const mastery = getSituationMastery(progress);
  const generatedImage = getGeneratedImagePath(situation.image);
  const [imageSrc, setImageSrc] = useState(generatedImage);

  useEffect(() => {
    setImageSrc(getGeneratedImagePath(situation.image));
  }, [situation.image]);

  return (
    <section className="scene-panel" aria-label="Training situation">
      <div className="scene-image-wrap">
        <img
          className="scene-image"
          src={imageSrc}
          alt={`${situation.category} situation`}
          onError={() => {
            if (imageSrc !== situation.image) setImageSrc(situation.image);
          }}
        />
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

function getGeneratedImagePath(fallbackPath: string) {
  const fileName = fallbackPath.split("/").pop()?.replace(/\.svg$/i, ".png");
  return fileName ? `/images/generated/${fileName}` : fallbackPath;
}
