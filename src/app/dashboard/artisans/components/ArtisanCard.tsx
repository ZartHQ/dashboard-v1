"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { STATUS_PILL } from "../../../../features/artisans/constants";
import { Artisan } from "@/types";
import { MapPin, Star, Phone, MessageSquare } from "lucide-react";

interface ArtisanCardProps {
  artisan: Artisan;
  setViewingArtisan: (artisan: Artisan) => void;
}

export function ArtisanCard({ artisan: a, setViewingArtisan }: ArtisanCardProps) {
  return (
    <Card className="flex flex-col" style={{ opacity: (a.vettingStatus === "suspended" || a.vettingStatus === "rejected") ? 0.65 : 1 }}>
      <div
        style={{
          padding: 16,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        {a.user.image ? (
          <img
            src={a.user.image}
            alt={`${a.user.firstName} ${a.user.lastName}`}
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: "#e8f5f0",
              color: "#115746",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {a.user.firstName[0] || ""}{a.user.lastName[0] || ""}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#1a1a1a",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {a.user.firstName} {a.user.lastName}
            {a.vettingStatus === "approved" && (
              <Badge variant="vetted" className="ml-1.5">
                Vetted
              </Badge>
            )}
          </div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{a.artisanType.name}</div>
          <div
            style={{
              fontSize: 11,
              color: "#aaa",
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <MapPin className="w-3.5 h-3.5 text-[#aaa] shrink-0" /> {a.operatingArea.join(", ")} · {a.user.phone}
          </div>
        </div>
        <span className={`sp ${STATUS_PILL[a.vettingStatus]?.cls || "sp-offline"}`}>
          {STATUS_PILL[a.vettingStatus]?.label || "Offline"}
        </span>
      </div>
      <CardContent className="flex-1">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          {[
            { val: a.jobsDone, label: "Jobs done" },
            { 
              val: (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
                  <Star className="w-4 h-4 fill-[#b27b00] text-[#b27b00]" />
                  {a.rating ?? "—"}
                </span>
              ), 
              label: "Rating" 
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "#f9f9f9",
                borderRadius: 8,
                padding: 8,
                textAlign: "center",
                border: "1px solid #f0f0f0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: "#115746", display: "flex", alignItems: "center" }}>{s.val}</div>
              <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {a.skills.map((s: string) => (
            <span
              key={s}
              style={{
                fontSize: 10,
                padding: "3px 9px",
                borderRadius: 6,
                background: "#FDF4D7",
                color: "#8a6f00",
                border: "1px solid #e8d98a",
                fontWeight: 500,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </CardContent>
      <div style={{ padding: "10px 16px", borderTop: "1px solid #f0f0f0", display: "flex", gap: 8 }}>
        <Button 
          variant="outline" 
          className="w-10 h-8 p-0 flex items-center justify-center shrink-0"
          onClick={() => a.user.phone && window.open(`tel:${a.user.phone}`)}
        >
          <Phone className="w-3.5 h-3.5 text-[#115746]" />
        </Button>
        <Button 
          variant="wa" 
          className="w-10 h-8 p-0 flex items-center justify-center shrink-0"
          onClick={() => a.user.phone && window.open(`https://wa.me/${a.user.phone.replace(/[^0-9]/g, "")}`)}
        >
          <MessageSquare className="w-3.5 h-3.5 text-white" />
        </Button>
        <Button 
          variant="primary" 
          className="flex-1 h-8 text-xs font-bold uppercase tracking-wider"
          onClick={() => setViewingArtisan(a)}
        >
          View profile
        </Button>
      </div>
    </Card>
  );
}
