"use client";

import { useState, useEffect } from "react";
import { STATUS_PILL } from "../../../features/artisans/constants";
import { useArtisans } from "../../../features/artisans/queries";
import { useCreateArtisanMutation, useUpdateArtisanVettingStatusMutation } from "../../../features/artisans/mutations";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { PageLoader } from "@/components/ui/PageLoader";
import { ArtisanCard } from "./components/ArtisanCard";
import { AddArtisanModal } from "./components/AddArtisanModal";
import { ArtisanProfileDrawer } from "./components/ArtisanProfileDrawer";
import { UpdateVettingModal } from "./components/UpdateVettingModal";
import { Artisan, VettingStatus } from "@/types";
import { Search, Plus } from "lucide-react";

export default function ArtisansPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [selectedTab, setSelectedTab] = useState<
    "all" | "approved" | "pending" | "under_review" | "requires_action" | "suspended" | "rejected"
  >("all");
  const [viewingArtisan, setViewingArtisan] = useState<Artisan | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<VettingStatus>("pending");
  const [statusNote, setStatusNote] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [artisanTypeId, setArtisanTypeId] = useState("1");
  const [operatingArea, setOperatingArea] = useState("");
  const [skills, setSkills] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const createArtisanMutation = useCreateArtisanMutation();
  const updateVettingMutation = useUpdateArtisanVettingStatusMutation();

  const handleUpdateVetting = (id: number, vettingStatus: VettingStatus, note?: string) => {
    updateVettingMutation.mutate({
      id,
      data: { vettingStatus, note: note || undefined }
    }, {
      onSuccess: () => {
        setViewingArtisan((prev: Artisan | null) => prev ? { ...prev, vettingStatus } : null);
        setIsStatusModalOpen(false);
      }
    });
  };

  const CATEGORY_MAP: Record<string, number> = {
    plumbing: 1,
    electrical: 2,
    carpentry: 3,
    painting: 4,
  };

  const getVettingStatus = () => {
    if (selectedTab === "all") return undefined;
    return selectedTab;
  };

  const { data: artisans, isLoading } = useArtisans({
    artisanTypeId: category !== "all" ? CATEGORY_MAP[category.toLowerCase()] : undefined,
    location: location !== "all" ? location : undefined,
    vettingStatus: getVettingStatus(),
  });

  const { data: allArtisans } = useArtisans();

  const [hasInitialLoaded, setHasInitialLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading && artisans) {
      setHasInitialLoaded(true);
    }
  }, [isLoading, artisans]);

  const handleCreateArtisan = (e: React.FormEvent) => {
    e.preventDefault();
    createArtisanMutation.mutate(
      {
        firstName,
        lastName,
        email,
        phone,
        artisanTypeId: Number(artisanTypeId),
        operatingArea: operatingArea.split(",").map((s) => s.trim()).filter(Boolean),
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        image: image || undefined,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setOperatingArea("");
          setSkills("");
          setImage(null);
        },
      }
    );
  };

  if (isLoading && !hasInitialLoaded) {
    return <PageLoader />;
  }

  // Frontend filters for search
  const filteredArtisans = (artisans || []).filter((a) => {
    const matchesSearch =
      !search ||
      a.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      a.user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      a.artisanType.name.toLowerCase().includes(search.toLowerCase()) ||
      a.operatingArea.some((area: string) => area.toLowerCase().includes(search.toLowerCase()));

    return matchesSearch;
  });

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">
          Artisans{" "}
          <span style={{ color: "#aaa", fontWeight: 400, fontSize: 13, marginLeft: 6 }}>
            {filteredArtisans.length} shown · {artisans?.length || 0} total
          </span>
          {isLoading && (
            <span style={{ color: "#115746", fontSize: 11, marginLeft: 8, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span className="w-3.5 h-3.5 border-2 border-[#115746] border-t-transparent rounded-full animate-spin inline-block" />
              Syncing...
            </span>
          )}
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add artisan
        </Button>
      </div>

      <div className="content">
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#aaa]" />
            <Input
              className="pl-9 w-full"
              placeholder="Search by name, category or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select className="w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="carpentry">Carpentry</option>
            <option value="painting">Painting</option>
          </Select>
          <Select className="w-auto" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="all">All locations</option>
            <option value="Lekki">Lekki</option>
            <option value="Victoria Island">Victoria Island</option>
            <option value="Ikeja">Ikeja</option>
            <option value="Surulere">Surulere</option>
            <option value="Ajah">Ajah</option>
          </Select>
        </div>

        <div className="chips" style={{ marginBottom: 18, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(["all", "approved", "pending", "under_review", "requires_action", "suspended", "rejected"] as const).map((tab) => {
            const label =
              tab === "all"
                ? "All"
                : tab === "approved"
                  ? "Approved"
                  : tab === "pending"
                    ? "Pending"
                    : tab === "under_review"
                      ? "Under Review"
                      : tab === "requires_action"
                        ? "Action Required"
                        : tab === "suspended"
                          ? "Suspended"
                          : "Rejected";
            return (
              <button
                key={tab}
                className={`chip${selectedTab === tab ? " active" : ""}`}
                onClick={() => setSelectedTab(tab)}
              >
                {label}
              </button>
            );
          })}
        </div>

        {filteredArtisans.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#aaa", fontFamily: "Outfit, sans-serif" }}>
            No artisans match the selected filters.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
            {filteredArtisans.map((a) => (
              <ArtisanCard
                key={a.id}
                artisan={a}
                setViewingArtisan={setViewingArtisan}
              />
            ))}
          </div>
        )}
      </div>

      {/* Premium Add Artisan Modal */}
      <AddArtisanModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        artisanTypeId={artisanTypeId}
        setArtisanTypeId={setArtisanTypeId}
        operatingArea={operatingArea}
        setOperatingArea={setOperatingArea}
        skills={skills}
        setSkills={setSkills}
        image={image}
        setImage={setImage}
        handleCreateArtisan={handleCreateArtisan}
        isPending={createArtisanMutation.isPending}
      />

      {/* Artisan Profile Details Drawer */}
      <ArtisanProfileDrawer
        viewingArtisan={viewingArtisan}
        setViewingArtisan={setViewingArtisan}
        setNewStatus={setNewStatus}
        setStatusNote={setStatusNote}
        setIsStatusModalOpen={setIsStatusModalOpen}
      />

      {/* Vetting Status Update Modal */}
      <UpdateVettingModal
        isStatusModalOpen={isStatusModalOpen}
        setIsStatusModalOpen={setIsStatusModalOpen}
        viewingArtisan={viewingArtisan}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        statusNote={statusNote}
        setStatusNote={setStatusNote}
        handleUpdateVetting={handleUpdateVetting}
        isPending={updateVettingMutation.isPending}
      />
    </>
  );
}
