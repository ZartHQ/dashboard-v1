"use client";

import { ADMINS } from "../features/auth/admins";
import { useLoginForm } from "../features/auth/hooks";

export default function LoginPage() {
  const { form, onSubmit, isLoading, error } = useLoginForm();
  const { register, formState: { errors } } = form;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }}>
      {/* Brand side */}
      <div
        style={{
          background: "#115746",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 48,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/zart-logo.png" alt="Zart" style={{ width: 44, height: 44, objectFit: "contain" }} />
          <span style={{ fontSize: 28, fontWeight: 700, color: "#FDF4D7", letterSpacing: -0.5 }}>Zart</span>
        </div>

        {/* Tagline */}
        <div>
          <h1
            style={{
              fontSize: 40, fontWeight: 700, color: "#FDF4D7",
              lineHeight: 1.2, marginBottom: 16,
            }}
          >
            Operations<br />
            <span style={{ color: "#FFC92A" }}>Dashboard</span>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(253,244,215,0.7)", lineHeight: 1.6, maxWidth: 360 }}>
            Manage requests, artisans, patrons, and every job from one place. Built for the Zart team.
          </p>
        </div>

        <p style={{ fontSize: 12, color: "rgba(253,244,215,0.4)" }}>
          © 2026 Zart Technology Limited
        </p>
      </div>

      {/* Login form side */}
      <div
        style={{
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#115746", marginBottom: 8 }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 14, color: "#888", marginBottom: 36 }}>
            Sign in to the Zart admin dashboard
          </p>

          {(error || Object.keys(errors).length > 0) && (
            <div
              style={{
                background: "#fff0ec", border: "1px solid #FA4812",
                borderRadius: 8, padding: "10px 14px",
                fontSize: 13, color: "#FA4812", marginBottom: 16,
              }}
            >
              {error || "Please check your credentials"}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#333", marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="you@zart.ng"
                disabled={isLoading}
                style={{
                  width: "100%", border: errors.email ? "1.5px solid #FA4812" : "1.5px solid #e0e0e0",
                  borderRadius: 10, padding: "12px 16px",
                  fontSize: 14, color: "#1a1a1a",
                  outline: "none",
                }}
              />
              {errors.email && <p style={{ color: "#FA4812", fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#333", marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="Enter your password"
                disabled={isLoading}
                style={{
                  width: "100%", border: errors.password ? "1.5px solid #FA4812" : "1.5px solid #e0e0e0",
                  borderRadius: 10, padding: "12px 16px",
                  fontSize: 14, color: "#1a1a1a",
                  outline: "none",
                }}
              />
              {errors.password && <p style={{ color: "#FA4812", fontSize: 12, marginTop: 4 }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%", background: "#115746", color: "#fff",
                border: "none", borderRadius: 10, padding: 14,
                fontSize: 15, fontWeight: 600,
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", margin: "28px 0" }} />

          <p style={{ fontSize: 12, color: "#aaa", textAlign: "center", lineHeight: 1.6 }}>
            <strong style={{ color: "#666" }}>Access is restricted to authorised Zart team members.</strong>
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 10 }}>
            {ADMINS.map((a) => (
              <span
                key={a.id}
                style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 20,
                  background: "#FDF4D7", color: "#115746",
                  fontWeight: 500, border: "1px solid #e0d5b0",
                }}
              >
                {a.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
