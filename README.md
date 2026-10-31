# InterviewIQ — AI-Powered Multi-Domain Mock Interview Coach 🎙️⚡

**InterviewIQ** is a modern, responsive web application MVP designed for high-stakes interview preparation across multiple specialized domains. Built for a fast 24-hour hackathon setup, it features zero database friction, instant local state persistence, interactive speech recognition, and an objective 4-pillar AI evaluation rubric.

---

## 🌟 Key Features

### 1. High-Converting Modern Landing Page
- **Hero & Value Proposition**: High-impact gradients, glowing indicators, dual-mode voice/text highlights.
- **Interactive Domain Showcase**: Dynamic role spotlights for Software Engineering, Corporate Management, Arts & Vocal Performance, and Product Management.
- **The 4-Pillar Rubric Preview**: Explains how answers are rigorously evaluated beyond generic chatbots.
- **Side-by-Side Comparison**: Highlights why domain-specific rubric scoring outperforms standard conversational AI.

### 2. Multi-Domain & Role Configuration
- **Software Engineering & Architecture**:
  - *Distributed Systems & Backend Architect*: High throughput, CAP trade-offs, rate-limiters, p99 latency triage.
  - *Staff Full-Stack Engineer*: Architectural technical debt, legacy refactoring, Strangler Fig pattern.
  - *Site Reliability & DevOps Lead*: Incident triage, blameless postmortems, SLOs/SLIs.
- **Corporate Management & Executive Leadership**:
  - *Director of Operations*: Zero-based budgeting, 20% cost reduction, cross-departmental throughput.
  - *Senior Engineering Manager / VP*: Underperformance diagnostics, burnout recovery, 1-on-1 coaching.
  - *VP of Strategy / Chief of Staff*: Enterprise fork vs roadmap conflict, MECE decision memos, crisis comms.
- **Arts & Vocal Performance**:
  - *Classical Opera Soloist*: Passaggio navigation, appoggio breath mechanics, aggiustamento, squillo/singer’s formant.
  - *Musical Theatre Lead*: Audition callback psychology, mix/belt coordination, dramatic objective.
  - *Contemporary Vocalist & Producer*: 8-show tour recovery, SOVT straw therapy, artistic disagreements with conductors.
- **Product Management & Innovation**:
  - *Principal PM & AI Product Lead*: Cohort retention decomposition, activation funnels, and trade-off matrices.

### 3. Interactive Interview Workspace
- **Dual Input Modes**:
  - **Live Speech Mic Recording**: Uses browser `SpeechRecognition` / `webkitSpeechRecognition` with live audio waveform visualization (`AudioVisualizer`) and real-time transcription.
  - **Text Mode**: Editable textarea allowing candidates to refine spoken transcripts or type directly.
- **Interviewer Voice (TTS)**: Text-to-Speech playback (`window.speechSynthesis`) so the candidate can listen to the interviewer read the question aloud.
- **Interviewer Hints & Evaluation Criteria**: Toggleable accordion revealing key focus points and thought prompts.
- **Demo Presets**: Quick-load "Exemplar Answer" or "Basic Answer" buttons for instantaneous hackathon testing and judging!

### 4. Structured 4-Pillar AI Evaluation Engine
Every answer is benchmarked against four foundational pillars:
1. **Relevance & Accuracy (30%)**: Evaluates factual precision, constraint adherence, and direct problem resolution.
2. **Communication & Delivery (25%)**: Analyzes structural frameworks (STAR, MECE), verbal cadence, and conciseness.
3. **Domain-Specific Polish (25%)**: Audits use of authentic professional terminology and explicit trade-off justifications.
4. **Actionable Gaps (20%)**: Identifies unaddressed risks, failure modes, and anticipates interviewer follow-ups.

### 5. Sleek Final Performance Dashboard
- **Executive Scorecard**: Radial progress score (0-100), letter grade (A+, A, B, etc.), and hiring recommendation badge (*Strong Hire*, *Hire*, *Leaning Hire*, *Borderline*, *Needs Improvement*).
- **Pillar Score Cards Grid**: Individual visual cards with scores, rating badges, bulleted strengths, actionable blind spots, and coach's pro-tips.
- **Question-by-Question Deep Dive**: Accordion displaying question prompts, candidate transcripts, individual pillar scores, and an **Elevated 98/100 AI Model Answer**.
- **Export & Session History**:
  - Print / Save as PDF with custom print stylesheets.
  - One-click copy performance summary to clipboard.
  - Automatic `localStorage` session history persistence to review past mock sessions.

---

## 🚀 Getting Started

The project is already initialized and compiled in your scratch workspace at:
```
C:\Users\DELL\.gemini\antigravity\scratch\interview-iq
```

### Running the Development Server
```bash
cd C:\Users\DELL\.gemini\antigravity\scratch\interview-iq
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Building for Production
```bash
npm run build
```
Creates an optimized, production-ready bundle in `dist/`.

---

## 🛠️ Tech Stack
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS with custom slate/indigo dark theme & glassmorphic accents
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, CSS Keyframe Audio Waveforms
- **Browser APIs**: Web Speech API (`SpeechRecognition`, `speechSynthesis`), LocalStorage
