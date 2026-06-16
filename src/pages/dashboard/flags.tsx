// ─── FLAGS PAGE ─────────────────────────────────────────────────────────────
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import { useAdmin } from "../../lib/auth";

interface FlagPerson {
  initials: string;
  bg: string;
  color: string;
  name: string;
}

interface Flag {
  id: number;
  title: string;
  sub: string;
  priority: 'high' | 'medium' | 'low';
  status: string;
  time: string;
  desc: string;
  artisan: FlagPerson;
  patron: FlagPerson;
  actions: string[];
}

const FLAGS: Flag[] = [
  { id: 1, title: "Off-platform solicitation", sub: "Job #ZRT-0038 · Wiring repair · Surulere", priority: "high", status: "open", time: "2h ago", desc: "Artisan Emeka Eze sent a message asking patron Grace Okonkwo to complete the transaction outside Zart via WhatsApp, offering a discount. Auto-detected by keyword scan. Conversation is preserved as evidence.", artisan: { initials: "EE", bg: "#ffe8e8", color: "#c41c1c", name: "Emeka Eze" }, patron: { initials: "GO", bg: "#e8f5e8", color: "#166534", name: "Grace Okonkwo" }, actions: ["View chat", "Suspend Emeka", "Mark resolved", "Dismiss"] },
  { id: 2, title: "Price dispute reported by patron", sub: "Job #ZRT-0041 · AC repair · Lekki", priority: "medium", status: "open", time: "5h ago", desc: "Patron Amaka Obi was quoted ₦20,000 but charged ₦35,000 after the job. Artisan claims extra parts were needed. No pre-approval was obtained before adding costs.", artisan: { initials: "NK", bg: "#f0eaff", color: "#5a3d8a", name: "Nkechi Kalu" }, patron: { initials: "AO", bg: "#fff3e0", color: "#c2410c", name: "Amaka Obi" }, actions: ["View chat", "View job", "Mark resolved", "Dismiss"] },
  { id: 3, title: "1-star review — possible retaliation", sub: "Job #ZRT-0036 · Painting · Ajah", priority: "medium", status: "open", time: "Yesterday", desc: "Patron Kunle Adeyemi left a 1-star review after artisan Chidi Bosah (4.8 rating, 30+ jobs) declined a last-minute discount request. Pattern suggests retaliatory review.", artisan: { initials: "CB", bg: "#FDF4D7", color: "#8a6f00", name: "Chidi Bosah" }, patron: { initials: "KA", bg: "#f5f5f5", color: "#888", name: "Kunle Adeyemi" }, actions: ["View review", "View chat", "Remove review", "Mark resolved"] },
];

export default function FlagsPage() {
  const { admin, loading } = useAdmin();
  if (loading) return <div style={{ padding: 40, fontFamily: "Outfit, sans-serif" }}>Loading...</div>;

  return (
    <>
      <Head><title>Zart — Flags</title><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" /></Head>
      <div className="layout">
        <Sidebar admin={admin} />
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">Flags &amp; alerts</div>
            <div style={{ fontSize: 13, color: "#aaa" }}>3 open · 8 resolved this week</div>
          </div>
          <div className="content">
            <div className="metrics" style={{ marginBottom: 16 }}>
              {[{ label: "Open flags", val: "3", sub: "Needs attention", subColor: "#c2410c" }, { label: "Resolved this week", val: "8", sub: "Good pace", subColor: "#166534" }, { label: "Artisans suspended", val: "2", sub: "All time", subColor: "#aaa" }, { label: "Auto-detected", val: "67%", sub: "Of all flags", subColor: "#166534" }].map((m) => (
                <div key={m.label} className="metric"><div className="metric-label">{m.label}</div><div className="metric-value" style={{ color: m.label === "Open flags" ? "#FA4812" : "#115746" }}>{m.val}</div><div className="metric-sub" style={{ color: m.subColor }}>{m.sub}</div></div>
              ))}
            </div>
            <div className="chips" style={{ marginBottom: 16 }}>
              {["Open (3)", "Resolved (8)", "All time"].map((c, i) => <button key={c} className={`chip${i === 0 ? " active" : ""}`}>{c}</button>)}
            </div>
            {FLAGS.map((f) => (
              <div key={f.id} className={`flag-card${f.priority === "high" ? " high" : ""}`} style={{ marginBottom: 14 }}>
                <div className={`flag-head${f.priority === "high" ? " high-bg" : ""}`}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: f.priority === "high" ? "#ffe8e8" : "#fff3e0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{f.priority === "high" ? "⚠️" : f.id === 3 ? "⭐" : "💬"}</div>
                    <div><div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{f.title}</div><div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{f.sub}</div></div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="badge" style={f.priority === "high" ? { background: "#ffe8e8", color: "#c41c1c", border: "1px solid #fecaca" } : { background: "#fff3e0", color: "#c2410c", border: "1px solid #fed7aa" }}>{f.priority === "high" ? "High priority" : "Medium"}</span>
                    <span className="badge badge-pending">Open</span>
                    <span style={{ fontSize: 11, color: "#bbb" }}>{f.time}</span>
                  </div>
                </div>
                <div className="flag-body">
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, flex: 1 }}>{f.desc}</p>
                  <div style={{ display: "flex", gap: 20, flexShrink: 0 }}>
                    {[f.artisan, f.patron].map((p, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: p.bg, color: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, margin: "0 auto 5px" }}>{p.initials}</div>
                        <div style={{ fontSize: 10, color: "#aaa" }}>{i === 0 ? "Artisan" : "Patron"}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>{p.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flag-actions">
                  {f.actions.map((a, i) => (
                    <button key={a} className={`btn ${i === 1 ? "btn-danger" : i === 2 ? "btn btn-outline" : "btn btn-plain"}`} style={{ fontSize: 12 }}>{a}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
