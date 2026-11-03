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
import { ArtisanListItem } from "./components/ArtisanListItem";
import { AddArtisanModal } from "./components/AddArtisanModal";
import { ArtisanDetailsPanel } from "./components/ArtisanDetailsPanel";
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
  const [isMobileDetailActive, setIsMobileDetailActive] = useState(false);
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
    plumber: 1,
    electrician: 2,
    carpenter: 3,
    cleaner: 4,
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

  const statusTabs = [
    ["all", "All statuses"],
    ["approved", "Approved"],
    ["pending", "Pending"],
    ["under_review", "Under review"],
    ["requires_action", "Action required"],
    ["suspended", "Suspended"],
    ["rejected", "Rejected"],
  ] as const;

  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <div className="bg-white border-b border-[#e8e8e8] p-[14px_24px] flex items-center justify-between shrink-0">
          <div className="text-[16px] font-bold text-[#115746] flex items-center">
            Artisans
            <span className="text-[#aaa] font-normal text-[13px] ml-1.5">
              {filteredArtisans.length} shown · {artisans?.length || 0} total
            </span>
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-[#115746] border-t-transparent rounded-full animate-spin inline-block ml-2" />
            )}
          </div>
          <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add artisan
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Artisan list */}
          <div
            className={
              "w-full md:w-[320px] flex-shrink-0 border-r border-[#e8e8e8] bg-white overflow-y-auto " +
              (isMobileDetailActive ? "hidden md:block" : "block")
            }
          >
            <div className="p-3 flex flex-col gap-2 border-b border-[#f0f0f0]">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#aaa]" />
                <Input
                  className="h-9 pl-9 w-full"
                  placeholder="Search name, trade or area..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <Select className="h-8 text-[11px] py-0" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="all">All trades</option>
                  <option value="plumber">Plumber</option>
                  <option value="electrician">Electrician</option>
                  <option value="carpenter">Carpenter</option>
                  <option value="cleaner">Cleaner</option>
                </Select>
                <Select className="h-8 text-[11px] py-0" value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option value="all">All areas</option>
                  <option value="Lekki">Lekki</option>
                  <option value="Victoria Island">Victoria Island</option>
                  <option value="Ikeja">Ikeja</option>
                  <option value="Surulere">Surulere</option>
                  <option value="Ajah">Ajah</option>
                </Select>
                <Select
                  className="h-8 text-[11px] py-0"
                  value={selectedTab}
                  onChange={(e) => setSelectedTab(e.target.value as typeof selectedTab)}
                >
                  {statusTabs.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
              </div>
            </div>
            {filteredArtisans.length === 0 ? (
              <div className="p-8 text-center text-[13px] text-[#aaa]">No artisans match these filters.</div>
            ) : (
              filteredArtisans.map((a) => (
                <ArtisanListItem
                  key={a.id}
                  artisan={a}
                  isSelected={viewingArtisan?.id === a.id}
                  onClick={() => {
                    setViewingArtisan(a);
                    setIsMobileDetailActive(true);
                  }}
                />
              ))
            )}
          </div>

          {/* Detail split */}
          {viewingArtisan ? (
            <ArtisanDetailsPanel
              viewingArtisan={viewingArtisan}
              setViewingArtisan={setViewingArtisan}
              isMobileDetailActive={isMobileDetailActive}
              onBack={() => setIsMobileDetailActive(false)}
              setNewStatus={setNewStatus}
              setStatusNote={setStatusNote}
              setIsStatusModalOpen={setIsStatusModalOpen}
            />
          ) : (
            <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-[#f9f9f9] p-6">
              <img src="/zart-logo-green.svg" alt="Zart Logo" className="w-16 h-16 object-contain mb-4" />
              <div className="text-[14px] font-semibold text-[#888] tracking-wide">Select an artisan to view details</div>
            </div>
          )}
        </div>
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
