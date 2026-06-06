import "server-only";

export type GroqMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content?: string | null;
  tool_calls?: Array<{ id: string; type: "function"; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
  name?: string;
};

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function askGroq(messages: GroqMessage[], tools?: any[]): Promise<GroqMessage | null> {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

  if (!apiKey) return null;

  try {
    const body: Record<string, any> = {
      model,
      temperature: 0.7,
      max_tokens: 300,
      messages
    };

    if (tools && tools.length > 0) {
      body.tools = tools;
      body.tool_choice = "auto";
    }

    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify(body),
      cache: "no-store"
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Groq error response:", text);
      return null;
    }
    
    const payload = (await response.json()) as { choices?: Array<{ message?: GroqMessage }> };
    return payload.choices?.[0]?.message ?? null;
  } catch (error) {
    console.error("Groq request failed", {
      message: error instanceof Error ? error.message : "Unknown error"
    });
    return null;
  }
}
