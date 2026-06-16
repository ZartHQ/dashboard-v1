import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import { useAdmin } from "../../lib/auth";

interface Payment {
  id: string;
  job: string;
  patron: string;
  artisan: string;
  amount: number;
  fee: number | null;
  status: 'paid' | 'pending' | 'disputed' | 'invoiced' | 'refunded';
  date: string;
}

const PAYMENTS: Payment[] = [
  { id: "ZRT-0042", job: "Fix leaking sink", patron: "John Doe", artisan: "John Mensah", amount: 15000, fee: 1200, status: "invoiced", date: "Today" },
  { id: "ZRT-0041", job: "Install ceiling fan", patron: "Amaka Obi", artisan: "Akin Kolade", amount: 35000, fee: 2800, status: "disputed", date: "Yesterday" },
  { id: "ZRT-0040", job: "Fix wardrobe door", patron: "Tunde Bello", artisan: "Chidi Bosah", amount: 22000, fee: 1760, status: "paid", date: "2 days ago" },
  { id: "ZRT-0039", job: "Toilet flush repair", patron: "Fatima Yusuf", artisan: "John Mensah", amount: 8000, fee: 640, status: "pending", date: "3 days ago" },
  { id: "ZRT-0038", job: "Wiring issue", patron: "Grace Okonkwo", artisan: "Emeka Eze", amount: 25000, fee: null, status: "refunded", date: "4 days ago" },
];

const BADGE: Record<string, { label: string; cls: string }> = {
  paid:     { label: "Paid",         cls: "badge-paid" },
  pending:  { label: "Pending",      cls: "badge-pending" },
  disputed: { label: "Disputed",     cls: "badge-disputed" },
  invoiced: { label: "Invoice sent", cls: "badge-invoiced" },
  refunded: { label: "Refunded",     cls: "badge-refunded" },
};

export default function PaymentsPage() {
  const { admin, loading } = useAdmin();
  if (loading) return <div style={{ padding: 40, fontFamily: "Outfit, sans-serif" }}>Loading...</div>;

  return (
    <>
      <Head><title>Zart — Payments</title><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" /></Head>
      <div className="layout">
        <Sidebar admin={admin} />
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">Payments</div>
            <button className="btn btn-outline">↓ Export CSV</button>
          </div>
          <div className="content">
            <div className="metrics" style={{ marginBottom: 16 }}>
              {[{ label: "Total invoiced", val: "₦1.4M", sub: "+₦180k this week", up: true }, { label: "Zart commission (8%)", val: "₦112k", sub: "Earned this month", up: true }, { label: "Awaiting payment", val: "₦84k", sub: "12 invoices pending", up: false }, { label: "Disputed", val: "2", sub: "Needs resolution", up: false }].map((m) => (
                <div key={m.label} className="metric">
                  <div className="metric-label">{m.label}</div>
                  <div className="metric-value" style={!m.up && m.label === "Disputed" ? { color: "#FA4812" } : {}}>{m.val}</div>
                  <div className={`metric-sub ${m.up ? "up" : "warn-color"}`}>{m.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <div className="chips">
                {["All", "Paid", "Invoice sent", "Pending", "Disputed"].map((c, i) => (
                  <button key={c} className={`chip${i === 0 ? " active" : ""}`}>{c}</button>
                ))}
              </div>
              <input className="search-input" style={{ maxWidth: 240 }} placeholder="🔍  Search by job or patron..." />
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Job</th><th>Patron</th><th>Artisan</th><th>Invoice amount</th><th>Zart fee</th><th>Status</th><th>Date</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYMENTS.map((p) => (
                    <tr key={p.id}>
                      <td><div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{p.job}</div><div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>#{p.id}</div></td>
                      <td>{p.patron}</td>
                      <td>{p.artisan}</td>
                      <td><div style={{ fontWeight: 700, color: "#115746" }}>₦{p.amount.toLocaleString()}</div></td>
                      <td><div style={{ fontSize: 11, color: "#FA4812", fontWeight: 500 }}>{p.fee ? `₦${p.fee.toLocaleString()}` : "—"}</div></td>
                      <td><span className={`badge ${BADGE[p.status].cls}`}>{BADGE[p.status].label}</span></td>
                      <td style={{ color: "#aaa", fontSize: 12 }}>{p.date}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-outline" style={{ fontSize: 11, padding: "4px 10px" }}>View</button>
                          {p.status === "invoiced" && <button className="btn btn-wa" style={{ fontSize: 11, padding: "4px 10px" }}>Send via app</button>}
                          {p.status === "disputed" && <button className="btn btn-danger" style={{ fontSize: 11, padding: "4px 10px" }}>Refund</button>}
                          {p.status === "pending" && <button className="btn btn-orange" style={{ fontSize: 11, padding: "4px 10px", color: "#fff" }}>Generate invoice</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                <span className="page-info">Showing 5 of 128 transactions</span>
                <div className="page-btns">
                  {["1", "2", "3", "→"].map((p, i) => <button key={p} className={`page-btn${i === 0 ? " active-pg" : ""}`}>{p}</button>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
