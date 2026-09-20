#!/usr/bin/env python3
"""Regenerates public/ai-resume.pdf."""

import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether,
)

NAVY = colors.HexColor("#1F3864")
INK = colors.HexColor("#333333")
GREY = colors.HexColor("#555555")
RULE = colors.HexColor("#BFBFBF")
LINK = colors.HexColor("#2E74B5")

GITHUB_VMS = "https://github.com/VariPhiGen/Intelligent-Video-Management-System"

name_s = ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=21, leading=25,
                        alignment=1, textColor=colors.black, spaceAfter=3)
contact_s = ParagraphStyle("contact", fontName="Helvetica", fontSize=9.5, leading=13,
                           alignment=1, textColor=INK, spaceAfter=2)
head_s = ParagraphStyle("head", fontName="Helvetica-Bold", fontSize=11, leading=13,
                        textColor=NAVY, spaceBefore=9, spaceAfter=2)
body_s = ParagraphStyle("body", fontName="Helvetica", fontSize=9, leading=12.2,
                        alignment=4, textColor=INK)
role_s = ParagraphStyle("role", fontName="Helvetica-Bold", fontSize=9.8, leading=12,
                        textColor=colors.black, spaceBefore=5)
date_s = ParagraphStyle("date", fontName="Helvetica-Oblique", fontSize=8.8, leading=11,
                        textColor=GREY, spaceAfter=2)
bullet_s = ParagraphStyle("bullet", parent=body_s, leftIndent=13, firstLineIndent=-8,
                          spaceAfter=1.5)
label_s = ParagraphStyle("label", fontName="Helvetica-Bold", fontSize=9, leading=12,
                         textColor=colors.black)

story = []


def head(text):
    story.append(Paragraph(text, head_s))
    story.append(HRFlowable(width="100%", thickness=0.6, color=RULE,
                            spaceBefore=1, spaceAfter=4))


def bullet(text):
    para = Paragraph(f"· {text}", bullet_s)
    if _pending:
        story.append(KeepTogether(_pending + [para]))
        _pending.clear()
    else:
        story.append(para)


_pending = []


def role(title, company, dates, location=None):
    """Buffer the heading so it binds to the next bullet and can't orphan."""
    _pending.append(Paragraph(f"{title} — {company}", role_s))
    meta = " · ".join(x for x in (location, dates) if x)
    _pending.append(Paragraph(meta, date_s))


def link(url, text):
    return f'<link href="{url}"><font color="#2E74B5">{text}</font></link>'


# ---------------------------------------------------------------- header
story.append(Paragraph("DEEPAK ARAVINDAN", name_s))
story.append(Paragraph(
    " &nbsp;|&nbsp; ".join([
        link("https://linkedin.com/in/deepakaravindan", "LinkedIn"),
        "+91 7550047396",
        link("https://github.com/deepak15arvd", "GitHub"),
        "deepak15arvd@gmail.com",
        "Bangalore, India",
    ]), contact_s))
story.append(HRFlowable(width="100%", thickness=0.6, color=RULE, spaceBefore=4))

# ---------------------------------------------------------------- summary
head("PROFESSIONAL SUMMARY")
story.append(Paragraph(
    "AI Product Engineer with 6+ years of combined experience building and shipping AI-powered "
    "products end-to-end — from defining product vision to writing production code. Hands-on with "
    "LLM orchestration, AI agent architectures, RAG pipelines, computer vision, and generative AI, "
    "backed by deep full-stack engineering skills (Python, React/Node.js, AWS, Docker). Proven "
    "ability to prototype rapidly, ship AI features that drive measurable user outcomes "
    "(30–40% faster deployments, 15–22% adoption lifts), and collaborate across ML engineering, "
    "design, and business teams. Author of a production, open-source video management system "
    "(AGPL-3.0) deployed at industrial sites.", body_s))

# ---------------------------------------------------------------- skills
head("TECHNICAL SKILLS")
skills = [
    ("AI &amp; ML:",
     "LLM Orchestration (GPT-4, Claude, LLaMA, Mistral), AI Agents &amp; Tool Use, RAG Architecture, "
     "Prompt Engineering &amp; Optimization, Fine-Tuning (LoRA), Computer Vision (YOLO, OpenVINO, "
     "OpenCV), NLP, Model Evaluation, Hallucination Reduction, Guardrails &amp; Safety"),
    ("Languages &amp; Frameworks:",
     "Python, JavaScript/TypeScript, React, Node.js, Express, FastAPI, REST APIs, GraphQL, Kafka, SQL"),
    ("Infrastructure &amp; MLOps:",
     "AWS (Lambda, EC2, S3, SageMaker), Docker, CI/CD Pipelines, FFmpeg, GStreamer, MediaMTX, ONVIF, "
     "RTSP/HLS, Keycloak (OIDC), Microservices, Edge AI Deployment, Model Serving"),
    ("Data &amp; AI Tooling:",
     "LangChain, LlamaIndex, Vector Databases (pgvector, Weaviate, Pinecone), PostgreSQL, "
     "Valkey/Redis, OpenAI API, CLIP &amp; Text Embeddings, Mixpanel, Google Analytics, A/B Testing, "
     "Data Pipelines"),
    ("Product &amp; Design:",
     "PRDs, Roadmapping, User Stories, RICE/MoSCoW Prioritization, Figma, Miro, Agile/Scrum, "
     "User Research, Competitive Analysis"),
    ("Tools:", "Jira, Git, GitHub Actions, Postman, Jupyter Notebooks"),
]
rows = [[Paragraph(k, label_s), Paragraph(v, body_s)] for k, v in skills]
t = Table(rows, colWidths=[132, 371])
t.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (0, -1), 8),
    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ("TOPPADDING", (0, 0), (-1, -1), 1),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
]))
story.append(t)

# ---------------------------------------------------------------- experience
head("PROFESSIONAL EXPERIENCE")

role("AI Product Engineer", "Variphi", "Jan 2025 – Present", "Bangalore, India")
bullet(
    "Architected, shipped and open-sourced the <b>Intelligent Video Management System</b> "
    f"({link(GITHUB_VMS, 'GitHub')}, AGPL-3.0) "
    "— a self-hosted NVR running 24/7 across 9+ industrial cameras: ONVIF discovery, "
    "single-pull MediaMTX RTSP relay, codec-copy recording, and a shared frame broker that decodes "
    "each stream once for every AI consumer. Owned it end-to-end, from camera ingest to operator console.")
bullet(
    "Ran YOLO via OpenVINO for person, vehicle, plate and face detection on <b>commodity CPUs with no "
    "GPU</b>, cutting hardware cost per site; forensic search over CLIP embeddings in pgvector turns "
    "weeks of footage into a plain-English query.")
bullet(
    "Built the <b>Live Event Assistant</b>, a RAG agent answering natural-language questions over a "
    "live safety-event stream (6,800+ events, 24 locations). Cut hallucination on quantitative "
    "questions by moving <b>all counting out of the model</b> — retrieval returns "
    "database-computed aggregates and the LLM only phrases them and picks a verifiable sample event. "
    "Pluggable model layer: self-hosted open LLM when data cannot leave the customer's hardware, "
    "OpenAI API when it can.")
bullet(
    "Architected and shipped a multi-agent AI system for real-time safety-violation monitoring, "
    "orchestrating LLM-based agents with tool-use capabilities (LangChain, OpenAI API) for autonomous "
    "image analysis and alert generation — reduced client deployment time by 30%.")
bullet(
    "Built end-to-end generative AI pipeline for on-demand image synthesis, implementing prompt "
    "optimization, guardrails for content safety, and evaluation frameworks to ensure output quality "
    "at production scale.")
bullet(
    "Designed and optimized HALO Accelerator — a zero-touch provisioning system (Python, Docker, "
    "AWS Lambda) — cutting enterprise onboarding from weeks to days (40% reduction) and enabling "
    "self-serve configuration for new clients.")
bullet(
    "Led R&amp;D evaluation of foundation models (GPT-4, Claude, open-source LLMs) across generative "
    "and perceptive AI use-cases; owned the product roadmap and technical PRDs for all AI features.")

role("Product Engineer", "ValueMatrix.ai", "Feb 2023 – Dec 2024", "Bangalore, India")
bullet(
    "Owned end-to-end roadmap and hands-on development for a candidate evaluation platform used by "
    "enterprise clients — defined PRDs, wrote user stories, and personally shipped core features, "
    "improving client retention by 22%.")
bullet(
    "Led a small engineering team to build LinkedIn integration for real-time candidate scoring and a "
    "Kafka-based analytics pipeline, reducing manual tasks by 60% and cutting API latency by 30%.")
bullet(
    "Designed and launched Big5 psychometric assessment module end-to-end — from product spec to "
    "frontend implementation to release — driving 30% increase in upsell revenue.")
bullet(
    "Established security best practices across the MERN stack: built middleware for input validation "
    "and XSS prevention, lowering vulnerabilities by 40% and improving platform reliability.")
bullet(
    "Conducted user research and competitive analysis, informing two high-ROI feature releases; "
    "reduced feature delivery cycle by 18% and boosted UX task completion by 25%.")
bullet(
    "Built Mixpanel &amp; GA dashboards with custom event tracking; iterated UI based on data insights "
    "and ran A/B tests on activation flows, lifting activation rates by 19% within four weeks.")

role("Frontend Engineer &amp; IoT Developer", "Autonomo Technologies", "Apr 2021 – Jan 2023", "Bangalore, India")
bullet(
    "Architected and shipped React-based admin portal for autonomous store operations powered by "
    "computer vision checkout — reduced operational delays by 35%.")
bullet(
    'Built "Hoody" — a real-time fault-tracking system for CV-based checkout hardware, integrating '
    "IoT sensor telemetry for predictive diagnostics; reduced support escalations by 40%.")
bullet(
    "Integrated IoT peripherals (sensors, dispensers) with cloud backend, enabling automated device "
    "management and laying groundwork for AI-driven predictive maintenance.")

role("Software Engineer (Contract)", "Smartlink / DIGISOL", "2020 – 2021", "Bangalore, India")
bullet(
    "Developed scalable router management platform handling 50K+ devices with 99.9% uptime; "
    "implemented security hardening and performance optimizations for production infrastructure.")

# ---------------------------------------------------------------- projects
head("OPEN SOURCE &amp; AI PROJECTS")
bullet(
    f"<b>Intelligent Video Management System</b> — {link(GITHUB_VMS, 'GitHub')} (AGPL-3.0). "
    "Self-hosted VMS: FastAPI microservices, React console, MediaMTX relay, YOLO/OpenVINO analytics, "
    "CLIP + pgvector forensic search, Keycloak RBAC across 5 tiers, Docker Compose deploy. "
    "Public code, in production at an industrial site.")
bullet(
    "<b>RAG Knowledge Assistant:</b> internal documentation search using LangChain, Weaviate, and "
    "OpenAI embeddings — reduced information retrieval time by 50% across the engineering team.")
bullet(
    "<b>AI Resume Screener:</b> end-to-end candidate-job matching prototype using fine-tuned "
    "transformer models and prompt engineering — 92% accuracy on benchmark dataset.")
bullet(
    "<b>Multi-Agent Task Automation:</b> autonomous agent workflow using LangChain agents with tool-use "
    "(web search, code execution, API calls) for automated research and reporting.")
bullet(
    "<b>MLOps Pipeline:</b> model versioning, automated evaluation, and CI/CD deployment on AWS "
    "SageMaker for continuous model improvement and A/B model serving.")

# ---------------------------------------------------------------- tail
head("CERTIFICATIONS")
bullet("Certified Scrum Product Owner (CSPO)")
bullet("Generative AI with Large Language Models — DeepLearning.AI &amp; AWS")
bullet("Google Analytics Individual Qualification (GAIQ)")
bullet("Google UX/UI Design Professional Certificate")

head("EDUCATION")
bullet("B.Tech, Computer Science — SRM University")

# ---------------------------------------------------------------- build
out = sys.argv[1]
doc = BaseDocTemplate(out, pagesize=letter,
                      leftMargin=54, rightMargin=54, topMargin=44, bottomMargin=40,
                      title="Deepak Aravindan — AI Product Engineer",
                      author="Deepak Aravindan")
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="f",
              leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([PageTemplate(id="p", frames=[frame])])
doc.build(story)
print(f"wrote {out}: {doc.page} pages")
