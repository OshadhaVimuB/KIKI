import { cn } from "@/lib/utils";

export function MatchScore({ score, className }: { score: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)} aria-label={`Gift match score ${score} percent`}>
      <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-bold text-primary">{score}% match</span>
    </div>
  );
}
