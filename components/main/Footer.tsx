"use client";

import React, { useEffect, useState } from "react";

type BuildLine = { ts: string; level: "info" | "ok" | "warn"; text: string };

const BUILD_LINES: BuildLine[] = [
  { ts: "00:00.001", level: "info", text: "▸ next build (production)" },
  { ts: "00:00.118", level: "info", text: "  Compiling assets…" },
  { ts: "00:00.402", level: "ok", text: "  ✓ Compiled successfully" },
  { ts: "00:00.418", level: "info", text: "  Linting and checking validity of types…" },
  { ts: "00:00.612", level: "ok", text: "  ✓ Linted (0 warnings)" },
  { ts: "00:00.799", level: "info", text: "  Generating static pages (5/5)…" },
  { ts: "00:01.044", level: "ok", text: "  ✓ Deployed → deadsec.dev" },
];

const FACTS = [
  "Built with React 18.3.1 · Next.js 13.5.6 · TypeScript 5",
  "Hosted on Vercel · edge runtime",
  "Source: github.com/Deepak15deadsec/spaceportfolio",
];

function BuildLog() {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= BUILD_LINES.length) return;
    const t = setTimeout(() => setN((x) => x + 1), 220);
    return () => clearTimeout(t);
  }, [n]);

  const lines = BUILD_LINES.slice(0, n);

  return (
    <div
      style={{
        background: "var(--editor-bg, #0a0418)",
        border: "1px solid var(--editor-border, rgba(112,66,248,0.25))",
        borderRadius: 12,
        overflow: "hidden",
        fontFamily: "ui-monospace, Menlo, monospace",
        fontSize: 11.5,
        lineHeight: 1.6,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          background: "var(--editor-chrome, #14082a)",
          borderBottom: "1px solid var(--editor-border)",
          color: "var(--fg-5)",
          letterSpacing: "0.06em",
          fontSize: 10,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "#22c55e",
              boxShadow: "0 0 6px #22c55e",
              animation: "pf-pulse-slow 2s ease-in-out infinite",
            }}
          />
          deploy.log
        </span>
        <span style={{ color: "var(--fg-disabled)" }}>·</span>
        <span>vercel · production</span>
        <span style={{ marginLeft: "auto", color: "var(--fg-disabled)" }}>tail -f</span>
      </div>

      <div style={{ padding: "14px 16px", minHeight: 160 }}>
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              color: l.level === "ok" ? "#86efac" : l.level === "warn" ? "#fcd34d" : "var(--fg-3)",
              animation: "pf-line-in 280ms ease-out both",
            }}
          >
            <span style={{ color: "var(--fg-disabled)", flexShrink: 0 }}>{l.ts}</span>
            <span>{l.text}</span>
          </div>
        ))}
        {n < BUILD_LINES.length && (
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: "1em",
              background: "var(--violet-glow)",
              verticalAlign: "text-bottom",
              animation: "pf-cursor 1s steps(2) infinite",
            }}
          />
        )}
      </div>
    </div>
  );
}

const Footer = () => {
  const socials = [
    { href: "https://github.com/Deepak15deadsec", src: "/github-icon.svg", label: "GitHub" },
    { href: "https://in.linkedin.com/in/deepak-aravindan-516919237", src: "/linkedin-icon.svg", label: "LinkedIn" },
    { href: "#", src: "/instagram.svg", label: "Instagram" },
    { href: "#", src: "/discord.svg", label: "Discord" },
  ];

  return (
    <footer className="pf-footer">
      <div className="pf-footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/NavLogo.png" alt="" style={{ width: 56, height: 56 }} />
            <div>
              <div
                style={{
                  color: "var(--fg-1)",
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: "0.02em",
                }}
              >
                Deadsec
              </div>
              <div
                style={{
                  color: "var(--fg-5)",
                  fontSize: 12,
                  fontFamily: "ui-monospace, Menlo, monospace",
                  letterSpacing: "0.04em",
                }}
              >
                Deepak Aravindan · Fullstack + Design + AI
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontFamily: "ui-monospace, Menlo, monospace",
              fontSize: 12,
              color: "var(--fg-4)",
              letterSpacing: "0.02em",
            }}
          >
            {FACTS.map((f) => (
              <div key={f} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 999,
                    background: "var(--violet-glow)",
                    flexShrink: 0,
                  }}
                />
                {f}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: "1px solid var(--border-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "var(--fg-5)",
                fontFamily: "ui-monospace, Menlo, monospace",
                letterSpacing: "0.04em",
              }}
            >
              © Deadsec 2024 · all rights reserved
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    background: "rgba(180,155,255,0.04)",
                    border: "1px solid var(--violet-border)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "border 200ms ease, background 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--violet-glow)";
                    e.currentTarget.style.background = "rgba(112,66,248,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--violet-border)";
                    e.currentTarget.style.background = "rgba(180,155,255,0.04)";
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt="" style={{ width: 16, height: 16 }} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <BuildLog />
      </div>
    </footer>
  );
};

export default Footer;
