/** Hand-drawn feel divider with a small diamond at the centre. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-border sm:w-24" />
      <span className="size-1.5 rotate-45 border border-gold/70" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-border sm:w-24" />
    </div>
  );
}
