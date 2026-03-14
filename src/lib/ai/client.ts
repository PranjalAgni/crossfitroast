import { AI_GATEWAY_URL, AI_GATEWAY_KEY } from "$env/static/private";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callAI(
  messages: Message[],
  model = "claude-sonnet-4-20250514"
): Promise<string> {
  console.log("\n=== AI PROMPT ===");
  console.log("Model:", model);
  messages.forEach((m, i) => console.log(`\n[${i + 1}] ${m.role.toUpperCase()}:\n${m.content}`));
  console.log("\n=================\n");

  const res = await fetch(AI_GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AI_GATEWAY_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!res.ok) {
    throw new Error(`AI gateway error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}
