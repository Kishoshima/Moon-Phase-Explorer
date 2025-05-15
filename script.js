// --- Main Function (for Find Phase button)
alert("script.js is running"); //debug


window.showMoonPhase = async function showMoonPhase() {
  const dateInput = document.getElementById('moonDate').value;
  if (!dateInput) return;

  // Show "Working…" message
  document.getElementById('loadingMessage').style.display = 'block';

  const [year, month, day] = dateInput.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const jd = toJulianDate(date);

  const daysSinceNew = jd - 2451550.1;
  const newMoons = daysSinceNew / 29.53058867;
  const phase = (newMoons - Math.floor(newMoons)) * 29.53058867;

  const phaseData = getMoonPhaseData(phase);
  const eventMonth = date.getUTCMonth() + 1;
  const eventDay = date.getUTCDate();
  const events = await fetchHistoricalEvents(eventMonth, eventDay);

  let eventsHTML = "";

  if (eventMonth === 9 && eventDay === 11) {
    eventsHTML += `
      <div class="event">
        <div class="event-text">
          <strong>🇺🇸 September 11, 2001:</strong> A day of remembrance for the U.S. <br><em>Never forget.</em>
        </div>
      </div>`;
  }

  const seenDescriptions = new Set();

  for (const event of events) {
    if (seenDescriptions.has(event.description)) continue;
    seenDescriptions.add(event.description);

    const imageUrl = await fetchWikiImage(event.wikipedia[0]?.title || "");
    eventsHTML += `
      <div class="event">
        <div class="event-text">
          <strong>${event.year}:</strong> ${event.description}
        </div>
        ${imageUrl ? `<div class="event-img"><img src="${imageUrl}" alt="Event image"></div>` : ""}
      </div>
    `;
  }

  document.getElementById('result').innerHTML = `
    <h2>${phaseData.name} — ${date.toUTCString().split(' ').slice(0, 4).join(' ')}</h2>
    <img src="${phaseData.image}" alt="Moon phase" style="max-width:300px; border-radius: 8px;"><br><br>
    ${eventsHTML}
  `;

  // Hide "Working…" message
  document.getElementById('loadingMessage').style.display = 'none';
};

// --- Helpers

function toJulianDate(date) {
  return (date.getTime() / 86400000) + 2440587.5;
}

function getMoonPhaseData(phase) {
  const phases = [
    { max: 1.84566, name: "New Moon", image: "images/New Moon.jpg" },
    { max: 5.53699, name: "Waxing Crescent", image: "images/Waxing Crescent.jpg" },
    { max: 9.22831, name: "First Quarter", image: "images/First Quarter.jpg" },
    { max: 12.91963, name: "Waxing Gibbous", image: "images/Waxing Gibbous.jpg" },
    { max: 16.61096, name: "Full Moon", image: "images/Full Moon.jpg" },
    { max: 20.30228, name: "Waning Gibbous", image: "images/Waning Gibbous.jpg" },
    { max: 23.99361, name: "Last Quarter", image: "images/Last Quarter.jpg" },
    { max: 27.68493, name: "Waning Crescent", image: "images/Waning Crescent.jpg" },
    { max: 29.53059, name: "New Moon", image: "images/New Moon.jpg" }
  ];
  return phases.find(p => phase < p.max);
}

async function fetchHistoricalEvents(month, day) {
  const url = `https://byabbe.se/on-this-day/${month}/${day}/events.json`;
  const response = await fetch(url);
  if (!response.ok) return [];
  const data = await response.json();
  return data.events.slice(0, 15);
}

async function fetchWikiImage(title) {
  const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  try {
    const res = await fetch(searchUrl);
    if (!res.ok) return null;
    const json = await res.json();
    return json.thumbnail?.source || null;
  } catch {
    return null;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("findBtn");
  btn.addEventListener("click", showMoonPhase);
});
