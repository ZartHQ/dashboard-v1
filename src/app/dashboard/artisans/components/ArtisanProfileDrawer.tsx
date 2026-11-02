"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { STATUS_PILL } from "../../../../features/artisans/constants";
import { formatDate } from "@/lib/utils";
import { Artisan, VettingStatus } from "@/types";
import { X, Star, Phone, Mail, UserCheck, MessageSquare } from "lucide-react";
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

  return (
    <div
      className="fixed inset-0 z-[1000] flex justify-end bg-black/40 backdrop-blur-sm"
      onClick={() => setViewingArtisan(null)}
    >
      <div
        className="bg-white w-full sm:w-[420px] h-full flex flex-col shadow-[-10px_0_25px_-5px_rgba(0,0,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-end">
            <button
              onClick={() => setViewingArtisan(null)}
              aria-label="Close"
              className="bg-transparent border-none cursor-pointer p-1 text-[#aaa] hover:text-[#555]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Who */}
          <div className="flex flex-col items-center text-center">
            <ArtisanImageUpload
              value={viewingArtisan.user.image || null}
              onChange={handleUpdateImage}
              firstName={viewingArtisan.user.firstName}
              lastName={viewingArtisan.user.lastName}
            />
            <div className="text-[18px] font-bold text-[#1a1a1a] mt-3">
              {viewingArtisan.user.firstName} {viewingArtisan.user.lastName}
            </div>
            <div className="text-[13px] text-[#888] mt-0.5">{viewingArtisan.artisanType.name}</div>
            <div className="flex items-center gap-2 mt-2.5">
              <span className={`sp ${pill?.cls || "sp-offline"}`}>{pill?.label || viewingArtisan.vettingStatus}</span>
              <span className="text-[11px] text-[#aaa]">Joined {formatDate(viewingArtisan.createdAt)}</span>
            </div>
            {updateArtisanMutation.isPending && (
              <div className="text-[11px] text-[#115746] font-medium mt-2">Updating photo...</div>
            )}
          </div>

          {/* Numbers */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-[#f9f9f9] border border-[#f0f0f0] rounded-xl p-3 text-center">
              <div className="text-[20px] font-bold text-[#1a1a1a]">{viewingArtisan.jobsDone}</div>
              <div className="text-[11px] text-[#888] mt-0.5">Jobs done</div>
            </div>
            <div className="bg-[#f9f9f9] border border-[#f0f0f0] rounded-xl p-3 text-center">
              <div className="text-[20px] font-bold text-[#1a1a1a] flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-[#e4a11b] text-[#e4a11b]" /> {viewingArtisan.rating ?? "—"}
              </div>
              <div className="text-[11px] text-[#888] mt-0.5">Rating</div>
            </div>
          </div>

          {/* Contact */}
          <Section title="Contact">
            <div className="flex flex-col gap-2.5 text-[13px]">
              <div className="flex items-center gap-2.5 text-[#333]">
                <Phone className="w-4 h-4 text-[#aaa] shrink-0" /> {phone || "No phone"}
              </div>
              <div className="flex items-center gap-2.5 text-[#333] min-w-0">
                <Mail className="w-4 h-4 text-[#aaa] shrink-0" /> <span className="truncate">{viewingArtisan.user.email}</span>
              </div>
            </div>
          </Section>

          <Section title="Areas">
            <Chips items={viewingArtisan.operatingArea} empty="No areas added" />
          </Section>

          <Section title="Skills">
            <Chips items={viewingArtisan.skills} empty="No skills added" />
          </Section>

          <button
            className="mt-6 bg-transparent border-none cursor-pointer p-0 text-[13px] font-semibold text-[#115746] flex items-center gap-1.5 hover:underline"
            onClick={() => {
              setNewStatus(viewingArtisan.vettingStatus);
              setStatusNote("");
              setIsStatusModalOpen(true);
            }}
          >
            <UserCheck className="w-4 h-4" /> Change vetting status
          </button>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="text-[11px] uppercase tracking-wider font-semibold text-[#aaa] mb-2">{title}</div>
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
