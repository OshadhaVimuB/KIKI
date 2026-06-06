import { Mascot } from "@/components/mascot";

export function KikiTypingIndicator() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-white/85 p-3 shadow-soft backdrop-blur">
      <Mascot compact />
      <div className="flex items-center gap-1" aria-label="KIKI is thinking">
        <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
      </div>
      <span className="text-sm font-medium text-muted-foreground">KIKI is choosing carefully</span>
    </div>
  );
}
