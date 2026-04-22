import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">404</p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-foreground md:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        The page you requested could not be found. Head back to the main catalog and continue from there.
      </p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
        Back to home
      </Link>
    </div>
  );
}
