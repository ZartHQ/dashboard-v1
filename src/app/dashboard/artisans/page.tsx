"use client";

import { STATUS_PILL } from "../../../features/artisans/constants";
import { useArtisans } from "../../../features/artisans/queries";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";

export default function ArtisansPage() {
  const { data: artisans, isLoading } = useArtisans();

  if (isLoading) {
    return <div style={{ padding: 40, fontFamily: "Outfit, sans-serif" }}>Loading artisans...</div>;
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">Artisans <span style={{ color: "#aaa", fontWeight: 400, fontSize: 13, marginLeft: 6 }}>{artisans?.length || 0} total</span></div>
        <Button variant="primary">+ Add artisan</Button>
      </div>
      <div className="content">
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <Input className="flex-1 min-w-[200px]" placeholder="🔍  Search by name, category or location..." />
          <Select className="w-auto"><option>All categories</option><option>Plumbing</option><option>Electrical</option><option>Carpentry</option><option>Painting</option></Select>
          <Select className="w-auto"><option>All locations</option><option>Lekki</option><option>Victoria Island</option><option>Ikeja</option><option>Surulere</option></Select>
        </div>
        <div className="chips" style={{ marginBottom: 18 }}>
          {["All (34)", "Online (12)", "Pending vetting (5)", "Suspended (2)"].map((t, i) => (
            <button key={t} className={`chip${i === 0 ? " active" : ""}`}>{t}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
          {artisans?.map((a) => (
            <Card key={a.id} style={{ opacity: a.status === "suspended" ? 0.65 : 1 }}>
              <div style={{ padding: 16, display: "flex", alignItems: "flex-start", gap: 12, borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: a.avBg, color: a.avColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{a.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>
                    {a.name}
                    {a.vetted && <Badge variant="vetted" className="ml-1.5">Vetted</Badge>}
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{a.type}</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>📍 {a.loc} · {a.phone}</div>
                </div>
                <span className={`sp ${STATUS_PILL[a.status].cls}`}>{STATUS_PILL[a.status].label}</span>
              </div>
              <CardContent>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
                  {[{ val: a.jobs, label: "Jobs done" }, { val: a.rating ?? "—", label: "Rating" }, { val: a.completion ? a.completion + "%" : "—", label: "Completion" }].map((s) => (
                    <div key={s.label} style={{ background: "#f9f9f9", borderRadius: 8, padding: 8, textAlign: "center", border: "1px solid #f0f0f0" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#115746" }}>{s.val}</div>
                      <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {a.warning ? (
                  <div style={{ fontSize: 11, background: "#fff3e0", color: "#c2410c", border: "1px solid #fed7aa", borderRadius: 6, padding: "5px 8px" }}>⚠️ {a.warning}</div>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {a.skills.map((s) => <span key={s} style={{ fontSize: 10, padding: "3px 9px", borderRadius: 6, background: "#FDF4D7", color: "#8a6f00", border: "1px solid #e8d98a", fontWeight: 500 }}>{s}</span>)}
                  </div>
                )}
              </CardContent>
              <div style={{ padding: "10px 16px", borderTop: "1px solid #f0f0f0", display: "flex", gap: 8 }}>
                <Button variant="outline" className="flex-1 text-xs">📞 Call</Button>
                {a.status === "suspended"
                  ? <Button className="flex-1 text-xs border-[1.5px] border-[#22c55e] text-[#166534] bg-[#f0fdf4]">Reinstate</Button>
                  : a.status === "offline" && !a.vetted
                  ? <Button variant="outline" className="flex-1 text-xs">Approve</Button>
                  : <Button variant="wa" className="flex-1 text-xs">💬 WhatsApp</Button>}
                <Button variant="plain" className="flex-1 text-xs">View profile</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
