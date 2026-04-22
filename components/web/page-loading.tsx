type PageLoadingProps = {
  title?: string;
};

export function PageLoading({ title = "Loading content" }: PageLoadingProps) {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-[1400px] flex-col gap-6 px-4 py-12 md:px-6">
      <div className="space-y-3">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-12 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-5 w-full max-w-3xl animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`${title}-${index}`} className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
            <div className="h-40 animate-pulse rounded-2xl bg-muted" />
            <div className="mt-5 h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
