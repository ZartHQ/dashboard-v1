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
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { PageLoader } from "@/components/ui/PageLoader";
import { Search } from "lucide-react";
import { RequestListItem } from "./components/RequestListItem";
import { RequestDetailsPanel } from "./components/RequestDetailsPanel";

// Two top-level buckets. The specific statuses live in a dropdown next to
// the search bar so the tabs stay simple: just Pending vs Done.
const BUCKETS: Record<"pending" | "done", string[]> = {
  pending: ["pending", "assigned", "in_progress"],
  done: ["completed", "cancelled"],
};

const SUB_OPTIONS: Record<"pending" | "done", { value: string; label: string }[]> = {
  pending: [
    { value: "all", label: "All pending" },
    { value: "pending", label: "Pending" },
    { value: "assigned", label: "Assigned" },
    { value: "in_progress", label: "In progress" },
  ],
  done: [
    { value: "all", label: "All done" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ],
};

export default function RequestsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bucket, setBucket] = useState<"pending" | "done">("pending");
  const [subStatus, setSubStatus] = useState("all");
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

  // Fetch a wide page and filter by bucket/sub-status on the client so the
  // Pending/Done tabs and the dropdown can regroup without refetching.
  const { data: requests, isLoading: isListLoading } = useRequests({
    limit: 100,
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

  // Total for a bucket = sum of its member statuses.
  const getBucketCount = (b: "pending" | "done") =>
    BUCKETS[b].reduce((sum, s) => sum + getFilterCount(s), 0);

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
      // Don't flip the badge optimistically — the backend enforces the
      // transition order (assigned -> in_progress -> completed) and can reject.
      // The badge updates from the refetched request once the server confirms.
      updateStatusMutation.mutate({ id: selected.id.toString(), status: newStatus });
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

  const filtered = requestsList.filter(
    (r) =>
      BUCKETS[bucket].includes(r.status) &&
      (subStatus === "all" || r.status === subStatus)
  );

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
        <div className="flex gap-1.5">
          {(["pending", "done"] as const).map((b) => (
            <button
              key={b}
              className={cn(
                "text-[12px] p-[6px_16px] rounded-[20px] border-[1.5px] font-semibold transition-all",
                bucket !== b && "border-[#e0e0e0] text-[#888] bg-transparent hover:border-[#115746] hover:text-[#115746]",
                bucket === b && b === "pending" && "bg-[#115746] text-white border-[#115746]",
                bucket === b && b === "done" && "bg-[#16a34a] text-white border-[#16a34a]"
              )}
              onClick={() => {
                setBucket(b);
                setSubStatus("all");
              }}
            >
              {`${b === "pending" ? "Pending" : "Done"} (${getBucketCount(b)})`}
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
          <div className="p-3 shrink-0 flex gap-2">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#aaa]" />
              <Input
                className="h-9 pl-9 w-full"
                placeholder="Search requests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              className="h-9 w-auto shrink-0 text-[12px] font-medium text-[#115746]"
              value={subStatus}
              onChange={(e) => setSubStatus(e.target.value)}
            >
              {SUB_OPTIONS[bucket].map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 relative p-3">
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
