import { Loader2 } from "lucide-react";

export default function ProposalLoading() {
  return (
    <main id="main-content" className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-lg border border-border bg-surface p-6 shadow-[0_18px_44px_rgba(37,32,24,0.07)]">
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <Loader2
              aria-hidden="true"
              className="h-4 w-4 motion-safe:animate-spin"
            />
            Loading itinerary
          </div>
          <div className="mt-6 h-44 rounded-lg border border-dashed border-border bg-surface-muted" />
        </section>
      </div>
    </main>
  );
}
