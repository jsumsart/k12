import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ChatSidebar({
  chats,
  activeChatId,
  currentUserName,
  onSelectChat,
  onNewChat,
  onLogout,
  chatCountLabel,
  canCreateChat
}) {
  return (
    <aside className="glass-panel flex w-full max-w-xs flex-col rounded-[2rem] p-4 text-white shadow-xl">
      <div className="border-b border-white/15 pb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-violet-200">Signed In</p>
        <h2 className="mt-2 text-lg font-bold">{currentUserName}</h2>
        <p className="mt-1 text-sm text-violet-100">{chatCountLabel}</p>
      </div>

      <Button
        onClick={onNewChat}
        disabled={!canCreateChat}
        className="mt-4 w-full justify-center shadow-lg"
      >
        New Chat
      </Button>

      <div className="mt-4 flex-1 space-y-2 overflow-y-auto">
        {chats.map((chat) => (
          <button
            key={chat.id}
            type="button"
            onClick={() => onSelectChat(chat.id)}
            className={cn(
              "w-full rounded-2xl border px-3 py-3 text-left text-sm transition",
              chat.id === activeChatId
                ? "border-white/40 bg-white/20"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            )}
          >
            <p className="font-semibold text-white">{chat.title}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-violet-100">
              {chat.messages[0]?.content || "No messages yet"}
            </p>
          </button>
        ))}
      </div>

      <Button variant="ghost" onClick={onLogout} className="mt-4 justify-center">
        Log Out
      </Button>
    </aside>
  );
}
