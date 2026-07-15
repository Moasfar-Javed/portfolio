import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { createPortal } from "react-dom";
import type { ProjectScreenshot } from "../../data/site";
import { easing } from "../../lib/motion";

type ProjectScreenshotLightboxProps = {
  shots: ProjectScreenshot[];
  primaryColor: string;
  activeIndex: number | null;
  portalRoot: HTMLElement;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_STEP = 0.35;
const DOUBLE_TAP_SCALE = 2.5;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function pointerDistance(a: PointerEvent, b: PointerEvent) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

type ZoomableImageProps = {
  src: string;
  alt: string;
  reduce: boolean | null;
  onZoomChange: (zoomed: boolean) => void;
};

function ZoomableImage({ src, alt, reduce, onZoomChange }: ZoomableImageProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const pointersRef = useRef(new Map<number, PointerEvent>());
  const pinchRef = useRef({ distance: 0, scale: 1 });

  const resetZoom = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const applyScale = useCallback((next: number) => {
    const clamped = clamp(next, MIN_SCALE, MAX_SCALE);
    setScale(clamped);
    if (clamped === 1) setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    resetZoom();
    setLoaded(false);
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src, resetZoom]);

  useEffect(() => {
    onZoomChange(scale > 1);
  }, [scale, onZoomChange]);

  const zoomIn = () => applyScale(scale + ZOOM_STEP);
  const zoomOut = () => applyScale(scale - ZOOM_STEP);

  const onWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    applyScale(scale + delta);
  };

  const onDoubleClick = () => {
    if (scale > 1) resetZoom();
    else applyScale(DOUBLE_TAP_SCALE);
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    pointersRef.current.set(e.pointerId, e.nativeEvent);

    if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()];
      pinchRef.current = { distance: pointerDistance(a, b), scale };
      return;
    }

    if (scale <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, e.nativeEvent);

    if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()];
      const distance = pointerDistance(a, b);
      if (pinchRef.current.distance > 0) {
        const ratio = distance / pinchRef.current.distance;
        applyScale(pinchRef.current.scale * ratio);
      }
      return;
    }

    if (!dragging || scale <= 1) return;
    setPan({
      x: dragRef.current.panX + (e.clientX - dragRef.current.x),
      y: dragRef.current.panY + (e.clientY - dragRef.current.y),
    });
  };

  const endPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = { distance: 0, scale };
    if (pointersRef.current.size === 0) setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const zoomPercent = Math.round(scale * 100);

  return (
    <div className="relative">
      <div className="absolute right-3 top-3 z-[2] flex items-center gap-1.5 sm:right-4 sm:top-4">
        <button
          id="lightbox-zoom-out"
          type="button"
          onClick={zoomOut}
          disabled={scale <= MIN_SCALE}
          className="glass-pill flex h-9 w-9 items-center justify-center rounded-full border border-border-strong text-base text-fg transition-colors duration-300 hover:border-accent/50 disabled:opacity-30"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          onClick={resetZoom}
          className="glass-pill min-w-[3.25rem] rounded-full border border-border-strong px-2.5 py-1.5 text-xs font-medium text-fg-muted transition-colors duration-300 hover:border-accent/50 hover:text-fg"
          aria-label="Reset zoom"
        >
          {zoomPercent}%
        </button>
        <button
          id="lightbox-zoom-in"
          type="button"
          onClick={zoomIn}
          disabled={scale >= MAX_SCALE}
          className="glass-pill flex h-9 w-9 items-center justify-center rounded-full border border-border-strong text-base text-fg transition-colors duration-300 hover:border-accent/50 disabled:opacity-30"
          aria-label="Zoom in"
        >
          +
        </button>
      </div>

      <div
        ref={viewportRef}
        data-lenis-prevent
        className={`relative h-[min(72dvh,820px)] w-full touch-none overflow-hidden ${
          scale > 1 ? (dragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
        }`}
        onWheel={onWheel}
        onDoubleClick={onDoubleClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
      >
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transition: dragging || reduce ? "none" : "transform 0.2s ease",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={src}
              ref={imgRef}
              src={src}
              alt={alt}
              draggable={false}
              onLoad={() => setLoaded(true)}
              className="max-h-full max-w-full select-none object-contain p-6 sm:p-8"
              initial={false}
              animate={{ opacity: loaded ? 1 : 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: easing }}
            />
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}

export function ProjectScreenshotLightbox({
  shots,
  primaryColor,
  activeIndex,
  portalRoot,
  onClose,
  onNavigate,
}: ProjectScreenshotLightboxProps) {
  const reduce = useReducedMotion();
  const activeShot = activeIndex !== null ? shots[activeIndex] : null;
  const hasPrev = activeIndex !== null && activeIndex > 0;
  const hasNext = activeIndex !== null && activeIndex < shots.length - 1;
  const [isZoomed, setIsZoomed] = useState(false);

  const goPrev = useCallback(() => {
    if (activeIndex === null || !hasPrev || isZoomed) return;
    onNavigate(activeIndex - 1);
  }, [activeIndex, hasPrev, isZoomed, onNavigate]);

  const goNext = useCallback(() => {
    if (activeIndex === null || !hasNext || isZoomed) return;
    onNavigate(activeIndex + 1);
  }, [activeIndex, hasNext, isZoomed, onNavigate]);

  useEffect(() => {
    setIsZoomed(false);
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if ((e.key === "+" || e.key === "=") && !e.shiftKey) {
        e.preventDefault();
        document.getElementById("lightbox-zoom-in")?.click();
      } else if (e.key === "-") {
        e.preventDefault();
        document.getElementById("lightbox-zoom-out")?.click();
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [activeIndex, onClose, goPrev, goNext]);

  return createPortal(
    <AnimatePresence>
      {activeShot && activeIndex !== null ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Screenshot gallery"
          data-lenis-prevent
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: easing }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-surface-0/92"
            aria-label="Close gallery"
            onClick={onClose}
          />

          <motion.div
            className="relative z-[1] flex w-full max-w-5xl flex-col gap-4"
            initial={reduce ? false : { opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.28, ease: easing }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-1">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-fg-subtle">
                {activeIndex + 1} / {shots.length}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="glass-pill rounded-full border border-border-strong px-3 py-2 text-sm font-medium text-fg-muted transition-colors duration-300 hover:border-accent/50 hover:text-fg"
              >
                Close
              </button>
            </div>

            <div
              className="relative overflow-hidden rounded-2xl border border-border-strong shadow-soft"
              style={{ backgroundColor: primaryColor }}
            >
              <ZoomableImage
                src={activeShot.src}
                alt={activeShot.description}
                reduce={reduce}
                onZoomChange={setIsZoomed}
              />

              {shots.length > 1 && !isZoomed ? (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={!hasPrev}
                    className="glass-pill absolute left-3 top-1/2 z-[3] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border-strong text-lg text-fg transition-colors duration-300 hover:border-accent/50 disabled:pointer-events-none disabled:opacity-30 sm:left-4"
                    aria-label="Previous screenshot"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!hasNext}
                    className="glass-pill absolute right-3 top-1/2 z-[3] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border-strong text-lg text-fg transition-colors duration-300 hover:border-accent/50 disabled:pointer-events-none disabled:opacity-30 sm:right-4"
                    aria-label="Next screenshot"
                  >
                    ›
                  </button>
                </>
              ) : null}
            </div>

            {activeShot.description ? (
              <p className="px-1 text-center text-sm text-fg-muted">
                {activeShot.description}
              </p>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    portalRoot,
  );
}
