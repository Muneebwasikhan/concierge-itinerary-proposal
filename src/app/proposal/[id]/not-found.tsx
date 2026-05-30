import { FileQuestion } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";

export default function ProposalNotFound() {
  return (
    <main id="main-content" className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <EmptyState
          icon={<FileQuestion className="h-5 w-5" />}
          title="Itinerary not found"
          description="This proposal may have been removed or the link may be incorrect."
          action={
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium leading-none text-foreground shadow-[0_8px_18px_rgba(37,32,24,0.06)] transition hover:border-muted-foreground/45 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Return to dashboard
            </Link>
          }
        />
      </div>
    </main>
  );
}
