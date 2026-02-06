// Trail Making (Popup Recall)
// - Creates a random alternating number/letter sequence (letters shuffled)
// - Shows popup with the order for N seconds
// - Then shows normal board with circles only; user taps in order
// - Tracks time + errors; logs a session JSON

const board = document.getElementById("board");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const difficultyEl = document.getElementById("difficulty");
const memorizeSecondsEl = document.getElementById("memorizeSeconds");

const timeEl = document.getElementById("time");
const errorsEl = document.getElementById("errors");
const statusEl = document.getElementById("status");

// Modal
const modal = document.getElementById("sequenceModal");
const sequenceText = document.getElementById("sequenceText");
const countdownEl = document.getElementById("countdown");
const startNowBtn = document.getElementById("startNowBtn");

// State
let state = "idle"; // idle | memorizing | active | done
let sequence = [];  // ["1","C","2","D","3","A",...]
let nodes = [];     // { label, x, y, el }
let expectedIndex = 0;
let errors = 0;

let t0 = null;
let rafId = null;

let countdownTimer = null;

// ---------- Helpers ----------
function setStatus(msg) {
  statusEl.textContent = msg;
}

function shuffle(arr) {
  // Fisher-Yates
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildShuffledSequence(nPairs) {
  // Numbers: 1..nPairs
  // Letters: A.. (A+nPairs-1), shuffled
  const letters = Array.from({ length: nPairs }, (_, i) => String.fromCharCode(65 + i));
  shuffle(letters);

  const seq = [];
  for (let i = 1; i <= nPairs; i++) {
    seq.push(String(i));
    seq.push(letters[i - 1]);
  }
  return seq;
}

function clearBoard() {
  board.querySelectorAll(".node").forEach((n) => n.remove());
  nodes = [];
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function dist(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

function placeNodes(labels) {
  const rect = board.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  const radius = 38;     // node ~70px
  const minSpacing = 95; // ensures no overlaps

  const placed = [];

  for (const label of labels) {
    let tries = 0;
    let x = 0, y = 0;

    while (tries++ < 800) {
      x = rand(radius, w - radius);
      y = rand(radius, h - radius);

      let ok = true;
      for (const p of placed) {
        if (dist(x, y, p.x, p.y) < minSpacing) {
          ok = false;
          break;
        }
      }
      if (ok) break;
    }

    placed.push({ label, x, y });
  }

  placed.forEach((p) => {
    const el = document.createElement("div");
    el.className = "node";
    el.textContent = p.label;

    el.style.left = `${p.x - 35}px`;
    el.style.top = `${p.y - 35}px`;

    el.addEventListener("click", () => onTap(p.label, el));
    board.appendChild(el);

    nodes.push({ ...p, el });
  });
}

function updateHUD() {
  errorsEl.textContent = String(errors);
}

function tick() {
  if (!t0) return;
  timeEl.textContent = `${((performance.now() - t0) / 1000).toFixed(1)}s`;
  rafId = requestAnimationFrame(tick);
}

// ---------- Modal ----------
function showSequenceModal(seq, seconds, onDone) {
  modal.classList.remove("hidden");
  sequenceText.textContent = seq.join(" → ");

  let remaining = seconds;
  countdownEl.textContent = String(remaining);

  const finish = () => {
    modal.classList.add("hidden");
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = null;
    onDone();
  };

  startNowBtn.onclick = finish;

  countdownTimer = setInterval(() => {
    remaining -= 1;
    countdownEl.textContent = String(Math.max(0, remaining));
    if (remaining <= 0) finish();
  }, 1000);
}

// ---------- Game Flow ----------
function startGame() {
  resetGame(false);

  const nPairs = Number(difficultyEl.value);
  const memorizeSeconds = Math.max(1, Math.min(10, Number(memorizeSecondsEl.value || 4)));

  sequence = buildShuffledSequence(nPairs);

  // Show modal first
  state = "memorizing";
  setStatus("Memorize the sequence in the popup…");

  showSequenceModal(sequence, memorizeSeconds, () => {
    // Build board AFTER modal closes, so user doesn't just stare at it while memorizing
    clearBoard();
    placeNodes(sequence);

    expectedIndex = 0;
    errors = 0;
    t0 = null;

    timeEl.textContent = "0.0s";
    updateHUD();

    state = "active";
    setStatus("Now tap the circles in the exact order you memorized.");
  });
}

function onTap(label, el) {
  if (state !== "active") return;

  if (!t0) {
    t0 = performance.now();
    tick();
  }

  const expectedLabel = sequence[expectedIndex];

  if (label === expectedLabel) {
    el.classList.add("correct");
    expectedIndex++;
    updateHUD();

    if (expectedIndex >= sequence.length) finishGame();
  } else {
    errors++;
    el.classList.add("wrong");
    setTimeout(() => el.classList.remove("wrong"), 260);
    updateHUD();
  }
}

function finishGame() {
  state = "done";
  if (rafId) cancelAnimationFrame(rafId);

  const timeSec = t0 ? (performance.now() - t0) / 1000 : 0;
  setStatus(`Completed! Time: ${timeSec.toFixed(1)}s • Errors: ${errors}`);

  const session = {
    game: "trail_making_popup_recall",
    timestamp_iso: new Date().toISOString(),
    difficulty_pairs: Number(difficultyEl.value),
    memorize_seconds: Number(memorizeSecondsEl.value || 4),
    completion_time_s: Number(timeSec.toFixed(3)),
    errors,
    sequence,
  };

  console.log("SESSION_RESULT", session);
}

function resetGame(resetSettings = true) {
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = null;

  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;

  modal.classList.add("hidden");

  state = "idle";
  sequence = [];
  nodes = [];
  expectedIndex = 0;
  errors = 0;
  t0 = null;

  clearBoard();

  timeEl.textContent = "0.0s";
  errorsEl.textContent = "0";
  setStatus("Choose settings, then press Start.");

  if (resetSettings) {
    difficultyEl.value = "3";
    memorizeSecondsEl.value = "4";
  }
}

// Wire up buttons
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", () => resetGame(false));

// Init
resetGame(true);
