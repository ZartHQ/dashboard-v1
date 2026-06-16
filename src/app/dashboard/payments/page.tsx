"use client";

import { useAdmin } from "../../../features/auth/auth";
import { Payment, PAYMENTS, BADGE } from "../../../features/payments/constants";

export default function PaymentsPage() {
  const { admin, loading } = useAdmin();
  if (loading) return <div style={{ padding: 40, fontFamily: "Outfit, sans-serif" }}>Loading...</div>;

  return (
    <>
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
    </>
  );
}
