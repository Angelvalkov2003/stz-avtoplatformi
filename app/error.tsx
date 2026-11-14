"use client";

import { Button } from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 md:px-6">
      <p className="tabular text-sm text-steel">Грешка</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">
        Нещо се обърка
      </h1>
      <p className="mt-3 text-steel">Опитайте отново или се обадете по телефона.</p>
      <div className="mt-8 flex gap-3">
        <Button type="button" onClick={reset}>
          Опитай пак
        </Button>
        <Button href="/" variant="ghost">
          Начало
        </Button>
      </div>
    </div>
  );
}
