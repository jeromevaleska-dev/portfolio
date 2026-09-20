"use client";

import React, { useEffect, useState } from "react";

type Project = {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  tags: string[];
  category: "design" | "engineering" | "fullstack" | "ai";
  image: string | null;
  shortDesc: string;
  problem: string;
  solution: string;
  role: string;
  stack: string[];
  process: string[];
  challenge: string;
  flag?: string;
  link?: string;
  gallery?: { src: string; caption: string }[];
};

const PROJECTS: Project[] = [
  {
    id: "vms",
    title: "Intelligent Video Management System",
    subtitle: "Variphi · AI surveillance platform · open source",
    year: "2026",
    tags: ["Computer Vision", "FastAPI", "Real-time Video", "Self-hosted"],
    category: "engineering",
    image: "/surveillance.png",
    link: "https://github.com/VariPhiGen/Intelligent-Video-Management-System",
    shortDesc:
      "A self-hosted NVR with AI built in — ONVIF discovery, 24/7 recording, object / plate / face detection, and plain-English forensic search across weeks of footage. Shipped to an industrial client, then open-sourced under AGPL-3.0.",
    problem:
      "An industrial site was running nine cameras into a vendor NVR that could record and nothing else. Finding one truck at one gate meant a person scrubbing hours of night footage. Cloud VMS products solved the search problem, but the footage legally could not leave the premises — and per-camera licensing made them unaffordable the moment the site wanted to grow past nine.",
    solution:
      "A VMS that runs entirely on the customer’s own hardware via Docker Compose, split into microservices along the seams that actually matter: one RTSP pull per camera through a MediaMTX relay, a frame broker that decodes each stream exactly once and shares the pixels, continuous 60-second codec-copy recording, and YOLO-via-OpenVINO analytics that runs on ordinary CPUs. CLIP embeddings in pgvector turn “white truck at the weighbridge after dark” into a query instead of an afternoon.",
    role: "Product owner & lead engineer — end to end, from camera ingest to console",
    stack: [
      "FastAPI",
      "React",
      "YOLO",
      "OpenVINO",
      "CLIP",
      "PostgreSQL + pgvector",
      "Valkey/Redis",
      "MediaMTX",
      "ffmpeg",
      "Keycloak",
      "Docker",
    ],
    process: [
      "Started at the camera, not the UI. ONVIF discovery, encrypted credentials, and a single Postgres table covering a camera’s whole lifecycle — discovered, registered, streaming, offline. Every service above it reads one source of truth.",
      "Made CPU the design constraint on purpose. One decode per camera in a shared frame broker, recording by codec-copy with zero re-encode, sub-stream for storage and main-stream for viewing, detection through OpenVINO. Nine cameras with live AI on a box with no GPU.",
      "Built the console as an operator tool, not a dashboard. Live grid at ~2–4s behind real time, click-to-expand and Esc to return, tiles that reconnect themselves, five tiers of role-based access and full audit logging — because the people reviewing footage and the people configuring cameras are never the same people.",
    ],
    challenge:
      "Latency, storage and AI pull in opposite directions: low-latency live view wants short segments, recording wants long ones, and analytics wants decoded frames — by far the most expensive thing in the pipeline. The fix was to stop treating them as three pipelines. MediaMTX pulls each camera exactly once; the NVR writes MPEG-TS segments by codec-copy so recording costs almost nothing; the frame broker decodes that same single stream and fans the pixels out to motion, detection and embedding consumers. HEVC→H.264 transcode happens only at extraction time, for the handful of clips a human actually exports.",
  },
  {
    id: "event-agent",
    title: "Live Event Assistant",
    subtitle: "Variphi · RAG agent over a live event stream",
    year: "2026",
    tags: ["RAG", "LLM", "Embeddings", "Real-time"],
    category: "ai",
    image: "/ai-assistant-dashboard.png",
    gallery: [
      {
        src: "/ai-assistant-chat.png",
        caption:
          "An aggregate question answered in one turn — counts broken out by violation type, plus a real sample event with location, timestamp and resolution status so the operator can verify it against the footage.",
      },
    ],
    shortDesc:
      "A chat assistant docked inside a live surveillance analytics dashboard. Ask “which location had the most events today?” in plain English and get counts, breakdowns and a verifiable sample event — instead of setting four filters and doing the arithmetic yourself.",
    problem:
      "The analytics dashboard was working exactly as designed: 6,835 events across 24 locations and a dozen violation types, all filterable. But every question an operator actually had — which gate is worst today, what did that camera catch last, is stray parking getting worse — meant picking a date range, selecting locations, reading four charts and doing the counting in your head. The data was all there and nobody was asking it anything.",
    solution:
      "An assistant docked into the dashboard that answers in plain English. Events are embedded as they land, so the index trails the live stream by seconds rather than a nightly batch; a question retrieves the relevant slice and the model composes the answer around aggregates the database computed. The model layer is pluggable — a self-hosted open model when event data is not allowed to leave the customer’s hardware, OpenAI when it is.",
    role: "AI engineer — retrieval pipeline, agent layer and the chat surface",
    stack: [
      "RAG",
      "Embeddings",
      "Vector search",
      "Self-hosted LLM",
      "OpenAI API",
      "FastAPI",
      "React",
      "PostgreSQL",
    ],
    process: [
      "Started from the questions, not the model. Watched what operators were already doing with the filters for a week — nearly all of it collapsed into four shapes: most/least by location, latest by camera, counts by violation type, and what happened inside a window. Retrieval got built for those four, properly, instead of for everything badly.",
      "Embedded events at write time rather than batch-indexing overnight. An event is searchable seconds after the camera sees it — which is the entire point. An assistant that can only answer about yesterday is just a report with a chat box on it.",
      "Made every answer auditable. Responses carry the numbers that were counted and a real sample event — location, timestamp, resolution status — so an operator can click through to the footage rather than take a paragraph on faith.",
    ],
    challenge:
      "Grounding. Hand an LLM a pile of retrieved events and it will cheerfully miscount them or invent a camera that was never installed — and counting is both the thing language models are worst at and exactly what “which location had the most events today” is asking for. So the counting moved out of the model entirely: retrieval returns aggregates computed in the database, and the model’s job is narrowed to phrasing them and choosing a representative example. It reads like a conversation, but the numbers in it are never the model’s opinion.",
  },
  {
    id: "social",
    title: "Social Media Platform",
    subtitle: "FreeLance · UI/UX + RN prototype",
    year: "2024",
    tags: ["React Native", "UI/UX", "Cross-platform"],
    category: "design",
    image: "/reactsocialmedia1.png",
    shortDesc:
      "FreeLance project worked using react-native so it can be displayed in mobile (android/ios) as well as web. More of just UI no backend involved.",
    problem:
      "Client wanted to validate a social-feed concept across mobile and web before committing to a backend. They needed a click-through prototype that felt like a shipped product, not Figma.",
    solution:
      "Built the entire interaction layer in React Native (with react-native-web for the browser target). Hand-rolled the feed, story rail, comment thread, and DM screens. Local state only — but theming, gestures and transitions are production-quality.",
    role: "Designer + Mobile Engineer",
    stack: ["React Native", "react-native-web", "Reanimated 3", "Figma"],
    process: [
      "Three Figma rounds with the client to lock down feed density, story-rail behavior, and a system for empty states.",
      "Tokenized the design system in code — spacing, radius, color, and motion as plain constants so the client's eventual eng team could lift it cleanly.",
      "Spent the last week pushing on transitions: tap-and-hold preview, swipe-to-dismiss DM, optimistic likes. The little stuff that sells a prototype.",
    ],
    challenge:
      "Keeping a single codebase visually identical on iOS, Android and web. Solved with a tiny `Platform` shim that picks between native and DOM components for the things that genuinely needed it (status bar, scroll handling).",
  },
  {
    id: "foodorder",
    title: "Food Order Website",
    subtitle: "Fullstack · MERN + Nginx",
    year: "2023",
    tags: ["React", "Node.js", "MongoDB", "Nginx"],
    category: "fullstack",
    image: "/foodorder.png",
    shortDesc:
      "This is a fullstack project. Where frontend is created by react and backend used is Node, Expressjs and mongodb. Deployed using Nginx.",
    problem:
      "A small restaurant group needed an order-ahead site that felt closer to UberEats than to a Wix template. Budget couldn't support a 3rd-party platform.",
    solution:
      "MERN stack with a cart-as-state-machine on the frontend (idle → adding → checking-out → submitted → tracking). Stripe webhooks drive order state on the backend. Restaurant dashboard for live order management.",
    role: "Fullstack Engineer",
    stack: ["React", "Node.js", "Express", "MongoDB", "Stripe", "Nginx", "PM2"],
    process: [
      "Designed the menu browse flow first — generous photography, sticky category nav, one-tap add. The conversion lives here.",
      "Built the cart and checkout end-to-end before touching the dashboard. Treat the customer surface as P0.",
      "Hardened the deploy: PM2 for the Node process, Nginx for static + reverse proxy, daily Mongo backups to S3.",
    ],
    challenge:
      "Mobile checkout abandonment. First version had 38% drop at the address step. Cut it to 11% by inlining address autocomplete, persisting cart in localStorage, and removing the account-creation gate.",
  },
  {
    id: "nikedash",
    title: "Inspired Nike Analytics",
    subtitle: "Fullstack · NestJS + TS dashboard",
    year: "2024",
    tags: ["TypeScript", "React", "NestJS", "Analytics"],
    category: "engineering",
    image: "/nikedash.png",
    shortDesc:
      "The dashboard is developed using typescript. Frontend React while backend used is nestjs which is a upcoming secure framework.",
    problem:
      "A study in shipping an internal analytics dashboard — what does it take to make data-dense screens feel calm? Built as a personal challenge after seeing Nike's internal tooling design.",
    solution:
      "NestJS API exposing aggregated KPIs from a Postgres warehouse. React + Recharts on the frontend. Strong typing end-to-end — the API schema generates frontend TypeScript types so a chart can't ask for a field that doesn't exist.",
    role: "Fullstack Engineer + Designer",
    stack: ["TypeScript", "React", "NestJS", "PostgreSQL", "Recharts", "Tailwind"],
    process: [
      "Reverse-engineered the visual language from a few public screens. Locked in the spacing, type and palette before writing any code.",
      "Wrote the API schema in NestJS, generated types via openapi-generator. Single source of truth.",
      "Charts last. Tempting to start there, but the layout and typography do more work than any chart will.",
    ],
    challenge:
      "Performance with 12 simultaneous chart widgets re-rendering on filter change. Solved by switching to memoised selectors + a single shared dataset subscription, instead of each chart fetching independently.",
  },
];

const FILTERS = [
  { id: "all", label: "All work" },
  { id: "ai", label: "AI agents" },
  { id: "design", label: "Design" },
  { id: "engineering", label: "Engineering" },
  { id: "fullstack", label: "Fullstack" },
];

function ProjectCard({ project, onOpen, index }: { project: Project; onOpen: (p: Project) => void; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => onOpen(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 14,
        border: hovered ? "1px solid var(--violet-soft)" : "1px solid var(--border-soft)",
        background: "rgba(3,0,20,0.4)",
        boxShadow: hovered
          ? "0 24px 60px rgba(0,0,0,0.55), 0 0 30px var(--accent-glow-strong)"
          : "0 8px 24px rgba(0,0,0,0.3)",
        padding: 0,
        cursor: "pointer",
        textAlign: "left",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 320ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 320ms ease, border 320ms ease",
        animation: `pf-fade-in 600ms ${index * 100}ms ease-out both`,
        display: "flex",
        flexDirection: "column",
        color: "inherit",
        font: "inherit",
      }}
    >
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden" }}>
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={project.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 480ms cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, rgba(112,66,248,0.3) 0%, rgba(60,8,126,0.45) 50%, rgba(236,72,153,0.25) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "ui-monospace, Menlo, monospace",
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            screenshot coming soon
          </div>
        )}

        {project.link && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 10,
              fontFamily: "ui-monospace, Menlo, monospace",
              padding: "4px 10px",
              borderRadius: 999,
              background: "rgba(3,0,20,0.7)",
              border: "1px solid var(--violet-border)",
              color: "var(--lavender)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.73.5.9 5.33.9 11.6c0 4.9 3.17 9.05 7.57 10.52.55.1.75-.24.75-.53v-1.9c-3.08.67-3.73-1.3-3.73-1.3-.5-1.29-1.23-1.63-1.23-1.63-1-.69.08-.67.08-.67 1.11.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.7-1.49-2.46-.28-5.05-1.23-5.05-5.48 0-1.21.43-2.2 1.14-2.98-.11-.28-.5-1.41.11-2.94 0 0 .93-.3 3.05 1.14a10.6 10.6 0 0 1 5.56 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.53.22 2.66.11 2.94.71.78 1.14 1.77 1.14 2.98 0 4.26-2.6 5.2-5.07 5.47.4.35.76 1.03.76 2.08v3.08c0 .3.2.64.76.53a11.11 11.11 0 0 0 7.56-10.52C23.1 5.33 18.27.5 12 .5Z" />
            </svg>
            Open source
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            fontSize: 10,
            fontFamily: "ui-monospace, Menlo, monospace",
            padding: "4px 10px",
            borderRadius: 999,
            background: "rgba(3,0,20,0.7)",
            border: "1px solid var(--violet-border)",
            color: "var(--lavender)",
            letterSpacing: "0.08em",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          {project.year}
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 50%, rgba(3,0,20,0.85) 100%)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            padding: 16,
            opacity: hovered ? 1 : 0,
            transition: "opacity 280ms ease",
            pointerEvents: "none",
          }}
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 10,
                  padding: "3px 8px",
                  borderRadius: 999,
                  background: "rgba(112,66,248,0.2)",
                  border: "1px solid var(--violet-border)",
                  color: "var(--lavender)",
                  fontFamily: "ui-monospace, Menlo, monospace",
                  letterSpacing: "0.04em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--lavender)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Read case study
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </div>

      <div style={{ padding: "18px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
          <h4 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.01em" }}>
            {project.title}
          </h4>
        </div>
        <div
          style={{
            fontFamily: "ui-monospace, Menlo, monospace",
            fontSize: 11,
            color: "var(--lavender)",
            letterSpacing: "0.04em",
            marginBottom: 10,
          }}
        >
          {project.subtitle}
        </div>
        <p style={{ margin: 0, color: "var(--fg-4)", fontSize: 13, lineHeight: 1.6 }}>{project.shortDesc}</p>
      </div>
    </button>
  );
}

function CaseSection({ label, body }: { label: string; body: string }) {
  return (
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
        {label}
      </div>
      <p style={{ margin: 0, color: "var(--fg-2)", fontSize: 15, lineHeight: 1.65 }}>{body}</p>
    </div>
  );
}

function CaseStudyModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(3,0,20,0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "48px 24px",
        overflowY: "auto",
        animation: "pf-fade-in 280ms ease-out both",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 980,
          background: "#030014",
          border: "1px solid var(--violet-soft)",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 60px 120px rgba(0,0,0,0.6), 0 0 80px var(--accent-glow-strong)",
          animation: "pf-modal-rise 380ms cubic-bezier(0.25, 1, 0.5, 1) both",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 5,
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "rgba(3,0,20,0.6)",
            border: "1px solid var(--violet-border)",
            color: "var(--fg-1)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            transition: "border 200ms ease, transform 200ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--violet-glow)";
            e.currentTarget.style.transform = "scale(1.05) rotate(90deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--violet-border)";
            e.currentTarget.style.transform = "scale(1) rotate(0deg)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div style={{ position: "relative", width: "100%", aspectRatio: "16/8", background: "var(--editor-bg)" }}>
          {project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.image} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, rgba(112,66,248,0.4) 0%, rgba(60,8,126,0.5) 50%, rgba(236,72,153,0.3) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.6)",
                fontFamily: "ui-monospace, Menlo, monospace",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              screenshot missing
            </div>
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, transparent 50%, rgba(3,0,20,0.95) 100%)",
            }}
          />
          <div style={{ position: "absolute", bottom: 24, left: 28, right: 28 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 10,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(112,66,248,0.2)",
                    border: "1px solid var(--violet-border)",
                    color: "var(--lavender)",
                    fontFamily: "ui-monospace, Menlo, monospace",
                    letterSpacing: "0.06em",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 style={{ margin: 0, fontSize: 42, fontWeight: 800, color: "var(--fg-1)", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              {project.title}
            </h2>
            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                color: "var(--fg-3)",
                fontFamily: "ui-monospace, Menlo, monospace",
                letterSpacing: "0.04em",
              }}
            >
              {project.subtitle} · {project.year}
            </div>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontFamily: "ui-monospace, Menlo, monospace",
                  color: "var(--fg-1)",
                  textDecoration: "none",
                  background: "rgba(112,66,248,0.2)",
                  border: "1px solid var(--violet-soft)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  transition: "border 200ms ease, background 200ms ease, transform 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--violet-glow)";
                  e.currentTarget.style.background = "rgba(112,66,248,0.32)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--violet-soft)";
                  e.currentTarget.style.background = "rgba(112,66,248,0.2)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.73.5.9 5.33.9 11.6c0 4.9 3.17 9.05 7.57 10.52.55.1.75-.24.75-.53v-1.9c-3.08.67-3.73-1.3-3.73-1.3-.5-1.29-1.23-1.63-1.23-1.63-1-.69.08-.67.08-.67 1.11.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.7-1.49-2.46-.28-5.05-1.23-5.05-5.48 0-1.21.43-2.2 1.14-2.98-.11-.28-.5-1.41.11-2.94 0 0 .93-.3 3.05 1.14a10.6 10.6 0 0 1 5.56 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.53.22 2.66.11 2.94.71.78 1.14 1.77 1.14 2.98 0 4.26-2.6 5.2-5.07 5.47.4.35.76 1.03.76 2.08v3.08c0 .3.2.64.76.53a11.11 11.11 0 0 0 7.56-10.52C23.1 5.33 18.27.5 12 .5Z" />
                </svg>
                View source
              </a>
            )}
          </div>
        </div>

        <div style={{ padding: "36px 40px 40px" }}>
          {project.flag && (
            <div
              style={{
                marginBottom: 24,
                padding: "10px 14px",
                fontSize: 11,
                color: "var(--lavender)",
                fontFamily: "ui-monospace, Menlo, monospace",
                background: "rgba(180,155,255,0.05)",
                border: "1px solid var(--violet-border)",
                borderRadius: 8,
                letterSpacing: "0.04em",
              }}
            >
              ⚠ {project.flag}
            </div>
          )}

          <div className="pf-case-grid">
            <CaseSection label="The problem" body={project.problem} />
            <CaseSection label="The shape of the solution" body={project.solution} />
          </div>

          <div
            style={{
              display: "flex",
              gap: 32,
              padding: "20px 0",
              borderTop: "1px solid var(--border-soft)",
              borderBottom: "1px solid var(--border-soft)",
              marginBottom: 36,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "0 0 auto" }}>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--fg-4)",
                  fontFamily: "ui-monospace, Menlo, monospace",
                  marginBottom: 8,
                }}
              >
                My role
              </div>
              <div style={{ color: "var(--fg-1)", fontSize: 15, fontWeight: 500 }}>{project.role}</div>
            </div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--fg-4)",
                  fontFamily: "ui-monospace, Menlo, monospace",
                  marginBottom: 8,
                }}
              >
                Stack
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {project.stack.map((s) => (
                  <span
                    key={s}
                    style={{
                      padding: "3px 10px",
                      borderRadius: 999,
                      fontSize: 11,
                      color: "var(--lavender)",
                      background: "var(--violet-fill, rgba(112,66,248,0.12))",
                      border: "1px solid var(--violet-border)",
                      fontFamily: "ui-monospace, Menlo, monospace",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 36 }}>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--fg-4)",
                fontFamily: "ui-monospace, Menlo, monospace",
                marginBottom: 16,
              }}
            >
              Process
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {project.process.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      flexShrink: 0,
                      borderRadius: 999,
                      background: "var(--violet-fill, rgba(112,66,248,0.12))",
                      border: "1px solid var(--violet-soft)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--lavender)",
                      fontFamily: "ui-monospace, Menlo, monospace",
                    }}
                  >
                    {i + 1}
                  </div>
                  <p style={{ margin: 0, color: "var(--fg-3)", fontSize: 15, lineHeight: 1.65, paddingTop: 2 }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {project.gallery && project.gallery.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--fg-4)",
                  fontFamily: "ui-monospace, Menlo, monospace",
                  marginBottom: 16,
                }}
              >
                A closer look
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {project.gallery.map((shot) => (
                  <figure key={shot.src} style={{ margin: 0 }}>
                    <div
                      style={{
                        borderRadius: 12,
                        overflow: "hidden",
                        border: "1px solid var(--border-soft)",
                        background: "var(--editor-bg)",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={shot.src}
                        alt={shot.caption}
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                    </div>
                    <figcaption
                      style={{
                        marginTop: 10,
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: "var(--fg-4)",
                      }}
                    >
                      {shot.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              padding: "20px 24px",
              background: "rgba(112,66,248,0.06)",
              border: "1px solid var(--violet-border)",
              borderRadius: 12,
              borderLeft: "3px solid var(--violet-glow)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--lavender)",
                fontFamily: "ui-monospace, Menlo, monospace",
                marginBottom: 10,
              }}
            >
              The hard problem
            </div>
            <p style={{ margin: 0, color: "var(--fg-2)", fontSize: 15, lineHeight: 1.7 }}>{project.challenge}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const Projects = () => {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<Project | null>(null);

  const visible = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="projects" className="pf-section">
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
        <span style={{ opacity: 0.7 }}>03</span>
        <span
          style={{
            width: 32,
            height: 1,
            background: "linear-gradient(90deg, var(--violet-glow), transparent)",
          }}
        />
        <span style={{ color: "var(--fg-3)", letterSpacing: "0.14em" }}>Selected work</span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 36,
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: 620 }}>
          <h2 style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg-1)", margin: 0, lineHeight: 1.05 }}>
            Five projects, <br />
            <span className="text-gradient-projects">five different problems.</span>
          </h2>
          <p style={{ marginTop: 14, fontSize: 16, color: "var(--fg-4)", lineHeight: 1.6 }}>
            Click any card to read the case study — problem, process, stack, and the hard part I had to solve.
          </p>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
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
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={filter}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24,
        }}
      >
        {visible.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} onOpen={setOpen} />
        ))}
      </div>

      {open && <CaseStudyModal project={open} onClose={() => setOpen(null)} />}
    </section>
  );
};

export default Projects;
