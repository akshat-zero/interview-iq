# InterviewIQ

> An interview practice app with AI-guided follow-up questions and local scorecards.

InterviewIQ is an open-source mock interview practice app with AI-generated role-specific questions, AI cross-questioning, and AI-generated four-pillar practice evaluations. Session history is stored locally in the browser. It does not provide hiring assessments.

---

## What is InterviewIQ?

InterviewIQ helps candidates rehearse prepared questions and review a consistent set of feedback prompts.

**InterviewIQ** is built to bridge that gap:
- **AI-Generated Questions**: New questions are generated for the selected domain, profession, role, and difficulty, with previously used prompts supplied to reduce repeats. If API credits run out, the app starts the mock with its built-in question bank.
- **AI Cross-Questioning**: The interviewer asks relevant follow-ups until it considers the response sufficient, then continues to the next main question.
- **AI 4-Pillar Evaluation**: AI evaluates each complete answer across four areas:
  1. **Relevance & Accuracy (35%)**: Direct constraint adherence and semantic precision.
  2. **Communication & Delivery (25%)**: Structured frameworks (STAR, MECE) and executive clarity.
  3. **Domain-Specific Polish (25%)**: Professional vocabulary, architectural trade-offs, and technical depth.
  4. **Actionable Gaps (15%)**: Unaddressed edge cases, failure recovery, and anticipatory problem-solving.
- **Voice & Text Input**: Dictate answers with browser speech recognition or type directly. Listen to questions read aloud with `SpeechSynthesis`. Speech recognition processing depends on the browser and may use its provider's service.
- **Walking Interview**: A separate voice-led session reads each prompt aloud, listens to the answer, asks AI follow-ups until the response is sufficient, and advances to the next question. It includes repeat, mic pause, and text fallback controls. Speech is transcribed by the browser; the app does not record or save audio.
- **AI Cross-Questioning**: An OpenAI model reviews the answer so far and asks focused follow-ups until it considers the response sufficient. If API credits run out during a mock, the app switches to its local practice rubric and clearly labels that feedback.
- **Optional Video Coaching**: With camera permission, an on-device pose model gives rough framing, shoulder alignment, and movement cues. It does not infer emotions or hiring readiness. Video is not recorded or saved by the app; the MediaPipe runtime/model are loaded from Google-hosted URLs and the library may send product usage metrics (see its privacy notice).
- **Reference Answer Outlines & Practice Drills**: Compare your answer with a structured outline and practice isolated topics.
- **Local Session History**: Session results and transcripts are stored in browser `localStorage`. Recorded audio is not saved with session history.
- **Transparent Limitations**: AI-generated questions and evaluations can be incorrect or inconsistent. Feedback is for practice only, is not a hiring recommendation, and does not evaluate spoken cadence or video-based emotion.

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

### 3. Configure AI follow-ups (optional)
Copy `.env.example` to `.env.local` and set your OpenAI API key there. The key is read by the Node server and is never included in the browser bundle. AI questions, follow-ups, and answer transcripts are sent to OpenAI. When API credits are unavailable, the app uses its local question bank and practice rubric so a mock can continue.

```env
OPENAI_API_KEY=your-api-key
OPENAI_MODEL=gpt-4.1-mini
```

You can also use **Continue with ChatGPT** from the sign-in screen in local development. If the app opens directly into a demo profile, open Settings and sign out first. ChatGPT sign-in lets you consent to use your own ChatGPT plan, then choose a model available to your account. The local Node process stores the OAuth credentials under your Windows `%LOCALAPPDATA%\InterviewIQ` folder (or the OS user configuration folder); they are not placed in the browser or repository. This local flow listens on `127.0.0.1:1455` for the OAuth callback. Publicly hosted ChatGPT sign-in requires OpenAI's separate hosted-partner approval; the local flow is disabled for production hosts.

### 4. Start development server
```bash
npm run dev
```
This starts the Vite website and the private API server. Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## Production Build

To test or deploy an optimized production bundle:
```bash
npm run build
```
The output bundle will be placed in the `dist/` directory. Run it with `npm start` on a Node.js 18+ host and configure `OPENAI_API_KEY` and optionally `OPENAI_MODEL` in the host's server environment. A static-only host such as GitHub Pages cannot keep this API key secret or run the AI endpoint; deploy the Node server on a Node-capable host.

---

## How It Works

```
1. Select Track ──> 2. Interview Practice ──> 3. Rubric Feedback ──> 4. Practice Scorecard
   Choose domain      Dictate via mic or type       4-pillar breakdown      Practice feedback
   and role level     with live waveform & TTS      with exemplar answers   verdict & session PDF
```

1. **Configure Session**: Pick your domain, target role, difficulty (`Entry`, `Mid`, `Senior`, `Lead`), and question count.
2. **Respond to Probes**: Speak naturally into your microphone or type in the response dock. The AI interviewer can ask one or more follow-ups before it proceeds. You can also listen to the prompt read aloud.
3. **Inspect the Evaluation**: Each complete answer receives AI-generated feedback across four practice areas, including strengths, gaps, and an answer outline.
4. **Review Scorecard**: View aggregate practice scores and print the scorecard or save it as a PDF using your browser.

---

## Tech Stack

- **Core**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (custom Graphite & Oxblood dark theme)
- **Icons**: Lucide React
- **Backend**: Node.js HTTP server and OpenAI Responses API
- **Web APIs**: Web Speech API (`SpeechRecognition`, `speechSynthesis`), AudioContext, LocalStorage

---

## License

MIT © [InterviewIQ Contributors](https://github.com/akshat-zero/interview-iq)
