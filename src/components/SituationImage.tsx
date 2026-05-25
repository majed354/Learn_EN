import { useEffect, useMemo, useState } from "react";
import type { Situation } from "../data/situations";

type SituationImageProps = {
  situation: Situation;
  className?: string;
};

export function SituationImage({ situation, className }: SituationImageProps) {
  const imageSources = useMemo(() => getImageSources(situation), [situation]);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [imageSources]);

  return (
    <img
      className={className}
      src={imageSources[imageIndex]}
      alt={`${situation.category} situation`}
      onError={() => {
        setImageIndex((currentIndex) => Math.min(currentIndex + 1, imageSources.length - 1));
      }}
    />
  );
}

function getImageSources(situation: Situation) {
  const categoryId = situation.image.split("/").pop()?.replace(/\.svg$/i, "");

  return [
    `/images/generated/${situation.id}.png`,
    `/.netlify/functions/situation-image?id=${encodeURIComponent(situation.id)}`,
    categoryId ? `/images/generated/${categoryId}.png` : "",
    situation.image
  ].filter(Boolean);
}
