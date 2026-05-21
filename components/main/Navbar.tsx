"use client";

import React, { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { id: "about-me", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        background: "rgba(255,255,255,0.04)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct * 100}%`,
          background: "linear-gradient(90deg, var(--violet-glow), #ec4899)",
          transition: "width 80ms linear",
          boxShadow: "0 0 8px var(--violet-glow)",
        }}
      />
    </div>
  );
}

function NavLinks() {
  const [active, setActive] = useState("about-me");
  const [hovered, setHovered] = useState<string | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const onScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      let curr = "about-me";
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPos) curr = item.id;
      }
      setActive(curr);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = hovered || active;
    const el = linkRefs.current[target];
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicator({
      left: elRect.left - parentRect.left,
      width: elRect.width,
      opacity: 1,
    });
  }, [hovered, active]);

  return (
    <div
      onMouseLeave={() => setHovered(null)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        border: "1px solid var(--violet-border)",
        background: "var(--bg-canvas-soft, #0300145e)",
        padding: "5px 8px",
        borderRadius: 9999,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: indicator.left,
          width: indicator.width,
          borderRadius: 9999,
          background: "rgba(112,66,248,0.18)",
          border: "1px solid var(--violet-soft)",
          opacity: indicator.opacity,
          transition: "all 320ms cubic-bezier(0.25, 1, 0.5, 1)",
          pointerEvents: "none",
          boxShadow: "0 0 14px var(--accent-glow-strong)",
        }}
      />
      {NAV_ITEMS.map((item) => (
        <a
          key={item.id}
          ref={(el) => {
            linkRefs.current[item.id] = el;
          }}
          href={"#" + item.id}
          onMouseEnter={() => setHovered(item.id)}
          onFocus={() => setHovered(item.id)}
          onBlur={() => setHovered(null)}
          style={{
            position: "relative",
            padding: "8px 16px",
            color: active === item.id ? "var(--fg-1)" : "var(--fg-3)",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.02em",
            zIndex: 1,
            transition: "color 200ms ease",
          }}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}

type Cmd = { id: string; label: string; hint: string; run: () => void };

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
      setQuery("");
    }
  }, [open]);

  const cmds: Cmd[] = [
    { id: "jump-about", label: "Jump to → About me", hint: "Section 01", run: () => { location.hash = "#about-me"; } },
    { id: "jump-skills", label: "Jump to → Skills", hint: "Section 02", run: () => { location.hash = "#skills"; } },
    { id: "jump-projects", label: "Jump to → Projects", hint: "Section 03", run: () => { location.hash = "#projects"; } },
    { id: "jump-contact", label: "Jump to → Contact", hint: "Section 04", run: () => { location.hash = "#contact"; } },
    { id: "theme-cyber", label: "Switch theme → Cyber", hint: "⌘1", run: () => document.documentElement.setAttribute("data-theme", "cyber") },
    { id: "theme-solar", label: "Switch theme → Solar", hint: "⌘2", run: () => document.documentElement.setAttribute("data-theme", "solar") },
    { id: "theme-mono", label: "Switch theme → Mono", hint: "⌘3", run: () => document.documentElement.setAttribute("data-theme", "mono") },
    { id: "resume", label: "Download resume", hint: ".pdf", run: () => window.open("/ai-resume.pdf", "_blank") },
    { id: "github", label: "Open GitHub profile", hint: "↗", run: () => window.open("https://github.com/Deepak15deadsec", "_blank") },
    { id: "linkedin", label: "Open LinkedIn profile", hint: "↗", run: () => window.open("https://in.linkedin.com/in/deepak-aravindan-516919237", "_blank") },
  ];

  const filtered = query
    ? cmds.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : cmds;

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(3,0,20,0.7)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh",
        animation: "pf-fade-in 200ms ease-out both",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 560,
          background: "var(--editor-bg, #0a0418)",
          border: "1px solid var(--violet-soft)",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 60px 120px rgba(0,0,0,0.6), 0 0 60px var(--accent-glow-strong)",
          animation: "pf-modal-rise 320ms cubic-bezier(0.25, 1, 0.5, 1) both",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 18px",
            borderBottom: "1px solid var(--editor-border)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--lavender)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or section name…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--fg-1)",
              fontSize: 15,
              fontFamily: "inherit",
            }}
          />
          <kbd
            style={{
              padding: "2px 8px",
              fontSize: 10,
              background: "rgba(180,155,255,0.08)",
              border: "1px solid var(--violet-border)",
              borderRadius: 6,
              color: "var(--fg-4)",
              fontFamily: "ui-monospace, Menlo, monospace",
              letterSpacing: "0.04em",
            }}
          >
            esc
          </kbd>
        </div>

        <div style={{ maxHeight: "50vh", overflowY: "auto", padding: 8 }}>
          {filtered.length === 0 && (
            <div
              style={{
                padding: "32px 16px",
                textAlign: "center",
                color: "var(--fg-5)",
                fontSize: 13,
                fontFamily: "ui-monospace, Menlo, monospace",
              }}
            >
              no matches for &quot;{query}&quot;
            </div>
          )}
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                c.run();
                onClose();
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                background: "transparent",
                border: "none",
                borderRadius: 8,
                color: "var(--fg-2)",
                fontSize: 14,
                cursor: "pointer",
                textAlign: "left",
                transition: "background 150ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(112,66,248,0.12)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontFamily: "inherit" }}>{c.label}</span>
              <span
                style={{
                  fontFamily: "ui-monospace, Menlo, monospace",
                  fontSize: 10,
                  color: "var(--fg-5)",
                  letterSpacing: "0.06em",
                }}
              >
                {c.hint}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const Navbar = () => {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      } else if (e.key === "Escape" && paletteOpen) {
        setPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 65,
          zIndex: 50,
          background: "rgba(3, 0, 20, 0.55)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 4px 30px rgba(42, 14, 97, 0.5)",
          borderBottom: "1px solid var(--violet-border)",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "0 auto",
          }}
        >
          <a
            href="#about-me"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              textDecoration: "none",
              gap: 10,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/NavLogo.png"
              alt="Deadsec logo"
              className="navlogo-spin"
              style={{ width: 52, height: 52, cursor: "pointer" }}
            />
            <span
              style={{
                fontWeight: 700,
                color: "var(--fg-1)",
                letterSpacing: "0.02em",
                fontSize: 15,
              }}
            >
              Deadsec
            </span>
          </a>

          <NavLinks />

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 10px 6px 12px",
                borderRadius: 9999,
                background: "rgba(180,155,255,0.04)",
                border: "1px solid var(--border-soft)",
                color: "var(--fg-4)",
                fontSize: 12,
                fontFamily: "ui-monospace, Menlo, monospace",
                letterSpacing: "0.04em",
                cursor: "pointer",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--violet-soft)";
                e.currentTarget.style.color = "var(--fg-2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-soft)";
                e.currentTarget.style.color = "var(--fg-4)";
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              jump to
              <kbd
                style={{
                  padding: "1px 6px",
                  fontSize: 10,
                  background: "rgba(180,155,255,0.08)",
                  border: "1px solid var(--violet-border)",
                  borderRadius: 4,
                  color: "var(--lavender)",
                }}
              >
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
        <ScrollProgress />
      </header>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
};

export default Navbar;
