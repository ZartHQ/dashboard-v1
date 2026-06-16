"use client";

import { useState, ChangeEvent } from "react";
import { STATUS_LABELS } from "../../../features/requests/constants";
import { useRequests } from "../../../features/requests/queries";
import { ServiceRequestStatus } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function RequestsPage() {
  const { data: requests, isLoading } = useRequests();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([
    { text: "Looks urgent — water damage visible in photos. Prioritise today.", by: "Mia", time: "9:35 AM" }
  ]);
  const [subtotal, setSubtotal] = useState(12000);

  const requestsList = requests?.data || [];
  const selected = requestsList.find(r => r.id.toString() === selectedId) || requestsList[0] || null;
  const [reqStatus, setReqStatus] = useState<ServiceRequestStatus>((selected?.status as ServiceRequestStatus) || "pending");

  const feePercent = subtotal >= 400000 ? 0.08 : 0.1;
  const fee = Math.round(subtotal * feePercent);
  const total = subtotal + fee;
  const feeLabel = `Zart service fee (${subtotal >= 400000 ? "8%" : "10%"})`;

  if (isLoading) {
    return <div className="p-10 font-outfit">Loading requests...</div>;
  }

  const filtered = filter === "all" ? requestsList : requestsList.filter((r) => r.status === filter);


  function addNote() {
    if (!note.trim()) return;
    setNotes((prev) => [...prev, { text: note, by: "Admin", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setNote("");
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Topbar */}
      <div className="bg-white border-b border-[#e8e8e8] p-[14px_24px] flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-[16px] font-bold text-[#115746]">Requests</span>
          <div className="flex items-center gap-[5px] bg-[#e8f5f0] border border-[#b2d8cc] rounded-[20px] p-[3px_10px] text-[11px] text-[#115746] font-semibold">
            <div className="w-1.5 h-1.5 rounded-full bg-[#115746] animate-pulse" />
            Live
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["all", "pending", "assigned", "progress", "done"].map((f) => (
            <button 
              key={f} 
              className={cn(
                "text-[12px] p-[5px_14px] rounded-[20px] border-[1.5px] border-[#e0e0e0] text-[#888] font-medium transition-all hover:border-[#115746] hover:text-[#115746]",
                filter === f && "bg-[#115746] text-white border-[#115746]"
              )} 
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All (32)" : f === "pending" ? "Pending (7)" : f === "assigned" ? "Assigned (5)" : f === "progress" ? "In progress (8)" : "Completed (12)"}
            </button>
          ))}
        </div>
      </div>

      {/* Split workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Request list */}
        <div className="w-[340px] flex-shrink-0 border-r border-[#e8e8e8] bg-white flex flex-col overflow-hidden">
          <div className="p-3">
            <Input className="h-9" placeholder="🔍  Search requests..." />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((r) => (
              <div 
                key={r.id} 
                className={cn(
                  "p-[14px_16px] border-b border-[#f0f0f0] cursor-pointer border-l-[3px] border-transparent transition-all hover:bg-[#fafafa]",
                  selected?.id === r.id && "bg-[#e8f5f0] border-l-[#115746]"
                )} 
                onClick={() => { setSelectedId(r.id.toString()); setReqStatus(r.status); }}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="text-[13px] font-semibold text-[#1a1a1a] flex-1 mr-2 leading-tight">{r.title}</div>
                  <div className={cn("w-[9px] h-[9px] rounded-full mt-1 shrink-0", `bg-${r.status}`, 
                    r.status === 'pending' && "bg-[#FFC92A]",
                    r.status === 'assigned' && "bg-[#115746]",
                    r.status === 'in_progress' && "bg-[#FA4812]",
                    r.status === 'completed' && "bg-[#22c55e]"
                  )} />
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-[6px] font-semibold", `cat-${r.artisanType?.name?.toLowerCase().substring(0, 5)}`,
                    r.artisanType?.name?.toLowerCase().includes('plumb') && "bg-[#e0f0ff] text-[#1e5a8e]",
                    r.artisanType?.name?.toLowerCase().includes('elec') && "bg-[#fff3cc] text-[#8a5f00]",
                    r.artisanType?.name?.toLowerCase().includes('carp') && "bg-[#e8f5e8] text-[#2a6b2a]",
                    r.artisanType?.name?.toLowerCase().includes('paint') && "bg-[#f0eaff] text-[#5a3d8a]",
                    r.artisanType?.name?.toLowerCase().includes('ac') && "bg-[#e0f8f8] text-[#1a6a6a]",
                    r.artisanType?.name?.toLowerCase().includes('clean') && "bg-[#ffe8e8] text-[#8a2020]"
                  )}>{r.artisanType?.name}</span>
                  <span className="text-[11px] text-[#888]">{r.patron?.firstName} {r.patron?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-[#aaa]">📍 {r.patron?.homeAddress || "No location"}</span>
                  <span className="text-[11px] text-[#bbb]">{new Date(r.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#f9f9f9]">
            <div className="bg-white border-b border-[#e8e8e8] p-[16px_24px] flex items-center justify-between shrink-0">
              <div>
                <div className="text-[17px] font-bold text-[#115746] mb-1">{selected.title}</div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#aaa]">#{selected.id}</span>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-[6px] font-semibold", `cat-${selected.artisanType?.name?.toLowerCase().substring(0, 5)}`,
                    selected.artisanType?.name?.toLowerCase().includes('plumb') && "bg-[#e0f0ff] text-[#1e5a8e]",
                    selected.artisanType?.name?.toLowerCase().includes('elec') && "bg-[#fff3cc] text-[#8a5f00]",
                    selected.artisanType?.name?.toLowerCase().includes('carp') && "bg-[#e8f5e8] text-[#2a6b2a]",
                    selected.artisanType?.name?.toLowerCase().includes('paint') && "bg-[#f0eaff] text-[#5a3d8a]",
                    selected.artisanType?.name?.toLowerCase().includes('ac') && "bg-[#e0f8f8] text-[#1a6a6a]",
                    selected.artisanType?.name?.toLowerCase().includes('clean') && "bg-[#ffe8e8] text-[#8a2020]"
                  )}>{selected.artisanType?.name}</span>
                </div>
              </div>
              <Select className="w-auto" value={reqStatus} onChange={(e: ChangeEvent<HTMLSelectElement>) => setReqStatus(e.target.value as ServiceRequestStatus)}>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            </div>

            <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-5 min-h-0">
              {/* Patron */}
              <Card className="shrink-0">
                <CardHeader><CardTitle>Patron details</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2.5 mb-3">
                    <div className="flex flex-col gap-1">
                      <div className="text-[11px] text-[#aaa] font-medium">Name</div>
                      <div className="text-[13px] text-[#1a1a1a] font-semibold">{selected.patron?.firstName} {selected.patron?.lastName}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-[11px] text-[#aaa] font-medium">Phone</div>
                      <div className="text-[13px] text-[#115746] font-semibold underline cursor-pointer">{selected.patron?.phone || "N/A"}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-[11px] text-[#aaa] font-medium">Location</div>
                      <div className="text-[13px] text-[#1a1a1a] font-semibold">{selected.patron?.homeAddress || "No location"}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-[11px] text-[#aaa] font-medium">Requested</div>
                      <div className="text-[13px] text-[#1a1a1a] font-semibold">{new Date(selected.createdAt || Date.now()).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#555] leading-relaxed mb-3">
                    {selected.description}
                  </p>
                  <div className="flex gap-2 mb-3.5">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="w-16 h-16 bg-[#f5f5f5] rounded-lg border-[1.5px] border-[#e8e8e8] flex items-center justify-center text-[22px] cursor-pointer">📷</div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">📞 Call patron</Button>
                    <Button variant="wa" className="flex-1">💬 Notify patron in app</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Assign */}
              <Card className="shrink-0">
                <CardHeader><CardTitle>Assign artisan</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2.5">
                    <Select className="w-full">
                      <option value="">Select an artisan...</option>
                      <option>John Mensah — Plumber · Lekki · ★ 4.9 (57 jobs)</option>
                      <option>Fatima Yusuf — Plumber · Ajah · ★ 4.6 (12 jobs)</option>
                      <option>Emeka Peters — Plumber · Surulere · ★ 4.4 (8 jobs)</option>
                    </Select>
                    <div className="flex items-center gap-1.5 bg-[#FDF4D7] border border-[#e8d98a] rounded-[6px] p-[7px_10px] text-[12px] text-[#8a6f00]">
                      🤖 AI suggests <strong className="ml-1">John Mensah</strong> — highest rated {selected.artisanType?.name?.toLowerCase() || 'artisan'} closest to {selected.patron?.homeAddress || 'location'}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Scheduled date & time" />
                      <Input placeholder="Est. duration e.g. 2 hrs" />
                    </div>
                    <Button variant="primary" className="w-full">Assign artisan &amp; notify patron via app</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Invoice */}
              <Card className="shrink-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>📄 Invoice generator</CardTitle>
                  <span className="text-[11px] text-[#aaa]">Auto-sends to patron in app on completion</span>
                </CardHeader>
                <CardContent>
                  <div className="bg-[#FDF4D7] border-[1.5px] border-[#e8d98a] rounded-[10px] p-3.5">
                    <div className="text-[12px] font-bold text-[#8a6f00] uppercase tracking-wider mb-2.5">
                      🤖 Invoice details
                    </div>
                    <div className="grid grid-cols-[1fr_80px_90px] gap-1.5 mb-1">
                      <span className="text-[11px] text-[#aaa] font-semibold">Description</span>
                      <span className="text-[11px] text-[#aaa] font-semibold">Qty</span>
                      <span className="text-[11px] text-[#aaa] font-semibold">Unit price</span>
                    </div>
                    <div className="grid grid-cols-[1fr_80px_90px] gap-1.5 mb-1.5">
                      <Input className="h-8 text-[12px] border-[#e8d98a]" defaultValue="Sink leak repair — labour" />
                      <Input className="h-8 text-[12px] border-[#e8d98a]" defaultValue="1" />
                      <Input 
                        className="h-8 text-[12px] border-[#e8d98a]" 
                        value={`₦${subtotal.toLocaleString()}`} 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0; setSubtotal(v); }} 
                      />
                    </div>
                    <div className="grid grid-cols-[1fr_80px_90px] gap-1.5">
                      <Input className="h-8 text-[12px] border-[#e8d98a]" placeholder="Additional item..." />
                      <Input className="h-8 text-[12px] border-[#e8d98a]" placeholder="1" />
                      <Input className="h-8 text-[12px] border-[#e8d98a]" placeholder="₦0" />
                    </div>
                    <div className="border-t border-[#e8d98a] mt-3 pt-2.5">
                      <div className="flex justify-between mb-1">
                        <span className="text-[12px] text-[#8a6f00] font-semibold">Subtotal</span>
                        <span className="text-[13px] font-semibold text-[#555]">₦{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-[12px] text-[#8a6f00] font-semibold">{feeLabel}</span>
                        <span className="text-[13px] font-semibold text-[#FA4812]">₦{fee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t-2 border-[#e8d98a] pt-2.5">
                        <span className="text-[14px] font-bold">Total due</span>
                        <span className="text-[18px] font-bold text-[#115746]">₦{total.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2.5">
                      <Button variant="primary" className="text-[12px] h-9">📄 Generate PDF invoice</Button>
                      <Button variant="wa" className="text-[12px] h-9">💬 Send to patron via app</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card className="shrink-0 mb-5">
                <CardHeader><CardTitle>Internal notes</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1.5 bg-[#fff8e1] border border-[#ffe082] rounded-[6px] p-[6px_10px] text-[11px] text-[#8a6f00] font-semibold mb-2">
                    🔒 Internal only — patron cannot see these notes
                  </div>
                  <div className="flex flex-col gap-2">
                    {notes.map((n, i) => (
                      <div key={i} className="bg-[#f9f9f9] rounded-lg p-[10px_12px] border-l-[3px] border-[#115746]">
                        <div className="text-[12px] text-[#555] leading-relaxed">{n.text}</div>
                        <div className="text-[10px] text-[#aaa] mt-1">{n.by} · {n.time}</div>
                      </div>
                    ))}
                  </div>
                  <textarea
                    value={note}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
                    placeholder="Add an internal note (e.g. 'called patron, no answer')..."
                    className="w-full bg-[#f9f9f9] border-[1.5px] border-[#e0e0e0] rounded-lg p-[10px_12px] text-[13px] text-[#333] font-outfit resize-none h-[72px] mt-2.5 focus:outline-none focus:border-[#115746]"
                  />
                  <div className="flex justify-end mt-2">
                    <Button variant="primary" className="text-[12px] h-8" onClick={addNote}>Add note</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#f9f9f9] text-[#bbb]">
            <div className="text-[36px] mb-2">📋</div>
            <div className="text-[14px]">Select a request to view details</div>
          </div>
        )}
      </div>
    </div>
  );
}
