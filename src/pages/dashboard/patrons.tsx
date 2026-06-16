import { useState, KeyboardEvent } from "react";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import { useAdmin } from "../../lib/auth";

interface JobInfo {
  title: string;
  id: string;
  status?: string;
}

interface Patron {
  id: number;
  name: string;
  initials: string;
  avBg: string;
  avColor: string;
  preview: string;
  time: string;
  unread: boolean;
  loc: string;
  bookings: number;
  joined: string;
  spent: string;
  activeJob: JobInfo | null;
  pastJobs: JobInfo[];
}

const PATRONS: Patron[] = [
  { id: 1, name: "John Doe", initials: "JD", avBg: "#e8f5f0", avColor: "#115746", preview: "Thanks for the update!", time: "9:41 AM", unread: true, loc: "Lekki Phase 1", bookings: 8, joined: "March 2025", spent: "₦94,000", activeJob: { title: "Fix leaking sink", id: "ZRT-0042", status: "Pending" }, pastJobs: [{ title: "Toilet flush repair", id: "ZRT-0031" }, { title: "Bathroom tile grouting", id: "ZRT-0024" }] },
  { id: 2, name: "Amaka Obi", initials: "AO", avBg: "#fff3e0", avColor: "#c2410c", preview: "What time will he arrive?", time: "8:50 AM", unread: false, loc: "Ikeja GRA", bookings: 14, joined: "January 2025", spent: "₦142,000", activeJob: { title: "Install ceiling fan", id: "ZRT-0041", status: "Assigned" }, pastJobs: [] },
  { id: 3, name: "Tunde Bello", initials: "TB", avBg: "#FDF4D7", avColor: "#8a6f00", preview: "Job is done, very happy!", time: "Yesterday", unread: false, loc: "Victoria Island", bookings: 5, joined: "February 2025", spent: "₦58,000", activeJob: null, pastJobs: [{ title: "Fix wardrobe door", id: "ZRT-0040" }] },
  { id: 4, name: "Funke Yemi", initials: "FY", avBg: "#f0eaff", avColor: "#5a3d8a", preview: "Okay, I'll wait to hear from you", time: "Yesterday", unread: false, loc: "Surulere", bookings: 2, joined: "March 2025", spent: "₦20,000", activeJob: null, pastJobs: [] },
  { id: 5, name: "Grace Okonkwo", initials: "GO", avBg: "#e8f5e8", avColor: "#166534", preview: "Excellent service, thank you!", time: "2 days ago", unread: false, loc: "Lekki Phase 2", bookings: 6, joined: "January 2025", spent: "₦72,000", activeJob: null, pastJobs: [] },
];

interface Message {
  from: 'patron' | 'admin';
  text: string;
  time: string;
}

const INIT_MESSAGES: Message[] = [
  { from: "patron", text: "Hi, I submitted a plumbing request this morning. Just checking if anyone has been assigned yet?", time: "9:30 AM" },
  { from: "admin", text: "Hi John! Yes, we've reviewed your request. We're assigning John Mensah, one of our top-rated plumbers in Lekki. He'll reach out shortly to confirm timing.", time: "9:38 AM" },
  { from: "patron", text: "Thanks for the update! What time should I expect him?", time: "9:41 AM" },
];

export default function PatronsPage() {
  const { admin, loading } = useAdmin();
  const [selected, setSelected] = useState<Patron | null>(PATRONS[0]);
  const [messages, setMessages] = useState<Message[]>(INIT_MESSAGES);
  const [draft, setDraft] = useState("");

  if (loading) return <div style={{ padding: 40, fontFamily: "Outfit, sans-serif" }}>Loading...</div>;

  function sendMessage() {
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { from: "admin", text: draft, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setDraft("");
  }

  return (
    <>
      <Head><title>Zart — Patrons</title><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" /></Head>
      <div className="layout">
        <Sidebar admin={admin} />
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">Patrons <span style={{ color: "#aaa", fontWeight: 400, fontSize: 13, marginLeft: 6 }}>318 total</span></div>
          </div>

          <div className="workspace" style={{ height: "calc(100vh - 57px)" }}>
            {/* Patron list */}
            <div className="patron-list">
              <div style={{ padding: 12 }}>
                <input className="search-input" placeholder="🔍  Search patrons..." />
              </div>
              {PATRONS.map((p) => (
                <div key={p.id} className={`patron-row${selected?.id === p.id ? " active" : ""}`} onClick={() => setSelected(p)}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: p.avBg, color: p.avColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{p.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "#888", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.preview}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: "#bbb" }}>{p.time}</span>
                    {p.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FA4812" }} />}
                  </div>
                </div>
              ))}
            </div>

            {/* Detail split */}
            {selected && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* Patron header */}
                <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: selected.avBg, color: selected.avColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>{selected.initials}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#115746" }}>{selected.name}</div>
                      <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{selected.loc} · {selected.bookings} bookings · Joined {selected.joined}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-outline" style={{ fontSize: 12 }}>📞 Call</button>
                    <button className="btn btn-wa" style={{ fontSize: 12 }}>💬 WhatsApp</button>
                  </div>
                </div>

                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 320px", overflow: "hidden" }}>
                  {/* Chat */}
                  <div style={{ display: "flex", flexDirection: "column", borderRight: "1px solid #e8e8e8", overflow: "hidden" }}>
                    <div style={{ padding: "10px 16px", borderBottom: "1px solid #f0f0f0", fontSize: 11, fontWeight: 700, color: "#115746", textTransform: "uppercase", letterSpacing: 0.5, background: "#f9f9f9", flexShrink: 0 }}>
                      💬 Chat with {selected.name}
                    </div>
                    <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", background: "#f9f9f9" }}>
                      {messages.map((m, i) => (
                        <div key={i} className={m.from === "admin" ? "from-admin" : ""} style={{ display: "flex", flexDirection: "column", alignItems: m.from === "admin" ? "flex-end" : "flex-start" }}>
                          {i === 0 && <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3, fontWeight: 600 }}>{m.from === "patron" ? selected.name : `Zart (you)`}</div>}
                          <div className={`bubble ${m.from === "patron" ? "from-patron" : "from-admin"}`}>{m.text}</div>
                          <div style={{ fontSize: 10, color: "#bbb", marginTop: 3 }}>{m.time}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: "12px 16px", borderTop: "1px solid #e8e8e8", background: "#fff", flexShrink: 0 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                        <textarea
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                          placeholder={`Message ${selected.name}...`}
                          rows={1}
                          style={{ flex: 1, background: "#f5f5f5", border: "1.5px solid #e0e0e0", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontFamily: "Outfit, sans-serif", color: "#333", resize: "none", lineHeight: 1.4 }}
                        />
                        <button className="btn btn-primary" onClick={sendMessage}>Send</button>
                      </div>
                    </div>
                  </div>

                  {/* Info panel */}
                  <div style={{ padding: 16, overflowY: "auto", background: "#f9f9f9", display: "flex", flexDirection: "column", gap: 12 }}>
                    <div className="card">
                      <div className="card-head"><span className="card-title">Patron info</span></div>
                      <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {[["Location", selected.loc], ["Joined", selected.joined], ["Total bookings", selected.bookings], ["Total spent", selected.spent]].map(([k, v]) => (
                          <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 11, color: "#aaa" }}>{k}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {selected.activeJob && (
                      <div className="card">
                        <div className="card-head"><span className="card-title">Active request</span></div>
                        <div className="card-body">
                          <div style={{ background: "#f9f9f9", borderRadius: 8, padding: "8px 10px", border: "1px solid #f0f0f0" }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>{selected.activeJob.title}</div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                              <span style={{ fontSize: 11, color: "#aaa" }}>#{selected.activeJob.id}</span>
                              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, fontWeight: 600, background: "#fff3e0", color: "#c2410c" }}>{selected.activeJob.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {selected.pastJobs.length > 0 && (
                      <div className="card">
                        <div className="card-head"><span className="card-title">Past bookings</span></div>
                        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {selected.pastJobs.map((j) => (
                            <div key={j.id} style={{ background: "#f9f9f9", borderRadius: 8, padding: "8px 10px", border: "1px solid #f0f0f0" }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>{j.title}</div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                                <span style={{ fontSize: 11, color: "#aaa" }}>#{j.id}</span>
                                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, fontWeight: 600, background: "#e8f5f0", color: "#115746" }}>Done</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
