"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useConversations, useChatThread } from "@/features/messaging/queries";
import { ChatMessage, Conversation } from "@/features/messaging/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn, formatDateTime } from "@/lib/utils";
import { Send, MessageSquare, Info, ArrowLeft, Search } from "lucide-react";

function patronName(c: Conversation): string {
  return `${c.patron?.firstName ?? ""} ${c.patron?.lastName ?? ""}`.trim() || "Unknown patron";
}

function initials(c: Conversation): string {
  const f = c.patron?.firstName?.[0] ?? "";
  const l = c.patron?.lastName?.[0] ?? "";
  return (f + l).toUpperCase() || "?";
}

function ConversationRow({
  convo,
  active,
  onClick,
}: {
  convo: Conversation;
  active: boolean;
  onClick: () => void;
}) {
  const last = convo.lastMessage;
  const preview = last
    ? `${last.senderType === "admin" ? "You: " : ""}${last.content}`
    : "No messages yet";
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left flex items-start gap-3 p-3 border-b border-[#f0f0f0] cursor-pointer transition-colors",
        active ? "bg-[#e8f5f0]" : "hover:bg-[#f9f9f9]"
      )}
    >
      <div className="w-9 h-9 rounded-full bg-[#115746]/10 text-[#115746] text-[12px] font-bold flex items-center justify-center shrink-0">
        {initials(convo)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-semibold text-[#1a1a1a] truncate">{patronName(convo)}</span>
          <span className="text-[10px] text-[#aaa] shrink-0">
            {convo.lastMessageAt ? formatDateTime(convo.lastMessageAt) : ""}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span className="text-[12px] text-[#888] truncate">{preview}</span>
          {convo.unreadCount > 0 && (
            <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FA4812] text-white text-[10px] font-bold flex items-center justify-center">
              {convo.unreadCount}
            </span>
          )}
        </div>
        {convo.serviceRequest && (
          <span className="inline-block mt-1 text-[10px] text-[#115746] bg-[#e8f5f0] px-1.5 py-0.5 rounded">
            {convo.serviceRequest.title}
          </span>
        )}
      </div>
    </button>
  );
}

function Thread({ convo }: { convo: Conversation }) {
  const { messages, send, sending, error, connected, isLoading } = useChatThread(convo.id);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    send(body);
    setDraft("");
  };

  const name = patronName(convo);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#f0f0f0] bg-white shrink-0">
        <span className="text-[13px] font-semibold text-[#1a1a1a]">{name}</span>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold">
          <span className={cn("w-1.5 h-1.5 rounded-full", connected ? "bg-[#15803d] animate-pulse" : "bg-[#aaa]")} />
          <span className={connected ? "text-[#15803d]" : "text-[#aaa]"}>
            {connected ? "Live" : "Connecting..."}
          </span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#fafafa]">
        {isLoading ? (
          <div className="text-[13px] text-[#aaa] text-center py-8">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-[13px] text-[#aaa] italic text-center py-8">No messages yet in this thread.</div>
        ) : (
          messages.map((m: ChatMessage) => (
            <div
              key={m.id}
              className={cn("flex flex-col max-w-[75%]", m.senderType === "admin" ? "self-end items-end" : "self-start items-start")}
            >
              <div
                className={cn(
                  "px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed break-words",
                  m.senderType === "admin"
                    ? "bg-[#115746] text-white rounded-br-sm"
                    : "bg-white border border-[#e8e8e8] text-[#1a1a1a] rounded-bl-sm"
                )}
              >
                {m.content}
              </div>
              <span className="text-[10px] text-[#bbb] mt-1 px-1 flex items-center gap-1">
                {formatDateTime(m.createdAt)}
                {m.senderType === "admin" && m.readAt && <span className="text-[#15803d]">· Read</span>}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#fff1f2] border-t border-[#fecdd3] text-[11px] text-[#c41c1c] font-semibold shrink-0">
          <Info className="w-3.5 h-3.5 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-[#f0f0f0] bg-white shrink-0">
        <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`Message ${name}...`} className="h-10 flex-1" />
        <Button type="submit" disabled={!draft.trim() || sending} isLoading={sending} className="h-10 px-4 flex items-center gap-1.5">
          <Send className="w-4 h-4" /> Send
        </Button>
      </form>
    </div>
  );
}

export default function MessagesPage() {
  const { data: conversations = [], isLoading } = useConversations();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => patronName(c).toLowerCase().includes(q));
  }, [conversations, query]);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f9f9f9]">
      {/* List pane */}
      <div
        className={cn(
          "w-full md:w-[340px] md:shrink-0 border-r border-[#e8e8e8] bg-white flex flex-col",
          selected ? "hidden md:flex" : "flex"
        )}
      >
        <div className="p-4 border-b border-[#e8e8e8] shrink-0">
          <div className="text-[18px] font-bold text-[#115746] flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> Messages
          </div>
          <div className="text-[12px] text-[#aaa] mt-0.5">All patron conversations</div>
          <div className="relative mt-3">
            <Search className="w-4 h-4 text-[#aaa] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patrons..." className="h-9 pl-8 text-[13px]" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="text-[13px] text-[#aaa] text-center py-10">Loading conversations...</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center gap-2 py-16 px-6">
              <MessageSquare className="w-8 h-8 text-[#ddd]" />
              <div className="text-[13px] font-semibold text-[#1a1a1a]">No conversations yet</div>
              <div className="text-[12px] text-[#888] max-w-[260px] leading-relaxed">
                When a patron messages from the app, their chat shows up here.
              </div>
            </div>
          ) : (
            filtered.map((c) => (
              <ConversationRow key={c.id} convo={c} active={c.id === selectedId} onClick={() => setSelectedId(c.id)} />
            ))
          )}
        </div>
      </div>

      {/* Thread pane */}
      <div className={cn("flex-1 flex-col bg-white min-w-0", selected ? "flex" : "hidden md:flex")}>
        {selected ? (
          <>
            <button
              onClick={() => setSelectedId(null)}
              className="md:hidden flex items-center gap-1 text-[13px] font-semibold text-[#115746] bg-transparent border-none cursor-pointer p-3"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex-1 min-h-0">
              <Thread convo={selected} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 text-[#aaa]">
            <MessageSquare className="w-10 h-10 text-[#ddd]" />
            <div className="text-[14px] font-semibold text-[#888]">Select a conversation</div>
            <div className="text-[12px] text-[#aaa]">Pick a patron on the left to read and reply.</div>
          </div>
        )}
      </div>
    </div>
  );
}
