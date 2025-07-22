/* ===========================================================
   0. BGMの準備（クリックで一度だけ許可を得る）
=========================================================== */

let bgmAudio;

window.addEventListener('DOMContentLoaded', () => {
  // BGMファイルを読み込み
  bgmAudio = new Audio('./assets/bgm.mp3');
  bgmAudio.loop = true;
  bgmAudio.volume = 0.6;
});

// 最初のクリックで再生許可を取ってBGM再生
window.addEventListener('click', () => {
  if (bgmAudio) {
    bgmAudio.play().catch((err) => {
      console.warn('BGM再生失敗:', err);
    });
  }
}, { once: true });

/* ===========================================================
   1. 歩く女の子アニメーション
=========================================================== */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const frameCount = 8;
const frameW = 100;
const frameH = 200;
const dispW = 200;
const dispH = 400;

const frames = [];
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = `./assets/walk${i}.png`;
  frames.push(img);
}

let speed = 0;
const damping = 0.95;
const gain = 0.05;
const maxSpeed = 0.08;

let framePos = 0;
let curIdx = 0;
let lastScrollY_Girl = window.scrollY;

function animateGirl() {
  const nowY = window.scrollY;
  const delta = nowY - lastScrollY_Girl;

  speed += Math.abs(delta) * gain;
  if (speed > maxSpeed) speed = maxSpeed;
  speed *= damping;

  framePos += speed;
  if (framePos >= 1) {
    const step = Math.floor(framePos);
    curIdx = (curIdx + step) % frameCount;
    framePos -= step;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = frames[curIdx];
  if (img.complete) {
    ctx.drawImage(img, 0, 0, frameW, frameH, 0, 0, dispW, dispH);
  }

  lastScrollY_Girl = nowY;
  requestAnimationFrame(animateGirl);
}
animateGirl();

/* ===========================================================
   2. エラーウィンドウ出現（スクロールに応じて）
=========================================================== */

const errorSrc = './assets/error.png';
let scrollBuffer = 0;
const threshold = 40;
let spawnIndex = 0;
let lastScrollY_Err = window.scrollY;

window.addEventListener('scroll', () => {
  const nowY = window.scrollY;
  const delta = Math.abs(nowY - lastScrollY_Err);
  scrollBuffer += delta;

  if (scrollBuffer >= threshold) {
    if (spawnIndex % 2 === 0) spawnErrorWindow();
    spawnIndex++;
    scrollBuffer = 0;
  }

  lastScrollY_Err = nowY;
});

function spawnErrorWindow() {
  const img = document.createElement('img');
  img.src = errorSrc;
  img.className = 'error-window';

  const vw = window.innerWidth - 140;
  const vh = window.innerHeight - 140;
  img.style.left = `${Math.random() * vw}px`;
  img.style.top = `${Math.random() * vh}px`;

  document.body.appendChild(img);
}

/* ===========================================================
   3. ギャラリー画像のポップアップ機能
=========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const popupOverlay = document.getElementById('image-popup');
  const popupImg = document.getElementById('popup-img');
  const closeBtn = document.querySelector('.popup-close');

  document.querySelectorAll('.popup-image').forEach(img => {
    img.addEventListener('click', () => {
      popupImg.src = img.src;
      popupOverlay.style.display = 'flex';
    });
  });

  closeBtn.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
  });

  popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
      popupOverlay.style.display = 'none';
    }
  });
});

