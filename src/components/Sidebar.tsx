import Link from "next/link";
import { useRouter } from "next/router";
import { clearSession, SessionAdmin } from "../lib/auth";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: string;
  badgeWarn?: boolean;
  section?: string | boolean;
}

const NAV: NavItem[] = [
  { href: "/dashboard/requests", label: "Requests", icon: "📋", badge: "7", section: "Operations" },
  { href: "/dashboard/artisans", label: "Artisans", icon: "🔧", section: false },
  { href: "/dashboard/patrons",  label: "Patrons",  icon: "👤", section: false },
  { href: "/dashboard/flags",    label: "Flags",    icon: "⚠️", badge: "3", badgeWarn: true, section: "Monitor" },
  { href: "/dashboard/payments", label: "Payments", icon: "💳", section: false },
  { href: "/dashboard/reports",  label: "Reports",  icon: "📊", section: false },
];

interface SidebarProps {
  admin: SessionAdmin | null;
}

export default function Sidebar({ admin }: SidebarProps) {
  const router = useRouter();

  function logout() {
    clearSession();
    router.push("/");
  }

  let lastSection: string | boolean | null = null;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="logo-wrap">
        <div className="logo-row">
          <img
            src="/zart-logo.png"
            alt="Zart"
            style={{ width: 28, height: 28, objectFit: "contain", flexShrink: 0 }}
          />
          <span className="logo-text">Zart</span>
        </div>
        <div className="logo-tagline">Operations dashboard</div>
      </div>

      {/* Navigation */}
      {NAV.map((item, i) => {
        const showSection = item.section && item.section !== lastSection;
        if (item.section) lastSection = item.section;
        const isActive = router.pathname === item.href;
        return (
          <div key={i}>
            {showSection && typeof item.section === 'string' && <div className="nav-section">{item.section}</div>}
            <Link href={item.href} className={`nav-item${isActive ? " active" : ""}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className={`nav-badge${item.badgeWarn ? " warn" : ""}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          </div>
        );
      })}

      {/* Admin footer */}
      <div className="sidebar-footer">
        <div className="admin-row">
          <div
            className="admin-av"
            style={{ background: admin?.color || "#FA4812" }}
          >
            {admin?.initials || "MI"}
          </div>
          <div style={{ flex: 1 }}>
            <div className="admin-name">{admin?.name || "Admin"}</div>
            <div className="admin-role">{admin?.role || "Admin"}</div>
          </div>
          <button
            onClick={logout}
            style={{ background: "none", border: "none", color: "rgba(253,244,215,0.5)", cursor: "pointer", fontSize: 18 }}
            title="Log out"
          >
            ↩
          </button>
        </div>
      </div>
    </aside>
  );
}
