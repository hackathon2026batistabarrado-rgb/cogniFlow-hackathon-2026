# CogniFlow
### Microsoft Innovation Challenge Hackathon — March 2026
**Challenge #3: Cognitive Load Reduction Assistant**

> *"The problem isn't that tasks are too complex. It's that neurodivergent professionals do two things simultaneously: they execute the work AND perform being neurotypical while working. These two activities compete for the same limited resource — working memory."*

---

## 💡 Problem & Vision

Neurodivergent professionals — especially those with late diagnoses of ADHD, autism, or dyslexia — spend between 30% and 40% of their working memory not on the tasks themselves, but on a parallel, invisible process: **simulating neurotypical behavior**.

This phenomenon, called the **Masking Tax**, is measurable, detectable through digital interaction patterns, and — crucially — mitigatable by properly architected AI systems.

Existing productivity tools treat cognitive load as a single variable and simplify everything indiscriminately, ignoring the science behind what actually drains focus. **No tool measures this cost. No tool addresses it.**

**CogniFlow** changes that.

---

## 🚀 Main Capabilities

- **Passive Behavioral Capture**
  Real-time keystroke latency, revision frequency, section returns, and abandonment signals — all captured without interrupting the user's workflow.

- **Masking Tax Index (MTI)**
  A proprietary metric calculated from behavioral proxies documented in neuropsychology literature. Ranges from 0 to 100. A falling index during a session is evidence of effectiveness.

- **Multi-Agent Intervention System**
  Seven specialized agents — each targeting a specific type of cognitive tax — coordinated by an intelligent orchestrator.

- **No Diagnosis Required**
  ProfileSense infers the current cognitive state from interaction patterns. No clinical label. No self-declaration. No form.

- **CalmGuard — Responsible AI by Architecture**
  Every output of every agent passes through CalmGuard before reaching the user. Anxiogenic, stigmatizing, or judgmental language is intercepted and rewritten.

---

## 🧠 Multi-Agent Architecture

```
Frontend (React + Vite)
    ↓
Backend (Node.js / Express)
    ↓
Azure AI Foundry (hub)
    ├── ProfileSense    → classifies active cognitive load type
    ├── FocusAgent      → executive load (ADHD) — micro-closures
    ├── PhonAgent       → phonological load (Dyslexia) — adaptive typography
    ├── ContextAgent    → contextual load (Autism) — making implicit explicit
    ├── BlendIt         → comorbidity orchestrator — resolves agent conflicts
    ├── CalmGuard       → Responsible AI structural layer
    └── NotifyAgent     → opportunity-window notifications
         ↓
    Azure Cosmos DB     — behavioral profile per session
    Azure AI Search     — semantic RAG over session history
```

### Agent Descriptions

- **ProfileSense — Cognitive Load Detector**
  Entry point for every interaction. Analyzes behavioral patterns silently. No labeling. No asking. Output: which intervention agent(s) to activate.

- **FocusAgent — Executive Load Specialist (ADHD)**
  Activated when executive load is dominant. Fragments tasks into micro-closures with concrete temporal anchors ("this takes the length of one song"). Based on Barkley's time agnosia and Sirois's dopaminergic micro-closures research.

- **PhonAgent — Phonological Load Specialist (Dyslexia)**
  Activated when phonological load is dominant. Adapts text presentation: adaptive typography per BDA guidelines, syllabic fragmentation, synchronized audio reading. Integrates Azure Immersive Reader natively.

- **ContextAgent — Contextual Load Specialist (Autism)**
  The most innovative agent. Makes implicit professional communication explicit: decodes unspoken expectations, signals ambiguous instructions with multiple plausible interpretations and probability scores.

- **BlendIt — Comorbidity Orchestrator**
  40–70% of autistic people have concurrent ADHD; 30–40% of dyslexics have ADHD. BlendIt resolves conflicts between agents before any output reaches the user — e.g., it will not activate FocusAgent's accelerated rhythm while PhonAgent needs reduced speed.

- **CalmGuard — Structural RAI**
  Responsible AI as architecture, not as a compliance checklist. Verifies: no anxiogenic language, autonomy preserved, no clinical references in the interface, calm and non-condescending tone. Generates an audit log of every intervention to Azure Monitor + App Insights.

- **NotifyAgent — Intelligent Notification System**
  Notifies in opportunity windows based on behavior — never on a fixed schedule. Cardinal rule: never interrupts active focus. Maximum 4 notifications/day.

---

## 📊 Masking Tax Index — The Core Metric

A proxy metric calculated from behavioral correlates documented in neuropsychology literature:

```
weights = {
  latency_score:       0.30,   # Barkley: latency ~ executive inhibition
  revision_frequency:  0.30,   # Hull et al.: self-monitoring ~ masking
  section_returns:     0.20,   # Baddeley: returns ~ phonological loop overload
  abandonment_signals: 0.20    # Sirois: abandonment ~ micro-closure failure
}
```

Scale: 0 to 100. **A falling index during a session = evidence of effectiveness.**

---

## 🎬 Demo — 4 Scenes

| Scene | Persona | Surface | Agent |
|-------|---------|---------|-------|
| 1 | Sofia, 34 — Senior Software Engineer (ADHD) | Text Editor | FocusAgent |
| 2 | Miguel, 29 — Backend Dev (Dyslexia) | Text Editor | PhonAgent |
| 3 | Ana, 31 — Product Manager (Autism) | Inbox | ContextAgent |
| 4 | Sofia — difficult day (mixed load) | Tasks | BlendIt + NotifyAgent |

---

## ☁️ Azure Services (15)

| # | Service | Role |
|---|---------|------|
| 1 | **Azure AI Foundry** | Central hub — orchestrates all agents |
| 2 | **Azure OpenAI (GPT-4o)** | Core reasoning engine |
| 3 | **Azure AI Search** | Semantic RAG over behavioral history |
| 4 | **Azure AI Language** | NLU for ContextAgent ambiguity detection |
| 5 | **Azure AI Speech** | Neural TTS/STT for PhonAgent |
| 6 | **Azure Document Intelligence** | Semantic PDF parsing |
| 7 | **Azure Immersive Reader** | Native dyslexia-optimized rendering |
| 8 | **Azure Cosmos DB** | Behavioral profile per session |
| 9 | **Azure AI Content Safety** | CalmGuard primary filter |
| 10 | **Azure Key Vault** | Credential management |
| 11 | **Azure Web App / App Service** | Frontend PWA + backend deploy |
| 12 | **Azure Functions** | Serverless orchestration (BlendIt, NotifyAgent) |
| 13 | **Azure Monitor + App Insights** | RAI audit trail |
| 14 | **Azure API Management** | Single entry point, rate limiting |
| 15 | **Azure Notification Hubs** | Mobile push roadmap (provisioned) |

---

## 🛡️ Responsible AI

CalmGuard is the architectural equivalent of Responsible AI — not a compliance slide.

| Principle | Implementation |
|-----------|---------------|
| **Fairness** | Zero diagnosis fields. Works without formal diagnosis. Zero self-declaration eliminates selection bias. |
| **Reliability & Safety** | CalmGuard validates every output. No intervention without sufficient behavioral evidence. System makes no clinical diagnoses. |
| **Privacy & Security** | Key Vault for credentials. Behavioral data classified as sensitive health data. No use for training without consent. |
| **Inclusiveness** | Zero-friction onboarding. No "accessibility mode" selection. Complexity emerges as the profile is learned. |
| **Transparency** | Explanatory log of every intervention: pattern detected → agent activated → intervention → result measured. |
| **Accountability** | Every intervention is reversible. Undo = explicit negative feedback that feeds the profile. Granular opt-out. |

---

## 🧱 Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- ES Modules

**Backend**
- Node.js + Express
- Azure OpenAI SDK
- Azure Cosmos DB SDK

**Azure**
- Azure AI Foundry (Agents)
- Azure OpenAI (GPT-4o)
- Azure Cosmos DB
- Azure AI Search
- Azure AI Content Safety
- Azure Key Vault
- Azure App Service
- Azure Monitor + App Insights

---

## 💻 How to Run

### Backend

```bash
cd backend
cp .env.example .env
# Fill in Azure credentials
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

> **Demo mode:** Click the **◈ Demo** button in the top bar to show/hide the Cognitive Insights panel during recording.

---

## 📁 Project Structure

```
cogniflow/
├── backend/
│   ├── agents/          ← one file per agent
│   ├── routes/          ← /api/* endpoints
│   ├── services/        ← openai.js, cosmos.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/  ← Topbar, Sidebar, InsightsPanel, WebPush
        ├── surfaces/    ← Editor, Inbox, Tasks
        ├── hooks/       ← useBehaviorCapture, useAgents, useNotifications
        ├── services/    ← agentClient.js
        ├── capture/     ← behaviorEngine.js
        ├── mockData/    ← emails, tasks, personas
        └── theme/       ← design tokens
```

---

## 🔭 Next Steps (Post-Hackathon)

- Integrate real email client via Microsoft Graph API (Outlook/Teams).
- Add PhonAgent with Azure AI Speech for synchronized audio reading.
- Deploy Azure Notification Hubs for native iOS and Android push notifications.
- Build user profile persistence with longitudinal MTI tracking across sessions.
- Validate Masking Tax Index calibration with neurodivergent professionals in real workplaces.

---

## 📚 Scientific References

- Baddeley, A. D., & Hitch, G. (1974). Working memory. *Psychology of Learning and Motivation*, Vol. 8.
- Barkley, R. A. (1997). *ADHD and the nature of self-control*. Guilford Press.
- Hull, L., Mandy, W., & Lai, M. C. (2017). Behavioral and cognitive sex/gender differences in autism. *Psychological Medicine*, 47(14).
- Pearson, A., & Rose, K. (2021). A conceptual analysis of autistic masking. *Autism in Adulthood*, 3(1).
- Sirois, F. M., & Pychyl, T. A. (2013). Procrastination and the priority of short-term mood regulation. *Social and Personality Psychology Compass*, 7(2).
- Sweller, J. (1988). Cognitive load during problem solving. *Cognitive Science*, 12(2).
- Fayyad, J. et al. (2024). Prevalence of adult ADHD. *World Psychiatry*.
- EY Neurodiversity Research (2023). *The Value of Neurodiversity*.

---

## 👥 Team

- **Letícia Batista Silva**
- **Erika Barrado**

---

*Built for the **Microsoft Innovation Challenge Hackathon — March 2026**.*
*Challenge #3: Cognitive Load Reduction Assistant.*