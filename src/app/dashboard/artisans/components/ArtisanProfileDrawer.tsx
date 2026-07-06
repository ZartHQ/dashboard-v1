"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { STATUS_PILL } from "../../../../features/artisans/constants";
import { formatDate } from "@/lib/utils";
import { Artisan, VettingStatus } from "@/types";

interface ArtisanProfileDrawerProps {
  viewingArtisan: Artisan | null;
  setViewingArtisan: (artisan: Artisan | null) => void;
  setNewStatus: (status: VettingStatus) => void;
  setStatusNote: (note: string) => void;
  setIsStatusModalOpen: (open: boolean) => void;
}

export function ArtisanProfileDrawer({
  viewingArtisan,
  setViewingArtisan,
  setNewStatus,
  setStatusNote,
  setIsStatusModalOpen,
}: ArtisanProfileDrawerProps) {
  if (!viewingArtisan) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
      onClick={() => setViewingArtisan(null)}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "440px",
          height: "100%",
          padding: "30px 24px",
          boxShadow: "-10px 0 25px -5px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Outfit, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#115746" }}>Artisan Profile</h3>
          <button
            onClick={() => setViewingArtisan(null)}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "20px",
              cursor: "pointer",
              color: "#aaa",
              padding: "4px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Profile Summary Card */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", background: "#f9f9f9", padding: "16px", borderRadius: "12px", border: "1px solid #f0f0f0", marginBottom: "20px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "#115746",
              color: "#FDF4D7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            {viewingArtisan.user.firstName[0]}{viewingArtisan.user.lastName[0]}
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a" }}>
              {viewingArtisan.user.firstName} {viewingArtisan.user.lastName}
            </div>
            <div style={{ fontSize: "13px", color: "#888", marginTop: "2px" }}>
              {viewingArtisan.artisanType.name}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          <div style={{ background: "#e8f5f0", padding: "12px", borderRadius: "10px", textAlign: "center", border: "1px solid #b2d8cc" }}>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#115746" }}>{viewingArtisan.jobsDone}</div>
            <div style={{ fontSize: "11px", color: "#115746", fontWeight: 500, marginTop: "2px" }}>Jobs Completed</div>
          </div>
          <div style={{ background: "#fff9e6", padding: "12px", borderRadius: "10px", textAlign: "center", border: "1px solid #ffe082" }}>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#b27b00" }}>★ {viewingArtisan.rating ?? "—"}</div>
            <div style={{ fontSize: "11px", color: "#8a6f00", fontWeight: 500, marginTop: "2px" }}>Rating</div>
          </div>
        </div>

        {/* Details Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, overflowY: "auto", paddingRight: "4px" }}>
          <div>
            <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#aaa", fontWeight: 600, letterSpacing: "0.5px", marginBottom: "6px" }}>Contact Information</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ fontSize: "13px", color: "#333" }}>📞 <strong>Phone:</strong> {viewingArtisan.user.phone}</div>
              <div style={{ fontSize: "13px", color: "#333" }}>✉️ <strong>Email:</strong> {viewingArtisan.user.email}</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#aaa", fontWeight: 600, letterSpacing: "0.5px", marginBottom: "6px" }}>Service Locations</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {viewingArtisan.operatingArea.map((loc: string) => (
                <span key={loc} style={{ fontSize: "12px", background: "#f0f0f0", color: "#555", padding: "4px 10px", borderRadius: "20px", fontWeight: 500 }}>
                  {loc}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#aaa", fontWeight: 600, letterSpacing: "0.5px", marginBottom: "6px" }}>Skills & Specialties</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {viewingArtisan.skills.map((skill: string) => (
                <span key={skill} style={{ fontSize: "12px", background: "#FDF4D7", color: "#8a6f00", border: "1px solid #e8d98a", padding: "4px 10px", borderRadius: "6px", fontWeight: 500 }}>
                  {skill}
                </span>
              ))}
              {viewingArtisan.skills.length === 0 && (
                <span style={{ fontSize: "12px", color: "#aaa", fontStyle: "italic" }}>No specific skills specified</span>
              )}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#aaa", fontWeight: 600, letterSpacing: "0.5px", marginBottom: "6px" }}>Operational Status</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                <span className={`sp ${STATUS_PILL[viewingArtisan.vettingStatus]?.cls || "sp-offline"}`}>
                  {STATUS_PILL[viewingArtisan.vettingStatus]?.label || viewingArtisan.vettingStatus}
                </span>
                <span style={{ fontSize: "11px", color: "#aaa" }}>Joined: {formatDate(viewingArtisan.createdAt)}</span>
              </div>

              {/* Vetting Management Button */}
              <Button 
                variant="outline" 
                className="w-full text-xs font-bold uppercase tracking-wider mt-2.5"
                onClick={() => {
                  setNewStatus(viewingArtisan.vettingStatus);
                  setStatusNote("");
                  setIsStatusModalOpen(true);
                }}
              >
                ✏️ Update vetting status
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px", marginTop: "16px", display: "flex", gap: "10px" }}>
          <Button variant="outline" className="flex-1" onClick={() => viewingArtisan.user.phone && window.open(`tel:${viewingArtisan.user.phone}`)}>
            📞 Call Artisan
          </Button>
          <Button variant="wa" className="flex-1" onClick={() => viewingArtisan.user.phone && window.open(`https://wa.me/${viewingArtisan.user.phone.replace(/[^0-9]/g, "")}`)}>
            💬 WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
