"use client";

import React, { useEffect, useState } from "react";

const EMAIL_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmai.com": "gmail.com",
  "yhaoo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yahho.com": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "hotnail.com": "hotmail.com",
  "outloo.com": "outlook.com",
  "outlok.com": "outlook.com",
};

const SUBJECT_PRESETS = [
  "Just saying hi",
  "Collab idea",
  "Job opportunity",
  "Freelance project",
  "Question about a project",
];

function suggestEmailFix(email: string): string | null {
  if (!email || !email.includes("@")) return null;
  const [local, domain] = email.split("@");
  if (!domain) return null;
  if (EMAIL_TYPOS[domain.toLowerCase()]) {
    return `${local}@${EMAIL_TYPOS[domain.toLowerCase()]}`;
  }
  return null;
}

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  multiline?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  hint?: React.ReactNode;
  suffix?: React.ReactNode;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
};

function FormField({
  label,
  name,
  type = "text",
  multiline = false,
  value,
  onChange,
  placeholder,
  hint,
  suffix,
  focused,
  onFocus,
  onBlur,
}: FormFieldProps) {
  const sharedStyle: React.CSSProperties = {
    background: "rgba(3,0,20,0.4)",
    border: focused ? "1px solid var(--violet-glow)" : "1px solid var(--border-soft)",
    color: "var(--fg-2)",
    fontSize: 14,
    borderRadius: 10,
    width: "100%",
    padding: "12px 14px",
    outline: "none",
    transition: "border 200ms ease, box-shadow 200ms ease",
    boxShadow: focused ? "0 0 0 4px var(--accent-glow-strong)" : "none",
    fontFamily: "inherit",
    resize: multiline ? "vertical" : "none",
    minHeight: multiline ? 110 : undefined,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <label
          htmlFor={name}
          style={{
            fontSize: 12,
            color: "var(--fg-1)",
            fontWeight: 500,
            letterSpacing: "0.04em",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {label}
          {focused && (
            <span
              style={{
                fontSize: 9,
                color: "var(--lavender)",
                fontFamily: "ui-monospace, Menlo, monospace",
                letterSpacing: "0.08em",
                opacity: 0.7,
              }}
            >
              ▸ editing
            </span>
          )}
        </label>
        {suffix}
      </div>
      <div style={{ position: "relative" }}>
        {multiline ? (
          <textarea
            id={name}
            name={name}
            rows={4}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            required
            style={sharedStyle}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            required
            style={sharedStyle}
          />
        )}
      </div>
      {hint && (
        <div
          style={{
            fontSize: 11,
            color: "var(--lavender)",
            fontFamily: "ui-monospace, Menlo, monospace",
            letterSpacing: "0.04em",
            marginTop: 2,
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}

type SendState = "idle" | "sending" | "sent" | "error";

function SendButton({ state }: { state: SendState }) {
  const label = {
    idle: "Send message",
    sending: "Sending…",
    sent: "Sent",
    error: "Try again",
  }[state];

  return (
    <button
      type="submit"
      disabled={state === "sending" || state === "sent"}
      style={{
        position: "relative",
        background:
          state === "sent"
            ? "rgba(34,197,94,0.18)"
            : "linear-gradient(180deg, rgba(60,8,126,0) 0%, rgba(60,8,126,0.32) 100%), rgba(112,66,248,0.12)",
        boxShadow: state === "sent" ? "inset 0 0 12px rgba(34,197,94,0.25)" : "inset 0 0 12px rgba(191,151,255,0.24)",
        color: state === "sent" ? "#86efac" : "var(--fg-1)",
        padding: "14px 26px",
        borderRadius: 10,
        border: state === "sent" ? "1px solid rgba(34,197,94,0.4)" : "1px solid var(--violet-border)",
        font: "inherit",
        fontWeight: 600,
        fontSize: 13,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: state === "sending" || state === "sent" ? "default" : "pointer",
        width: "100%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        transition: "all 320ms cubic-bezier(0.25, 1, 0.5, 1)",
      }}
    >
      {state === "sending" && (
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            border: "2px solid rgba(180,155,255,0.3)",
            borderTopColor: "var(--violet-glow)",
            animation: "pf-spin 800ms linear infinite",
          }}
        />
      )}
      {state === "sent" && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {state === "idle" && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      )}
      {label}
    </button>
  );
}

function SignalChip({ label, value, dotColor }: { label: string; value: string; dotColor: string }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 130,
        padding: "10px 14px",
        borderRadius: 10,
        background: "rgba(180,155,255,0.04)",
        border: "1px solid var(--violet-border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: 999,
            background: dotColor,
            boxShadow: `0 0 8px ${dotColor}`,
          }}
        />
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--fg-5)",
            fontFamily: "ui-monospace, Menlo, monospace",
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          marginTop: 4,
          color: "var(--fg-1)",
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "ui-monospace, Menlo, monospace",
          letterSpacing: "0.02em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ChannelLink({
  href,
  icon,
  label,
  value,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        background: "rgba(3,0,20,0.4)",
        border: "1px solid var(--border-soft)",
        borderRadius: 10,
        textDecoration: "none",
        color: "var(--fg-2)",
        transition: "all 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--violet-soft)";
        e.currentTarget.style.background = "rgba(112,66,248,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-soft)";
        e.currentTarget.style.background = "rgba(3,0,20,0.4)";
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          flexShrink: 0,
          borderRadius: 8,
          background: "rgba(180,155,255,0.08)",
          border: "1px solid var(--violet-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--lavender)",
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--fg-4)",
            fontFamily: "ui-monospace, Menlo, monospace",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--fg-2)",
            fontFamily: "ui-monospace, Menlo, monospace",
            letterSpacing: "0.02em",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </div>
      </div>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "var(--fg-5)" }}
      >
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    </a>
  );
}

function SignalPanel() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  const fmt = now
    ? now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      })
    : "--:--";

  return (
    <div
      style={{
        padding: "28px 24px",
        background: "rgba(3,0,20,0.4)",
        border: "1px solid var(--violet-border)",
        borderRadius: 14,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        gap: 22,
      }}
    >
      <div>
        <h4 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.01em" }}>
          Let&apos;s connect.
        </h4>
        <p style={{ margin: "8px 0 0", color: "var(--fg-4)", fontSize: 14, lineHeight: 1.6, maxWidth: 340 }}>
          I&apos;m currently looking for new opportunities, my inbox is always open. Whether you have a question or just
          want to say hi, I&apos;ll try my best to get back to you.
        </p>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <SignalChip label="Response time" value="under 24h" dotColor="#22c55e" />
        <SignalChip label="Local time" value={fmt + " IST"} dotColor="var(--lavender)" />
      </div>

      <div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--fg-4)",
            fontFamily: "ui-monospace, Menlo, monospace",
            marginBottom: 12,
          }}
        >
          Direct channels
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <ChannelLink
            href="mailto:deepsprojects10@gmail.com"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            }
            label="Email"
            value="deepsprojects10@gmail.com"
          />
          <ChannelLink
            href="https://github.com/Deepak15deadsec"
            // eslint-disable-next-line @next/next/no-img-element
            icon={<img src="/github-icon.svg" alt="" style={{ width: 14, height: 14 }} />}
            label="GitHub"
            value="github.com/Deepak15deadsec"
          />
          <ChannelLink
            href="https://www.linkedin.com/in/deepak-aravindan-516919237/"
            // eslint-disable-next-line @next/next/no-img-element
            icon={<img src="/linkedin-icon.svg" alt="" style={{ width: 14, height: 14 }} />}
            label="LinkedIn"
            value="in/deepak-aravindan"
          />
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const [values, setValues] = useState({ email: "", subject: "", message: "" });
  const [focused, setFocused] = useState<string | null>(null);
  const [state, setState] = useState<SendState>("idle");

  const set =
    (k: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [k]: e.target.value }));
  const focus = (k: string) => () => setFocused(k);
  const blur = () => setFocused(null);

  const emailFix = suggestEmailFix(values.email);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.email || !values.subject || !values.message) return;
    setState("sending");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setState("sent");
        setTimeout(() => {
          setState("idle");
          setValues({ email: "", subject: "", message: "" });
        }, 2600);
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FormField
        label="Your email"
        name="email"
        type="email"
        value={values.email}
        onChange={set("email")}
        focused={focused === "email"}
        onFocus={focus("email")}
        onBlur={blur}
        placeholder="you@elsewhere.com"
        hint={
          emailFix ? (
            <span>
              did you mean{" "}
              <button
                type="button"
                onClick={() => setValues((v) => ({ ...v, email: emailFix }))}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--violet-glow)",
                  cursor: "pointer",
                  padding: 0,
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  textDecoration: "underline",
                }}
              >
                {emailFix}
              </button>
              ?
            </span>
          ) : null
        }
      />

      <FormField
        label="Subject"
        name="subject"
        value={values.subject}
        onChange={set("subject")}
        focused={focused === "subject"}
        onFocus={focus("subject")}
        onBlur={blur}
        placeholder="What's this about?"
      />

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: -8 }}>
        {SUBJECT_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setValues((v) => ({ ...v, subject: p }))}
            style={{
              padding: "5px 11px",
              fontSize: 11,
              fontFamily: "ui-monospace, Menlo, monospace",
              letterSpacing: "0.04em",
              background:
                values.subject === p
                  ? "var(--violet-fill, rgba(112,66,248,0.18))"
                  : "rgba(180,155,255,0.04)",
              border: values.subject === p ? "1px solid var(--violet-soft)" : "1px solid var(--border-soft)",
              color: values.subject === p ? "var(--lavender)" : "var(--fg-4)",
              borderRadius: 999,
              cursor: "pointer",
              transition: "all 180ms ease",
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <FormField
        label="Message"
        name="message"
        multiline
        value={values.message}
        onChange={set("message")}
        focused={focused === "message"}
        onFocus={focus("message")}
        onBlur={blur}
        placeholder="Let's talk about…"
        suffix={
          <span
            style={{
              fontSize: 10,
              color: "var(--fg-5)",
              fontFamily: "ui-monospace, Menlo, monospace",
              letterSpacing: "0.04em",
            }}
          >
            {values.message.length} chars
          </span>
        }
      />

      <SendButton state={state} />
    </form>
  );
}

const EmailSection = () => {
  return (
    <section id="contact" className="pf-section">
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
        <span style={{ opacity: 0.7 }}>04</span>
        <span
          style={{
            width: 32,
            height: 1,
            background: "linear-gradient(90deg, var(--violet-glow), transparent)",
          }}
        />
        <span style={{ color: "var(--fg-3)", letterSpacing: "0.14em" }}>Open inbox</span>
      </div>

      <h2 style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg-1)", margin: 0, lineHeight: 1.05, marginBottom: 8 }}>
        Say hi.
      </h2>
      <p style={{ margin: "0 0 40px", fontSize: 16, color: "var(--fg-4)", lineHeight: 1.6, maxWidth: 540 }}>
        The form below works. The page reacts as you type — typos get caught, presets are one tap away. Try it.
      </p>

      <div className="pf-contact-grid">
        <ContactForm />
        <SignalPanel />
      </div>
    </section>
  );
};

export default EmailSection;
