import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const styles: Record<Variant, string> = {
  primary:
    "bg-accent text-graphite hover:brightness-95 border border-accent",
  secondary:
    "bg-graphite text-white hover:bg-graphite/90 border border-graphite",
  ghost:
    "bg-transparent text-graphite border border-silver hover:border-graphite",
  danger:
    "bg-white text-graphite border border-silver hover:border-graphite",
};

type Common = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

type ButtonAsButton = Common &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = Common & {
  href: string;
  target?: string;
  rel?: string;
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const cls = `inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium tracking-wide transition-colors disabled:opacity-50 disabled:pointer-events-none ${styles[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, target, rel } = props;
    return (
      <Link href={href} target={target} rel={rel} className={cls}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button type={buttonProps.type ?? "button"} className={cls} {...buttonProps}>
      {children}
    </button>
  );
}
