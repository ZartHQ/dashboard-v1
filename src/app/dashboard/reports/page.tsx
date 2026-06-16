"use client";

import { useAdmin } from "../../../features/auth/auth";
import { Category, CATEGORIES, TopArtisan, TOP_ARTISANS } from "../../../features/reports/constants";

export default function ReportsPage() {
  const { admin, loading } = useAdmin();
  if (loading) return <div style={{ padding: 40, fontFamily: "Outfit, sans-serif" }}>Loading...</div>;

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">Reports</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select className="sel"><option>This week</option><option>This month</option><option>Last 3 months</option><option>All time</option></select>
          <button className="btn btn-outline">↓ Export CSV</button>
        </div>
      </div>
      <div className="content">
        <div className="metrics" style={{ marginBottom: 16 }}>
          {[{ label: "Jobs completed", val: "128", sub: "+18 vs last week" }, { label: "New patrons", val: "24", sub: "+6 vs last week" }, { label: "Revenue invoiced", val: "₦1.4M", sub: "+₦180k" }, { label: "Completion rate", val: "90%", sub: "Target: 85% ✓" }].map((m) => (
            <div key={m.label} className="metric"><div className="metric-label">{m.label}</div><div className="metric-value">{m.val}</div><div className="metric-sub up">{m.sub}</div></div>
          ))}
        </div>

        <div className="two-col" style={{ marginBottom: 14 }}>
          {/* Category bar chart */}
          <div className="card">
            <div className="card-head">
              <span className="card-title">Jobs by category</span>
              <span style={{ fontSize: 11, color: "#aaa" }}>This week</span>
            </div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CATEGORIES.map((c) => (
                <div key={c.label} className="bar-row">
                  <span className="bar-label">{c.label}</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${c.pct}%`, background: c.color }} /></div>
                  <span className="bar-val">{c.jobs} jobs</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top artisans */}
          <div className="card">
            <div className="card-head">
              <span className="card-title">Top artisans</span>
              <span style={{ fontSize: 11, color: "#aaa" }}>By jobs completed</span>
            </div>
            <div>
              {TOP_ARTISANS.map((a) => (
                <div key={a.rank} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid #f8f8f8" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#aaa", width: 18 }}>{a.rank}</span>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: a.bg, color: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{a.initials}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{a.type}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#115746" }}>{a.jobs} jobs</div>
                    <div style={{ fontSize: 11, color: "#FA4812", marginTop: 1 }}>★ {a.rating}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform health */}
        <div className="card">
          <div className="card-head">
            <span className="card-title">Platform health</span>
            <span style={{ fontSize: 11, color: "#aaa" }}>Key operational metrics</span>
          </div>
          <div className="health-grid">
            {[{ val: "18 min", label: "Avg response time" }, { val: "2.4 hrs", label: "Avg job duration" }, { val: "73%", label: "Patron repeat rate" }, { val: "1.6%", label: "Dispute rate", warn: true }].map((h) => (
              <div key={h.label} className="health-item">
                <div className={`health-val${h.warn ? " warn-v" : ""}`}>{h.val}</div>
                <div className="health-label">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
