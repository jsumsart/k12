const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
});

function buildInput(systemPrompt, messages) {
  const parts = [];

  if (systemPrompt) {
    parts.push({
      role: "system",
      content: systemPrompt
    });
  }

  for (const message of messages) {
    parts.push({
      role: message.role,
      content: message.content
    });
  }

  return parts;
}

export default {
  async fetch(request, env) {
    const requestOrigin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "";
    const origin = requestOrigin || allowedOrigin;
    const headers = corsHeaders(allowedOrigin || "*");

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    if (allowedOrigin && requestOrigin && requestOrigin !== allowedOrigin) {
      return new Response(JSON.stringify({ error: "Origin not allowed." }), {
        status: 403,
        headers
      });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed." }), {
        status: 405,
        headers
      });
    }

    try {
      const { systemPrompt, messages } = await request.json();

      if (!Array.isArray(messages) || messages.length === 0) {
        return new Response(JSON.stringify({ error: "messages must be a non-empty array." }), {
          status: 400,
          headers
        });
      }

      const aiResponse = await env.AI.run(env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct-fast", {
        messages: buildInput(systemPrompt, messages),
        max_tokens: 500,
        temperature: 0.6
      });
      const reply =
        aiResponse?.response ||
        aiResponse?.result?.response ||
        aiResponse?.result ||
        aiResponse?.output_text;

      return new Response(
        JSON.stringify({
          reply: reply || "I could not generate a reply."
        }),
        {
          status: 200,
          headers
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : "Unexpected worker error."
        }),
        {
          status: 500,
          headers
        }
      );
    }
  }
};
