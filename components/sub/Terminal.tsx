"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type LineKind =
  | "out"
  | "muted"
  | "err"
  | "ok"
  | "spacer"
  | "ascii"
  | "cmd";

type Line = { kind: LineKind; text?: string };

const PROMPT = "deadsec@portfolio:~$";

const BANNER: Line[] = [
  {
    kind: "ascii",
    text: [
      "  ____                 _                 ",
      " |  _ \\  ___  __ _  __| |___  ___  ___   ",
      " | | | |/ _ \\/ _` |/ _` / __|/ _ \\/ __|  ",
      " | |_| |  __/ (_| | (_| \\__ \\  __/ (__   ",
      " |____/ \\___|\\__,_|\\__,_|___/\\___|\\___|  ",
    ].join("\n"),
  },
  {
    kind: "muted",
    text: "v1.0 · Type 'help' to list commands. 'exit' to close.",
  },
  { kind: "spacer" },
];

type CommandResult = Line[] | "__CLEAR__" | "__EXIT__";
type Command = (arg?: string) => CommandResult;

const COMMANDS: Record<string, Command> = {
  help: () => [
    { kind: "out", text: "Available commands:" },
    { kind: "muted", text: "  help              — this list" },
    { kind: "muted", text: "  whoami            — who's behind this site" },
    { kind: "muted", text: "  ls                — list sections" },
    { kind: "muted", text: "  cat about.md      — long-form about" },
    { kind: "muted", text: "  goto [section]    — jump to a section" },
    { kind: "muted", text: "  theme [name]      — cyber | solar | mono" },
    { kind: "muted", text: "  coffee            — for the long nights" },
    { kind: "muted", text: "  sudo              — escalate (try it)" },
    { kind: "muted", text: "  secret            — there's something here" },
    { kind: "muted", text: "  clear             — clear screen" },
    { kind: "muted", text: "  exit              — close terminal" },
  ],

  whoami: () => [
    {
      kind: "ok",
      text: "uid=1337(deadsec) gid=1337(designers) groups=engineers,designers,coffee",
    },
    { kind: "out", text: "Deepak Aravindan — fullstack engineer + designer." },
    {
      kind: "out",
      text: "I write boring backends so the frontend can be exciting.",
    },
  ],

  ls: () => [
    { kind: "muted", text: "drwxr-xr-x  about/        section 01" },
    { kind: "muted", text: "drwxr-xr-x  skills/       section 02" },
    { kind: "muted", text: "drwxr-xr-x  projects/     section 03" },
    { kind: "muted", text: "drwxr-xr-x  playground/   section 04" },
    { kind: "muted", text: "drwxr-xr-x  contact/      section 05" },
    { kind: "muted", text: "-rw-r--r--  resume.pdf    432K" },
    { kind: "muted", text: "-rw-r--r--  about.md      `cat` me" },
    { kind: "muted", text: "-rwx------  .secret       restricted" },
  ],

  "cat about.md": () => [
    { kind: "out", text: "# Deepak Aravindan" },
    { kind: "spacer" },
    {
      kind: "out",
      text: "I build interfaces that feel alive — not because",
    },
    {
      kind: "out",
      text: "animation is cool, but because friction loses users.",
    },
    { kind: "spacer" },
    {
      kind: "out",
      text: "Currently freelancing. Previously: 3 startups, 2 of",
    },
    { kind: "out", text: "which I shipped to production solo." },
    { kind: "spacer" },
    {
      kind: "muted",
      text: "Stack: React, Next.js, NestJS, TypeScript, Postgres.",
    },
  ],

  goto: (arg) => {
    const map: Record<string, string> = {
      about: "#about-me",
      "about-me": "#about-me",
      skills: "#skills",
      projects: "#projects",
      playground: "#playground",
      contact: "#contact",
    };
    if (!arg)
      return [
        {
          kind: "err",
          text: "usage: goto [about|skills|projects|playground|contact]",
        },
      ];
    const hash = map[arg.toLowerCase()];
    if (!hash)
      return [{ kind: "err", text: `goto: unknown section '${arg}'` }];
    setTimeout(() => {
      window.location.hash = hash;
    }, 150);
    return [{ kind: "ok", text: `→ jumping to ${arg}…` }];
  },

  theme: (arg) => {
    const valid = ["cyber", "solar", "mono"];
    if (!arg || !valid.includes(arg.toLowerCase())) {
      return [{ kind: "err", text: "usage: theme [cyber|solar|mono]" }];
    }
    document.documentElement.setAttribute("data-theme", arg.toLowerCase());
    return [{ kind: "ok", text: `theme set → ${arg}` }];
  },

  coffee: () => [
    {
      kind: "ascii",
      text: [
        "        )  (",
        "       (   ) )",
        "        ) ( (",
        "      _______)_",
        "   .-'---------|",
        "  ( C|/\\/\\/\\/\\/|",
        "   '-./\\/\\/\\/\\/|",
        "     '_________'",
        "      '-------'",
      ].join("\n"),
    },
    { kind: "muted", text: "☕ on the house. now back to work." },
  ],

  sudo: () => [
    { kind: "err", text: "deadsec is not in the sudoers file." },
    { kind: "err", text: "This incident will be reported." },
    { kind: "muted", text: "(just kidding. but seriously, hire me.)" },
  ],

  secret: () => {
    document.documentElement.style.transition = "filter 200ms ease";
    document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
    setTimeout(() => {
      document.documentElement.style.filter = "";
    }, 800);
    return [
      { kind: "ok", text: "ACCESS GRANTED ███████████████ 100%" },
      {
        kind: "out",
        text: "You found it. There's nothing here, but I appreciate",
      },
      { kind: "out", text: "that you looked. Want to work together?" },
      { kind: "muted", text: "→ deepsprojects10@gmail.com" },
    ];
  },

  clear: () => "__CLEAR__",
  exit: () => "__EXIT__",
};

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const Terminal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<Line[]>(BANNER);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [pos, setPos] = useState({ x: 32, y: 32 });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  // ---- Global triggers ----------------------------------------------
  useEffect(() => {
    let buffer = "";
    let bufferTimer: ReturnType<typeof setTimeout> | null = null;
    const TRIGGERS = ["whoami", "sudo"];
    let konamiIdx = 0;

    const runTrigger = (trig: string) => {
      const fn = COMMANDS[trig];
      const out = fn ? fn() : [];
      setOpen(true);
      setHistory((h) => [
        ...h,
        { kind: "cmd", text: trig },
        ...(Array.isArray(out) ? out : []),
        { kind: "spacer" },
      ]);
    };

    const onKey = (e: KeyboardEvent) => {
      const tag =
        (document.activeElement && document.activeElement.tagName) || "";
      const inField = tag === "INPUT" || tag === "TEXTAREA";

      if ((e.metaKey || e.ctrlKey) && e.key === "`") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }

      if (inField || open) return;

      if (e.key === KONAMI[konamiIdx]) {
        konamiIdx++;
        if (konamiIdx === KONAMI.length) {
          konamiIdx = 0;
          setOpen(true);
          setHistory((h) => [
            ...h,
            { kind: "ok", text: "✦ konami code accepted ✦" },
            { kind: "spacer" },
          ]);
        }
      } else if (e.key !== "Shift") {
        konamiIdx = 0;
      }

      if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
        buffer += e.key.toLowerCase();
        if (buffer.length > 8) buffer = buffer.slice(-8);
        if (bufferTimer) clearTimeout(bufferTimer);
        bufferTimer = setTimeout(() => {
          buffer = "";
        }, 1200);
        for (const trig of TRIGGERS) {
          if (buffer.endsWith(trig)) {
            buffer = "";
            runTrigger(trig);
            break;
          }
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (bufferTimer) clearTimeout(bufferTimer);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const runCommand = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    setHistory((h) => [...h, { kind: "cmd", text: trimmed }]);
    setCmdHistory((h) => [...h, trimmed]);
    setHistoryIdx(-1);

    let result: CommandResult;
    if (COMMANDS[trimmed]) {
      result = COMMANDS[trimmed]();
    } else {
      const [cmd, ...rest] = trimmed.split(/\s+/);
      const arg = rest.join(" ");
      if (COMMANDS[cmd]) {
        result = COMMANDS[cmd](arg);
      } else {
        result = [
          {
            kind: "err",
            text: `command not found: ${cmd}. type 'help' for a list.`,
          },
        ];
      }
    }

    if (result === "__CLEAR__") {
      setHistory([]);
      return;
    }
    if (result === "__EXIT__") {
      setHistory((h) => [
        ...h,
        { kind: "muted", text: "goodbye." },
        { kind: "spacer" },
      ]);
      setTimeout(() => setOpen(false), 250);
      return;
    }
    setHistory((h) => [...h, ...result, { kind: "spacer" }]);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(input);
    setInput("");
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next =
        historyIdx === -1
          ? cmdHistory.length - 1
          : Math.max(0, historyIdx - 1);
      setHistoryIdx(next);
      setInput(cmdHistory[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const next = historyIdx + 1;
      if (next >= cmdHistory.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(next);
        setInput(cmdHistory[next]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const partial = input.trim();
      if (!partial) return;
      const match = Object.keys(COMMANDS).find((k) => k.startsWith(partial));
      if (match) setInput(match);
    }
  };

  const onDragMove = useCallback((e: PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    setPos({
      x: Math.max(8, drag.current.origX - dx),
      y: Math.max(8, drag.current.origY - dy),
    });
  }, []);

  const onDragEnd = useCallback(() => {
    drag.current = null;
    window.removeEventListener("pointermove", onDragMove);
    window.removeEventListener("pointerup", onDragEnd);
  }, [onDragMove]);

  const onDragStart = (e: React.PointerEvent) => {
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    };
    window.addEventListener("pointermove", onDragMove);
    window.addEventListener("pointerup", onDragEnd);
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: pos.y,
        right: pos.x,
        zIndex: 400,
        width: "min(560px, calc(100vw - 24px))",
        height: "min(420px, calc(100vh - 100px))",
        background: "var(--editor-bg)",
        border: "1px solid var(--violet-soft)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow:
          "0 30px 80px rgba(0,0,0,0.6), 0 0 60px var(--accent-glow-strong)",
        animation: "pf-modal-rise 240ms cubic-bezier(0.25, 1, 0.5, 1) both",
        display: "flex",
        flexDirection: "column",
        fontFamily: "ui-monospace, Menlo, Consolas, monospace",
      }}
    >
      {/* Title bar (draggable) */}
      <div
        onPointerDown={onDragStart}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "9px 12px",
          background: "var(--editor-chrome)",
          borderBottom: "1px solid var(--editor-border)",
          cursor: "grab",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <span
            onClick={() => setOpen(false)}
            style={{
              width: 11,
              height: 11,
              borderRadius: 999,
              background: "#ff5f57",
              cursor: "pointer",
            }}
          />
          <span
            style={{
              width: 11,
              height: 11,
              borderRadius: 999,
              background: "#febc2e",
            }}
          />
          <span
            style={{
              width: 11,
              height: 11,
              borderRadius: 999,
              background: "#28c840",
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 11,
            color: "var(--fg-3)",
            letterSpacing: "0.06em",
          }}
        >
          ~/portfolio — zsh — 80×24
        </div>
        <span
          style={{
            fontSize: 9,
            color: "var(--fg-5)",
            letterSpacing: "0.1em",
          }}
        >
          esc to close
        </span>
      </div>

      {/* Output stream */}
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 16px",
          fontSize: 13,
          lineHeight: 1.55,
          color: "var(--fg-2)",
          background: "var(--editor-bg)",
        }}
      >
        {history.map((line, i) => (
          <TermLine key={i} line={line} />
        ))}

        <form
          onSubmit={onSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 2,
          }}
        >
          <span style={{ color: "var(--code-kw)", flexShrink: 0 }}>
            {PROMPT}
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onInputKey}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--fg-1)",
              fontFamily: "inherit",
              fontSize: "inherit",
              padding: 0,
              caretColor: "var(--violet-glow)",
            }}
          />
        </form>
      </div>
    </div>
  );
};

const TermLine: React.FC<{ line: Line }> = ({ line }) => {
  if (line.kind === "spacer") {
    return <div style={{ height: 8 }} />;
  }
  if (line.kind === "ascii") {
    return (
      <pre
        style={{
          margin: 0,
          color: "var(--lavender)",
          fontSize: 11,
          lineHeight: 1.15,
          whiteSpace: "pre",
        }}
      >
        {line.text}
      </pre>
    );
  }
  if (line.kind === "cmd") {
    return (
      <div style={{ display: "flex", gap: 6 }}>
        <span style={{ color: "var(--code-kw)" }}>{PROMPT}</span>
        <span style={{ color: "var(--fg-1)" }}>{line.text}</span>
      </div>
    );
  }
  const colorMap: Record<string, string> = {
    out: "var(--fg-2)",
    muted: "var(--fg-5)",
    err: "#fda4af",
    ok: "#86efac",
  };
  return (
    <div
      style={{
        color: colorMap[line.kind] || "var(--fg-2)",
        whiteSpace: "pre-wrap",
      }}
    >
      {line.text}
    </div>
  );
};

export default Terminal;
