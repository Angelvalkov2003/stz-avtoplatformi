import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 md:px-6">
      <p className="tabular text-sm text-steel">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">
        Страницата не е намерена
      </h1>
      <p className="mt-3 text-steel">
        Адресът е грешен или страницата е премахната.
      </p>
      <Button href="/" className="mt-8">
        Към началото
      </Button>
    </div>
  );
}
