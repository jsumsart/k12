import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Brain,
  Calculator,
  FlaskConical,
  Globe,
  Plus,
  Send,
  Sparkles,
  Zap
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const SYSTEM_PROMPT =
  "You are a supportive study tutor. When a user asks for help, explain the underlying concepts, provide analogies, and ask guiding questions to help them think through problems. If a user asks you to solve a specific assignment, quiz, or homework question, politely decline and instead help them understand the topic so they can solve it themselves. Never give direct answers to graded work. Always encourage learning over shortcuts.";

const SUGGESTIONS = [
  {
    icon: FlaskConical,
    label: "Explain photosynthesis to me",
    color: "text-emerald-300"
  },
  {
    icon: Calculator,
    label: "Help me understand quadratic equations",
    color: "text-fuchsia-200"
  },
  {
    icon: Globe,
    label: "What caused the French Revolution?",
    color: "text-amber-300"
  },
  {
    icon: Zap,
    label: "How does DNA replication work?",
    color: "text-sky-300"
  }
];

function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={cn("mb-4 flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white shadow">
          <Brain className="h-4 w-4 text-violet-700" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[78%] rounded-3xl px-4 py-3 text-sm shadow-lg",
          isUser
            ? "rounded-tr-sm bg-white text-violet-900"
            : "glass-panel rounded-tl-sm text-white"
        )}
      >
        {isUser ? (
          <p className="leading-relaxed">{content}</p>
        ) : (
          <ReactMarkdown className="prose prose-sm max-w-none prose-invert [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="mb-4 flex justify-start gap-3">
      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white shadow">
        <Brain className="h-4 w-4 text-violet-700" />
      </div>
      <div className="glass-panel rounded-3xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1 py-1">
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-white"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-white"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-white"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function StudyAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, error]);

  async function sendMessage(text) {
    const userMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setError("");
    setIsLoading(true);

    const history = updatedMessages
      .map((message) => `${message.role === "user" ? "User" : "Assistant"}: ${message.content}`)
      .join("\n\n");

    const prompt = `${SYSTEM_PROMPT}\n\n--- Conversation ---\n${history}\n\nAssistant:`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({ prompt });
      setMessages((current) => [...current, { role: "assistant", content: response }]);
    } catch (err) {
      setError(
        err?.message ||
          "The Base44 request failed. Check your .env.local values and make sure the backend app is available."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (input.trim() && !isLoading) {
        sendMessage(input.trim());
      }
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6d28d9 45%, #0f172a 100%)" }}
    >
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.18)"
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-white shadow-xl">
            <Sparkles className="h-5 w-5 text-violet-700" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-white">Study Buddy</h1>
            <p className="text-sm text-violet-200">Guided help for K-12 learners</p>
          </div>
        </div>
        <Button onClick={() => setMessages([])} className="shadow-lg">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="mx-auto flex h-full max-w-4xl flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white/15 shadow-2xl backdrop-blur">
              <Brain className="h-9 w-9 text-white" />
            </div>
            <div className="max-w-xl space-y-3">
              <h2 className="text-4xl font-black tracking-tight text-white">
                Learn the why, not just the answer.
              </h2>
              <p className="text-base leading-7 text-violet-100">
                Ask about science, math, history, reading, or study skills. This assistant is
                designed to coach students through ideas instead of doing graded work for them.
              </p>
            </div>
            <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
              {SUGGESTIONS.map(({ icon: Icon, label, color }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => sendMessage(label)}
                  disabled={isLoading}
                  className="glass-panel flex items-center gap-3 rounded-3xl px-4 py-4 text-left text-sm font-medium text-white transition duration-150 hover:-translate-y-0.5 hover:bg-white/20 disabled:opacity-60"
                >
                  <Icon className={cn("h-5 w-5 shrink-0", color)} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <p className="text-sm text-violet-200">
              The assistant explains concepts and asks guiding questions instead of solving graded
              assignments outright.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            {messages.map((message, index) => (
              <MessageBubble key={`${message.role}-${index}`} {...message} />
            ))}
            {isLoading && <TypingIndicator />}
            {error ? (
              <div className="glass-panel mt-4 rounded-3xl border border-rose-200/30 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>
        )}
      </main>

      <footer className="mx-auto w-full max-w-3xl px-2 pb-4">
        <div className="glass-panel flex items-end gap-2 rounded-[1.75rem] p-3">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about a topic you are learning..."
            className="min-h-[52px] resize-none border-none"
            rows={1}
            disabled={isLoading}
          />
          <Button
            onClick={() => {
              if (input.trim() && !isLoading) {
                sendMessage(input.trim());
              }
            }}
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 rounded-2xl p-0 shadow-lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
