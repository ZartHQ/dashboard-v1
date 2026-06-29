"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { STATUS_LABELS } from "../../../features/requests/constants";
import { useRequests, useRequestDetail } from "../../../features/requests/queries";
import { useUpdateStatusMutation, useAssignArtisanMutation, useAddNoteMutation } from "../../../features/requests/mutations";
import { useArtisans } from "../../../features/artisans/queries";
import { ServiceRequestDetail, ServiceRequestNote, ServiceRequestStatus } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { PageLoader } from "@/components/ui/PageLoader";

export default function RequestsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [hasInitialLoaded, setHasInitialLoaded] = useState(false);
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setShowAssignDropdown(false);
  }, [selectedId]);

  const { data: requests, isLoading: isListLoading } = useRequests({
    status: filter !== "all" ? filter : undefined,
    search: debouncedSearch || undefined,
  });

  useEffect(() => {
    if (!isListLoading && requests) {
      setHasInitialLoaded(true);
    }
  }, [isListLoading, requests]);



  const { data: selectedDetail, isLoading: isDetailLoading } = useRequestDetail(selectedId);
  const { data: artisansList } = useArtisans();
  console.log(artisansList);

  const [note, setNote] = useState("");
  const [subtotal, setSubtotal] = useState(12000);
  const [selectedArtisanId, setSelectedArtisanId] = useState<string>("");

  const requestsList = requests?.data || [];
  const selectedListItem = requestsList.find(r => r.id.toString() === selectedId) || requestsList[0] || null;
  const selected = (selectedDetail || selectedListItem);

  const [reqStatus, setReqStatus] = useState<ServiceRequestStatus>((selected?.status as ServiceRequestStatus) || "pending");

  useEffect(() => {
    if (selectedDetail?.status) {
      setReqStatus(selectedDetail.status as ServiceRequestStatus);
    }
  }, [selectedDetail?.status]);

  useEffect(() => {
    if (selected?.artisan?.id) {
      setSelectedArtisanId(selected.artisan.id.toString());
    } else {
      setSelectedArtisanId("");
    }
  }, [selected?.id, selected?.artisan?.id]);

  const updateStatusMutation = useUpdateStatusMutation();
  const assignArtisanMutation = useAssignArtisanMutation();
  const addNoteMutation = useAddNoteMutation();

  const handleUpdateStatus = (newStatus: ServiceRequestStatus) => {
    if (selected?.id) {
      updateStatusMutation.mutate({ id: selected.id.toString(), status: newStatus });
      setReqStatus(newStatus);
    }
  };

  const handleAssign = () => {
    if (selected?.id && selectedArtisanId) {
      assignArtisanMutation.mutate({
        id: selected.id.toString(),
        artisanProfileId: Number(selectedArtisanId),
      });
    }
  };

  const handleAddNote = () => {
    if (!note.trim() || !selected?.id) return;
    addNoteMutation.mutate({
      id: selected.id.toString(),
      note: note.trim(),
    });
    setNote("");
  };

  const feePercent = subtotal >= 400000 ? 0.08 : 0.1;
  const fee = Math.round(subtotal * feePercent);
  const total = subtotal + fee;
  const feeLabel = `Zart service fee (${subtotal >= 400000 ? "8%" : "10%"})`;

  if (isListLoading && !hasInitialLoaded) {
    return <PageLoader />;
  }

  const filtered = requestsList;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Topbar */}
      <div className="bg-white border-b border-[#e8e8e8] p-[14px_20px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-[16px] font-bold text-[#115746]">Requests</span>
          <div className="flex items-center gap-[5px] bg-[#e8f5f0] border border-[#b2d8cc] rounded-[20px] p-[3px_10px] text-[11px] text-[#115746] font-semibold">
            <div className="w-1.5 h-1.5 rounded-full bg-[#115746] animate-pulse" />
            Live
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["all", "pending", "assigned", "in_progress", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              className={cn(
                "text-[12px] p-[5px_14px] rounded-[20px] border-[1.5px] font-medium transition-all",
                filter !== f && "border-[#e0e0e0] text-[#888] bg-transparent hover:border-[#115746] hover:text-[#115746]",
                filter === f && f === "all" && "bg-[#115746] text-white border-[#115746]",
                filter === f && f === "pending" && "bg-[#FDF4D7] text-[#8a6f00] border-[#e8d98a]",
                filter === f && f === "assigned" && "bg-[#e8f5f0] text-[#115746] border-[#b2d8cc]",
                filter === f && f === "in_progress" && "bg-[#fff5f2] text-[#FA4812] border-[#ffd4c7]",
                filter === f && f === "completed" && "bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]",
                filter === f && f === "cancelled" && "bg-[#ffe8e8] text-[#c41c1c] border-[#fecaca]"
              )}
              onClick={() => setFilter(f)}
            >
              {f === "all"
                ? "All"
                : f === "pending"
                  ? "Pending"
                  : f === "assigned"
                    ? "Assigned"
                    : f === "in_progress"
                      ? "In progress"
                      : f === "completed"
                        ? "Completed"
                        : "Cancelled"}
            </button>
          ))}
        </div>
      </div>

      {/* Split workspace */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Request list */}
        <div className={cn(
          "w-full md:w-[340px] flex-shrink-0 border-r border-[#e8e8e8] bg-white flex flex-col overflow-hidden min-h-0",
          selectedId !== null ? "hidden md:flex" : "flex"
        )}>
          <div className="p-3 shrink-0">
            <Input
              className="h-9"
              placeholder="🔍  Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 relative">
            {isListLoading && (
              <div className="absolute inset-0 bg-white/60 z-10 flex justify-center pt-10">
                <div className="w-6 h-6 border-[2px] border-[#115746] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {requestsList.length === 0 && !isListLoading && (
              <div className="p-10 text-center text-[13px] text-[#aaa]">No requests found.</div>
            )}
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
                  <span className={cn(
                    "text-[9px] font-bold px-2 py-0.5 rounded-[12px] border shrink-0 mt-0.5",
                    r.status === 'pending' && "bg-[#FDF4D7] text-[#8a6f00] border-[#e8d98a]",
                    r.status === 'assigned' && "bg-[#e8f5f0] text-[#115746] border-[#b2d8cc]",
                    r.status === 'in_progress' && "bg-[#fff5f2] text-[#FA4812] border-[#ffd4c7]",
                    r.status === 'completed' && "bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]",
                    r.status === 'cancelled' && "bg-[#f5f5f5] text-[#737373] border-[#e5e5e5]",
                    r.status === 'disputed' && "bg-[#fff1f2] text-[#e11d48] border-[#fecdd3]"
                  )}>
                    {STATUS_LABELS[r.status] || r.status}
                  </span>
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
                    <Button variant="outline" className="flex-1">📞 Call patron</Button>
                    <Button variant="wa" className="flex-1">💬 Notify patron in app</Button>
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
