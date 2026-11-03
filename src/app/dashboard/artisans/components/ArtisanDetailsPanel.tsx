"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { STATUS_PILL } from "../../../../features/artisans/constants";
import { formatDate } from "@/lib/utils";
import { Artisan, VettingStatus } from "@/types";
import { ArrowLeft, Star, Phone, Mail, UserCheck, MessageSquare, MapPin, Wrench, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useArtisanDetail } from "../../../../features/artisans/queries";
import { useUpdateArtisanMutation } from "../../../../features/artisans/mutations";
import { ArtisanImageUpload } from "./ArtisanImageUpload";

interface ArtisanDetailsPanelProps {
  viewingArtisan: Artisan | null;
  /** Phones: the panel replaces the list while an artisan is open. */
  isMobileDetailActive: boolean;
  onBack: () => void;
  setViewingArtisan: (artisan: Artisan | null) => void;
  setNewStatus: (status: VettingStatus) => void;
  setStatusNote: (note: string) => void;
  setIsStatusModalOpen: (open: boolean) => void;
}

/** Right-hand detail panel on the Artisans page (laid out like Patrons). */
export function ArtisanDetailsPanel({
  viewingArtisan,
  isMobileDetailActive,
  onBack,
  setViewingArtisan,
  setNewStatus,
  setStatusNote,
  setIsStatusModalOpen,
}: ArtisanDetailsPanelProps) {
  const updateArtisanMutation = useUpdateArtisanMutation();
  const { data: detail } = useArtisanDetail(viewingArtisan?.id);

  if (!viewingArtisan) return null;

  const handleUpdateImage = (newImage: string | null) => {
    updateArtisanMutation.mutate(
      {
        id: viewingArtisan.id,
        data: { image: newImage || "" },
      },
      {
        onSuccess: () => {
          setViewingArtisan({
            ...viewingArtisan,
            user: {
              ...viewingArtisan.user,
              image: newImage,
            },
          });
        },
      }
    );
  };

  const phone = viewingArtisan.user.phone;
  const pill = STATUS_PILL[viewingArtisan.vettingStatus];
  const notes: { id: number; note: string; createdAt: string; admin?: { firstName?: string } }[] =
    detail?.vettingNotes || [];
  const changeStatus = () => {
    setNewStatus(viewingArtisan.vettingStatus);
    setStatusNote("");
    setIsStatusModalOpen(true);
  };

  return (
    <div
      className={cn(
        "flex-1 flex flex-col overflow-hidden bg-[#f9f9f9]",
        !isMobileDetailActive ? "hidden md:flex" : "flex"
      )}
    >
      {/* Header */}
      <div className="bg-white border-b border-[#e8e8e8] p-[14px_20px] flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="md:hidden flex items-center gap-1 text-[13px] font-semibold text-[#115746] bg-transparent border-none cursor-pointer mr-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <ArtisanImageUpload
            value={viewingArtisan.user.image || null}
            onChange={handleUpdateImage}
            firstName={viewingArtisan.user.firstName}
            lastName={viewingArtisan.user.lastName}
            size="sm"
          />
          <div className="min-w-0">
            <div className="text-[15px] font-bold text-[#1a1a1a] truncate">
              {viewingArtisan.user.firstName} {viewingArtisan.user.lastName}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <span className="text-[11px] text-[#888]">{viewingArtisan.artisanType.name}</span>
              <span className={`sp ${pill?.cls || "sp-offline"}`}>{pill?.label || viewingArtisan.vettingStatus}</span>
            </div>
            {updateArtisanMutation.isPending && (
              <div className="text-[11px] text-[#115746] font-medium mt-0.5">Updating photo...</div>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" className="text-xs h-9 flex items-center gap-1.5" disabled={!phone} onClick={() => phone && window.open(`tel:${phone}`)}>
            <Phone className="w-3.5 h-3.5" /> Call
          </Button>
          <Button variant="wa" className="text-xs h-9 hidden sm:flex items-center gap-1.5" disabled={!phone} onClick={() => phone && window.open(`https://wa.me/${phone.replace(/[^0-9]/g, "")}`)}>
            <MessageSquare className="w-3.5 h-3.5 text-white" /> WhatsApp
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
        {/* Numbers */}
        <div className="grid grid-cols-3 gap-3">
          <StatTile value={String(viewingArtisan.jobsDone ?? 0)} label="Jobs done" />
          <StatTile
            value={
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#e4a11b] text-[#e4a11b]" /> {viewingArtisan.rating ?? "New"}
              </span>
            }
            label="Rating"
          />
          <StatTile value={formatDate(viewingArtisan.createdAt)} label="Joined" small />
        </div>

        <Card>
          <CardContent className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <Section icon={<Phone className="w-3.5 h-3.5" />} title="Contact">
              <div className="flex flex-col gap-1.5 text-[13px] text-[#333]">
                <span>{phone || "No phone"}</span>
                <span className="flex items-center gap-1.5 min-w-0 text-[#555]">
                  <Mail className="w-3.5 h-3.5 text-[#aaa] shrink-0" />
                  <span className="truncate">{viewingArtisan.user.email}</span>
                </span>
              </div>
            </Section>
            <Section icon={<MapPin className="w-3.5 h-3.5" />} title="Areas">
              <Chips items={viewingArtisan.operatingArea} empty="No areas added" />
            </Section>
            <Section icon={<Wrench className="w-3.5 h-3.5" />} title="Skills" wide>
              <Chips items={viewingArtisan.skills} empty="No skills added" />
            </Section>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-[#f0f0f0] flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#115746]" /> Vetting
            </CardTitle>
            <button
              className="bg-transparent border-none cursor-pointer p-0 text-[13px] font-semibold text-[#115746] flex items-center gap-1.5 hover:underline"
              onClick={changeStatus}
            >
              <UserCheck className="w-4 h-4" /> Change status
            </button>
          </CardHeader>
          <CardContent className="py-4">
            {notes.length === 0 ? (
              <div className="text-[12px] text-[#aaa] italic">No vetting notes yet</div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {notes.map((n) => (
                  <div key={n.id} className="border-l-2 border-[#e8e8e8] pl-3">
                    <div className="text-[13px] text-[#333]">{n.note}</div>
                    <div className="text-[11px] text-[#aaa] mt-0.5">
                      {[n.admin?.firstName, formatDate(n.createdAt)].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatTile({ value, label, small }: { value: React.ReactNode; label: string; small?: boolean }) {
  return (
    <div className="bg-white border border-[#e8e8e8] rounded-xl p-4 flex flex-col gap-1">
      <span className="text-[11px] text-[#aaa] font-semibold uppercase tracking-wider">{label}</span>
      <span className={small ? "text-[14px] font-bold text-[#115746]" : "text-[20px] font-bold text-[#115746]"}>{value}</span>
    </div>
  );
}

function Section({ icon, title, wide, children }: { icon: React.ReactNode; title: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <div className="text-[11px] uppercase tracking-wider font-semibold text-[#aaa] mb-2 flex items-center gap-1.5">
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function Chips({ items, empty }: { items: string[]; empty: string }) {
  if (!items?.length) return <div className="text-[12px] text-[#aaa] italic">{empty}</div>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className="text-[12px] bg-[#f0f0f0] text-[#555] px-2.5 py-1 rounded-full font-medium">
          {item}
        </span>
      ))}
    </div>
  );
}
