"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const PlatformScene = dynamic(
  () =>
    import("@/components/platform/PlatformScene").then((m) => m.PlatformScene),
  {
    ssr: false,
    loading: () => null,
  },
);

type Props = {
  slug: string;
  lengthM: number;
  widthM: number;
  fallbackImage: string;
  name: string;
};

export function PlatformViewer(props: Props) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden border border-silver bg-white">
      <Image
        src={props.fallbackImage}
        alt=""
        fill
        className="object-cover opacity-40"
        sizes="(max-width:768px) 100vw, 60vw"
      />
      <div className="absolute inset-0">
        <PlatformScene {...props} />
      </div>
      <p className="pointer-events-none absolute bottom-3 left-3 bg-white/90 px-2 py-1 text-xs text-steel">
        3D преглед — завъртете с пръст или мишка
      </p>
    </div>
  );
}
