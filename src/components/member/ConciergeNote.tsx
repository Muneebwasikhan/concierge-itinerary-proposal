import { MessageSquareQuote } from "lucide-react";
 
type ConciergeNoteProps = {
  note: string;
};

export function ConciergeNote({ note }: ConciergeNoteProps) {
  if (!note || note.trim().length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="concierge-note-heading"
      className="rounded-lg border border-border bg-surface p-6 shadow-[0_18px_44px_rgba(37,32,24,0.04)] sm:p-7"
    >
      <h2 id="concierge-note-heading" className="sr-only">
        Message from your Concierge
      </h2>
      <div className="flex gap-4 sm:gap-5">
        <div
          aria-hidden="true"
          className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent"
        >
          <MessageSquareQuote className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            A Note from your Concierge
          </p>
          <p className="break-words text-base italic leading-relaxed text-foreground/90 sm:text-lg">
            &ldquo;{note.trim()}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
