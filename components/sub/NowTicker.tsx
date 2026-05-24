"use client";

import React, { useEffect, useRef, useState } from "react";

type NowItem = {
  label: string;
  primary: string;
  secondary?: string;
  icon: React.ReactNode;
};

const Dot = ({ color = "#22c55e" }: { color?: string }) => (
  <span
    style={{
      display: "inline-block",
      width: 8,
      height: 8,
      borderRadius: 999,
      background: color,
      boxShadow: `0 0 0 4px ${color}22, 0 0 10px ${color}`,
      animation: "pf-now-pulse 1.6s ease-in-out infinite",
    }}
  />
);

const Icon = ({ d }: { d: string }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d={d} />
  </svg>
);

// Curated swap-friendly feed. Edit any entry to keep it true.
const NOW_ITEMS: NowItem[] = [
  {
    label: "Reading",
    primary: "Designing Data-Intensive Applications",
    secondary: "Martin Kleppmann",
    icon: <Icon d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4z M4 4v12a4 4 0 0 0 4 4" />,
  },
  {
    label: "Last commit",
    primary: "feat(hero): live editor + preview",
    secondary: "main · 2h ago",
    icon: <Icon d="M12 2v6 M12 16v6 M5 12h14" />,
  },
  {
    label: "Listening",
    primary: "Lo-Fi for late nights",
    secondary: "Spotify",
    icon: <Icon d="M9 18V5l12-2v13 M9 13a3 3 0 1 1-3-3 M21 11a3 3 0 1 1-3-3" />,
  },
  {
    label: "Location",
    primary: "Chennai, IN",
    secondary: "UTC+5:30",
    icon: <Icon d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z M12 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />,
  },
  {
    label: "Weather",
    primary: "29°C · partly cloudy",
    secondary: "feels like 33°",
    icon: <Icon d="M17 18a4 4 0 0 0 0-8 6 6 0 0 0-11 2 4 4 0 0 0 1 8h10z" />,
  },
  {
    label: "Status",
    primary: "Open to freelance",
    secondary: "Q3 · 1 slot left",
    icon: <Icon d="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01l-3-3" />,
  },
];

const ROTATE_MS = 3500;

const NowTicker: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % NOW_ITEMS.length);
    }, ROTATE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  const item = NOW_ITEMS[index];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "8px 14px",
        borderRadius: 999,
        background: "rgba(3,0,20,0.55)",
        border: "1px solid var(--editor-border)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        fontFamily: "ui-monospace, Menlo, Consolas, monospace",
        fontSize: 12,
        color: "var(--fg-3)",
        maxWidth: "100%",
        cursor: paused ? "default" : "default",
        transition: "border-color 200ms ease",
      }}
    >
      {/* live dot + NOW label */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          paddingRight: 12,
          borderRight: "1px solid var(--editor-border)",
        }}
      >
        <Dot />
        <span
          style={{
            color: "var(--lavender)",
            letterSpacing: "0.2em",
            fontWeight: 600,
            fontSize: 10,
          }}
        >
          NOW
        </span>
      </span>

      {/* rotating content */}
      <span
        key={index}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          minWidth: 0,
          animation: "pf-fade-in 350ms ease-out both",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--fg-5)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            fontSize: 10,
          }}
        >
          {item.icon}
          {item.label}
        </span>
        <span
          style={{
            color: "var(--fg-2)",
            fontWeight: 500,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: isMobile ? 220 : 360,
          }}
        >
          {item.primary}
        </span>
        {!isMobile && item.secondary && (
          <span
            style={{
              color: "var(--fg-5)",
              fontStyle: "italic",
              whiteSpace: "nowrap",
            }}
          >
            · {item.secondary}
          </span>
        )}
      </span>

      {/* progress dots — hidden on phones */}
      {!isMobile && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            marginLeft: 4,
            paddingLeft: 12,
            borderLeft: "1px solid var(--editor-border)",
          }}
        >
          {NOW_ITEMS.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === index ? 12 : 4,
                height: 4,
                borderRadius: 999,
                background:
                  i === index ? "var(--violet-glow)" : "var(--editor-border)",
                transition: "width 250ms ease, background 250ms ease",
              }}
            />
          ))}
        </span>
      )}
    </div>
  );
};

export default NowTicker;
