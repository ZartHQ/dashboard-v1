"use client";

import React, { ChangeEvent } from "react";
import { ServiceRequestDetail, ServiceRequestStatus, Artisan } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { PageLoader } from "@/components/ui/PageLoader";
import { STATUS_LABELS } from "../../../../features/requests/constants";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

interface RequestDetailsPanelProps {
  selected: ServiceRequestDetail;
  isDetailLoading: boolean;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  reqStatus: ServiceRequestStatus;
  handleUpdateStatus: (status: ServiceRequestStatus) => void;
  updateStatusMutation: { isPending: boolean };
  showAssignDropdown: boolean;
  setShowAssignDropdown: (show: boolean) => void;
  selectedArtisanId: string;
  setSelectedArtisanId: (id: string) => void;
  artisansList: Artisan[];
  handleAssign: () => void;
  assignArtisanMutation: { isPending: boolean };
  subtotal: number;
  setSubtotal: (val: number) => void;
  feeLabel: string;
  fee: number;
  total: number;
  note: string;
  setNote: (note: string) => void;
  handleAddNote: () => void;
  addNoteMutation: { isPending: boolean };
}

export function RequestDetailsPanel({
  selected,
  isDetailLoading,
  selectedId,
  setSelectedId,
  reqStatus,
  handleUpdateStatus,
  updateStatusMutation,
  showAssignDropdown,
  setShowAssignDropdown,
  selectedArtisanId,
  setSelectedArtisanId,
  artisansList,
  handleAssign,
  assignArtisanMutation,
  subtotal,
  setSubtotal,
  feeLabel,
  fee,
  total,
  note,
  setNote,
  handleAddNote,
  addNoteMutation,
}: RequestDetailsPanelProps) {
  return (
    <div className={cn(
      "flex-1 flex flex-col overflow-hidden bg-[#f9f9f9] min-h-0 relative",
      selectedId === null ? "hidden md:flex" : "flex"
    )}>
      {isDetailLoading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <PageLoader />
        </div>
      )}
      <div className="bg-white border-b border-[#e8e8e8] p-[16px_20px] flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 shrink-0">
        <div>
          <button
            onClick={() => setSelectedId(null)}
            className="md:hidden flex items-center gap-1 text-[13px] font-semibold text-[#115746] bg-transparent border-none cursor-pointer mb-2.5"
          >
            ← Back to requests
          </button>
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
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Indicator */}
          <span className={cn(
            "text-[10px] font-bold px-3 py-1.5 rounded-[12px] border uppercase tracking-wider shrink-0",
            reqStatus === 'pending' && "bg-[#FDF4D7] text-[#8a6f00] border-[#e8d98a]",
            reqStatus === 'assigned' && "bg-[#e8f5f0] text-[#115746] border-[#b2d8cc]",
            reqStatus === 'in_progress' && "bg-[#fff5f2] text-[#FA4812] border-[#ffd4c7]",
            reqStatus === 'completed' && "bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]",
            reqStatus === 'cancelled' && "bg-[#f5f5f5] text-[#737373] border-[#e5e5e5]",
            reqStatus === 'disputed' && "bg-[#fff1f2] text-[#e11d48] border-[#fecdd3]"
          )}>
            {STATUS_LABELS[reqStatus] || reqStatus}
          </span>

          {/* Action Buttons */}
          {reqStatus === 'pending' && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Button
                variant="outline"
                className="h-8 text-[11px] font-bold px-3 uppercase tracking-wider border-[#c41c1c] text-[#c41c1c] hover:bg-[#c41c1c] hover:text-white transition-all duration-200"
                onClick={() => handleUpdateStatus('cancelled')}
                disabled={updateStatusMutation.isPending}
              >
                Cancel
              </Button>

              {!showAssignDropdown ? (
                <Button
                  variant="primary"
                  className="h-8 text-[11px] font-bold px-3 uppercase tracking-wider"
                  onClick={() => setShowAssignDropdown(true)}
                >
                  Assign
                </Button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Select
                    className="h-8 text-[11px] py-0 w-[180px]"
                    value={selectedArtisanId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedArtisanId(e.target.value)}
                  >
                    <option value="">Select artisan...</option>
                    {artisansList?.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.user.firstName} {a.user.lastName} ({a.artisanType.name})
                      </option>
                    ))}
                  </Select>
                  <Button
                    variant="primary"
                    className="h-8 text-[11px] font-bold px-3 uppercase tracking-wider"
                    onClick={() => {
                      handleAssign();
                      setShowAssignDropdown(false);
                    }}
                    disabled={assignArtisanMutation.isPending || !selectedArtisanId}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 text-[11px] font-bold px-2.5 uppercase tracking-wider"
                    onClick={() => setShowAssignDropdown(false)}
                  >
                    ✕
                  </Button>
                </div>
              )}
            </div>
          )}

          {(reqStatus === 'assigned' || reqStatus === 'in_progress') && (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                className="h-8 text-[11px] font-bold px-3 uppercase tracking-wider border-[#c41c1c] text-[#c41c1c] hover:bg-[#c41c1c] hover:text-white transition-all duration-200"
                onClick={() => handleUpdateStatus('cancelled')}
                disabled={updateStatusMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="h-8 text-[11px] font-bold px-3 uppercase tracking-wider"
                onClick={() => handleUpdateStatus('completed')}
                disabled={updateStatusMutation.isPending}
              >
                Complete
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-5 min-h-0">
        {/* Patron */}
        <Card className="shrink-0">
          <CardHeader><CardTitle>Patron details</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
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
                <div className="text-[13px] text-[#1a1a1a] font-semibold">{selected.address}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[11px] text-[#aaa] font-medium">Requested</div>
                <div className="text-[13px] text-[#1a1a1a] font-semibold">{formatDate(selected.createdAt || new Date())}</div>
              </div>
            </div>
            <p className="text-[13px] text-[#555] leading-relaxed mb-3">
              {selected.description}
            </p>
            <div className="flex gap-2 mb-3.5 flex-wrap">
              {selected.media && selected.media.length > 0 ? (
                selected.media.map((m: any) => (
                  <a key={m.id} href={m.mediaUrl} target="_blank" rel="noopener noreferrer" className="w-16 h-16 bg-[#f5f5f5] rounded-lg border-[1.5px] border-[#e8e8e8] flex items-center justify-center cursor-pointer overflow-hidden hover:opacity-90 transition-opacity">
                    {m.mediaType === 'image' ? (
                      <img src={m.mediaUrl} alt="Request media" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[22px]">📁</div>
                    )}
                  </a>
                ))
              ) : (
                <div className="text-[12px] text-[#aaa] italic py-2">No media attached</div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="flex-1" onClick={() => selected.patron?.phone && window.open(`tel:${selected.patron.phone}`)}>📞 Call patron</Button>
              <Button variant="wa" className="flex-1" onClick={() => selected.patron?.phone && window.open(`https://wa.me/${selected.patron.phone.replace(/[^0-9]/g, "")}`)}>💬 Notify patron in app</Button>
            </div>
          </CardContent>
        </Card>

        {/* Assign */}
        <Card className="shrink-0">
          <CardHeader><CardTitle>Assign artisan</CardTitle></CardHeader>
          <CardContent>
            {reqStatus === 'pending' ? (
              <div className="flex flex-col gap-2.5">
                <Select
                  className="w-full"
                  value={selectedArtisanId}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedArtisanId(e.target.value)}
                >
                  <option value="">Select an artisan...</option>
                  {artisansList?.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.user?.firstName} {a.user?.lastName} — {a.artisanType.name} · {a.operatingArea.join(', ')} · ★ {a.rating ?? "—"} ({a.jobsDone} jobs)
                    </option>
                  ))}
                </Select>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleAssign}
                  disabled={assignArtisanMutation.isPending || !selectedArtisanId}
                >
                  {assignArtisanMutation.isPending ? "Assigning..." : "Assign artisan & notify patron via app"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="text-[11px] text-[#aaa] font-medium">Assigned Artisan</div>
                {selected.artisan ? (
                  <div className="bg-[#e8f5f0] border border-[#b2d8cc] rounded-[8px] p-3 flex items-center justify-between">
                    <div>
                      <div className="text-[13px] text-[#115746] font-bold">{`${selected.artisan.firstName} ${selected.artisan.lastName}`}</div>
                      <div className="text-[11px] text-[#888] mt-0.5">{selected.artisan.phone || "No phone"}</div>
                    </div>
                    <span className="text-[10px] bg-[#115746] text-white font-bold px-2.5 py-0.5 rounded-[10px] uppercase">Assigned</span>
                  </div>
                ) : (
                  <div className="text-[12px] text-[#888] italic">No artisan assigned.</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice */}
        <Card className="shrink-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>📄 Invoice generator</CardTitle>
            <span className="text-[11px] text-[#aaa]">Auto-sends to patron in app on completion</span>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[380px] bg-[#FDF4D7] border-[1.5px] border-[#e8d98a] rounded-[10px] p-3.5">
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
                  value={formatCurrency(subtotal)}
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
                  <span className="text-[13px] font-semibold text-[#555]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-[12px] text-[#8a6f00] font-semibold">{feeLabel}</span>
                  <span className="text-[13px] font-semibold text-[#FA4812]">{formatCurrency(fee)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-[#e8d98a] pt-2.5">
                  <span className="text-[14px] font-bold">Total due</span>
                  <span className="text-[18px] font-bold text-[#115746]">{formatCurrency(total)}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-2.5">
                <Button variant="primary" className="text-[12px] h-9 flex-1">📄 Generate PDF invoice</Button>
                <Button variant="wa" className="text-[12px] h-9 flex-1">💬 Send to patron via app</Button>
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
              {((selected as ServiceRequestDetail).notes || []).map((n: any, i: number) => (
                <div key={n.id || i} className={cn("bg-[#f9f9f9] rounded-lg p-[10px_12px] border-l-[3px] border-[#115746] transition-opacity", n.sending && "opacity-70")}>
                  <div className="text-[12px] text-[#555] leading-relaxed">{n.note}</div>
                  <div className="text-[10px] text-[#aaa] mt-1 flex justify-between items-center">
                    <span>By {n.admin ? `${n.admin.firstName} ${n.admin.lastName}` : "Admin"}</span>
                    <span>{n.sending ? "" : `${(n.createdAt ? new Date(n.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) : "Just now")}`}</span>
                  </div>
                </div>
              ))}
              {((selected as ServiceRequestDetail).notes || []).length === 0 && (
                <div className="text-[12px] text-[#aaa] italic py-2 text-center">No internal notes yet.</div>
              )}
            </div>
            <textarea
              value={note}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
              placeholder="Add an internal note (e.g. 'called patron, no answer')..."
              className="w-full bg-[#f9f9f9] border-[1.5px] border-[#e0e0e0] rounded-lg p-[10px_12px] text-[13px] text-[#333] font-outfit resize-none h-[72px] mt-2.5 focus:outline-none focus:border-[#115746]"
            />
            <div className="flex justify-end mt-2">
              <Button
                variant="primary"
                className="text-[12px] h-8"
                onClick={handleAddNote}
                disabled={addNoteMutation.isPending}
              >
                {addNoteMutation.isPending ? "Adding..." : "Add note"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
