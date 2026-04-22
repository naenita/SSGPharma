"use client";

import "./globals.css";

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Application error</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight">
            The app could not finish rendering
          </h2>
          <p className="mt-4 text-muted-foreground">Reload the route and try again.</p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
