
const normalBGM = new Audio('assets/audio/normal.mp3');
const horrorBGM = new Audio('assets/audio/horror.mp3');

normalBGM.loop = true;
horrorBGM.loop = true;

normalBGM.volume = 0;
horrorBGM.volume = 0;

let currentBGM = null;
let audioUnlocked = false;
let fadeTimers = new Map();

function fadeTo(audio, targetVolume, duration = 1800) {
  clearInterval(fadeTimers.get(audio));

  const startVolume = audio.volume;
  const steps = 36;
  const interval = duration / steps;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    audio.volume = Math.max(
      0,
      Math.min(1, startVolume + (targetVolume - startVolume) * step / steps)
    );

    if (step >= steps) {
      clearInterval(timer);
      fadeTimers.delete(audio);
      audio.volume = targetVolume;
    }
  }, interval);

  fadeTimers.set(audio, timer);
}

function playBGMForDay(day) {
    // Day 5 开始切换为阴暗 UI
document.body.classList.toggle('horror-mode', day >= 5);

  if (!audioUnlocked) return;

  const nextBGM = day <= 4 ? normalBGM : horrorBGM;

  if (currentBGM === nextBGM && !nextBGM.paused) return;

  const previousBGM = currentBGM;
  currentBGM = nextBGM;

  nextBGM.volume = 0;
 nextBGM.play().then(() => {
  if (nextBGM === normalBGM) {
    fadeTo(nextBGM, 0.12, 1800); // Normal：12%
  } else {
    fadeTo(nextBGM, 0.40, 1800); // Horror：40%
  }
fadeTo(nextBGM, targetVolume);

    if (previousBGM && previousBGM !== nextBGM) {
      fadeTo(previousBGM, 0, 1800);
      setTimeout(() => previousBGM.pause(), 1900);
    }
  }).catch(error => {
    console.warn('BGM playback failed:', error);
  });
}

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  playBGMForDay(1);
}

document.addEventListener('pointerdown', unlockAudio, { once: true });
document.addEventListener('keydown', unlockAudio, { once: true });

window.playBGMForDay = playBGMForDay;


// Click sound effect
const clickSFX = new Audio('assets/audio/click.mp3');
clickSFX.volume = 0.22;

document.addEventListener('click', (event) => {
  const interactive = event.target.closest(
    'button, [role="button"], .file-row, a, input, select'
  );

  if (!interactive || interactive.disabled) return;

  clickSFX.currentTime = 0;
  clickSFX.play().catch(() => {});
});
