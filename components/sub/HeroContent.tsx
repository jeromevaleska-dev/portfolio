"use client";

import React, { useEffect, useMemo, useState } from "react";

// ---- The "source code" that gets typed out ----------------------------
const SOURCE_CODE = `// about.tsx
import { type Developer } from "@/types";

const me: Developer = {
  name: "Deepak Aravindan",
  roles: [
    "Web Developer",
    "Mobile Developer",
    "UI/UX Designer",
    "AI Developer",
  ],
  stack: ["TypeScript", "React", "Next.js", "Node.js"],
  available: true,
  // design x engineering, both halves
  craft: "fullstack + interface design",
};

export default me;`;

// ---- Tokenizer --------------------------------------------------------
const KEYWORDS = new Set([
  "const", "let", "var", "import", "from", "export", "default",
  "type", "true", "false", "return", "function", "interface",
]);
const TYPES = new Set(["Developer", "string", "number", "boolean", "string[]"]);

type Token = { type: string; text: string };

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const push = (type: string, text: string) => tokens.push({ type, text });

  while (i < src.length) {
    const c = src[i];

    if (c === "/" && src[i + 1] === "/") {
      let end = src.indexOf("\n", i);
      if (end === -1) end = src.length;
      push("comment", src.slice(i, end));
      i = end;
      continue;
    }

    if (c === '"') {
      let j = i + 1;
      while (j < src.length && src[j] !== '"') {
        if (src[j] === "\\") j += 2;
        else j++;
      }
      push("string", src.slice(i, j + 1));
      i = j + 1;
      continue;
    }

    if (/\s/.test(c)) {
      let j = i;
      while (j < src.length && /\s/.test(src[j])) j++;
      push("ws", src.slice(i, j));
      i = j;
      continue;
    }

    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9.]/.test(src[j])) j++;
      push("number", src.slice(i, j));
      i = j;
      continue;
    }

    if (/[A-Za-z_@]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_@/.]/.test(src[j])) j++;
      const word = src.slice(i, j);
      let k = j;
      while (k < src.length && src[k] === " ") k++;
      if (KEYWORDS.has(word)) push("kw", word);
      else if (TYPES.has(word)) push("type", word);
      else if (src[k] === ":") push("prop", word);
      else if (word === "me") push("ident-prim", word);
      else push("ident", word);
      i = j;
      continue;
    }

    push("punct", c);
    i++;
  }

  return tokens;
}

const TOKEN_COLORS: Record<string, string> = {
  kw: "var(--code-kw)",
  type: "var(--code-type)",
  string: "var(--code-string)",
  comment: "var(--code-comment)",
  prop: "var(--code-prop)",
  punct: "var(--code-punct)",
  number: "var(--code-num)",
  "ident-prim": "var(--code-ident-prim)",
  ident: "var(--code-ident)",
  ws: "inherit",
};

function TypedCode({ tokens, typedChars }: { tokens: Token[]; typedChars: number }) {
  let consumed = 0;
  const out: React.ReactNode[] = [];

  for (let t = 0; t < tokens.length; t++) {
    const tok = tokens[t];
    if (consumed >= typedChars) break;

    const remaining = typedChars - consumed;
    const slice = tok.text.length <= remaining ? tok.text : tok.text.slice(0, remaining);

    if (tok.type === "ws") {
      out.push(<span key={t}>{slice}</span>);
    } else {
      out.push(
        <span
          key={t}
          style={{
            color: TOKEN_COLORS[tok.type] || "inherit",
            fontStyle: tok.type === "comment" ? "italic" : "normal",
          }}
        >
          {slice}
        </span>
      );
    }
    consumed += tok.text.length;
  }
  return <>{out}</>;
}

function TrafficLights() {
  const dots = [
    { c: "#ff5f57", t: "Close" },
    { c: "#febc2e", t: "Minimize" },
    { c: "#28c840", t: "Maximize" },
  ];
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {dots.map((d) => (
        <span
          key={d.t}
          title={d.t}
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            background: d.c,
            boxShadow: `0 0 8px ${d.c}66`,
          }}
        />
      ))}
    </div>
  );
}

function EditorTabs() {
  const tabs = [
    { name: "about.tsx", active: true },
    { name: "skills.json", active: false },
    { name: "experience.md", active: false },
  ];
  return (
    <div style={{ display: "flex", gap: 1, marginLeft: 20 }}>
      {tabs.map((tab) => (
        <div
          key={tab.name}
          style={{
            padding: "8px 16px",
            background: tab.active ? "var(--editor-bg)" : "transparent",
            color: tab.active ? "var(--fg-1)" : "var(--fg-4)",
            fontSize: 12,
            fontFamily: "ui-monospace, Menlo, monospace",
            borderTop: tab.active ? "1px solid var(--violet-soft)" : "1px solid transparent",
            borderLeft: tab.active ? "1px solid var(--editor-border)" : "none",
            borderRight: tab.active ? "1px solid var(--editor-border)" : "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
            position: "relative",
            top: 1,
            cursor: "pointer",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          {tab.name}
        </div>
      ))}
    </div>
  );
}

function CodeEditor({ typedChars, tokens }: { typedChars: number; tokens: Token[] }) {
  const fullText = useMemo(() => tokens.map((t) => t.text).join(""), [tokens]);
  const lines = fullText.split("\n");
  const typedText = fullText.slice(0, typedChars);
  const currentLine = typedText.split("\n").length;

  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 0,
        background: "var(--editor-bg)",
        border: "1px solid var(--editor-border)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(112,66,248,0.15)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "ui-monospace, Menlo, monospace",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 14px 0",
          background: "var(--editor-chrome)",
          borderBottom: "1px solid var(--editor-border)",
        }}
      >
        <TrafficLights />
        <EditorTabs />
      </div>

      <div
        style={{
          flex: 1,
          padding: "16px 0",
          fontSize: 13,
          lineHeight: 1.65,
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            padding: "0 14px",
            color: "var(--code-gutter)",
            textAlign: "right",
            userSelect: "none",
            minWidth: 40,
          }}
        >
          {lines.map((_, i) => (
            <div
              key={i}
              style={{
                color: i + 1 === currentLine ? "var(--code-gutter-active)" : "var(--code-gutter)",
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, position: "relative", paddingRight: 16 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${(currentLine - 1) * 1.65}em`,
              height: "1.65em",
              background: "rgba(112,66,248,0.07)",
              transition: "top 80ms linear",
            }}
          />
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "var(--code-ident)",
              fontFamily: "inherit",
              fontSize: "inherit",
              lineHeight: "inherit" as unknown as number,
              position: "relative",
            }}
          >
            <TypedCode tokens={tokens} typedChars={typedChars} />
            <span
              style={{
                display: "inline-block",
                width: 7,
                height: "1.1em",
                background: "var(--violet-glow)",
                verticalAlign: "text-bottom",
                marginLeft: 1,
                animation: "pf-cursor 1s steps(2) infinite",
              }}
            />
          </pre>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 14px",
          background: "var(--editor-chrome)",
          borderTop: "1px solid var(--editor-border)",
          fontSize: 10.5,
          fontFamily: "ui-monospace, Menlo, monospace",
          color: "var(--fg-5)",
          letterSpacing: "0.04em",
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "#22c55e",
                boxShadow: "0 0 6px #22c55e",
              }}
            />
            connected
          </span>
          <span>main</span>
          <span>+{typedText.split("\n").length} lines</span>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          <span>TypeScript</span>
          <span>UTF-8</span>
          <span>
            Ln {currentLine}, Col {typedText.length - typedText.lastIndexOf("\n")}
          </span>
        </div>
      </div>
    </div>
  );
}

type PreviewState = {
  hasName: boolean;
  roles: string[];
  hasStack: boolean;
  hasAvailable: boolean;
  hasCraft: boolean;
};

function derivePreviewState(typedText: string): PreviewState {
  const has = (s: string) => typedText.includes(s);
  const roles: string[] = [];
  if (has('"Web Developer"')) roles.push("Web Developer");
  if (has('"Mobile Developer"')) roles.push("Mobile Developer");
  if (has('"UI/UX Designer"')) roles.push("UI/UX Designer");
  if (has('"AI Developer"')) roles.push("AI Developer");
  return {
    hasName: has('"Deepak Aravindan"'),
    roles,
    hasStack: has('stack: ["TypeScript"'),
    hasAvailable: has("available: true"),
    hasCraft: has('"fullstack + interface design"'),
  };
}

function TypeCycle({ sequence, speed = 70, hold = 1400 }: { sequence: string[]; speed?: number; hold?: number }) {
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = sequence[idx];
    if (!deleting && chars < current.length) {
      const t = setTimeout(() => setChars((n) => n + 1), speed);
      return () => clearTimeout(t);
    }
    if (!deleting && chars === current.length) {
      const t = setTimeout(() => setDeleting(true), hold);
      return () => clearTimeout(t);
    }
    if (deleting && chars > 0) {
      const t = setTimeout(() => setChars((n) => n - 1), speed / 2);
      return () => clearTimeout(t);
    }
    if (deleting && chars === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % sequence.length);
    }
  }, [chars, deleting, idx, sequence, speed, hold]);

  return <>{sequence[idx].slice(0, chars)}</>;
}

function LivePreview({ state }: { state: PreviewState }) {
  const { hasName, roles, hasStack, hasAvailable, hasCraft } = state;

  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 0,
        background: "var(--bg-canvas-soft)",
        border: "1px solid var(--violet-soft)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(112,66,248,0.18)",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          background: "var(--editor-chrome)",
          borderBottom: "1px solid var(--editor-border)",
        }}
      >
        <TrafficLights />
        <div
          style={{
            flex: 1,
            background: "var(--editor-bg)",
            border: "1px solid var(--editor-border)",
            borderRadius: 999,
            padding: "5px 14px",
            fontSize: 11,
            fontFamily: "ui-monospace, Menlo, monospace",
            color: "var(--fg-5)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          deadsec.dev/about
        </div>
        <span
          style={{
            fontSize: 10,
            color: "var(--lavender)",
            fontFamily: "ui-monospace, Menlo, monospace",
          }}
        >
          LIVE
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
          position: "relative",
          minHeight: 440,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 280,
            height: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "1px dashed var(--violet-border)",
              borderRadius: "50%",
              animation: "pf-spin 50s linear infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 24,
              border: "1px solid rgba(180,155,255,0.18)",
              borderRadius: "50%",
              animation: "pf-spin 35s linear infinite reverse",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 240,
              height: 240,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, var(--accent-glow-strong) 0%, transparent 60%)",
              filter: "blur(20px)",
            }}
          />
          {hasName ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/deepp.jpeg"
              alt=""
              style={{
                position: "relative",
                width: 200,
                height: 200,
                objectFit: "cover",
                borderRadius: "50%",
                border: "2px solid var(--violet-soft)",
                animation: "pf-fade-in 600ms ease-out both",
              }}
            />
          ) : (
            <div
              style={{
                position: "relative",
                width: 200,
                height: 200,
                borderRadius: "50%",
                border: "1px dashed var(--border-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--fg-disabled)",
                fontFamily: "ui-monospace, Menlo, monospace",
                fontSize: 10,
                letterSpacing: "0.1em",
              }}
            >
              awaiting
            </div>
          )}
        </div>

        {hasAvailable && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 12px",
              borderRadius: 999,
              border: "1px solid rgba(34,197,94,0.4)",
              background: "rgba(34,197,94,0.08)",
              fontSize: 11,
              color: "#86efac",
              fontWeight: 500,
              marginBottom: 12,
              animation: "pf-fade-in 400ms ease-out both",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "#22c55e",
                boxShadow: "0 0 6px #22c55e",
              }}
            />
            Available for new opportunities
          </div>
        )}

        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "var(--fg-1)",
            margin: 0,
            minHeight: "1.2em",
            textAlign: "center",
          }}
        >
          {hasName ? (
            <span
              className="text-gradient-name"
              style={{ animation: "pf-fade-in 500ms ease-out both" }}
            >
              Deepak Aravindan
            </span>
          ) : (
            <span
              style={{
                color: "var(--fg-disabled)",
                fontWeight: 400,
                fontFamily: "ui-monospace, Menlo, monospace",
                fontSize: 13,
                letterSpacing: "0.1em",
              }}
            >
              ...
            </span>
          )}
        </h2>

        <div
          style={{
            marginTop: 8,
            color: "var(--fg-3)",
            fontSize: 15,
            fontFamily: "ui-monospace, Menlo, monospace",
            letterSpacing: "0.04em",
            minHeight: "1.4em",
          }}
        >
          {roles.length === 0 && <span style={{ color: "var(--fg-disabled)" }}>{"// roles[]"}</span>}
          {roles.length > 0 && roles.length < 4 && (
            <span style={{ animation: "pf-fade-in 350ms ease-out both" }} key={roles[roles.length - 1]}>
              {roles[roles.length - 1]}
            </span>
          )}
          {roles.length === 4 && (
            <span style={{ color: "var(--lavender)" }}>
              <TypeCycle sequence={roles} speed={70} hold={1400} />
            </span>
          )}
        </div>

        {hasStack && (
          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 14,
              flexWrap: "wrap",
              justifyContent: "center",
              animation: "pf-fade-in 500ms ease-out both",
            }}
          >
            {["TypeScript", "React", "Next.js", "Node.js"].map((s) => (
              <span
                key={s}
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 10,
                  background: "var(--violet-fill)",
                  border: "1px solid var(--violet-border)",
                  color: "var(--lavender)",
                  fontFamily: "ui-monospace, Menlo, monospace",
                  letterSpacing: "0.04em",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {hasCraft && (
          <div
            style={{
              marginTop: 16,
              fontSize: 12,
              color: "var(--fg-5)",
              fontStyle: "italic",
              fontFamily: "var(--font-cursive)",
              animation: "pf-fade-in 500ms ease-out both",
            }}
          >
            fullstack + interface design
          </div>
        )}
      </div>
    </div>
  );
}

const THEMES = [
  { id: "cyber", label: "Cyber", color: "#7042f8" },
  { id: "solar", label: "Solar", color: "#f97316" },
  { id: "mono", label: "Mono", color: "#e5e7eb" },
];

function ThemeSwitcher() {
  const [theme, setTheme] = useState("cyber");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: 5,
        background: "rgba(3,0,20,0.5)",
        border: "1px solid var(--editor-border)",
        borderRadius: 999,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--fg-5)",
          padding: "0 8px 0 6px",
          fontFamily: "ui-monospace, Menlo, monospace",
        }}
      >
        theme
      </span>
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          aria-label={t.label}
          title={t.label}
          style={{
            width: 22,
            height: 22,
            borderRadius: 999,
            background: t.color,
            border: theme === t.id ? "2px solid var(--fg-1)" : "2px solid transparent",
            boxShadow: theme === t.id ? `0 0 12px ${t.color}80` : "none",
            cursor: "pointer",
            padding: 0,
            transition: "border 150ms ease, box-shadow 200ms ease",
          }}
        />
      ))}
    </div>
  );
}

function SectionIndex({ index, label }: { index: string; label: string }) {
  return (
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
      }}
    >
      <span style={{ opacity: 0.7 }}>{index}</span>
      <span
        style={{
          width: 32,
          height: 1,
          background: "linear-gradient(90deg, var(--violet-glow), transparent)",
        }}
      />
      <span style={{ color: "var(--fg-3)", letterSpacing: "0.14em" }}>{label}</span>
    </div>
  );
}

function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 75%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: 520,
          height: 520,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--accent-glow-strong) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-5%",
          left: "-5%",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--accent-glow-soft) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}

const HeroContent = () => {
  const tokens = useMemo(() => tokenize(SOURCE_CODE), []);
  const totalChars = SOURCE_CODE.length;
  const [typed, setTyped] = useState(0);
  const [done, setDone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (typed >= totalChars) {
      setDone(true);
      return;
    }
    const ch = SOURCE_CODE[typed];
    const next = SOURCE_CODE[typed + 1];
    let delay = 14;
    if (ch === " ") delay = 8;
    if (ch === "\n") delay = 80;
    if (ch === '"' || next === '"') delay = 24;
    if (ch === "(" || ch === "{") delay = 60;
    const t = setTimeout(() => setTyped((n) => n + 1), delay);
    return () => clearTimeout(t);
  }, [typed, totalChars]);

  const previewState = useMemo(
    () => derivePreviewState(SOURCE_CODE.slice(0, typed)),
    [typed]
  );

  return (
    <section
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "calc(100vh - 65px)",
        padding: "105px 0 0",
      }}
    >
      <HeroBackdrop />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: isMobile ? "0 20px" : "0 80px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <SectionIndex index="01" label="About me" />
          <ThemeSwitcher />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <h1
            style={{
              fontSize: isMobile ? 36 : 56,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              color: "var(--fg-1)",
              margin: 0,
              maxWidth: 900,
            }}
          >
            I design and engineer <br />
            <span className="text-gradient-name">interfaces that feel alive.</span>
          </h1>
          <p
            style={{
              fontSize: 17,
              color: "var(--fg-4)",
              maxWidth: 620,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Fullstack engineer with a designer&apos;s eye for detail. This page is
            building itself — watch the code on the left compile into the preview
            on the right.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.05fr) minmax(0, 1fr)",
            gap: 24,
            alignItems: "stretch",
            marginTop: 8,
          }}
        >
          <CodeEditor typedChars={typed} tokens={tokens} />
          <LivePreview state={previewState} />
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            marginTop: 8,
            flexWrap: "wrap",
          }}
        >
          <a
            href="/ai-resume.pdf"
            download
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              padding: "13px 26px",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            DOWNLOAD MY RESUME
          </a>
          <a
            href="#projects"
            style={{
              color: "var(--fg-2)",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "13px 22px",
              borderRadius: 8,
              border: "1px solid var(--border-soft)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "border-color 200ms ease, color 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--violet-glow)";
              e.currentTarget.style.color = "var(--fg-1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-soft)";
              e.currentTarget.style.color = "var(--fg-2)";
            }}
          >
            View projects
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </a>
          {done && (
            <span
              style={{
                fontSize: 11,
                color: "var(--fg-5)",
                fontFamily: "ui-monospace, Menlo, monospace",
                letterSpacing: "0.08em",
                marginLeft: "auto",
                animation: "pf-fade-in 400ms ease-out both",
              }}
            >
              ✓ build successful · {((SOURCE_CODE.length * 14) / 1000).toFixed(1)}s
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroContent;
