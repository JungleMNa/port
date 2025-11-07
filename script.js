// Mobile menu toggle only
const nav = document.querySelector('.glass-nav');
const toggle = document.querySelector('.menu-toggle');
const navMenu = document.getElementById('nav-menu');

if (toggle && nav && navMenu) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Parallax background (mouse-based via transform on body::before)
(() => {

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0; // px
  let rafId = 0;

  const damp = 0.15; // smoothing factor
  const maxOffsetPx = 40; // stronger motion

  const onMove = (e) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const x = (e.clientX / vw) * 2 - 1; // -1..1
    const y = (e.clientY / vh) * 2 - 1; // -1..1
    mouseX = x * maxOffsetPx;
    mouseY = y * maxOffsetPx;
    if (!rafId) rafId = requestAnimationFrame(tick);
  };

  const tick = () => {
    targetX += (mouseX - targetX) * damp;
    targetY += (mouseY - targetY) * damp;
    document.body.style.setProperty('--tx', targetX.toFixed(2) + 'px');
    document.body.style.setProperty('--ty', targetY.toFixed(2) + 'px');
    if (Math.abs(mouseX - targetX) > 0.2 || Math.abs(mouseY - targetY) > 0.2) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = 0;
    }
  };

  document.addEventListener('pointermove', onMove, { passive: true });
})();

// Background image rotation every 30s with fade
(() => {
  const bgStack = document.getElementById('bg-stack');
  if (!bgStack) return;

  const images = [
    'BMW_M_Wallpaper_3.0_CSL_rear_Desktop.jpg',
    '683213.jpg',
    'cem-gurbuz-kaan-soloturk-b.jpg'
  ].filter(Boolean);

  if (!images.length) return;

  let index = Math.floor(Math.random() * images.length);
  let currentFrame = null;

  const createFrame = (src, { immediate = false, onActivate } = {}) => {
    const frame = document.createElement('div');
    frame.className = 'bg-frame';
    frame.style.backgroundImage = `url('${src}')`;
    bgStack.appendChild(frame);
    const activate = () => {
      requestAnimationFrame(() => {
        frame.classList.add('is-active');
        onActivate?.(frame);
      });
    };

    if (immediate) {
      activate();
    } else {
      const img = new Image();
      img.onload = activate;
      img.src = src;
    }

    return frame;
  };

  const advance = () => {
    const nextIndex = (index + 1) % images.length;
    let nextFrame = null;
    nextFrame = createFrame(images[nextIndex], {
      onActivate: (frame) => {
        if (currentFrame && currentFrame !== frame) {
          const prevFrame = currentFrame;
          prevFrame.classList.remove('is-active');
          prevFrame.addEventListener('transitionend', () => prevFrame.remove(), { once: true });
        }
        currentFrame = frame;
        index = nextIndex;
      }
    });
  };

  currentFrame = createFrame(images[index], { immediate: true });

  setInterval(advance, 20000);
})();

// Fallback: copy email to clipboard on click (in case mail client isn't configured)
const emailCta = document.getElementById('email-cta');
if (emailCta) {
  emailCta.addEventListener('click', () => {
    const email = emailCta.getAttribute('data-email');
    if (!email) return;
    try {
      navigator.clipboard?.writeText(email);
      const original = emailCta.textContent;
      emailCta.textContent = 'Email copied!';
      setTimeout(() => { emailCta.textContent = original || 'Email me'; }, 1400);
    } catch (_) {
      // ignore clipboard errors silently
    }
  });
}


