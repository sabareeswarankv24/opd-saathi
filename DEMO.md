# 3-minute demo script and live-demo checklist

## Setup (before judges arrive)
1. `npm run dev`. Open three windows side by side in **one browser**: patient `/` (narrow, phone-sized), staff `/staff`, board `/board`.
2. On staff tap **Turn the alarm sound on**. On the board tap the sound button. This unlocks sound.
3. On staff press **Reset everything** so the start is clean.
4. On the patient window, clear the language choice (Settings is fine) so first-visit shows.

## Script

**0:00 Problem (15 s).** "In a government hospital, people queue for hours, then cannot find the room on the slip. Meet Kamla, 62, reads a little Hindi, avoids stairs."

**0:15 Language and registration (40 s).** Pick **हिंदी**. *Solves: people who do not read English.* Tap Register. Switch on **Someone is helping me**. *Solves: elderly patients and helpers, with bigger text and read-aloud.* Type "Kamla", 62, woman, skip mobile. Point out the emergency signs on the first screen: *"Any of these? Go to Emergency, no token needed."* Pick the picture card **General Medicine**. *Solves: choosing a department without knowing the names.*

**1:00 Slip and board (25 s).** The slip shows token, room, floor, doctor, wait, QR. Point to the staff window and the board: Kamla is already there. *Solves: no standing in line to get a number.* Tap **Listen**.

**1:25 Avoid-stairs route (35 s).** Tap **Find my room**. Avoid stairs is on. Show the lift route on the floor plans and a step with a landmark ("opposite the blue chairs"). *Solves: not finding the room, and avoiding stairs.* Optionally press **I'm lost** to show the card for staff.

**2:00 The "3 ahead" alert (30 s).** Open **My turn**. On staff press **Call next** until 3 are ahead. The phone gets a banner, a sound, and the simulated SMS. Then call until Kamla's token: the big **It is your turn** screen appears and the board announces it aloud. *Solves: not knowing when to go in.* Set a doctor break on staff and show the wait grow on the patient screen.

**2:30 Urgent flag (20 s).** On the patient screen tap **I need urgent help**. The red flag lands at the top of staff with an alarm. Press **Mark as seen**. *Solves: emergencies are never stuck in a queue. The app never decides who is urgent, staff do.*

**2:50 Close (10 s).** "Registration in your language, directions to the door, a live queue, and emergencies first. Next: server sync across phones, offline mode, more languages."

## What could go wrong, and how to avoid it
| Risk | Avoid it |
|---|---|
| No sound or announcement | Tap the sound buttons on staff and the board first. Browsers need one tap. |
| Hindi voice missing on the laptop | Test Listen beforehand. Use Chrome or Edge. Be ready to demo without voice. |
| Tabs do not sync | Use tabs of **one browser profile**, not incognito, not two browsers. Same address (`localhost` vs an IP are different). |
| Camera scan not offered | Normal in some browsers. Use token entry. |
| Microphone not offered or noisy | Type instead. Mention it is supported where the browser allows. |
| Old data from earlier rehearsal | Press **Reset everything** before starting. |
| Alert at "3 ahead" fires before you are ready | Register when the queue has 4+ ahead, then call next once at a time. |
| Notifications blocked | The banner and SMS card still show on screen. |
| Wi-Fi fails | The app runs fully on localhost with no internet. |
| Console shows a crash | A crash shows an error screen with Home. Press Home, then Reset. |
