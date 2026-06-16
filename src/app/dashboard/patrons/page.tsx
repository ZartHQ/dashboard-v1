"use client";

import { useState, KeyboardEvent, useEffect } from "react";
import { Patron, Message, INIT_MESSAGES } from "../../../features/patrons/constants";
import { usePatrons } from "../../../features/patrons/queries";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export default function PatronsPage() {
  const { data: patrons, isLoading: patronsLoading } = usePatrons();
  const [selected, setSelected] = useState<Patron | null>(null);
  const [messages, setMessages] = useState<Message[]>(INIT_MESSAGES);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (patrons && patrons.length > 0 && !selected) {
      setSelected(patrons[0]);
    }
  }, [patrons, selected]);

  if (patronsLoading) {
    return <div className="p-10 font-outfit">Loading patrons...</div>;
  }

  function sendMessage() {
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { from: "admin", text: draft, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setDraft("");
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Topbar */}
      <div className="bg-white border-b border-[#e8e8e8] p-[14px_24px] flex items-center justify-between shrink-0">
        <div className="text-[16px] font-bold text-[#115746]">Patrons <span className="text-[#aaa] font-normal text-[13px] ml-1.5">{patrons?.length || 0} total</span></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Patron list */}
        <div className="w-[300px] flex-shrink-0 border-r border-[#e8e8e8] bg-white overflow-y-auto">
          <div className="p-3">
            <Input className="h-9" placeholder="🔍  Search patrons..." />
          </div>
          {patrons?.map((p) => (
            <div 
              key={p.id} 
              className={cn(
                "flex items-center gap-2.5 p-[12px_14px] border-b border-[#f5f5f5] cursor-pointer border-l-[3px] border-transparent transition-all hover:bg-[#fafafa]",
                selected?.id === p.id && "bg-[#e8f5f0] border-l-[#115746]"
              )} 
              onClick={() => setSelected(p)}
            >
              <div 
                className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                style={{ background: p.avBg, color: p.avColor }}
              >{p.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#1a1a1a]">{p.name}</div>
                <div className="text-[11px] text-[#888] mt-0.5 truncate">{p.preview}</div>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[10px] text-[#bbb]">{p.time}</span>
                {p.unread && <div className="w-2 h-2 rounded-full bg-[#FA4812]" />}
              </div>
            </div>
          ))}
        </div>

        {/* Detail split */}
        {selected && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#f9f9f9]">
            {/* Patron header */}
            <div className="bg-white border-b border-[#e8e8e8] p-[14px_20px] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div 
                  className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-[14px] font-bold"
                  style={{ background: selected.avBg, color: selected.avColor }}
                >{selected.initials}</div>
                <div>
                  <div className="text-[15px] font-bold text-[#115746]">{selected.name}</div>
                  <div className="text-[11px] text-[#aaa] mt-0.5">{selected.loc} · {selected.bookings} bookings · Joined {selected.joined}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="text-xs h-9">📞 Call</Button>
                <Button variant="wa" className="text-xs h-9">💬 WhatsApp</Button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-[1fr_320px] overflow-hidden">
              {/* Chat */}
              <div className="flex flex-col border-r border-[#e8e8e8] overflow-hidden">
                <div className="p-[10px_16px] border-b border-[#f0f0f0] text-[11px] font-bold text-[#115746] uppercase tracking-wider bg-[#f9f9f9] shrink-0">
                  💬 Chat with {selected.name}
                </div>
                <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto bg-[#f9f9f9]">
                  {messages.map((m, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "flex flex-col",
                        m.from === "admin" ? "items-end" : "items-start"
                      )}
                    >
                      {i === 0 && <div className="text-[10px] text-[#aaa] mb-1 font-semibold">{m.from === "patron" ? selected.name : `Zart (you)`}</div>}
                      <div 
                        className={cn(
                          "max-w-[70%] p-[10px_14px] rounded-[12px] text-[13px] leading-normal",
                          m.from === "patron" ? "bg-white text-[#1a1a1a] border border-[#e8e8e8] rounded-tl-[4px]" : "bg-[#115746] text-[#FDF4D7] rounded-tr-[4px]"
                        )}
                      >
                        {m.text}
                      </div>
                      <div className="text-[10px] text-[#bbb] mt-1">{m.time}</div>
                    </div>
                  ))}
                </div>
                <div className="p-[12px_16px] border-t border-[#e8e8e8] bg-white shrink-0">
                  <div className="flex gap-2 items-end">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder={`Message ${selected.name}...`}
                      rows={1}
                      className="flex-1 bg-[#f5f5f5] border-[1.5px] border-[#e0e0e0] rounded-xl p-[10px_14px] text-[13px] font-outfit text-[#333] resize-none leading-normal focus:outline-none focus:border-[#115746]"
                    />
                    <Button variant="primary" onClick={sendMessage} className="h-10 px-5">Send</Button>
                  </div>
                </div>
              </div>

              {/* Info panel */}
              <div className="p-4 overflow-y-auto bg-[#f9f9f9] flex flex-col gap-3">
                <Card>
                  <CardHeader><CardTitle>Patron info</CardTitle></CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    {[["Location", selected.loc], ["Joined", selected.joined], ["Total bookings", selected.bookings], ["Total spent", selected.spent]].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center">
                        <span className="text-[11px] text-[#aaa] font-medium">{k}</span>
                        <span className="text-[12px] font-semibold text-[#1a1a1a]">{v}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                {selected.activeJob && (
                  <Card>
                    <CardHeader><CardTitle>Active request</CardTitle></CardHeader>
                    <CardContent>
                      <div className="bg-[#f9f9f9] rounded-lg p-2 border border-[#f0f0f0]">
                        <div className="text-[12px] font-semibold text-[#1a1a1a]">{selected.activeJob.title}</div>
                        <div className="flex justify-between mt-1 items-center">
                          <span className="text-[11px] text-[#aaa]">#{selected.activeJob.id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-[6px] font-bold bg-[#fff3e0] text-[#c2410c] uppercase">{selected.activeJob.status}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {selected.pastJobs.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle>Past bookings</CardTitle></CardHeader>
                    <CardContent className="flex flex-col gap-1.5">
                      {selected.pastJobs.map((j) => (
                        <div key={j.id} className="bg-[#f9f9f9] rounded-lg p-2 border border-[#f0f0f0]">
                          <div className="text-[12px] font-semibold text-[#1a1a1a]">{j.title}</div>
                          <div className="flex justify-between mt-1 items-center">
                            <span className="text-[11px] text-[#aaa]">#{j.id}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-[6px] font-bold bg-[#e8f5f0] text-[#115746] uppercase">Done</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
