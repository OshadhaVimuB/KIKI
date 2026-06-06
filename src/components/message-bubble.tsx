import { Mascot } from "@/components/mascot";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full items-end gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-white/80 backdrop-blur-sm shadow-sm border border-white/60 flex items-center justify-center">
          <Mascot compact />
        </div>
      )}
      <div
        className={cn(
          "rounded-2xl p-4 max-w-[85%] md:max-w-[75%] text-sm md:text-base leading-6 shadow-sm",
          isUser
            ? "bg-gradient-to-br from-primary-container/90 to-primary/90 text-white shadow-[0_4px_15px_rgba(64,41,112,0.2)] border-b-0 border-white/10 rounded-br-sm"
            : "bg-white/60 backdrop-blur-[20px] text-on-surface shadow-[0_4px_15px_rgba(0,0,0,0.03),inset_0_0_0_1px_rgba(255,255,255,0.3)] border border-white/50 rounded-bl-sm"
        )}
      >
        <p>{message.content}</p>
      </div>
    </div>
  );
}
