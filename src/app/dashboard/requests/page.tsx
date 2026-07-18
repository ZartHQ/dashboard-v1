"use client";

import { useState, useEffect } from "react";
import { useRequests, useRequestDetail, useRequestCounts, useRequestInvoice } from "../../../features/requests/queries";
import {
  useUpdateStatusMutation,
  useAssignArtisanMutation,
  useAddNoteMutation,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useSendInvoiceMutation,
  useMarkInvoicePaidMutation
} from "../../../features/requests/mutations";
import { useArtisans } from "../../../features/artisans/queries";
import { ServiceRequestDetail, ServiceRequestNote, ServiceRequestStatus, Invoice } from "@/types";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { PageLoader } from "@/components/ui/PageLoader";
import { Search } from "lucide-react";
import { RequestListItem } from "./components/RequestListItem";
import { RequestDetailsPanel } from "./components/RequestDetailsPanel";

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
  const { data: counts } = useRequestCounts();
  const { data: invoice, isLoading: isInvoiceLoading } = useRequestInvoice(selectedId);
  console.log(artisansList);

  const getFilterCount = (f: string) => {
    if (!counts) return 0;
    return Number(counts[f]) || 0;
  };

  const [note, setNote] = useState("");
  const [selectedArtisanId, setSelectedArtisanId] = useState<string>("");

  const requestsList = requests?.data || [];
  const selectedListItem = selectedId ? (requestsList.find(r => r.id.toString() === selectedId) || null) : null;
  const selected = selectedId ? (selectedDetail || selectedListItem) : null;

  const [reqStatus, setReqStatus] = useState<ServiceRequestStatus>((selected?.status as ServiceRequestStatus) || "pending");

  useEffect(() => {
    if (selected?.status) {
      setReqStatus(selected.status as ServiceRequestStatus);
    }
  }, [selected?.id, selected?.status]);

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
  const createInvoiceMutation = useCreateInvoiceMutation();
  const updateInvoiceMutation = useUpdateInvoiceMutation();
  const sendInvoiceMutation = useSendInvoiceMutation();
  const markInvoicePaidMutation = useMarkInvoicePaidMutation();

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

  // Fee and total are managed in details panel or synced from fetched invoice

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
                filter === f && f === "cancelled" && "bg-[#f5f5f5] text-[#737373] border-[#e5e5e5]"
              )}
              onClick={() => setFilter(f)}
            >
              {`${f === "all"
                ? "All"
                : f === "pending"
                  ? "Pending"
                  : f === "assigned"
                    ? "Assigned"
                    : f === "in_progress"
                      ? "In progress"
                      : f === "completed"
                        ? "Completed"
                        : "Cancelled"
                } (${getFilterCount(f)})`}
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
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#aaa]" />
              <Input
                className="h-9 pl-9 w-full"
                placeholder="Search requests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
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
              <RequestListItem
                key={r.id}
                request={r}
                isSelected={selected?.id === r.id}
                onClick={() => { setSelectedId(r.id.toString()); setReqStatus(r.status); }}
              />
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {selected ? (
          <RequestDetailsPanel
            selected={selected as ServiceRequestDetail}
            isDetailLoading={isDetailLoading}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            reqStatus={reqStatus}
            handleUpdateStatus={handleUpdateStatus}
            updateStatusMutation={updateStatusMutation}
            showAssignDropdown={showAssignDropdown}
            setShowAssignDropdown={setShowAssignDropdown}
            selectedArtisanId={selectedArtisanId}
            setSelectedArtisanId={setSelectedArtisanId}
            artisansList={artisansList || []}
            handleAssign={handleAssign}
            assignArtisanMutation={assignArtisanMutation}
            invoice={invoice}
            isInvoiceLoading={isInvoiceLoading}
            createInvoiceMutation={createInvoiceMutation}
            updateInvoiceMutation={updateInvoiceMutation}
            sendInvoiceMutation={sendInvoiceMutation}
            markInvoicePaidMutation={markInvoicePaidMutation}
            note={note}
            setNote={setNote}
            handleAddNote={handleAddNote}
            addNoteMutation={addNoteMutation}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#f9f9f9] text-[#bbb] font-outfit p-6">
            <img
              src="/zart-logo-green.svg"
              alt="Zart Logo"
              className="w-16 h-16 object-contain mb-4"
            />
            <div className="text-[14px] font-semibold text-[#888] tracking-wide">Select a request to view details</div>
          </div>
        )}
      </div>
    </div>
  );
}
