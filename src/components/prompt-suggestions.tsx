import { Gift, Sparkles, Timer } from "lucide-react";

import { Button } from "@/components/button";

const icons = [Gift, Timer, Sparkles];

export function PromptSuggestions({ suggestions, onSelect }: { suggestions: string[]; onSelect: (value: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Suggested prompts">
      {suggestions.map((suggestion, index) => {
        const Icon = icons[index % icons.length];
        return (
          <Button key={suggestion} type="button" variant="outline" size="sm" onClick={() => onSelect(suggestion)} className="shrink-0 bg-white/80">
            <Icon className="h-4 w-4" />
            {suggestion}
          </Button>
        );
      })}
    </div>
  );
}
