"use client";

import React, { useMemo, useState } from "react";

type Tech = {
  id: string;
  name: string;
  src: string;
  x: number;
  y: number;
  size: number;
  cat: "frontend" | "backend" | "mobile" | "tools";
  years: number;
  blurb: string;
};

const TECHS: Tech[] = [
  { id: "html", name: "HTML 5", src: "/html.png", x: 130, y: 160, size: 52, cat: "frontend", years: 4, blurb: "Semantic markup, accessibility-first. The foundation of every interface I ship." },
  { id: "css", name: "CSS", src: "/css.png", x: 270, y: 100, size: 56, cat: "frontend", years: 4, blurb: "Grid, container queries, animations, custom properties. I treat CSS as a design tool, not a side-effect." },
  { id: "js", name: "JavaScript", src: "/js.png", x: 410, y: 170, size: 56, cat: "frontend", years: 4, blurb: "ESNext daily. Comfortable in the metaprogramming weeds when needed." },
  { id: "next", name: "Next.js", src: "/next.png", x: 410, y: 320, size: 64, cat: "frontend", years: 2, blurb: "App Router, RSC, ISR, edge functions. My default for production web apps." },
  { id: "framer", name: "Framer Motion", src: "/framer.png", x: 270, y: 380, size: 56, cat: "frontend", years: 2, blurb: "Spring physics, layout animations, gesture handling. Motion is part of the brand." },
  { id: "mui", name: "Material UI", src: "/mui.png", x: 130, y: 320, size: 50, cat: "frontend", years: 2, blurb: "Token-driven theming. I use it when a project needs a complete kit on day one." },

  { id: "node", name: "Node.js", src: "/node-js.png", x: 700, y: 170, size: 56, cat: "backend", years: 3, blurb: "Streams, workers, observability. I write boring backends so the product can be exciting." },
  { id: "express", name: "Express", src: "/express.png", x: 840, y: 100, size: 60, cat: "backend", years: 3, blurb: "Middleware-first. I lean on it for fast REST surfaces." },
  { id: "mongo", name: "MongoDB", src: "/mongodb.png", x: 700, y: 330, size: 50, cat: "backend", years: 3, blurb: "Aggregation pipelines and Atlas Search. Comfortable modeling for both speed and consistency." },
  { id: "mysql", name: "MySQL", src: "/mysql.png", x: 960, y: 220, size: 54, cat: "backend", years: 2, blurb: "Indexing, EXPLAIN plans, migrations. I'll pick a relational store when the model is relational." },
  { id: "firebase", name: "Firebase", src: "/Firebase.png", x: 840, y: 320, size: 52, cat: "backend", years: 2, blurb: "Auth, Firestore, hosting. The pragmatic choice for getting an MVP in the hands of real users." },
  { id: "graphql", name: "GraphQL", src: "/graphql.png", x: 960, y: 380, size: 56, cat: "backend", years: 2, blurb: "Schema-first, persisted queries, Apollo + Yoga. Stays out of the way of the frontend." },

  { id: "rn", name: "React Native", src: "/ReactNative .png", x: 200, y: 470, size: 56, cat: "mobile", years: 2, blurb: "Cross-platform mobile with native bridges where needed. Shipped both stores." },
  { id: "figma", name: "Figma", src: "/figma.png", x: 380, y: 490, size: 48, cat: "tools", years: 4, blurb: "Auto-layout fluency. Where every project starts." },
  { id: "docker", name: "Docker", src: "/docker.webp", x: 560, y: 470, size: 54, cat: "tools", years: 2, blurb: "Compose-driven local dev, multi-stage builds for prod images." },
  { id: "unity", name: "Unity", src: "/go.png", x: 870, y: 470, size: 50, cat: "tools", years: 1, blurb: "Side experiments in interactive 3D and WebGL exports." },
];

const EDGES: [string, string][] = [
  ["html", "css"], ["html", "js"], ["css", "js"],
  ["css", "framer"], ["css", "mui"],
  ["js", "next"], ["js", "framer"],
  ["next", "node"], ["next", "rn"],
  ["mui", "framer"],
  ["node", "express"], ["node", "mongo"], ["node", "mysql"], ["node", "graphql"],
  ["express", "mongo"], ["express", "graphql"],
  ["mongo", "firebase"], ["mongo", "mysql"],
  ["rn", "figma"], ["rn", "next"],
  ["docker", "node"], ["docker", "mongo"],
];

const CATEGORIES = [
  { id: "all", label: "All", count: TECHS.length },
  { id: "frontend", label: "Frontend", count: TECHS.filter((t) => t.cat === "frontend").length },
  { id: "backend", label: "Backend", count: TECHS.filter((t) => t.cat === "backend").length },
  { id: "mobile", label: "Mobile", count: TECHS.filter((t) => t.cat === "mobile").length },
  { id: "tools", label: "Tools", count: TECHS.filter((t) => t.cat === "tools").length },
];

function Constellation() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const byId = useMemo(() => Object.fromEntries(TECHS.map((t) => [t.id, t])) as Record<string, Tech>, []);

  const isLit = (id: string) => {
    const t = byId[id];
    const matchesFilter = filter === "all" || t.cat === filter;
    if (!hovered) return matchesFilter;
    if (hovered === id) return true;
    const linked = EDGES.some(([a, b]) => (a === hovered && b === id) || (b === hovered && a === id));
    return linked;
  };

  const isHoveredSelf = (id: string) => hovered === id;
  const isLinked = (id: string) =>
    hovered && hovered !== id && EDGES.some(([a, b]) => (a === hovered && b === id) || (b === hovered && a === id));

  const detail = hovered ? byId[hovered] : null;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 32, flexWrap: "wrap" }}>
        {CATEGORIES.map((c) => {
          const active = filter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              style={{
                padding: "8px 16px",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.04em",
                fontFamily: "ui-monospace, Menlo, monospace",
                textTransform: "lowercase",
                background: active ? "var(--violet-fill, rgba(112,66,248,0.18))" : "transparent",
                color: active ? "var(--fg-1)" : "var(--fg-4)",
                border: active ? "1px solid var(--violet-soft)" : "1px solid var(--border-soft)",
                borderRadius: 9999,
                cursor: "pointer",
                transition: "all 200ms ease",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.borderColor = "var(--violet-border)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.borderColor = "var(--border-soft)";
              }}
            >
              {c.label}
              <span
                style={{
                  fontSize: 10,
                  opacity: 0.6,
                  padding: "1px 6px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                {c.count}
              </span>
            </button>
          );
        })}
      </div>

      <div
        onMouseLeave={() => setHovered(null)}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1100 / 560",
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(112,66,248,0.07) 0%, transparent 75%)",
          borderRadius: 16,
        }}
      >
        <svg
          viewBox="0 0 1100 560"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="var(--violet-border)" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="1100" height="560" fill="url(#dots)" opacity="0.5" />

          {EDGES.map(([a, b], i) => {
            const A = byId[a];
            const B = byId[b];
            if (!A || !B) return null;
            const aLit = isLit(a);
            const bLit = isLit(b);
            const active = !!hovered && (hovered === a || hovered === b);
            const visible = aLit && bLit;
            return (
              <line
                key={i}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke={active ? "var(--violet-glow)" : "var(--violet-border)"}
                strokeWidth={active ? 1.2 : 0.7}
                opacity={visible ? (active ? 0.9 : 0.35) : 0.06}
                style={{ transition: "opacity 300ms ease, stroke 300ms ease, stroke-width 300ms ease" }}
                strokeDasharray={active ? "0" : "3 4"}
              />
            );
          })}
        </svg>

        {TECHS.map((t) => {
          const lit = isLit(t.id);
          const self = isHoveredSelf(t.id);
          const linkedNow = isLinked(t.id);
          return (
            <button
              key={t.id}
              onMouseEnter={() => setHovered(t.id)}
              onFocus={() => setHovered(t.id)}
              aria-label={t.name}
              style={{
                position: "absolute",
                left: `${(t.x / 1100) * 100}%`,
                top: `${(t.y / 560) * 100}%`,
                width: t.size,
                height: t.size,
                transform: `translate(-50%, -50%) scale(${self ? 1.15 : linkedNow ? 1.05 : 1})`,
                background: self
                  ? "rgba(112,66,248,0.18)"
                  : linkedNow
                    ? "rgba(112,66,248,0.10)"
                    : "rgba(3,0,20,0.6)",
                border: self
                  ? "1px solid var(--violet-glow)"
                  : linkedNow
                    ? "1px solid var(--violet-soft)"
                    : "1px solid var(--violet-border)",
                borderRadius: "50%",
                padding: 0,
                cursor: "pointer",
                opacity: lit ? 1 : 0.25,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                boxShadow: self
                  ? "0 0 30px var(--violet-glow), inset 0 0 12px rgba(180,155,255,0.3)"
                  : linkedNow
                    ? "0 0 14px var(--accent-glow-strong)"
                    : "none",
                transition: "all 280ms cubic-bezier(0.25, 1, 0.5, 1)",
                zIndex: self ? 10 : linkedNow ? 5 : 1,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.src}
                alt=""
                style={{
                  width: "65%",
                  height: "65%",
                  objectFit: "contain",
                  pointerEvents: "none",
                  filter: lit ? "none" : "saturate(0.3) brightness(0.7)",
                  transition: "filter 280ms ease",
                }}
              />
              {self && (
                <span
                  style={{
                    position: "absolute",
                    inset: -4,
                    borderRadius: "50%",
                    border: "1px solid var(--violet-glow)",
                    animation: "pf-ring 1.6s ease-out infinite",
                    pointerEvents: "none",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 24,
          minHeight: 96,
          padding: "20px 24px",
          background: "rgba(3,0,20,0.5)",
          border: "1px solid var(--violet-border)",
          borderRadius: 12,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          gap: 24,
          transition: "border 300ms ease",
        }}
      >
        {detail ? (
          <>
            <div
              style={{
                width: 56,
                height: 56,
                flexShrink: 0,
                background: "rgba(112,66,248,0.12)",
                border: "1px solid var(--violet-soft)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={detail.src} alt="" style={{ width: 36, height: 36, objectFit: "contain" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                <h4 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--fg-1)" }}>{detail.name}</h4>
                <span
                  style={{
                    fontFamily: "ui-monospace, Menlo, monospace",
                    fontSize: 11,
                    color: "var(--lavender)",
                    letterSpacing: "0.08em",
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "rgba(180,155,255,0.08)",
                    border: "1px solid var(--violet-border)",
                  }}
                >
                  ~{detail.years} {detail.years === 1 ? "yr" : "yrs"}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--fg-4)",
                    fontFamily: "ui-monospace, Menlo, monospace",
                  }}
                >
                  {detail.cat}
                </span>
              </div>
              <p style={{ margin: "6px 0 0", color: "var(--fg-3)", fontSize: 14, lineHeight: 1.55, maxWidth: 720 }}>
                {detail.blurb}
              </p>
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: "var(--fg-5)",
              fontFamily: "ui-monospace, Menlo, monospace",
              fontSize: 13,
              letterSpacing: "0.06em",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: "var(--violet-glow)",
                boxShadow: "0 0 8px var(--violet-glow)",
                animation: "pf-pulse-slow 2s ease-in-out infinite",
              }}
            />
            hover a star to read about it · {TECHS.length} technologies · {EDGES.length} connections
          </div>
        )}
      </div>
    </div>
  );
}

const Skills = () => {
  return (
    <section
      id="skills"
      className="pf-section"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--lavender)",
          alignSelf: "flex-start",
          paddingLeft: 24,
        }}
      >
        <span style={{ opacity: 0.7 }}>02</span>
        <span
          style={{
            width: 32,
            height: 1,
            background: "linear-gradient(90deg, var(--violet-glow), transparent)",
          }}
        />
        <span style={{ color: "var(--fg-3)", letterSpacing: "0.14em" }}>The stack</span>
      </div>

      <div style={{ textAlign: "center", marginBottom: 40, maxWidth: 720 }}>
        <h2
          style={{
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--fg-1)",
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          A constellation of <br />
          <span className="text-gradient-projects">tools, not a checklist.</span>
        </h2>
        <p
          style={{
            marginTop: 14,
            fontSize: 16,
            color: "var(--fg-4)",
            lineHeight: 1.6,
          }}
        >
          Each star is a technology I&apos;ve shipped with. Lines connect tools I reach for together. Hover to read why.
        </p>
      </div>

      <Constellation />
    </section>
  );
};

export default Skills;
