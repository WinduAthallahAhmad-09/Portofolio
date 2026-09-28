import { Howl, Howler } from 'howler';

let ambientSound: Howl | null = null;
let hoverSound: Howl | null = null;
let clickSound: Howl | null = null;

let isSoundEnabled = false;

export const initAudio = () => {
  if (typeof window === 'undefined') return;

  const pref = localStorage.getItem('sound-pref');
  if (pref === 'on') {
    enableAudio();
  }

  // Handle visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      Howler.mute(true);
    } else {
      if (isSoundEnabled) Howler.mute(false);
    }
  });
  
  // Attach toggle listeners
  const desktopToggle = document.getElementById('sound-toggle-desktop');
  const mobileToggle = document.getElementById('sound-toggle-mobile');
  
  const handleToggle = () => {
    if (isSoundEnabled) disableAudio();
    else enableAudio();
  };

  desktopToggle?.addEventListener('click', handleToggle);
  mobileToggle?.addEventListener('click', handleToggle);
  
  // Attach hover/click events globally
  document.addEventListener('mouseover', (e) => {
    if (!isSoundEnabled || !hoverSound) return;
    const target = e.target as HTMLElement;
    if (target.closest('a, button, [data-cursor="view"]')) {
      if (!hoverSound.playing()) {
        hoverSound.play();
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!isSoundEnabled || !clickSound) return;
    const target = e.target as HTMLElement;
    if (target.closest('a, button')) {
      clickSound.play();
    }
  });
};

export const enableAudio = () => {
  isSoundEnabled = true;
  localStorage.setItem('sound-pref', 'on');
  Howler.mute(false);
  updateEqualizerUI(true);

  if (!ambientSound) {
    ambientSound = new Howl({
      src: ['/audio/ambient.mp3'],
      loop: true,
      volume: 0,
      html5: true // better for large background audio
    });
    
    hoverSound = new Howl({ src: ['/audio/hover.mp3'], volume: 0.15 });
    clickSound = new Howl({ src: ['/audio/click.mp3'], volume: 0.2 });
    
    ambientSound.play();
    ambientSound.fade(0, 0.35, 1500);
  } else if (!ambientSound.playing()) {
    ambientSound.play();
    ambientSound.fade(0, 0.35, 1500);
  }
};

export const disableAudio = () => {
  isSoundEnabled = false;
  localStorage.setItem('sound-pref', 'off');
  Howler.mute(true);
  updateEqualizerUI(false);
  if (ambientSound && ambientSound.playing()) {
    ambientSound.pause();
  }
};

const updateEqualizerUI = (playing: boolean) => {
  const eqBars = document.querySelectorAll('#sound-toggle-desktop span, #sound-toggle-mobile span');
  eqBars.forEach((bar) => {
    const el = bar as HTMLElement;
    if (playing) {
      el.style.animation = 'equalizer 1s infinite alternate ease-in-out';
      // randomize delay
      el.style.animationDelay = `${Math.random() * 0.5}s`;
    } else {
      el.style.animation = 'none';
      el.style.transform = 'scaleY(0.2)';
    }
  });
};
