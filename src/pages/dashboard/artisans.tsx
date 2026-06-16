import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import { useAdmin } from "../../lib/auth";

interface Artisan {
  id: number;
  name: string;
  initials: string;
  type: string;
  loc: string;
  phone: string;
  status: 'online' | 'busy' | 'offline' | 'suspended';
  vetted: boolean;
  jobs: number;
  rating: number | null;
  completion: number | null;
  skills: string[];
  avBg: string;
  avColor: string;
  warning?: string;
}

const ARTISANS: Artisan[] = [
  { id: 1, name: "John Mensah", initials: "JM", type: "Plumber", loc: "Lekki", phone: "0801 XXX XXXX", status: "online", vetted: true, jobs: 57, rating: 4.9, completion: 98, skills: ["Pipe fitting", "Sink repair", "Drainage", "Water heater"], avBg: "#e8f5f0", avColor: "#115746" },
  { id: 2, name: "Akin Kolade", initials: "AK", type: "Electrician", loc: "Victoria Island", phone: "0802 XXX XXXX", status: "online", vetted: true, jobs: 44, rating: 4.8, completion: 95, skills: ["Wiring", "Fan install", "Fuse board", "Inverter"], avBg: "#fff3e0", avColor: "#c2410c" },
  { id: 3, name: "Chidi Bosah", initials: "CB", type: "Carpenter", loc: "Ikeja", phone: "0809 XXX XXXX", status: "busy", vetted: true, jobs: 39, rating: 4.7, completion: 92, skills: ["Furniture", "Door fitting", "Wardrobes"], avBg: "#FDF4D7", avColor: "#8a6f00" },
  { id: 4, name: "Emeka Eze", initials: "EE", type: "Electrician", loc: "Surulere", phone: "0805 XXX XXXX", status: "suspended", vetted: true, jobs: 11, rating: 3.1, completion: 70, skills: ["Wiring"], avBg: "#ffe8e8", avColor: "#c41c1c" },
  { id: 5, name: "Fatima Yusuf", initials: "FY", type: "Plumber", loc: "Ajah", phone: "0807 XXX XXXX", status: "offline", vetted: false, jobs: 0, rating: null, completion: null, skills: [], warning: "Pending vetting — skills test outstanding", avBg: "#f5f5f5", avColor: "#888" },
];

const STATUS_PILL: Record<string, { label: string; cls: string }> = {
  online: { label: "Online", cls: "sp-online" },
  busy: { label: "On a job", cls: "sp-busy" },
  offline: { label: "Offline", cls: "sp-offline" },
  suspended: { label: "Suspended", cls: "sp-suspended" },
};

export default function ArtisansPage() {
  const { admin, loading } = useAdmin();
  if (loading) return <div style={{ padding: 40, fontFamily: "Outfit, sans-serif" }}>Loading...</div>;

  return (
    <>
      <Head><title>Zart — Artisans</title><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" /></Head>
      <div className="layout">
        <Sidebar admin={admin} />
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">Artisans <span style={{ color: "#aaa", fontWeight: 400, fontSize: 13, marginLeft: 6 }}>34 total</span></div>
            <button className="btn btn-primary">+ Add artisan</button>
          </div>
          <div className="content">
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <input className="search-input" style={{ flex: 1, minWidth: 200 }} placeholder="🔍  Search by name, category or location..." />
              <select className="sel"><option>All categories</option><option>Plumbing</option><option>Electrical</option><option>Carpentry</option><option>Painting</option></select>
              <select className="sel"><option>All locations</option><option>Lekki</option><option>Victoria Island</option><option>Ikeja</option><option>Surulere</option></select>
            </div>
            <div className="chips" style={{ marginBottom: 18 }}>
              {["All (34)", "Online (12)", "Pending vetting (5)", "Suspended (2)"].map((t, i) => (
                <button key={t} className={`chip${i === 0 ? " active" : ""}`}>{t}</button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
              {ARTISANS.map((a) => (
                <div key={a.id} className="card" style={{ opacity: a.status === "suspended" ? 0.65 : 1 }}>
                  <div style={{ padding: 16, display: "flex", alignItems: "flex-start", gap: 12, borderBottom: "1px solid #f0f0f0" }}>
                    <div style={{ width: 46, height: 46, borderRadius: "50%", background: a.avBg, color: a.avColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{a.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>
                        {a.name}
                        {a.vetted && <span className="badge badge-vetted" style={{ marginLeft: 6 }}>Vetted</span>}
                      </div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{a.type}</div>
                      <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>📍 {a.loc} · {a.phone}</div>
                    </div>
                    <span className={`sp ${STATUS_PILL[a.status].cls}`}>{STATUS_PILL[a.status].label}</span>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
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
                  </div>
                  <div style={{ padding: "10px 16px", borderTop: "1px solid #f0f0f0", display: "flex", gap: 8 }}>
                    <button className="btn btn-outline" style={{ flex: 1, fontSize: 12 }}>📞 Call</button>
                    {a.status === "suspended"
                      ? <button className="btn" style={{ flex: 1, fontSize: 12, border: "1.5px solid #22c55e", color: "#166534", background: "#f0fdf4" }}>Reinstate</button>
                      : a.status === "offline" && !a.vetted
                      ? <button className="btn btn-outline" style={{ flex: 1, fontSize: 12 }}>Approve</button>
                      : <button className="btn btn-wa" style={{ flex: 1, fontSize: 12 }}>💬 WhatsApp</button>}
                    <button className="btn btn-plain" style={{ flex: 1, fontSize: 12 }}>View profile</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
