let audio: HTMLAudioElement | null = null;
let unlocked = false;

function getAudio() {
  if (typeof window === "undefined") return null;
  if (!audio) {
    audio = new Audio("/sounds/notification.wav");
    audio.volume = 0.5;
  }
  return audio;
}

// Browsers block all audio until the user interacts with the page at least
// once. Call this from a one-time click/keydown listener so later,
// unattended calls to playNotificationSound() are actually allowed to play.
export function unlockNotificationSound() {
  if (unlocked) return;
  const el = getAudio();
  if (!el) return;
  el.play()
    .then(() => {
      el.pause();
      el.currentTime = 0;
      unlocked = true;
    })
    .catch(() => {
      // Still locked — we'll try again on the next gesture.
    });
}

export function playNotificationSound() {
  const el = getAudio();
  if (!el) return;
  el.currentTime = 0;
  el.play().catch(() => {
    // Autoplay blocked (no user gesture yet this session) — fail silently,
    // the visual badge still updates regardless.
  });
}