import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Заявката е изпратена",
  robots: { index: false },
};

export default function BookingSuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 md:px-6">
      <p className="tabular text-sm text-steel">01</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">
        Заявката е получена
      </h1>
      <p className="mt-4 text-base leading-relaxed text-steel">
        Ще се свържем с вас по телефона за потвърждение.{" "}
        {siteConfig.paymentNote}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/">Към началото</Button>
        <Button href={siteConfig.phoneHref} variant="ghost">
          Обади се
        </Button>
      </div>
    </div>
  );
}
