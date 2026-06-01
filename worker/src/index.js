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
      content: [{ type: "input_text", text: systemPrompt }]
    });
  }

  for (const message of messages) {
    parts.push({
      role: message.role,
      content: [{ type: "input_text", text: message.content }]
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

    if (!env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not set." }), {
        status: 500,
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

      const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || "gpt-4.1-mini",
          input: buildInput(systemPrompt, messages)
        })
      });

      const payload = await openAiResponse.json();

      if (!openAiResponse.ok) {
        return new Response(
          JSON.stringify({
            error: payload?.error?.message || "OpenAI request failed."
          }),
          {
            status: openAiResponse.status,
            headers
          }
        );
      }

      return new Response(
        JSON.stringify({
          reply: payload.output_text || "I could not generate a reply."
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
