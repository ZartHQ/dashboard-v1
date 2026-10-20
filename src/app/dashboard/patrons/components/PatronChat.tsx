"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePatronConversation } from "@/features/messaging/patronChat";
import { useChatThread } from "@/features/messaging/queries";
import { ChatMessage } from "@/features/messaging/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn, formatDateTime } from "@/lib/utils";
import { Send, MessageSquareDashed, Info } from "lucide-react";

interface PatronChatProps {
  patronId: number;
  patronName: string;
}

export function PatronChat({ patronId, patronName }: PatronChatProps) {
  const { data: conversation, isLoading: convoLoading } = usePatronConversation(patronId);
  const conversationId = conversation?.id ?? null;
  const { messages, send, sending, error, connected, isLoading } = useChatThread(conversationId);

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

  // Patron hasn't opened a chat yet (admins can't start one on the backend).
  if (!convoLoading && !conversation) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-[260px] gap-2 px-6">
        <MessageSquareDashed className="w-8 h-8 text-[#aaa]" />
        <div className="text-[13px] font-semibold text-[#1a1a1a]">No chat yet</div>
        <div className="text-[12px] text-[#888] max-w-[320px] leading-relaxed">
          {patronName} hasn&apos;t started a conversation in the app. When they message Zart,
          their chat opens here and you can reply.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[460px] overflow-hidden">
      {/* Connection status */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#f0f0f0] bg-white shrink-0">
        <span className="text-[11px] text-[#888]">In-app chat with {patronName}</span>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold">
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              connected ? "bg-[#115746] animate-pulse" : "bg-[#aaa]"
            )}
          />
          <span className={connected ? "text-[#115746]" : "text-[#aaa]"}>
            {connected ? "Live" : "Connecting..."}
          </span>
        </span>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#fafafa]">
        {(convoLoading || isLoading) ? (
          <div className="text-[13px] text-[#aaa] text-center py-8">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-[13px] text-[#aaa] italic text-center py-8">
            No messages yet in this thread.
          </div>
        ) : (
          messages.map((m: ChatMessage) => (
            <div
              key={m.id}
              className={cn(
                "flex flex-col max-w-[75%]",
                m.senderType === "admin" ? "self-end items-end" : "self-start items-start"
              )}
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
                {m.senderType === "admin" && m.readAt && <span className="text-[#115746]">· Read</span>}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#fff5f2] border-t border-[#ffd4c7] text-[11px] text-[#FA4812] font-semibold shrink-0">
          <Info className="w-3.5 h-3.5 shrink-0" /> {error}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-3 border-t border-[#f0f0f0] bg-white shrink-0"
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message ${patronName}...`}
          className="h-10 flex-1"
        />
        <Button
          type="submit"
          disabled={!draft.trim() || sending}
          isLoading={sending}
          className="h-10 px-4 flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" /> Send
        </Button>
      </form>
    </div>
  );
}
