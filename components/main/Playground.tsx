"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ShapeKind = "rect" | "circle" | "pill" | "card";

type Shape = {
  id: number;
  kind: ShapeKind;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  radius: number;
};

type ShapeDefaults = { w: number; h: number; fill: string; radius: number };

const SHAPE_KINDS: { kind: ShapeKind; label: string; icon: string; defaults: ShapeDefaults }[] = [
  { kind: "rect", label: "Rectangle", icon: "▭", defaults: { w: 140, h: 100, fill: "#7042f8", radius: 12 } },
  { kind: "circle", label: "Circle", icon: "●", defaults: { w: 90, h: 90, fill: "#ec4899", radius: 999 } },
  { kind: "pill", label: "Pill", icon: "▬", defaults: { w: 160, h: 56, fill: "#67e8f9", radius: 999 } },
  { kind: "card", label: "Card", icon: "▢", defaults: { w: 200, h: 130, fill: "#b49bff", radius: 14 } },
];

const SWATCHES = ["#7042f8", "#ec4899", "#67e8f9", "#b49bff", "#fcd34d", "#fb923c", "#1f2937", "#f9fafb"];

const STARTER: Shape[] = [
  { id: 1, kind: "card", x: 60, y: 70, w: 220, h: 140, fill: "#1f1430", radius: 14 },
  { id: 2, kind: "pill", x: 90, y: 100, w: 130, h: 32, fill: "#7042f8", radius: 999 },
  { id: 3, kind: "rect", x: 90, y: 152, w: 160, h: 10, fill: "#b49bff", radius: 4 },
  { id: 4, kind: "rect", x: 90, y: 172, w: 100, h: 10, fill: "#3a2466", radius: 4 },
  { id: 5, kind: "circle", x: 360, y: 60, w: 100, h: 100, fill: "#ec4899", radius: 999 },
  { id: 6, kind: "circle", x: 420, y: 130, w: 60, h: 60, fill: "#67e8f9", radius: 999 },
];

type Token = [string, string];

function toJsxLine(s: Shape): string {
  if (s.kind === "circle") {
    return `      <Circle x={${s.x}} y={${s.y}} size={${s.w}} fill="${s.fill}" />`;
  }
  if (s.kind === "pill") {
    return `      <Pill x={${s.x}} y={${s.y}} w={${s.w}} h={${s.h}} fill="${s.fill}" />`;
  }
  return `      <div style={{ position: "absolute", left: ${s.x}, top: ${s.y}, width: ${s.w}, height: ${s.h}, background: "${s.fill}", borderRadius: ${s.radius} }} />`;
}

function tokenizeShape(s: Shape): Token[] {
  const pad: Token = ["sp", "      "];
  if (s.kind === "circle") {
    return [
      pad,
      ["punct", "<"], ["type", "Circle"], ["sp", " "],
      ["prop", "x"], ["punct", "="], ["punct", "{"], ["num", String(s.x)], ["punct", "}"], ["sp", " "],
      ["prop", "y"], ["punct", "="], ["punct", "{"], ["num", String(s.y)], ["punct", "}"], ["sp", " "],
      ["prop", "size"], ["punct", "="], ["punct", "{"], ["num", String(s.w)], ["punct", "}"], ["sp", " "],
      ["prop", "fill"], ["punct", "="], ["str", `"${s.fill}"`], ["sp", " "],
      ["punct", "/>"],
    ];
  }
  if (s.kind === "pill") {
    return [
      pad,
      ["punct", "<"], ["type", "Pill"], ["sp", " "],
      ["prop", "x"], ["punct", "="], ["punct", "{"], ["num", String(s.x)], ["punct", "}"], ["sp", " "],
      ["prop", "y"], ["punct", "="], ["punct", "{"], ["num", String(s.y)], ["punct", "}"], ["sp", " "],
      ["prop", "w"], ["punct", "="], ["punct", "{"], ["num", String(s.w)], ["punct", "}"], ["sp", " "],
      ["prop", "h"], ["punct", "="], ["punct", "{"], ["num", String(s.h)], ["punct", "}"], ["sp", " "],
      ["prop", "fill"], ["punct", "="], ["str", `"${s.fill}"`], ["sp", " "],
      ["punct", "/>"],
    ];
  }
  return [
    pad,
    ["punct", "<"], ["type", "div"], ["sp", " "],
    ["prop", "style"], ["punct", "={{"], ["sp", " "],
    ["prop", "left"], ["punct", ":"], ["sp", " "], ["num", String(s.x)], ["punct", ","], ["sp", " "],
    ["prop", "top"], ["punct", ":"], ["sp", " "], ["num", String(s.y)], ["punct", ","], ["sp", " "],
    ["prop", "width"], ["punct", ":"], ["sp", " "], ["num", String(s.w)], ["punct", ","], ["sp", " "],
    ["prop", "height"], ["punct", ":"], ["sp", " "], ["num", String(s.h)], ["punct", ","], ["sp", " "],
    ["prop", "background"], ["punct", ":"], ["sp", " "], ["str", `"${s.fill}"`], ["punct", ","], ["sp", " "],
    ["prop", "borderRadius"], ["punct", ":"], ["sp", " "], ["num", String(s.radius)], ["sp", " "],
    ["punct", "}}"], ["sp", " "], ["punct", "/>"],
  ];
}

function generateCode(shapes: Shape[]): { plain: string; lines: Token[][] } {
  const plain = `export function Composition() {
  return (
    <div className="canvas">
${shapes.map(toJsxLine).join("\n")}
    </div>
  );
}`;

  const lines: Token[][] = [
    [["kw", "export"], ["sp", " "], ["kw", "function"], ["sp", " "], ["ident-prim", "Composition"], ["punct", "()"], ["sp", " "], ["punct", "{"]],
    [["sp", "  "], ["kw", "return"], ["sp", " "], ["punct", "("]],
    [["sp", "    "], ["punct", "<"], ["type", "div"], ["sp", " "], ["prop", "className"], ["punct", "="], ["str", '"canvas"'], ["punct", ">"]],
    ...shapes.map(tokenizeShape),
    [["sp", "    "], ["punct", "</"], ["type", "div"], ["punct", ">"]],
    [["sp", "  "], ["punct", ");"]],
    [["punct", "}"]],
  ];

  return { plain, lines };
}

const TOKEN_COLOR: Record<string, string> = {
  kw: "var(--code-kw)",
  type: "var(--code-type)",
  str: "var(--code-string)",
  prop: "var(--code-prop)",
  punct: "var(--code-punct)",
  num: "var(--code-num)",
  ident: "var(--code-ident)",
  "ident-prim": "var(--code-ident-prim)",
  comment: "var(--code-comment)",
  sp: "transparent",
};

function CanvasShape({
  shape,
  selected,
  onPointerDown,
}: {
  shape: Shape;
  selected: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  return (
    <div
      onPointerDown={onPointerDown}
      style={{
        position: "absolute",
        left: shape.x,
        top: shape.y,
        width: shape.w,
        height: shape.h,
        background: shape.fill,
        borderRadius: shape.radius,
        cursor: "grab",
        boxShadow: selected
          ? "0 0 0 2px var(--violet-glow), 0 0 24px var(--accent-glow-strong)"
          : "0 6px 16px rgba(0,0,0,0.35)",
        transition: "box-shadow 180ms ease",
        userSelect: "none",
        touchAction: "none",
      }}
    />
  );
}

function DesignCanvas({
  shapes,
  setShapes,
  selectedId,
  setSelectedId,
}: {
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
}) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ id: number; offsetX: number; offsetY: number } | null>(null);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!drag.current || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - drag.current.offsetX;
      const y = e.clientY - rect.top - drag.current.offsetY;
      setShapes((prev) =>
        prev.map((s) =>
          s.id === drag.current!.id
            ? {
                ...s,
                x: Math.max(0, Math.min(rect.width - s.w, Math.round(x))),
                y: Math.max(0, Math.min(rect.height - s.h, Math.round(y))),
              }
            : s
        )
      );
    }
    function onUp() {
      drag.current = null;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [setShapes]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Backspace" || e.key === "Delete") && selectedId != null) {
        const tag = (document.activeElement && document.activeElement.tagName) || "";
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        setShapes((prev) => prev.filter((s) => s.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, setShapes, setSelectedId]);

  const startDrag = useCallback(
    (e: React.PointerEvent, shape: Shape) => {
      e.stopPropagation();
      setSelectedId(shape.id);
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      drag.current = {
        id: shape.id,
        offsetX: e.clientX - rect.left - shape.x,
        offsetY: e.clientY - rect.top - shape.y,
      };
    },
    [setSelectedId]
  );

  return (
    <div
      ref={canvasRef}
      onPointerDown={() => setSelectedId(null)}
      style={{
        position: "relative",
        width: "100%",
        height: 380,
        borderRadius: 12,
        backgroundColor: "var(--editor-bg)",
        backgroundImage:
          "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px), radial-gradient(circle at 30% 20%, rgba(112,66,248,0.10), transparent 55%), radial-gradient(circle at 80% 80%, rgba(236,72,153,0.08), transparent 55%)",
        backgroundSize: "24px 24px, 24px 24px, auto, auto",
        border: "1px solid var(--editor-border)",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {shapes.map((s) => (
        <CanvasShape
          key={s.id}
          shape={s}
          selected={s.id === selectedId}
          onPointerDown={(e) => startDrag(e, s)}
        />
      ))}

      {shapes.length === 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--fg-5)",
            fontSize: 13,
            fontFamily: "ui-monospace, Menlo, monospace",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            pointerEvents: "none",
          }}
        >
          drop a shape from the palette →
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: 10,
          right: 12,
          fontSize: 10,
          fontFamily: "ui-monospace, Menlo, monospace",
          color: "var(--fg-5)",
          letterSpacing: "0.06em",
          pointerEvents: "none",
        }}
      >
        drag to move · ⌫ to delete
      </div>
    </div>
  );
}

function CodePanel({ lines, plain }: { lines: Token[][]; plain: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(plain).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };

  return (
    <div
      style={{
        background: "var(--editor-bg)",
        border: "1px solid var(--editor-border)",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: 380,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          background: "var(--editor-chrome)",
          borderBottom: "1px solid var(--editor-border)",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "#ff5f57" }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "#febc2e" }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "#28c840" }} />
        </div>
        <div
          style={{
            marginLeft: 8,
            padding: "3px 10px",
            fontSize: 11,
            color: "var(--fg-2)",
            fontFamily: "ui-monospace, Menlo, monospace",
            background: "rgba(180,155,255,0.06)",
            border: "1px solid var(--violet-border)",
            borderRadius: 6,
            letterSpacing: "0.04em",
          }}
        >
          Composition.tsx
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={copy}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 10px",
            fontSize: 11,
            fontFamily: "ui-monospace, Menlo, monospace",
            letterSpacing: "0.04em",
            color: copied ? "#22c55e" : "var(--fg-3)",
            background: "transparent",
            border: "1px solid " + (copied ? "#22c55e" : "var(--border-soft)"),
            borderRadius: 6,
            cursor: "pointer",
            transition: "all 180ms ease",
          }}
        >
          {copied ? "copied ✓" : "copy"}
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "14px 0",
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: 12.5,
          lineHeight: 1.6,
        }}
      >
        {lines.map((tokens, i) => (
          <div key={i} style={{ display: "flex", paddingLeft: 0, paddingRight: 14 }}>
            <span
              style={{
                flex: "0 0 36px",
                textAlign: "right",
                paddingRight: 14,
                color: "var(--code-gutter)",
                userSelect: "none",
                fontSize: 11,
              }}
            >
              {i + 1}
            </span>
            <span style={{ whiteSpace: "pre", flex: 1, minWidth: 0 }}>
              {tokens.map(([type, text], j) => (
                <span key={j} style={{ color: TOKEN_COLOR[type] || "var(--code-ident)" }}>
                  {text}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NumberRow({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 11,
        color: "var(--fg-3)",
        fontFamily: "ui-monospace, Menlo, monospace",
      }}
    >
      <span style={{ width: 16, color: "var(--fg-5)", letterSpacing: "0.08em" }}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        style={{ flex: 1, accentColor: "var(--violet-glow)" }}
      />
      <span style={{ width: 38, textAlign: "right", color: "var(--code-num)" }}>{value}</span>
    </label>
  );
}

function PaletteRail({
  onAdd,
  selected,
  onUpdate,
  onDelete,
  onClear,
}: {
  onAdd: (kind: ShapeKind) => void;
  selected: Shape | null;
  onUpdate: (patch: Partial<Shape>) => void;
  onDelete: () => void;
  onClear: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: 14,
        background: "var(--editor-bg)",
        border: "1px solid var(--editor-border)",
        borderRadius: 12,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--fg-4)",
            fontFamily: "ui-monospace, Menlo, monospace",
            marginBottom: 10,
          }}
        >
          Palette
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {SHAPE_KINDS.map((s) => (
            <button
              key={s.kind}
              onClick={() => onAdd(s.kind)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 10px",
                background: "rgba(180,155,255,0.04)",
                border: "1px solid var(--violet-border)",
                borderRadius: 8,
                color: "var(--fg-2)",
                fontSize: 12,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 180ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--violet-soft)";
                e.currentTarget.style.background = "rgba(112,66,248,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--violet-border)";
                e.currentTarget.style.background = "rgba(180,155,255,0.04)";
              }}
            >
              <span style={{ color: "var(--lavender)", fontSize: 14 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--editor-border)", paddingTop: 14 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--fg-4)",
            fontFamily: "ui-monospace, Menlo, monospace",
            marginBottom: 10,
          }}
        >
          Inspector
        </div>

        {selected ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                fontSize: 11,
                fontFamily: "ui-monospace, Menlo, monospace",
                color: "var(--fg-3)",
                letterSpacing: "0.04em",
              }}
            >
              <span style={{ color: "var(--code-type)" }}>{selected.kind}</span>
              <span style={{ color: "var(--code-punct)" }}> · </span>
              <span style={{ color: "var(--code-num)" }}>#{selected.id}</span>
            </div>

            <NumberRow label="W" value={selected.w} onChange={(v) => onUpdate({ w: v })} min={20} max={400} />
            <NumberRow label="H" value={selected.h} onChange={(v) => onUpdate({ h: v })} min={20} max={400} />
            <NumberRow label="R" value={selected.radius} onChange={(v) => onUpdate({ radius: v })} min={0} max={999} />

            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--fg-5)",
                  fontFamily: "ui-monospace, Menlo, monospace",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                FILL
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {SWATCHES.map((c) => (
                  <button
                    key={c}
                    onClick={() => onUpdate({ fill: c })}
                    aria-label={"Set fill " + c}
                    style={{
                      width: "100%",
                      height: 22,
                      borderRadius: 6,
                      background: c,
                      border:
                        selected.fill === c
                          ? "2px solid var(--violet-glow)"
                          : "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={onDelete}
              style={{
                marginTop: 4,
                padding: "7px 10px",
                background: "transparent",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#fda4af",
                borderRadius: 6,
                fontSize: 11,
                fontFamily: "ui-monospace, Menlo, monospace",
                letterSpacing: "0.06em",
                cursor: "pointer",
                transition: "all 180ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.10)";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
              }}
            >
              delete shape
            </button>
          </div>
        ) : (
          <div
            style={{
              fontSize: 11,
              color: "var(--fg-5)",
              lineHeight: 1.6,
              fontFamily: "ui-monospace, Menlo, monospace",
            }}
          >
            Tap a shape on the canvas to edit its size, radius, and fill.
          </div>
        )}
      </div>

      <button
        onClick={onClear}
        style={{
          marginTop: "auto",
          padding: "8px 10px",
          background: "transparent",
          border: "1px dashed var(--border-soft)",
          color: "var(--fg-4)",
          borderRadius: 6,
          fontSize: 11,
          fontFamily: "ui-monospace, Menlo, monospace",
          letterSpacing: "0.06em",
          cursor: "pointer",
        }}
      >
        clear canvas
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--fg-5)",
          fontFamily: "ui-monospace, Menlo, monospace",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "var(--fg-1)",
          fontFamily: "ui-monospace, Menlo, monospace",
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const Playground = () => {
  const [shapes, setShapes] = useState<Shape[]>(STARTER);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const nextIdRef = useRef(STARTER.length + 1);

  const selected = shapes.find((s) => s.id === selectedId) || null;

  const onAdd = (kind: ShapeKind) => {
    const def = SHAPE_KINDS.find((k) => k.kind === kind)!.defaults;
    const id = nextIdRef.current++;
    const offset = (shapes.length % 6) * 18;
    const newShape: Shape = {
      id,
      kind,
      x: 80 + offset,
      y: 60 + offset,
      w: def.w,
      h: def.h,
      fill: def.fill,
      radius: def.radius,
    };
    setShapes((prev) => [...prev, newShape]);
    setSelectedId(id);
  };

  const onUpdate = (patch: Partial<Shape>) => {
    if (selectedId == null) return;
    setShapes((prev) => prev.map((s) => (s.id === selectedId ? { ...s, ...patch } : s)));
  };

  const onDelete = () => {
    if (selectedId == null) return;
    setShapes((prev) => prev.filter((s) => s.id !== selectedId));
    setSelectedId(null);
  };

  const onClear = () => {
    setShapes([]);
    setSelectedId(null);
  };

  const { lines, plain } = useMemo(() => generateCode(shapes), [shapes]);

  return (
    <section id="playground" style={{ padding: "60px 80px", position: "relative", zIndex: 2 }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 80,
          right: 80,
          width: 280,
          height: 280,
          background: "radial-gradient(circle, var(--accent-glow-soft), transparent 60%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

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
        <span style={{ opacity: 0.7 }}>05</span>
        <span
          style={{
            width: 32,
            height: 1,
            background: "linear-gradient(90deg, var(--violet-glow), transparent)",
          }}
        />
        <span style={{ color: "var(--fg-3)", letterSpacing: "0.14em" }}>The lab</span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 32,
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: 640 }}>
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
            Live design playground.
            <br />
            <span className="text-gradient-projects">The component writes itself.</span>
          </h2>
          <p style={{ marginTop: 14, fontSize: 16, color: "var(--fg-4)", lineHeight: 1.6 }}>
            Drop shapes from the palette, drag them around, tune fill and radius. Every change re-emits a React
            component on the right — ready to copy into a real codebase.
          </p>
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", paddingBottom: 6 }}>
          <Stat label="Shapes" value={shapes.length} />
          <Stat label="Lines" value={lines.length} />
          <Stat label="Kind" value={selected ? selected.kind : "—"} />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr 1fr",
          gap: 18,
          alignItems: "stretch",
        }}
      >
        <PaletteRail
          onAdd={onAdd}
          selected={selected}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onClear={onClear}
        />
        <DesignCanvas
          shapes={shapes}
          setShapes={setShapes}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
        <CodePanel lines={lines} plain={plain} />
      </div>
    </section>
  );
};

export default Playground;
