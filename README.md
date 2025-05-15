# Moon Phase Explorer

An educational web app that helps students explore the **moon phase** on their date of birth and learn about **historic events** that happened on that same day.

---

## Live Site

(https://kishoshima.github.io/Moon-Phase-Explorer/)

---

## Features

- Calculates the moon phase for any selected date
- Displays a high-quality moon phase image
- Pulls historical events from [byabbe.se](https://byabbe.se/on-this-day/)
- Retrieves images for events from Wikipedia for visual context
- Includes a dedicated 9/11 remembrance
- Optimized for classroom use — no login or accounts required
- Works fully in-browser (no server or backend)

---

## Designed For

- Middle school or high school science and history classes
- Students learning about lunar cycles, moon phases, and timelines
- Interactive classroom exploration tools

---

## Security Notes

- No user data is collected or stored
- Entire app is static (HTML, CSS, JS only)
- All API calls are read-only and use HTTPS:
  - `https://byabbe.se/on-this-day/`
  - `https://en.wikipedia.org/api/rest_v1/`
- Images are loaded from Wikipedia's CDN or local resources
- Compatible with GitHub Pages — no custom ports used

---

## How To Run Locally

```bash
# Clone the repository
git clone https://github.com/kishoshima/moon-phase-explorer.git
cd moon-phase-explorer

# Open index.html directly, or serve with Live Server
python3 -m http.server
# then open http://localhost:8000 in your browser
