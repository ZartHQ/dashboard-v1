"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

import { Artisan, VettingStatus } from "@/types";

interface UpdateVettingModalProps {
  isStatusModalOpen: boolean;
  setIsStatusModalOpen: (open: boolean) => void;
  viewingArtisan: Artisan | null;
  newStatus: VettingStatus;
  setNewStatus: (status: VettingStatus) => void;
  statusNote: string;
  setStatusNote: (note: string) => void;
  handleUpdateVetting: (id: number, status: VettingStatus, note: string) => void;
  isPending: boolean;
}

export function UpdateVettingModal({
  isStatusModalOpen,
  setIsStatusModalOpen,
  viewingArtisan,
  newStatus,
  setNewStatus,
  statusNote,
  setStatusNote,
  handleUpdateVetting,
  isPending,
}: UpdateVettingModalProps) {
  if (!isStatusModalOpen || !viewingArtisan) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          width: "400px",
          padding: "24px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          background: "#ffffff",
          border: "1px solid #e8e8e8",
          fontFamily: "Outfit, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#115746" }}>Update Vetting Status</h3>
          <button
            onClick={() => setIsStatusModalOpen(false)}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "18px",
              cursor: "pointer",
              color: "#aaa",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ fontSize: "13px", color: "#666" }}>
            Updating vetting status for <strong>{viewingArtisan.user.firstName} {viewingArtisan.user.lastName}</strong>
          </div>

          <div>
            <label style={{ fontSize: "11px", color: "#888", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Select Status
            </label>
            <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value as VettingStatus)}>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="requires_action">Action Required</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </Select>
          </div>

          <div>
            <label style={{ fontSize: "11px", color: "#888", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Notes (Optional)
            </label>
            <textarea
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Reason for change, next steps, or feedback..."
              className="w-full bg-[#f9f9f9] border-[1.5px] border-[#e0e0e0] rounded-lg p-[10px_12px] text-[13px] text-[#333] font-outfit resize-none h-[80px] focus:outline-none focus:border-[#115746]"
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px", justifyContent: "end" }}>
            <Button variant="outline" type="button" onClick={() => setIsStatusModalOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={() => {
                handleUpdateVetting(viewingArtisan.id, newStatus, statusNote);
              }}
              isLoading={isPending}
            >
              Update Status
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
