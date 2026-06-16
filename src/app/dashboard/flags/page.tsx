"use client";

import { useFlags, useQueueStats } from "../../../features/monitoring/queries";
import { useRetryFailedMutation } from "../../../features/monitoring/mutations";

export default function FlagsPage() {
  const { data: flags, isLoading: isFlagsLoading } = useFlags();
  const { data: stats, isLoading: isStatsLoading } = useQueueStats();
  const retryMutation = useRetryFailedMutation();

  const isLoading = isFlagsLoading || isStatsLoading;

  if (isLoading) {
    return <div style={{ padding: 40, fontFamily: "Outfit, sans-serif" }}>Loading monitoring data...</div>;
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">Monitoring &amp; Queue Stats</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button 
            className="btn btn-orange" 
            onClick={() => retryMutation.mutate()}
            disabled={retryMutation.isPending}
            style={{ fontSize: 12 }}
          >
            {retryMutation.isPending ? "Retrying..." : "Retry Failed Queues"}
          </button>
        </div>
      </div>
      <div className="content">
        <div className="metrics" style={{ marginBottom: 16 }}>
          {[
            { label: "Queued", val: stats?.waiting.toString() || "0", sub: "Waiting", subColor: "#aaa" },
            { label: "Active", val: stats?.active.toString() || "0", sub: "Processing", subColor: "#166534" },
            { label: "Failed", val: stats?.failed.toString() || "0", sub: "Needs retry", subColor: "#c2410c" },
            { label: "Completed", val: stats?.completed.toString() || "0", sub: "All time", subColor: "#166534" }
          ].map((m) => (
            <div key={m.label} className="metric">
              <div className="metric-label">{m.label}</div>
              <div className="metric-value" style={{ color: m.label === "Failed" ? "#FA4812" : "#115746" }}>{m.val}</div>
              <div className="metric-sub" style={{ color: m.subColor }}>{m.sub}</div>
            </div>
          ))}
        </div>

        <div className="topbar-title" style={{ margin: "24px 0 16px", fontSize: 16 }}>Flags &amp; Alerts</div>
        <div className="chips" style={{ marginBottom: 16 }}>
          {["Open", "Resolved", "All time"].map((c, i) => <button key={c} className={`chip${i === 0 ? " active" : ""}`}>{c}</button>)}
        </div>
        {flags?.map((f: any) => (
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
                {[f.artisan, f.patron].map((p: any, i: number) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: p?.bg || "#eee", color: p?.color || "#888", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, margin: "0 auto 5px" }}>{p?.initials || "??"}</div>
                    <div style={{ fontSize: 10, color: "#aaa" }}>{i === 0 ? "Artisan" : "Patron"}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>{p?.name || "Unknown"}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flag-actions">
              {f.actions?.map((a: string, i: number) => (
                <button key={a} className={`btn ${i === 1 ? "btn-danger" : i === 2 ? "btn btn-outline" : "btn btn-plain"}`} style={{ fontSize: 12 }}>{a}</button>
              ))}
            </div>
          </div>
        ))}
        {flags?.length === 0 && <p style={{ textAlign: "center", color: "#aaa", padding: 20 }}>No flags detected.</p>}
      </div>
    </>
  );
}
