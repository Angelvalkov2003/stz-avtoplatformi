"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  alt: string;
};

export function Gallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden border border-silver bg-warm">
        {current ? (
          <Image
            src={current}
            alt={`${alt} — снимка ${active + 1}`}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 70vw"
            priority
          />
        ) : null}
      </div>
      <ul className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-7">
        {images.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setActive(i)}
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
    </div>
  );
}
