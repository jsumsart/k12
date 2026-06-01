import { getRuntimeConfig } from "@/lib/runtime-config";

export async function sendChatRequest({ systemPrompt, messages }) {
  const { chatApiUrl } = getRuntimeConfig();

  if (!chatApiUrl) {
    throw new Error(
      "Chat API is not configured yet. Add your deployed backend URL to config.js."
    );
  }

  const response = await fetch(chatApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      systemPrompt,
      messages
    })
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "The chat API returned an unexpected error.");
  }

  if (!data?.reply) {
    throw new Error("The chat API did not return a reply.");
  }

  return data.reply;
}
