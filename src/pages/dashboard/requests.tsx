import { useState, ChangeEvent } from "react";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import { useAdmin } from "../../lib/auth";

interface Request {
  id: string;
  title: string;
  cat: string;
  catKey: string;
  patron: string;
  loc: string;
  time: string;
  status: string;
}

const REQUESTS: Request[] = [
  { id: "ZRT-0042", title: "Fix leaking sink in kitchen", cat: "Plumbing", catKey: "plumb", patron: "John Doe", loc: "Lekki Phase 1", time: "9:30 AM · Today", status: "pending" },
  { id: "ZRT-0041", title: "Install ceiling fan — 2 rooms", cat: "Electrical", catKey: "elec", patron: "Amaka Obi", loc: "Ikeja GRA", time: "8:15 AM · Today", status: "assigned" },
  { id: "ZRT-0040", title: "Fix wardrobe door hinge", cat: "Carpentry", catKey: "carp", patron: "Tunde Bello", loc: "Victoria Island", time: "Yesterday", status: "progress" },
  { id: "ZRT-0039", title: "Repaint living room walls", cat: "Painting", catKey: "paint", patron: "Funke Yemi", loc: "Surulere", time: "Yesterday", status: "pending" },
  { id: "ZRT-0038", title: "AC not cooling — servicing needed", cat: "AC repair", catKey: "ac", patron: "Kunle Adeyemi", loc: "Ajah", time: "2 days ago", status: "progress" },
  { id: "ZRT-0037", title: "Deep clean 3 bedroom flat", cat: "Cleaning", catKey: "clean", patron: "Grace Okonkwo", loc: "Lekki Phase 2", time: "2 days ago", status: "done" },
];

const STATUS_LABELS: Record<string, string> = { pending: "Pending", assigned: "Assigned", progress: "In progress", done: "Completed", cancelled: "Cancelled" };

interface Note {
  text: string;
  by: string;
  time: string;
}

export default function RequestsPage() {
  const { admin, loading } = useAdmin();
  const [selected, setSelected] = useState<Request | null>(REQUESTS[0]);
  const [filter, setFilter] = useState("all");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([{ text: "Looks urgent — water damage visible in photos. Prioritise today.", by: "Mia", time: "9:35 AM" }]);
  const [reqStatus, setReqStatus] = useState("pending");
  const [subtotal, setSubtotal] = useState(12000);
  const feePercent = subtotal >= 400000 ? 0.08 : 0.1;
  const fee = Math.round(subtotal * feePercent);
  const total = subtotal + fee;
  const feeLabel = `Zart service fee (${subtotal >= 400000 ? "8%" : "10%"})`;

  if (loading) return <div style={{ padding: 40, fontFamily: "Outfit, sans-serif" }}>Loading...</div>;

  const filtered = filter === "all" ? REQUESTS : REQUESTS.filter((r) => r.status === filter);

  function addNote() {
    if (!note.trim()) return;
    setNotes((prev) => [...prev, { text: note, by: admin?.name || "Admin", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setNote("");
  }

  return (
    <>
      <Head><title>Zart — Requests</title><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" /></Head>
      <div className="layout">
        <Sidebar admin={admin} />
        <div className="main">
          {/* Topbar */}
          <div className="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="topbar-title">Requests</span>
              <div className="live-pill"><div className="live-dot" />Live</div>
            </div>
            <div className="chips">
              {["all", "pending", "assigned", "progress", "done"].map((f) => (
                <button key={f} className={`chip${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                  {f === "all" ? "All (32)" : f === "pending" ? "Pending (7)" : f === "assigned" ? "Assigned (5)" : f === "progress" ? "In progress (8)" : "Completed (12)"}
                </button>
              ))}
            </div>
          </div>

          {/* Split workspace */}
          <div className="workspace" style={{ height: "calc(100vh - 57px)", overflow: "hidden" }}>
            {/* Request list */}
            <div className="req-list">
              <div style={{ padding: 12 }}>
                <input className="search-input" placeholder="🔍  Search requests..." />
              </div>
              {filtered.map((r) => (
                <div key={r.id} className={`req-item${selected?.id === r.id ? " active" : ""}`} onClick={() => { setSelected(r); setReqStatus(r.status); }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 5 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", flex: 1, marginRight: 8, lineHeight: 1.3 }}>{r.title}</div>
                    <div className={`dot dot-${r.status}`} style={{ marginTop: 4 }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span className={`cat cat-${r.catKey}`}>{r.cat}</span>
                    <span style={{ fontSize: 11, color: "#888" }}>{r.patron}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#aaa" }}>📍 {r.loc}</span>
                    <span style={{ fontSize: 11, color: "#bbb" }}>{r.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail panel */}
            {selected ? (
              <div className="detail-panel">
                <div className="detail-head">
                  <div>
                    <div className="detail-title">{selected.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, color: "#aaa" }}>#{selected.id}</span>
                      <span className={`cat cat-${selected.catKey}`}>{selected.cat}</span>
                    </div>
                  </div>
                  <select className="sel" value={reqStatus} onChange={(e: ChangeEvent<HTMLSelectElement>) => setReqStatus(e.target.value)}>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>

                <div className="detail-body">
                  {/* Patron */}
                  <div className="card">
                    <div className="card-head"><span className="card-title">Patron details</span></div>
                    <div className="card-body">
                      <div className="info-grid" style={{ marginBottom: 12 }}>
                        <div className="info-item"><div className="info-label">Name</div><div className="info-val">{selected.patron}</div></div>
                        <div className="info-item"><div className="info-label">Phone</div><div className="info-val link">0803 XXX XXXX</div></div>
                        <div className="info-item"><div className="info-label">Location</div><div className="info-val">{selected.loc}</div></div>
                        <div className="info-item"><div className="info-label">Requested</div><div className="info-val">{selected.time}</div></div>
                      </div>
                      <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 12 }}>
                        The kitchen sink has been leaking from the base for 2 days. Water is pooling under the cabinet. Needs urgent attention.
                      </p>
                      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                        {[1, 2, 3].map((n) => (
                          <div key={n} style={{ width: 64, height: 64, background: "#f5f5f5", borderRadius: 8, border: "1.5px solid #e8e8e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer" }}>📷</div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-outline" style={{ flex: 1 }}>📞 Call patron</button>
                        <button className="btn btn-wa" style={{ flex: 1 }}>💬 Notify patron in app</button>
                      </div>
                    </div>
                  </div>

                  {/* Assign */}
                  <div className="card">
                    <div className="card-head"><span className="card-title">Assign artisan</span></div>
                    <div className="card-body">
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <select className="sel" style={{ width: "100%" }}>
                          <option value="">Select an artisan...</option>
                          <option>John Mensah — Plumber · Lekki · ★ 4.9 (57 jobs)</option>
                          <option>Fatima Yusuf — Plumber · Ajah · ★ 4.6 (12 jobs)</option>
                          <option>Emeka Peters — Plumber · Surulere · ★ 4.4 (8 jobs)</option>
                        </select>
                        <div className="ai-suggest">🤖 AI suggests <strong style={{ marginLeft: 4 }}>John Mensah</strong> — highest rated plumber closest to {selected.loc}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          <input className="search-input" placeholder="Scheduled date & time" />
                          <input className="search-input" placeholder="Est. duration e.g. 2 hrs" />
                        </div>
                        <button className="btn btn-primary" style={{ width: "100%" }}>Assign artisan &amp; notify patron via app</button>
                      </div>
                    </div>
                  </div>

                  {/* Invoice */}
                  <div className="card">
                    <div className="card-head">
                      <span className="card-title">📄 Invoice generator</span>
                      <span style={{ fontSize: 11, color: "#aaa" }}>Auto-sends to patron in app on completion</span>
                    </div>
                    <div className="card-body">
                      <div className="invoice-section">
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#8a6f00", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 10 }}>
                          🤖 Invoice details
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 90px", gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>Description</span>
                          <span style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>Qty</span>
                          <span style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>Unit price</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 90px", gap: 6, marginBottom: 6 }}>
                          <input className="inv-input" defaultValue="Sink leak repair — labour" />
                          <input className="inv-input" defaultValue="1" />
                          <input className="inv-input" value={`₦${subtotal.toLocaleString()}`} onChange={(e: ChangeEvent<HTMLInputElement>) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0; setSubtotal(v); }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 90px", gap: 6 }}>
                          <input className="inv-input" placeholder="Additional item..." />
                          <input className="inv-input" placeholder="1" />
                          <input className="inv-input" placeholder="₦0" />
                        </div>
                        <div style={{ borderTop: "1px solid #e8d98a", marginTop: 12, paddingTop: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: "#8a6f00", fontWeight: 600 }}>Subtotal</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>₦{subtotal.toLocaleString()}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ fontSize: 12, color: "#8a6f00", fontWeight: 600 }}>{feeLabel}</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#FA4812" }}>₦{fee.toLocaleString()}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #e8d98a", paddingTop: 10 }}>
                            <span style={{ fontSize: 14, fontWeight: 700 }}>Total due</span>
                            <span style={{ fontSize: 18, fontWeight: 700, color: "#115746" }}>₦{total.toLocaleString()}</span>
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                          <button className="btn btn-primary" style={{ fontSize: 12 }}>📄 Generate PDF invoice</button>
                          <button className="btn btn-wa" style={{ fontSize: 12 }}>💬 Send to patron via app</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="card">
                    <div className="card-head"><span className="card-title">Internal notes</span></div>
                    <div className="card-body">
                      <div className="internal-label">🔒 Internal only — patron cannot see these notes</div>
                      {notes.map((n, i) => (
                        <div key={i} style={{ background: "#f9f9f9", borderRadius: 8, padding: "10px 12px", borderLeft: "3px solid #115746", marginBottom: 8 }}>
                          <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{n.text}</div>
                          <div style={{ fontSize: 10, color: "#aaa", marginTop: 4 }}>{n.by} · {n.time}</div>
                        </div>
                      ))}
                      <textarea
                        value={note}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
                        placeholder="Add an internal note (e.g. 'called patron, no answer')..."
                        style={{ width: "100%", background: "#f9f9f9", border: "1.5px solid #e0e0e0", borderRadius: 8, padding: "10px 12px", fontSize: 13, fontFamily: "Outfit, sans-serif", color: "#333", resize: "none", height: 72 }}
                      />
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                        <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={addNote}>Add note</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="detail-panel" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", color: "#bbb" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
                  <div style={{ fontSize: 14 }}>Select a request to view details</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
