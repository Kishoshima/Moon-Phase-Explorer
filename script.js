// Attach to global scope so button can access it
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
    { max: 1.84566, name: "New Moon", emoji: "🌑", image: "https://upload.wikimedia.org/wikipedia/commons/0/09/New_Moon.jpg" },
    { max: 5.53699, name: "Waxing Crescent", emoji: "🌒", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Moon_phase_Waxing_Crescent.svg/512px-Moon_phase_Waxing_Crescent.svg.png" },
    { max: 9.22831, name: "First Quarter", emoji: "🌓", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Moon_phase_first_quarter.svg/512px-Moon_phase_first_quarter.svg.png" },
    { max: 12.91963, name: "Waxing Gibbous", emoji: "🌔", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Moon_phase_Waxing_Gibbous.svg/512px-Moon_phase_Waxing_Gibbous.svg.png" },
    { max: 16.61096, name: "Full Moon", emoji: "🌕", image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/FullMoon2010.jpg" },
    { max: 20.30228, name: "Waning Gibbous", emoji: "🌖", image
