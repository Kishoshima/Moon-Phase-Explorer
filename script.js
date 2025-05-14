async function fetchHistoricalEvents(month, day) {
  const url = `https://byabbe.se/on-this-day/${month}/${day}/events.json`;
  const response = await fetch(url);
  if (!response.ok) return [];
  const data = await response.json();
  return data.events.slice(0, 15); // up to 15 events
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

function getMoonPhaseData(phase) {
  const phases = [
    { max: 1.84566, name: "New Moon", emoji: "🌑", image: "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004768/phase_00_newmoon.jpg" },
    { max: 5.53699, name: "Waxing Crescent", emoji: "🌒", image: "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004768/phase_01_waxingcrescent.jpg" },
    { max: 9.22831, name: "First Quarter", emoji: "🌓", image: "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004768/phase_02_firstquarter.jpg" },
    { max: 12.91963, name: "Waxing Gibbous", emoji: "🌔", image: "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004768/phase_03_waxinggibbous.jpg" },
    { max: 16.61096, name: "Full Moon", emoji: "🌕", image: "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004768/phase_04_fullmoon.jpg" },
    { max: 20.30228, name: "Waning Gibbous", emoji: "🌖", image: "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004768/phase_05_waninggibbous.jpg" },
    { max: 23.99361, name: "Last Quarter", emoji: "🌗", image: "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004768/phase_06_lastquarter.jpg" },
    { max: 27.68493, name: "Waning Crescent", emoji: "🌘", image: "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004768/phase_07_waningcrescent.jpg" },
    { max: 29.53059, name: "New Moon", emoji: "🌑", image: "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004768/phase_00_newmoon.jpg" }
  ];
  return phases.find(p => phase < p.max);
}

async function showMoonPhase() {
  const dateInput = document.getElementById('moonDate').value;
  if (!dateInput) return;

  const date = new Date(dateInput);
  const jd = Math.floor((date / 86400000) + 2440587.5);
  const daysSinceNew = jd - 2451550.1;
  const newMoons = daysSinceNew / 29.53058867;
  const phase = (newMoons - Math.floor(newMoons)) * 29.53058867;

  const phaseData = getMoonPhaseData(phase);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const events = await fetchHistoricalEvents(month, day);

  let eventsHTML = "";

  if (month === 9 && day === 11) {
    eventsHTML += `<div class="event"><strong>🇺🇸 September 11, 2001:</strong> A day of remembrance for the U.S. <br><em>Never forget.</em></div>`;
  }

  const seenDescriptions = new Set();

  for (const event of events) {
    if (seenDescriptions.has(event.description)) continue; // Skip duplicate
    seenDescriptions.add(event.description);

    const imageUrl = await fetchWikiImage(event.wikipedia[0]?.title || "");
    eventsHTML += `
      <div class="event">
        <strong>${event.year}:</strong> ${event.description}
        ${imageUrl ? `<img src="${imageUrl}" alt="Event image">` : ""}
      </div>
    `;
  }


      document.getElementById('result').innerHTML = `
      <div class="moon-emoji">${phaseData.emoji}</div>
      <h2>${phaseData.name} — ${date.toDateString()}</h2>
      <img src="${phaseData.image}" alt="Moon phase" style="max-width:300px; border-radius: 8px;"><br><br>
      ${eventsHTML}
      `;
      }
