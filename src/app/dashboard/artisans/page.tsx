"use client";

import { useState, useEffect } from "react";
import { STATUS_PILL } from "../../../features/artisans/constants";
import { useArtisans } from "../../../features/artisans/queries";
import { useCreateArtisanMutation } from "../../../features/artisans/mutations";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { PageLoader } from "@/components/ui/PageLoader";

export default function ArtisansPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [selectedTab, setSelectedTab] = useState<"all" | "online" | "pending" | "suspended">("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [artisanTypeId, setArtisanTypeId] = useState("1");
  const [operatingArea, setOperatingArea] = useState("");
  const [skills, setSkills] = useState("");

  const createArtisanMutation = useCreateArtisanMutation();

  const CATEGORY_MAP: Record<string, number> = {
    plumbing: 1,
    electrical: 2,
    carpentry: 3,
    painting: 4,
  };

  const getVettingStatus = () => {
    if (selectedTab === "pending") return "pending";
    if (selectedTab === "suspended") return "suspended";
    return undefined;
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
        },
      }
    );
  };

  if (isLoading && !hasInitialLoaded) {
    return <PageLoader />;
  }

  // Frontend filters for search and "online" tab status
  const filteredArtisans = (artisans || []).filter((a) => {
    const matchesSearch =
      !search ||
      a.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      a.user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      a.artisanType.name.toLowerCase().includes(search.toLowerCase()) ||
      a.operatingArea.includes(search.toLowerCase());

    const matchesOnline = selectedTab !== "online" || a.vettingStatus === "verified";

    return matchesSearch && matchesOnline;
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
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Add artisan
        </Button>
      </div>

      <div className="content">
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <Input
            className="flex-1 min-w-[200px]"
            placeholder="🔍  Search by name, category or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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

        <div className="chips" style={{ marginBottom: 18 }}>
          {(["all", "online", "pending", "suspended"] as const).map((tab) => {
            const label =
              tab === "all"
                ? "All"
                : tab === "online"
                  ? "Online"
                  : tab === "pending"
                    ? "Pending vetting"
                    : "Suspended";
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
              <Card key={a.id} className="flex flex-col" style={{ opacity: a.vettingStatus === "suspended" ? 0.65 : 1 }}>
                <div
                  style={{
                    padding: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
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
                    {a.user.firstName[0]}{a.user.lastName[0]}
                  </div>
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
                      {a.vettingStatus === "verified" && (
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
                      }}
                    >
                      📍 {a.operatingArea.join(", ")} · {a.user.phone}
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
                      { val: a.rating ?? "—", label: "Rating" },
                    ].map((s) => (
                      <div
                        key={s.label}
                        style={{
                          background: "#f9f9f9",
                          borderRadius: 8,
                          padding: 8,
                          textAlign: "center",
                          border: "1px solid #f0f0f0",
                        }}
                      >
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#115746" }}>{s.val}</div>
                        <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {a.skills.map((s) => (
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
                  <Button variant="outline" className="flex-1 text-xs">
                    📞 Call
                  </Button>
                  {a.vettingStatus === "suspended" ? (
                    <Button className="flex-1 text-xs border-[1.5px] border-[#22c55e] text-[#166534] bg-[#f0fdf4]">
                      Reinstate
                    </Button>
                  ) : a.vettingStatus === "pending" ? (
                    <Button variant="outline" className="flex-1 text-xs">
                      Approve
                    </Button>
                  ) : (
                    <Button variant="wa" className="flex-1 text-xs">
                      💬 WhatsApp
                    </Button>
                  )}
                  <Button variant="plain" className="flex-1 text-xs">
                    View profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Premium Add Artisan Modal */}
      {isModalOpen && (
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
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#aaa",
                  padding: "4px",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateArtisan} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
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
                <Button variant="primary" type="submit" disabled={createArtisanMutation.isPending}>
                  {createArtisanMutation.isPending ? "Saving..." : "Save Artisan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
