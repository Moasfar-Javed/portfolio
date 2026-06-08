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
  return (
    <div
      className={`relative w-full overflow-hidden ${fill ? "h-full min-h-0" : ""} ${className}`}
      style={{
        backgroundColor: primaryColor,
        ...(fill ? {} : { aspectRatio }),
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-contain ${padded ? paddingClass[padding] : ""} ${imageClassName}`}
      />
    </div>
  );
}
