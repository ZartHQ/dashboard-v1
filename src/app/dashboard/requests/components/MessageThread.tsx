"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMessages, useSendMessage } from "@/features/messaging/queries";
import { Message } from "@/features/messaging/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn, formatDateTime } from "@/lib/utils";
import { Send } from "lucide-react";

interface MessageThreadProps {
  requestId: number;
  patronName: string;
}

export function MessageThread({ requestId, patronName }: MessageThreadProps) {
  const { data: messages = [], isLoading } = useMessages(requestId);
  const sendMessage = useSendMessage(requestId);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    sendMessage.mutate(body);
    setDraft("");
  };

  return (
    <div className="flex flex-col h-[440px] overflow-hidden">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#fafafa]">
        {isLoading ? (
          <div className="text-[13px] text-[#aaa] text-center py-8">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-[13px] text-[#aaa] italic text-center py-8">
            No messages yet. Say hello to {patronName}.
          </div>
        ) : (
          messages.map((m: Message) => (
            <div
              key={m.id}
              className={cn(
                "flex flex-col max-w-[75%]",
                m.sender === "admin" ? "self-end items-end" : "self-start items-start"
              )}
            >
              <div
                className={cn(
                  "px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed break-words",
                  m.sender === "admin"
                    ? "bg-[#115746] text-white rounded-br-sm"
                    : "bg-white border border-[#e8e8e8] text-[#1a1a1a] rounded-bl-sm"
                )}
              >
                {m.body}
              </div>
              <span className="text-[10px] text-[#bbb] mt-1 px-1">
                {formatDateTime(m.createdAt)}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

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
          disabled={!draft.trim()}
          isLoading={sendMessage.isPending}
          className="h-10 px-4 flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" /> Send
        </Button>
      </form>
    </div>
  );
}
