type Props = {
  number?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({
  number,
  title,
  description,
  className = "",
}: Props) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {number ? (
        <p className="tabular mb-3 text-sm text-steel">{number}</p>
      ) : null}
      <h2 className="font-display text-2xl font-semibold tracking-tight text-graphite md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-prose text-base leading-relaxed text-steel">
          {description}
        </p>
      ) : null}
    </div>
  );
}
