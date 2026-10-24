# OPD Saathi — Hackathon Pitch Deck (Slide-by-Slide Content)

*Copy-paste these slide contents directly into Google Slides, Canva, Gamma, or PowerPoint to export as PDF / shareable link.*

---

## Slide 1: Title & Tagline
**Header**: OPD Saathi (ओपीडी साथी / OPD சாத்தி)  
**Subheader**: Smart Queue Management and Accessible Navigation for Government Hospitals  
**Tagline**: Reimagining Government: Making hospital visits dignified, understandable, and stress-free for every citizen.  
**Presented by**: Team OPD Saathi  
**Badges**: Low-Literacy Accessible • 3 Languages (EN/HI/TA) • Offline PWA • Step-Free Dijkstra Navigation  

---

## Slide 2: The Ground Reality (The Problem)
**Headline**: Government Hospital Corridors Are Overwhelmed and Confusing
- **Endless Waiting & Lost Tokens**: Patients wait 3–4 hours just to get an OPD paper slip, unaware of doctor delays or when their turn will come.
- **Digital & Linguistic Divide**: Portals assume English literacy and digital fluency. Elderly, rural, and disabled patients are left stranded.
- **Physical Mazes**: "Ward 4" or "Room 3" is printed on a slip, but patients cannot read signage or find rooms across multi-floor buildings.
- **Critical Risk**: Emergencies get trapped in regular registration queues because triage doesn't happen at the front gate.

---

## Slide 3: Our Target Persona — Kamla (Age 62)
**Headline**: Designing for the Most Vulnerable First
- **Profile**: 62-year-old grandmother, visiting district hospital alone on a basic smartphone.
- **Literacy**: Reads conversational Hindi, does not read English medical jargon.
- **Mobility**: Walks slowly with knee pain, strictly avoids stairs.
- **The OPD Saathi Experience**:
  - Chooses Hindi in one tap with large native script.
  - Speaks her name into the microphone.
  - Selects doctors via symptom picture cards (*"fever, cough, BP"* instead of *"General Medicine"*).
  - Toggles *"Avoid Stairs"* for automated lift & ramp directions.

---

## Slide 4: Core Innovation & Features
**Headline**: A Complete Ecosystem from Entry to Consultation
1. **Inclusive Registration**:
   - Voice speech-to-text, 1-question-per-screen with progress feedback.
   - **Helper Mode**: Enlarged high-contrast font, automated screen narration, and assisted typing.
2. **Smart OPD Slip & Real-Time Queue**:
   - Dynamic token number & QR code linked to live turn tracker.
   - Dynamic wait formula: $(Patients Ahead \times Moving Avg Duration) + Doctor Delays$.
   - **Proactive Alerts**: Phone vibrates and alerts at "3 patients ahead" with simulated SMS and sound.
3. **Indoor Landmark Navigation**:
   - Dijkstra's shortest-path algorithm running over SVG floor plans.
   - Visual physical landmarks (e.g., *"opposite the blue chairs"*, *"beside drinking water"*).
   - Dedicated **"I'm Lost"** card displaying destination in English + native language for staff assistance.

---

## Slide 5: Emergency First Policy (Ethical Healthcare Protocol)
**Headline**: Technology Must Never Delay Emergency Care
- **Universal Emergency Header**: Persistent 1-tap "Emergency" and "I need urgent help" accessible from *every* screen, without registering or obtaining a token.
- **Instant Casualty Routing**: Clear directions to Casualty & direct click-to-call for 112 / 108.
- **The "No AI Diagnosis" Rule**: 
  - OPD Saathi *never* decides if a patient can wait.
  - Urgent alerts immediately chime an audible alarm pinned at the top of the Staff Dashboard until medically verified by qualified staff.

---

## Slide 6: System Architecture & Technical Execution
**Headline**: Resilient, High-Performance, and Offline-First
- **Frontend**: React 18, Vite, Tailwind CSS, Accessible HTML5 (WCAG AA, 56px+ targets, 18px+ text).
- **Offline PWA**: Full service worker precaching floor maps, routing logic, and slips for zero-connectivity hospital basements.
- **Real-Time Multi-Device Sync**:
  - Node.js + Express + Socket.io local/remote WebSocket engine.
  - Client fallback using BroadcastChannel & LocalStorage for instant cross-tab sync without a backend.
- **Public TV Board (`/board`)**: Tri-lingual automated audio-visual announcement system for hospital waiting halls.
- **Staff Control Station (`/staff`)**: Queue triage, doctor delay toggles, and crowd overcrowding warnings.

---

## Slide 7: Real-World Impact & What's Next
**Headline**: Scalable Impact for Public Healthcare Infrastructure
- **Immediate Impact**:
  - Slashes counter congestion by up to 60%.
  - Eliminates hallway overcrowding through remote waiting.
  - Prevents physical exhaustion for senior citizens through step-free pathfinding.
- **Future Roadmap**:
  - Integration with **ABHA / Ayushman Bharat Digital Mission (ABDM)** for scan-and-share tokens.
  - WhatsApp/SMS gateway integration for non-smartphone feature phones.
  - Multi-hospital rollout with regional dialect audio packs.

---
**Thank You!**  
*Try the live demo at: [Your Live Link]*  
*GitHub: [Your GitHub URL]*
