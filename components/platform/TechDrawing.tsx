type Props = {
  lengthM: number;
  widthM: number;
  name: string;
};

export function TechDrawing({ lengthM, widthM, name }: Props) {
  const L = lengthM;
  const W = widthM;
  const pad = 48;
  const scale = 90;
  const deckW = L * scale;
  const deckH = W * scale * 0.55;
  const svgW = deckW + pad * 2 + 40;
  const svgH = deckH + pad * 2 + 36;
  const x = pad;
  const y = pad;

  const lenLabel = `${L.toFixed(2)} м`;
  const widLabel = `${W.toFixed(2)} м`;

  return (
    <figure className="border border-silver bg-warm p-3 md:p-5">
      <figcaption className="mb-3 flex items-baseline justify-between gap-3">
        <span className="font-display text-sm font-medium text-graphite">
          Технически чертеж
        </span>
        <span className="tabular text-xs text-steel">{name}</span>
      </figcaption>
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Чертеж ${name}: ${lenLabel} на ${widLabel}`}
      >
        <defs>
          <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <path
              d="M 16 0 L 0 0 0 16"
              fill="none"
              stroke="#C8CCD2"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width={svgW} height={svgH} fill="#F6F6F4" />
        <rect width={svgW} height={svgH} fill="url(#grid)" opacity="0.45" />

        {/* deck top view */}
        <rect
          x={x}
          y={y}
          width={deckW}
          height={deckH}
          fill="#FFFFFF"
          stroke="#1E2125"
          strokeWidth="1.5"
        />
        {/* side rails */}
        <line
          x1={x}
          y1={y + 8}
          x2={x + deckW}
          y2={y + 8}
          stroke="#6E737B"
          strokeWidth="1"
        />
        <line
          x1={x}
          y1={y + deckH - 8}
          x2={x + deckW}
          y2={y + deckH - 8}
          stroke="#6E737B"
          strokeWidth="1"
        />
        {/* hitch triangle */}
        <path
          d={`M ${x} ${y + deckH / 2 - 18} L ${x - 28} ${y + deckH / 2} L ${x} ${y + deckH / 2 + 18}`}
          fill="none"
          stroke="#1E2125"
          strokeWidth="1.5"
        />
        <circle
          cx={x - 32}
          cy={y + deckH / 2}
          r="4"
          fill="#FCBC04"
          stroke="#1E2125"
          strokeWidth="1"
        />
        {/* axles */}
        <circle cx={x + deckW * 0.62} cy={y + deckH + 10} r="7" fill="none" stroke="#1E2125" />
        <circle cx={x + deckW * 0.78} cy={y + deckH + 10} r="7" fill="none" stroke="#1E2125" />

        {/* length dimension */}
        <line
          x1={x}
          y1={y + deckH + 28}
          x2={x + deckW}
          y2={y + deckH + 28}
          stroke="#6E737B"
          strokeWidth="1"
        />
        <line x1={x} y1={y + deckH + 22} x2={x} y2={y + deckH + 34} stroke="#6E737B" />
        <line
          x1={x + deckW}
          y1={y + deckH + 22}
          x2={x + deckW}
          y2={y + deckH + 34}
          stroke="#6E737B"
        />
        <text
          x={x + deckW / 2}
          y={y + deckH + 44}
          textAnchor="middle"
          className="tabular"
          fill="#1E2125"
          fontSize="12"
          fontFamily="ui-monospace, monospace"
        >
          {lenLabel}
        </text>

        {/* width dimension */}
        <line
          x1={x + deckW + 18}
          y1={y}
          x2={x + deckW + 18}
          y2={y + deckH}
          stroke="#6E737B"
          strokeWidth="1"
        />
        <line
          x1={x + deckW + 12}
          y1={y}
          x2={x + deckW + 24}
          y2={y}
          stroke="#6E737B"
        />
        <line
          x1={x + deckW + 12}
          y1={y + deckH}
          x2={x + deckW + 24}
          y2={y + deckH}
          stroke="#6E737B"
        />
        <text
          x={x + deckW + 30}
          y={y + deckH / 2 + 4}
          fill="#1E2125"
          fontSize="12"
          fontFamily="ui-monospace, monospace"
        >
          {widLabel}
        </text>
      </svg>
    </figure>
  );
}
