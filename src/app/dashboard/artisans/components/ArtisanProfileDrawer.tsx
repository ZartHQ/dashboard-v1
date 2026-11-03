"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { STATUS_PILL } from "../../../../features/artisans/constants";
import { formatDate } from "@/lib/utils";
import { Artisan, VettingStatus } from "@/types";
import { X, Star, Phone, Mail, UserCheck, MessageSquare, MapPin, Wrench, ShieldCheck } from "lucide-react";
import { useArtisanDetail } from "../../../../features/artisans/queries";
import { useUpdateArtisanMutation } from "../../../../features/artisans/mutations";
import { ArtisanImageUpload } from "./ArtisanImageUpload";

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
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm sm:p-6"
      onClick={() => setViewingArtisan(null)}
    >
      <div
        className="bg-white w-full sm:max-w-[640px] max-h-[92vh] rounded-t-[20px] sm:rounded-[20px] overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto">
          {/* Banner + photo */}
          <div className="relative h-[96px] bg-gradient-to-r from-[#0d3d31] to-[#115746]">
            <button
              onClick={() => setViewingArtisan(null)}
              aria-label="Close"
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 border-none cursor-pointer flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-6 -mt-12 flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="rounded-full ring-4 ring-white w-fit bg-white">
              <ArtisanImageUpload
                value={viewingArtisan.user.image || null}
                onChange={handleUpdateImage}
                firstName={viewingArtisan.user.firstName}
                lastName={viewingArtisan.user.lastName}
              />
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="text-[20px] font-bold text-[#1a1a1a] truncate">
                {viewingArtisan.user.firstName} {viewingArtisan.user.lastName}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-[13px] text-[#555]">{viewingArtisan.artisanType.name}</span>
                <span className={`sp ${pill?.cls || "sp-offline"}`}>{pill?.label || viewingArtisan.vettingStatus}</span>
              </div>
              {updateArtisanMutation.isPending && (
                <div className="text-[11px] text-[#115746] font-medium mt-1">Updating photo...</div>
              )}
            </div>
          </div>

          {/* Numbers */}
          <div className="mx-6 mt-5 grid grid-cols-3 border border-[#f0f0f0] rounded-xl divide-x divide-[#f0f0f0]">
            <Stat value={String(viewingArtisan.jobsDone ?? 0)} label="Jobs done" />
            <Stat
              value={
                <span className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-[#e4a11b] text-[#e4a11b]" /> {viewingArtisan.rating ?? "New"}
                </span>
              }
              label="Rating"
            />
            <Stat value={formatDate(viewingArtisan.createdAt)} label="Joined" small />
          </div>

          {/* Details */}
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
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
            <Section icon={<ShieldCheck className="w-3.5 h-3.5" />} title="Vetting history" wide>
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
              <button
                className="mt-3 bg-transparent border-none cursor-pointer p-0 text-[13px] font-semibold text-[#115746] flex items-center gap-1.5 hover:underline"
                onClick={changeStatus}
              >
                <UserCheck className="w-4 h-4" /> Change vetting status
              </button>
            </Section>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-[#f0f0f0] p-4 flex gap-2.5 shrink-0">
          <Button variant="outline" className="flex-1 flex items-center justify-center gap-2" disabled={!phone} onClick={() => phone && window.open(`tel:${phone}`)}>
            <Phone className="w-4 h-4" /> Call
          </Button>
          <Button variant="wa" className="flex-1 flex items-center justify-center gap-2" disabled={!phone} onClick={() => phone && window.open(`https://wa.me/${phone.replace(/[^0-9]/g, "")}`)}>
            <MessageSquare className="w-4 h-4 text-white" /> WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label, small }: { value: React.ReactNode; label: string; small?: boolean }) {
  return (
    <div className="py-3 px-2 text-center">
      <div className={small ? "text-[13px] font-semibold text-[#1a1a1a] mt-1" : "text-[20px] font-bold text-[#1a1a1a]"}>{value}</div>
      <div className="text-[11px] text-[#888] mt-0.5">{label}</div>
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
