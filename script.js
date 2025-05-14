alert("script.js is loading correctly.");

window.showMoonPhase = async function showMoonPhase() {
  const dateInput = document.getElementById('moonDate').value;
  if (!dateInput) return;

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
    eventsHTML += `<div class="event"><strong>🇺🇸 September 11, 2001:</strong> A day of remembrance for the U.S. <br><em>Never forget.</em></div>`;
  }

  const seenDescriptions = new Set();

  for (const event of events) {
    if (seenDescriptions.has(event.description)) continue;
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
    <h2>${phaseData.name} — ${date.toUTCString().split(' ').slice(0, 4).join(' ')}</h2>
    <img src="${phaseData.image}" alt="Moon phase" style="max-width:300px; border-radius: 8px;"><br><br>
    ${eventsHTML}
  `;
};

// --- Supporting functions (must stay outside the above)
function toJulianDate(date) {
  return (date.getTime() / 86400000) + 2440587.5;
}

function getMoonPhaseData(phase) {
  const phases = [
    { max: 1.84566, name: "New Moon", emoji: "🌑", image: "images/New Moon.jpg" },
    { max: 5.53699, name: "Waxing Crescent", emoji: "🌒", image: "images/Waxing Crescent.jpg" },
    { max: 9.22831, name: "First Quarter", emoji: "🌓", image: "images/First Quarter.jpg" },
    { max: 12.91963, name: "Waxing Gibbous", emoji: "🌔", image: "images/Waxing Gibbous.jpg" },
    { max: 16.61096, name: "Full Moon", emoji: "🌕", image: "images/Full Moon.jpg" },
    { max: 20.30228, name: "Waning Gibbous", emoji: "🌖", image: "images/Waning Gibbous.jpg" },
    { max: 23.99361, name: "Last Quarter", emoji: "🌗", image: "images/Last Quarter.jpg" },
    { max: 27.68493, name: "Waning Crescent", emoji: "🌘", image: "images/Waning Crescent.jpg" },
    { max: 29.53059, name: "New Moon", emoji: "🌑", image: "images/New Moon.jpg" }
  ];
  return phases.find(p => phase < p.max);
}
