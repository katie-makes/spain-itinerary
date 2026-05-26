# Product Requirements Document — Itinerario (ESP 26)

**Product:** Barcelona & Costa Brava group trip itinerary  
**Trip dates:** 29 May – 6 June 2026 (9 days)  
**Travelers:** Hanna, Katie, Sunny  
**Version:** 1.0 (as-built)  
**Last updated:** May 2026

---

## 1. Overview

### 1.1 Problem

A shared trip needs one place to see what is booked, what is still open, where things are on a map, and a curated list of saved restaurants, shops, and sights—without juggling spreadsheets, screenshots, and separate Google Maps lists.

### 1.2 Solution

A static, editorial-style web app that combines:

- A full-viewport hero and day-by-day itinerary
- An interactive map with photo pins per day
- A searchable directory (~40 saved places + live place search)
- Lightweight personalization: fill open windows, edit items, persist in the browser

### 1.3 Product goals

| Goal | Description |
|------|-------------|
| **Clarity** | Confirmed plans read as anchors; open time reads as flexible. |
| **Discovery** | Browse and search places, then assign them to the right day and slot. |
| **Orientation** | Map + day jumper tie schedule to geography. |
| **Collaboration-ready** | Same baseline itinerary; each browser can customize locally (no account yet). |

### 1.4 Primary users

| Persona | Needs |
|---------|--------|
| **Trip planner** | See reservations, fill gaps, adjust times and notes. |
| **Traveler** | Skim the day, open Maps for a venue, jump to map view. |
| **Curator** | Maintain directory data from Google Maps lists. |

---

## 2. Scope

### 2.1 In scope (v1)

- 9-day itinerary (Barcelona + Costa Brava)
- Confirmed vs open activity states
- Map explorer (Leaflet) with day tabs and stop list
- Directory with filters and Nominatim search
- Slot picker modal (day, open window, time frame, place)
- Edit sheet (time, title, notes; remove user-added items)
- Place bottom sheet → Google Maps
- `localStorage` persistence for adds and edits
- Static deploy (Netlify + GitHub)

### 2.2 Out of scope (v1)

- Multi-user sync / accounts
- Server-side API or database
- Real-time collaboration
- Booking or payments
- Offline PWA
- Push notifications

---

## 3. Information architecture

```
Hero → Day jumper (sticky) → Map explorer → Itinerary (day cards) → Directory → Footer

Modals / sheets:
  - Picker modal (fill open slot / add from directory)
  - Edit sheet (itinerary item)
  - Place sheet (venue → Google Maps)
```

---

## 4. User stories

Stories are grouped by epic. Priority: **P0** = must have for trip use, **P1** = important polish, **P2** = nice to have / future.

---

### Epic A — Landing & brand

| ID | Priority | User story | Acceptance criteria |
|----|----------|------------|---------------------|
| A-1 | P0 | As a **traveler**, I want to **see the trip name and dates immediately**, so that I know I am on the right itinerary. | Hero shows “Barcelona & Costa Brava”; dates show May 29 – Jun 6, 2026; header meta matches. |
| A-2 | P0 | As a **traveler**, I want a **full-screen hero with a coastal photo**, so that the site feels like a travel carnet, not a spreadsheet. | Hero height is 100vh; background image with scrim; title is large and readable. |
| A-3 | P1 | As a **traveler**, I want a **clear call to enter the itinerary**, so that I know where to scroll next. | “turn the page →” links to `#itinerary`. |
| A-4 | P1 | As a **traveler**, I want **consistent branding** (itinerario · esp 26), so that the trip feels cohesive. | Logo, footer, and page title use shared naming. |

---

### Epic B — Global navigation

| ID | Priority | User story | Acceptance criteria |
|----|----------|------------|---------------------|
| B-1 | P0 | As a **traveler**, I want **sticky header navigation** to Map, Itinerary, and Directory, so that I can jump between sections on long pages. | Header stays visible; anchor links scroll to sections. |
| B-2 | P0 | As a **traveler**, I want a **day jumper** (Day 01–09), so that I can skip to any day without scrolling the full list. | Sticky bar below hero; buttons scroll to `#day-N` and sync map when applicable. |
| B-3 | P1 | As a **traveler**, I want the **header to account for fixed chrome**, so that anchored content is not hidden under the nav. | Scroll offset / padding respects header height on jump. |

---

### Epic C — Map explorer

| ID | Priority | User story | Acceptance criteria |
|----|----------|------------|---------------------|
| C-1 | P0 | As a **traveler**, I want to **select a day on the map**, so that I only see stops relevant to that day. | Day tabs on map; switching day updates markers and side panel. |
| C-2 | P0 | As a **traveler**, I want **photo pins on the map**, so that stops feel tangible and easy to spot. | Custom markers with thumbnails; click pin focuses stop. |
| C-3 | P0 | As a **traveler**, I want a **side panel listing stops** for the active day, so that I can read details without only using the map. | Panel shows day kicker, title, hint, stop list with time, name, category. |
| C-4 | P0 | As a **traveler**, I want **clicking a stop in the list to focus the map**, so that list and map stay in sync. | Active stop highlighted; map pans/zooms to marker. |
| C-5 | P1 | As a **traveler**, I want to **open a driving route in Google Maps**, so that I can navigate between first and last stop of the day. | “Open route” opens Google Maps directions when ≥2 stops; single stop opens search. |
| C-6 | P1 | As a **traveler**, I want to **jump from the map panel to the day card**, so that I can read the full schedule. | “View day card ↓” scrolls to itinerary day section. |
| C-7 | P1 | As a **traveler**, I want **days without map data** to show a helpful empty state, so that I am not confused on travel-only days. | e.g. Day 1 shows “No mapped stops this day — travel or flexible time.” |
| C-8 | P1 | As a **traveler**, I want the **map panel shadow to feel soft and modern**, so that the UI does not look harsh or dated. | Panel uses subtle elevation, not heavy glass inset shadow. |

---

### Epic D — Itinerary (read)

| ID | Priority | User story | Acceptance criteria |
|----|----------|------------|---------------------|
| D-1 | P0 | As a **traveler**, I want to **see all 9 days in order**, so that I can follow the trip chronologically. | One card per day: number, date, location, hint, schedule. |
| D-2 | P0 | As a **traveler**, I want **confirmed activities** to look distinct from **open windows**, so that I know what is locked vs flexible. | Legend: Confirmed vs Open; open rows use dashed border. |
| D-3 | P0 | As a **traveler**, I want each day card to show **region, caption, and photo**, so that days feel visually distinct. | Unsplash photos with gradient fallback; region tag on image. |
| D-4 | P1 | As a **traveler**, I want **times displayed consistently** (e.g. lowercase am/pm), so that the schedule scans cleanly. | Time labels normalized in UI. |
| D-5 | P1 | As a **traveler**, I want **notes on confirmed items** (e.g. address, reservation owner), so that logistics are on the page. | Notes render under title for confirmed rows. |
| D-6 | P1 | As a **traveler**, I want to **open the map for a day from the day card**, so that I do not hunt for the map section. | “View on map” sets map day and scrolls to map (when day has stops). |

---

### Epic E — Open slots & planning

| ID | Priority | User story | Acceptance criteria |
|----|----------|------------|---------------------|
| E-1 | P0 | As a **planner**, I want **open windows** to show title + optional suggestion, so that I know the intent without clutter. | Open row: title; notes prefixed as “Suggestion · …”; no “Tap to fill” copy. |
| E-2 | P0 | As a **planner**, I want to **click an open window to add a place**, so that filling the schedule is one action. | Click opens picker modal scoped to that day/slot. |
| E-3 | P0 | As a **planner**, I want to **pick a place from the directory or search**, so that I am not limited to preloaded names. | Picker: directory grid + search (Nominatim) with results. |
| E-4 | P0 | As a **planner**, I want to **choose a time frame** (morning / afternoon / evening / flexible / custom), so that the new item sorts sensibly in the day. | Time frame chips; custom time input when “Custom” selected. |
| E-5 | P0 | As a **planner**, I want the **new activity inserted as a confirmed row** (not nested inside the dashed box), so that the day reads as a real plan. | Added item appears as confirmed line; open slot remains for other fills if applicable. |
| E-6 | P1 | As a **planner**, I want to **add from the directory without pre-selecting a slot**, so that I can start from a place and then choose day/window. | “Add to day” on directory card opens picker with day/slot selectors visible. |
| E-7 | P1 | As a **planner**, I want **search biased to Barcelona or Costa Brava** when picking time, so that results are relevant to the trip region. | Nominatim viewbox adjusts by day region when available. |
| E-8 | P1 | As a **planner**, I want **added plans to persist after refresh**, so that I do not lose work. | `localStorage` key `itinerario-added-activities`; reload restores state. |

---

### Epic F — Directory & place discovery

| ID | Priority | User story | Acceptance criteria |
|----|----------|------------|---------------------|
| F-1 | P0 | As a **traveler**, I want to **browse ~40 curated places**, so that I can explore saved list picks in one grid. | Cards with photo, category, list source, name, tags, description. |
| F-2 | P0 | As a **traveler**, I want to **filter by list and category**, so that I can narrow to Barcelona list, Costa Brava, eat & drink, shops, or sights. | Filter chips update grid; empty state when no matches. |
| F-3 | P0 | As a **traveler**, I want to **search saved places by text**, so that I can find a name quickly. | Directory search filters grid client-side. |
| F-4 | P0 | As a **traveler**, I want to **search any place via OpenStreetMap**, so that I can add venues not in the curated file. | Query ≥3 chars triggers Nominatim; selecting result opens add flow. |
| F-5 | P1 | As a **traveler**, I want **links to the original Google Maps lists**, so that I can open the source lists in Maps. | Barcelona list + Costa Brava list external links in directory header. |
| F-6 | P1 | As a **traveler**, I want to **preview a directory place on the map**, so that I can see where it is before adding. | “On map” flies map to coordinates (heuristic day for region). |

---

### Epic G — Edit & remove

| ID | Priority | User story | Acceptance criteria |
|----|----------|------------|---------------------|
| G-1 | P0 | As a **planner**, I want to **edit time, title, and notes** on any activity, so that I can fix typos and updates. | Edit sheet with three fields; Save writes to `itinerario-edits`. |
| G-2 | P1 | As a **planner**, I want **Edit to appear on hover** (desktop), so that the schedule stays minimal until I need it. | Edit hidden by default; visible on row hover / focus-within; always visible on touch. |
| G-3 | P0 | As a **planner**, I want to **remove activities I added from the directory**, so that I can undo a bad pick. | Remove button only for `isAdded` items; clears from storage and rebuilds day. |
| G-4 | P1 | As a **planner**, I want **edits to persist**, so that changes survive refresh. | Edits merged on load via `rebuildItineraryState()`. |
| G-5 | P2 | As a **planner**, I want **legacy linked-spot data migrated** to confirmed rows, so that old browser data still works. | Migration from `itinerario-spot-links` to added-activities format. |

---

### Epic H — Places & external maps

| ID | Priority | User story | Acceptance criteria |
|----|----------|------------|---------------------|
| H-1 | P0 | As a **traveler**, I want **known venues to be tappable**, so that I can get location details. | Confirmed titles with resolved place open bottom sheet. |
| H-2 | P0 | As a **traveler**, I want to **open a venue in Google Maps**, so that I can navigate there. | Place sheet includes “Open in Google Maps” with lat/lng or query URL. |
| H-3 | P1 | As a **traveler**, I want **addresses inferred from notes** when they look like locations, so that more items become tappable without manual setup. | `resolvePlace()` matches directory, map stops, and keyword index. |

---

### Epic I — Content & data

| ID | Priority | User story | Acceptance criteria |
|----|----------|------------|---------------------|
| I-1 | P0 | As a **product owner**, I want the **baseline 9-day schedule** defined in code, so that all travelers start from the same plan. | `BASE_ITINERARY` in `script.js`: flights, hotels, tours, dinners, open slots. |
| I-2 | P0 | As a **product owner**, I want **map stops per day** defined separately, so that the map shows geography even when the schedule is prose-heavy. | `DAY_STOPS` keyed by day 2–9. |
| I-3 | P1 | As a **curator**, I want to **update saved places in one data file**, so that list changes do not require editing HTML. | `directory-data.js` exports `DIRECTORY_DATA`. |
| I-4 | P1 | As a **product owner**, I want **weekday labels to match the trip year**, so that dates are trustworthy. | Day strings use correct DOW for 2026 calendar. |

---

### Epic J — UX, accessibility & responsive

| ID | Priority | User story | Acceptance criteria |
|----|----------|------------|---------------------|
| J-1 | P1 | As a **traveler**, I want the site to **work on mobile**, so that I can use it on the trip. | Responsive layout; map stacks; sheets/modals usable on small screens. |
| J-2 | P1 | As a **traveler**, I want to **close modals with Escape or backdrop**, so that interaction feels standard. | Picker, edit sheet, place sheet support dismiss. |
| J-3 | P2 | As a **traveler using a screen reader**, I want **dialogs and live regions labeled**, so that flows are navigable. | `aria-modal`, `aria-live` on map panel, tab roles on filters. |

---

### Epic K — Hosting & delivery

| ID | Priority | User story | Acceptance criteria |
|----|----------|------------|---------------------|
| K-1 | P0 | As a **planner**, I want the site **hosted on a public URL**, so that travelers can open it without running a local server. | Deployed to Netlify (or equivalent static host). |
| K-2 | P1 | As a **planner**, I want **GitHub connected to Netlify**, so that updates deploy on push. | Repo on GitHub; Netlify build publishes `.` with no build command. |
| K-3 | P1 | As a **developer**, I want **documented local run steps**, so that anyone can preview before deploy. | README: `python3 -m http.server 4173`. |

---

## 5. Functional requirements (summary)

| Area | Requirement |
|------|-------------|
| **Itinerary model** | Activity: `time`, `text`, `status` (`confirmed` \| `open`), `notes`, optional `id`, `isAdded`, `place`. |
| **Persistence** | `localStorage`: added activities, edits; legacy link migration on load. |
| **Map** | Leaflet 1.9; day-scoped markers; flyTo on focus. |
| **Search** | Nominatim OpenStreetMap API; debounced; min 3 characters. |
| **External deps** | Google Fonts, Unsplash CDN, unpkg Leaflet, Google Maps URLs. |

---

## 6. Non-functional requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | First paint without build step; lazy image probe for Unsplash. |
| **Privacy** | No analytics in v1; place search queries go to Nominatim (third party). |
| **Reliability** | Graceful fallback if search fails (“Search unavailable”). |
| **Maintainability** | Static HTML/CSS/JS; no framework; data in JS modules. |
| **Browser support** | Modern evergreen browsers; `localStorage` required for personalization. |

---

## 7. Trip content snapshot (baseline)

| Day | Date (2026) | Location | Highlights |
|-----|-------------|----------|------------|
| 1 | Fri May 29 | NYC → BCN | Red-eye departure |
| 2 | Sat May 30 | Barcelona | Land, check-in Aspasios, open PM |
| 3 | Sun May 31 | Barcelona | Open AM; Sunny arrives; La Puntual dinner |
| 4 | Mon Jun 1 | Barcelona | Gothic & Gaudí tour; open PM |
| 5 | Tue Jun 2 | Costa Brava | Car north, Mas Ses Vinyes, coves, Begurio |
| 6 | Wed Jun 3 | Costa Brava | Beach day calas; Ses Vinyes dinner |
| 7 | Thu Jun 4 | Costa Brava | Tossa kayak; Cala Pola / Marimurtra |
| 8 | Fri Jun 5 | Costa Brava | Platja Fonda; Girona day trip |
| 9 | Sat Jun 6 | Barcelona | Drive back; fly home |

---

## 8. Future backlog (post-v1)

| ID | User story |
|----|------------|
| L-1 | As a **group**, we want **one shared itinerary** synced in the cloud, so that edits from any phone appear for everyone. |
| L-2 | As a **planner**, I want to **export the itinerary to PDF or calendar**, so that I can share offline or add to Apple/Google Calendar. |
| L-3 | As a **traveler**, I want **offline map tiles**, so that the map works without data abroad. |
| L-4 | As a **curator**, I want to **import places from Google Maps list API**, so that directory stays in sync automatically. |
| L-5 | As a **planner**, I want to **assign travelers to activities**, so that we know who is on which flight or reservation. |
| L-6 | As a **traveler**, I want **dark mode**, so that the site is comfortable at night. |

---

## 9. Success metrics (suggested)

| Metric | Target |
|--------|--------|
| All travelers can open the URL on mobile | 100% before departure |
| Open slots filled for critical days | Planner-defined (e.g. Days 2, 4, 5) |
| Zero confusion between confirmed vs open | Qualitative check after first group review |
| Map used on-trip for at least one navigation | Self-reported or analytics (if added later) |

---

## 10. Appendix — Storage keys

| Key | Purpose |
|-----|---------|
| `itinerario-added-activities` | User-added confirmed rows from open slots |
| `itinerario-edits` | Patches to time / title / notes by activity id |
| `itinerario-spot-links` | Legacy format; migrated on load |

---

## 11. Appendix — Key files

| File | Role |
|------|------|
| `index.html` | Structure, modals, sections |
| `styles.css` | Editorial UI, schedule grid, map, directory |
| `script.js` | Itinerary logic, map, picker, persistence |
| `directory-data.js` | Curated places |
| `netlify.toml` | Static deploy config |
