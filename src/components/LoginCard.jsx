import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LoginCard({ onLogin }) {
  const [name, setName] = useState("");
  const [accessCode, setAccessCode] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !accessCode.trim()) {
      return;
    }

    onLogin({
      name,
      accessCode
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="glass-panel w-full max-w-md rounded-[2rem] p-6 text-white shadow-2xl"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-black tracking-tight">Study Buddy Login</h1>
          <p className="text-sm leading-6 text-violet-100">
            This test login is browser-local for now. Students on the same device can return to
            their saved chats with the same name and access code.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-violet-200"
              placeholder="Student name"
            />
          </label>

          <label className="block text-sm font-medium">
            Access code
            <input
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-violet-200"
              placeholder="Class code or test PIN"
              type="password"
            />
          </label>
        </div>

        <Button type="submit" className="mt-6 w-full justify-center py-3 text-base shadow-lg">
          Enter Study Buddy
        </Button>
      </form>
    </div>
  );
}
