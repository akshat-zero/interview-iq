# InterviewIQ

> An agent harness for high-stakes interview mastery and practice.

InterviewIQ is an open-source, local-first mock interview harness. It replaces superficial chatbots and costly human coaching with structured, multi-domain interview simulations and transparent 4-pillar rubric scoring.

---

## What is InterviewIQ?

Most AI interview tools act like open-ended chat assistants: they accept vague answers, offer surface-level praise, and fail to test real operational constraints.

**InterviewIQ** is built to bridge that gap:
- **Domain-Specific Depth**: Evaluates candidates against authentic industry standards across Software Engineering, Executive Management, Product Leadership, and Vocal & Performance Arts.
- **Objective 4-Pillar Rubric**: Scores every answer against four clear evaluation categories:
  1. **Relevance & Accuracy (35%)**: Direct constraint adherence and semantic precision.
  2. **Communication & Delivery (25%)**: Structured frameworks (STAR, MECE) and executive clarity.
  3. **Domain-Specific Polish (25%)**: Professional vocabulary, architectural trade-offs, and technical depth.
  4. **Actionable Gaps (15%)**: Unaddressed edge cases, failure recovery, and anticipatory problem-solving.
- **Dual Voice & Text Interaction**: Dictate answers using real-time browser speech recognition (`Web Speech API`) with live waveform visualization, or type directly. Listen to questions read aloud via `SpeechSynthesis`.
- **Exemplar Answers & Practice Drills**: Compare your thinking against 98/100 reference model answers and drill isolated blind spots before full mocks.
- **Local-First & Private**: 100% in-browser state persistence via `localStorage`. Audio transcripts and performance analytics never leave your device.

---

## Supported Domains & Roles

| Domain | Roles Covered | Core Focus |
| :--- | :--- | :--- |
| **Software Engineering** | Distributed Systems Architect, Staff Full-Stack, SRE & DevOps Lead | CAP theorem, latency triage, failure modes, scalability |
| **Corporate Management** | Director of Operations, Senior Engineering Manager, Chief of Staff | P&L ownership, MECE memos, team burnout, crisis leadership |
| **Product Management** | Principal Product Manager, AI Product Lead | North star metrics, user journeys, prioritization trade-offs |
| **Arts & Vocal Performance**| Classical Opera Soloist, Musical Theatre Lead, Vocalist & Producer | Appoggio mechanics, acoustic projection, audition psychology |

---

## Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- npm, pnpm, or yarn

### 1. Clone the repository
```bash
git clone https://github.com/akshat-zero/interview-iq.git
cd interview-iq
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## Production Build

To test or deploy an optimized production bundle:
```bash
npm run build
npm run preview
```
The output bundle will be placed in the `dist/` directory.

---

## How It Works

```
1. Select Track ──> 2. Interview Simulation ──> 3. Real-Time Rubric ──> 4. Performance Scorecard
   Choose domain      Dictate via mic or type       4-pillar breakdown      Letter grade, hiring
   and role level     with live waveform & TTS      with exemplar answers   verdict & session PDF
```

1. **Configure Session**: Pick your domain, target role, difficulty (`Entry`, `Mid`, `Senior`, `Lead`), and question count (3 or 5 questions).
2. **Respond to Probes**: Speak naturally into your microphone or type in the response dock. You can also listen to the prompt read aloud.
3. **Inspect the Rubric**: Each question is evaluated with concrete strengths, missed constraints, and an elevated model answer.
4. **Review Scorecard**: View aggregate rubric scores, hiring recommendation (`Strong Hire`, `Hire`, `Leaning Hire`, `Borderline`, `Needs Improvement`), and print or export your scorecard to PDF.

---

## Tech Stack

- **Core**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (custom Graphite & Oxblood dark theme)
- **Icons**: Lucide React
- **Web APIs**: Web Speech API (`SpeechRecognition`, `speechSynthesis`), AudioContext, LocalStorage

---

## License

MIT © [InterviewIQ Contributors](https://github.com/akshat-zero/interview-iq)
