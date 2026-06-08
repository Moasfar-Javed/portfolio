import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type ProjectImageFrameProps = {
  src: string;
  alt: string;
  primaryColor: string;
  aspectRatio?: string;
  fill?: boolean;
  className?: string;
  imageClassName?: string;
  padded?: boolean;
  padding?: "default" | "compact";
};

const paddingClass = {
  default: "p-4 sm:p-5",
  compact: "p-2 sm:p-3",
} as const;

export function ProjectImageFrame({
  src,
  alt,
  primaryColor,
  aspectRatio = "16 / 10",
  fill = false,
  className = "",
  imageClassName = "",
  padded = true,
  padding = "default",
}: ProjectImageFrameProps) {
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setLoaded(false);
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div
      className={`relative w-full overflow-hidden ${fill ? "h-full min-h-0" : ""} ${className}`}
      style={{
        backgroundColor: primaryColor,
        ...(fill ? {} : { aspectRatio }),
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-contain transition-opacity ${reduce ? "duration-0" : "duration-500 ease-out"} ${loaded ? "opacity-100" : "opacity-0"} ${padded ? paddingClass[padding] : ""} ${imageClassName}`}
      />
    </div>
  );
}
