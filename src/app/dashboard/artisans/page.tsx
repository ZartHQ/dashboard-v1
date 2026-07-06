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

export default function ArtisansPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [selectedTab, setSelectedTab] = useState<
    "all" | "approved" | "pending" | "under_review" | "requires_action" | "suspended" | "rejected"
  >("all");
  const [viewingArtisan, setViewingArtisan] = useState<any>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("pending");
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

  const createArtisanMutation = useCreateArtisanMutation();
  const updateVettingMutation = useUpdateArtisanVettingStatusMutation();

  const handleUpdateVetting = (id: number, vettingStatus: any, note?: string) => {
    updateVettingMutation.mutate({
      id,
      data: { vettingStatus, note: note || undefined }
    }, {
      onSuccess: () => {
        setViewingArtisan((prev: any) => prev ? { ...prev, vettingStatus } : null);
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
              <Card key={a.id} className="flex flex-col" style={{ opacity: (a.vettingStatus === "suspended" || a.vettingStatus === "rejected") ? 0.65 : 1 }}>
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
                  <Button 
                    variant="outline" 
                    className="w-10 h-8 p-0 flex items-center justify-center text-xs shrink-0"
                    onClick={() => a.user.phone && window.open(`tel:${a.user.phone}`)}
                  >
                    📞
                  </Button>
                  <Button 
                    variant="wa" 
                    className="w-10 h-8 p-0 flex items-center justify-center text-xs shrink-0"
                    onClick={() => a.user.phone && window.open(`https://wa.me/${a.user.phone.replace(/[^0-9]/g, "")}`)}
                  >
                    💬
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

      {/* Artisan Profile Details Drawer */}
      {viewingArtisan && (
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
                    <span style={{ fontSize: "11px", color: "#aaa" }}>Joined: {new Date(viewingArtisan.createdAt).toLocaleDateString()}</span>
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
              <Button variant="outline" className="flex-1" onClick={() => window.open(`tel:${viewingArtisan.user.phone}`)}>
                📞 Call Artisan
              </Button>
              <Button variant="wa" className="flex-1" onClick={() => window.open(`https://wa.me/${viewingArtisan.user.phone.replace(/[^0-9]/g, "")}`)}>
                💬 WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Vetting Status Update Modal */}
      {isStatusModalOpen && viewingArtisan && (
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
                <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
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
                <Button variant="outline" type="button" onClick={() => setIsStatusModalOpen(false)} disabled={updateVettingMutation.isPending}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => {
                    handleUpdateVetting(viewingArtisan.id, newStatus, statusNote);
                  }}
                  isLoading={updateVettingMutation.isPending}
                >
                  Update Status
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
