"use client";

export default function Error({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-start justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Something went wrong</p>
      <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-foreground">
        We hit an unexpected error
      </h2>
      <p className="mt-4 text-muted-foreground">Please try the request again. If it keeps failing, refresh the page.</p>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
      >
        Try again
      </button>
    </div>
  );
}
