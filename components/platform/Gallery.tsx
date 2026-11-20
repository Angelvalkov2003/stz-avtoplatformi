"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type Props = {
  images: string[];
  alt: string;
};

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.5;

export function Gallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    x: number;
    y: number;
    ox: number;
    oy: number;
  } | null>(null);
  const current = images[active] ?? images[0];
  const total = images.length;

  const go = useCallback(
    (dir: -1 | 1) => {
      if (total < 2) return;
      setActive((i) => (i + dir + total) % total);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    },
    [total],
  );

  const close = useCallback(() => {
    setOpen(false);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
    if (e.key === "+" || e.key === "=") {
      setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP));
    }
    if (e.key === "-") {
      setZoom((z) => {
        const next = Math.max(ZOOM_MIN, z - ZOOM_STEP);
        if (next === ZOOM_MIN) setOffset({ x: 0, y: 0 });
        return next;
      });
    }
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onKey]);

  function openAt(index: number) {
    setActive(index);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setOpen(true);
  }

  function bumpZoom(dir: -1 | 1) {
    setZoom((z) => {
      const next = Math.min(
        ZOOM_MAX,
        Math.max(ZOOM_MIN, z + dir * ZOOM_STEP),
      );
      if (next === ZOOM_MIN) setOffset({ x: 0, y: 0 });
      return next;
    });
  }

  function onPointerDown(e: React.PointerEvent) {
    if (zoom <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag) return;
    setOffset({
      x: drag.ox + (e.clientX - drag.x),
      y: drag.oy + (e.clientY - drag.y),
    });
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  const arrowBtn =
    "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-silver/40 bg-graphite/80 text-lg text-white transition hover:border-accent hover:text-accent";

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden border border-silver bg-warm">
        {current ? (
          <button
            type="button"
            onClick={() => openAt(active)}
            className="absolute inset-0 block"
            aria-label="Отвори снимката на цял екран"
          >
            <Image
              src={current}
              alt={`${alt} — снимка ${active + 1}`}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 70vw"
              priority
            />
          </button>
        ) : null}

        {total > 1 ? (
          <>
            <button
              type="button"
              className={`${arrowBtn} left-2`}
              aria-label="Предишна снимка"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
            >
              ‹
            </button>
            <button
              type="button"
              className={`${arrowBtn} right-2`}
              aria-label="Следваща снимка"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
            >
              ›
            </button>
          </>
        ) : null}

        <p className="pointer-events-none absolute bottom-2 right-2 bg-graphite/75 px-2 py-1 font-mono text-xs text-silver">
          {active + 1} / {total}
        </p>
      </div>

      <ul className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-7">
        {images.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setActive(i)}
              onDoubleClick={() => openAt(i)}
              aria-label={`Снимка ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-[4/3] w-full overflow-hidden border ${
                i === active ? "border-accent" : "border-silver"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          </li>
        ))}
      </ul>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-[120] flex flex-col bg-graphite/95"
              role="dialog"
              aria-modal="true"
              aria-label="Галерия"
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-3 py-3 md:px-5">
                <p className="font-mono text-xs text-silver">
                  {active + 1} / {total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="border border-silver/40 px-3 py-2 text-sm text-white hover:border-accent hover:text-accent"
                    onClick={() => bumpZoom(-1)}
                    aria-label="Намали"
                  >
                    −
                  </button>
                  <span className="min-w-[3rem] text-center font-mono text-xs text-silver">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    type="button"
                    className="border border-silver/40 px-3 py-2 text-sm text-white hover:border-accent hover:text-accent"
                    onClick={() => bumpZoom(1)}
                    aria-label="Увеличи"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="ml-2 flex h-10 w-10 items-center justify-center border border-silver/40 text-xl text-white hover:border-accent hover:text-accent"
                    onClick={close}
                    aria-label="Затвори"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="relative min-h-0 flex-1">
                {total > 1 ? (
                  <>
                    <button
                      type="button"
                      className={`${arrowBtn} left-3 md:left-5`}
                      aria-label="Предишна снимка"
                      onClick={() => go(-1)}
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className={`${arrowBtn} right-3 md:right-5`}
                      aria-label="Следваща снимка"
                      onClick={() => go(1)}
                    >
                      ›
                    </button>
                  </>
                ) : null}

                <div
                  className={`absolute inset-0 flex items-center justify-center overflow-hidden ${
                    zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
                  }`}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  onDoubleClick={() => bumpZoom(zoom >= ZOOM_MAX ? -1 : 1)}
                  onClick={(e) => {
                    if (e.target === e.currentTarget && zoom === 1) close();
                  }}
                >
                  {current ? (
                    <div
                      className="relative h-[min(85vh,900px)] w-[min(92vw,1200px)] transition-transform duration-150"
                      style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                      }}
                    >
                      <Image
                        src={current}
                        alt={`${alt} — снимка ${active + 1}`}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                        draggable={false}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
