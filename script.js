const tips = [
  "Tip of the day: Pack versatile outfits.",
  "Tip of the day: Download offline maps before departure.",
  "Tip of the day: Keep digital copies of important documents.",
  "Tip of the day: Leave room in your luggage for souvenirs."
];

const recommendations = {
  "Beach & Relaxation": "a tropical island getaway",
  "Culture & History": "a historic city itinerary",
  "Adventure & Nature": "a mountain and trail adventure"
};

const tipText = document.getElementById("tip-text");
const tipButton = document.getElementById("new-tip");
const planForm = document.getElementById("plan-form");
const formMessage = document.getElementById("form-message");
const yearSpan = document.getElementById("year");
const dayRange = document.getElementById("days");
const dayCount = document.getElementById("day-count");

let tipIndex = 0;

tipButton?.addEventListener("click", () => {
  tipIndex = (tipIndex + 1) % tips.length;
  if (tipText) {
    tipText.textContent = tips[tipIndex];
  }
});

dayRange?.addEventListener("input", () => {
  if (dayCount) {
    dayCount.textContent = dayRange.value;
  }
});

planForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(planForm);
  const name = String(formData.get("name") || "Traveler").trim();
  const style = String(formData.get("style") || "");
  const days = String(formData.get("days") || "7");

  const suggestedTrip = recommendations[style] || "custom destination ideas";

  if (formMessage) {
    formMessage.textContent = `${name}, great choice! For ${days} days, we recommend ${suggestedTrip}.`;
  }
});

if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}
