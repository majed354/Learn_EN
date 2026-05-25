import { useEffect, useMemo, useState } from "react";
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
  const imageSources = useMemo(() => getImageSources(situation.image), [situation.image]);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [situation.image]);

  return (
    <section className="scene-panel" aria-label="Training situation">
      <div className="scene-image-wrap">
        <img
          className="scene-image"
          src={imageSources[imageIndex]}
          alt={`${situation.category} situation`}
          onError={() => {
            setImageIndex((currentIndex) => Math.min(currentIndex + 1, imageSources.length - 1));
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

function getImageSources(fallbackPath: string) {
  const id = fallbackPath.split("/").pop()?.replace(/\.svg$/i, "");
  if (!id) return [fallbackPath];

  return [
    `/images/generated/${id}.png`,
    `/.netlify/functions/situation-image?id=${encodeURIComponent(id)}`,
    fallbackPath
  ];
}
