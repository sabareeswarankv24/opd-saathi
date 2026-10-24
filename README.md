# OPD Saathi

**Smart queue management and accessible navigation for City District Hospital (a made-up sample hospital).**

## The problem
Patients at government hospitals wait hours to register and get an OPD slip, then cannot find the room written on it. Registering is hard for elderly people, people who do not read English, and people who rarely use smartphones.

## Who it is for
**Kamla, 62**, visits alone, reads a little Hindi, has a basic Android phone, walks slowly and avoids stairs. It also serves helpers, patients with disabilities, and hospital staff who run the queues.

## What it does (one line per screen)
| Screen | Route | What it does |
|---|---|---|
| Home | `/` | Four big buttons (Register, I have my slip, Find a place, Emergency). Asks for a language on first visit, each shown in its own script. |
| Register | `/register` | One question per screen with a progress bar, picture cards for the doctor, microphone input, helper mode. |
| OPD slip | `/slip/:token` | Token, room, floor, doctor, people ahead, wait, QR code. Save as picture, print, read aloud, show large to staff. |
| My turn | `/turn/:token` | Place in the queue, token now serving, doctor status, what to do next. Alert when 3 are ahead. Big "your turn" screen with directions. |
| I have my slip | `/have` | Type the token, or scan the QR code where the browser supports it. |
| Find a place | `/find` | Floor plans with the route drawn, step-by-step directions with landmarks, Avoid stairs, Listen, I'm lost. |
| Emergency | `/emergency` | Route to Emergency (Casualty), 112 and 108, the list of warning signs. No token needed. |
| Settings | `/settings` | Language, text size (3 steps), high contrast, read aloud, avoid stairs, helper mode. |
| Staff dashboard | `/staff` | All queues, call next, no-show, end of queue, move department, doctor status, crowd colours, urgent flags, demo controls. |
| Registration counter | `/staff/counter` | Register a patient who has no phone and print the slip. |
| Waiting-room board | `/board` | TV view: token being served per room, next three, delays. Alternates English and Hindi. Announces calls aloud. |

## How emergencies are handled
- An **Emergency** button and an **I need urgent help** button are fixed at the bottom of every patient screen, including before registration.
- Emergency shows the route on the map, says "go now or tell any staff member", and shows 112 and 108. No token, no form.
- **I need urgent help** is one tap. The flag goes to the top of the staff dashboard, with a repeating alarm, until a staff member marks it as seen.
- **The app never decides who is urgent.** It never says someone can wait and never puts an urgent case behind registration or a token. Only doctors and nurses can judge an emergency. A wrong "you are fine" from an app could cost a life, so the app only gets people to staff faster.

## Design decisions and why
- **Helper mode:** many patients come with a relative or a volunteer. It turns on bigger text, read-aloud and step-free routes, and lets a helper type for the patient.
- **Picture cards:** the doctor choice is shown as icon plus plain words ("fever, cough, BP, sugar") because people know their symptoms, not department names. "Not sure?" shows the way to the Help desk.
- **Avoid stairs:** removes stair paths from the graph *before* the shortest path is worked out, so it can never route through stairs. The route uses lifts and the ramp.
- **Languages:** English and Hindi. Every string, including directions, landmarks and announcements, lives in `src/i18n`.
- **Read aloud:** every screen can be read aloud, and each direction step has its own Listen button, for people who read little.
- **Plain design:** 18px+ text, 56px+ buttons, high contrast, visible keyboard focus, icon plus word on every button, and never colour alone.

## How waiting time is worked out
`wait = people ahead x average of the last 10 consultations in that room (sample average at the start) + doctor delay`, rounded to 5 minutes and shown as "about". The delay is the minutes the doctor is running late, or the minutes left on a break. It updates every time the queue moves.

## How it improves on a hospital visit today
| Today | With OPD Saathi |
|---|---|
| Stand in a line to learn your number | Register on your phone, or at the counter, in your language |
| Read an English slip, ask around for the room | Directions from the slip to the door, with landmarks |
| Wait in the corridor, afraid to miss your turn | Live place in the queue and an alert when your turn is close |
| Stairs are the only signposted way | Step-free route on request |
| Emergency depends on someone noticing | One tap flags staff with an alarm |

## How to run
```
npm install
npm run dev          # http://localhost:5173
npm run build        # production build in dist/
npm run test:routes  # checks the hospital graph
```
Open `/`, `/staff` and `/board` in three tabs of **one browser**. The shared state uses localStorage and BroadcastChannel, so tabs sync live.

## What is simulated
- The hospital, doctors and patients are made up. No real Aadhaar or ABHA number is ever asked for.
- The demo clock starts at 09:30 and can run 10x.
- The SMS is shown on screen. No real SMS is sent.
- Sync works between tabs of one browser only (no server yet).
- No staff login. A real hospital needs one.

## What we would build next
Server sync across phones with a staff PIN, offline PWA, Tamil and other regional languages, real SMS, a staff login, and integration with the hospital's own system.
