"use client";

import React, { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ArtisanImageUpload } from "./ArtisanImageUpload";
import { X } from "lucide-react";

interface AddArtisanModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  artisanTypeId: string;
  setArtisanTypeId: (val: string) => void;
  operatingArea: string;
  setOperatingArea: (val: string) => void;
  skills: string;
  setSkills: (val: string) => void;
  image: string | null;
  setImage: (val: string | null) => void;
  handleCreateArtisan: (e: FormEvent) => void;
  isPending: boolean;
}

export function AddArtisanModal({
  isModalOpen,
  setIsModalOpen,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  artisanTypeId,
  setArtisanTypeId,
  operatingArea,
  setOperatingArea,
  skills,
  setSkills,
  image,
  setImage,
  handleCreateArtisan,
  isPending,
}: AddArtisanModalProps) {
  if (!isModalOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          width: "480px",
          padding: "24px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          background: "#ffffff",
          border: "1px solid #e8e8e8",
          fontFamily: "Outfit, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#115746" }}>Add New Artisan</h3>
          <button
            onClick={() => setIsModalOpen(false)}
            style={{
              border: "none",
              background: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X className="w-5 h-5 text-[#aaa] hover:text-black transition-colors" />
          </button>
        </div>

        <form onSubmit={handleCreateArtisan} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <ArtisanImageUpload
            value={image}
            onChange={setImage}
            firstName={firstName}
            lastName={lastName}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "#888", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                First Name
              </label>
              <Input required placeholder="e.g. John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "#888", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                Last Name
              </label>
              <Input required placeholder="e.g. Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "11px", color: "#888", fontWeight: 600, display: "block", marginBottom: "4px" }}>
              Email Address
            </label>
            <Input required type="email" placeholder="e.g. john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label style={{ fontSize: "11px", color: "#888", fontWeight: 600, display: "block", marginBottom: "4px" }}>
              Phone Number
            </label>
            <Input required placeholder="e.g. 09012345678" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div>
            <label style={{ fontSize: "11px", color: "#888", fontWeight: 600, display: "block", marginBottom: "4px" }}>
              Artisan Category
            </label>
            <Select value={artisanTypeId} onChange={(e) => setArtisanTypeId(e.target.value)}>
              <option value="1">Plumbing</option>
              <option value="2">Electrical</option>
              <option value="3">Carpentry</option>
              <option value="4">Painting</option>
            </Select>
          </div>

          <div>
            <label style={{ fontSize: "11px", color: "#888", fontWeight: 600, display: "block", marginBottom: "4px" }}>
              Operating Areas (comma separated)
            </label>
            <Input required placeholder="e.g. Lekki, Victoria Island" value={operatingArea} onChange={(e) => setOperatingArea(e.target.value)} />
          </div>

          <div>
            <label style={{ fontSize: "11px", color: "#888", fontWeight: 600, display: "block", marginBottom: "4px" }}>
              Skills (comma separated)
            </label>
            <Input required placeholder="e.g. Pipe fitting, Drain unclogging" value={skills} onChange={(e) => setSkills(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px", justifyContent: "end" }}>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Artisan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
