//What is missing game, Aneesh

const scene = document.getElementById("scene");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const totalRoundsEl = document.getElementById("totalRounds");
const memorizeSecondsEl = document.getElementById("memorizeSeconds");

const roundEl = document.getElementById("round");
const itemsEl = document.getElementById("items");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const phaseEl = document.getElementById("phase");
const feedbackEl = document.getElementById("feedback");
const statusEl = document.getElementById("status");

const exportBtn = document.getElementById("exportBtn");
const endGameBtn = document.getElementById("endGameBtn");

let state = "idle";
let gameState = {
    round: 0,
    score: 0,
    streak: 0,
    maxRounds: 10,
    memorizeTime: 8,
    currentScene: [],
    removedItem: null,
    difficulty: 6
};

let t0 = null;
let countdownTimer = null;

let session = null;
let liveSession = null;

//scenes
const sceneTemplates = [
    {
        name: 'Beach',
        background: 'linear-gradient(to bottom, #87CEEB 0%, #B0E2FF 40%, #F4E4C1 70%, #E8D5B7 100%)',
        layers: [
            { items: ['☀️'], size: '4.5em', positions: [{x: 82, y: 10}] },
            { items: ['⛅', '☁️'], size: '3em', positions: [{x: 25, y: 15}, {x: 60, y: 12}] },
            { items: ['🌊', '🌊', '🌊', '🌊'], size: '2.8em', positions: [{x: 8, y: 42}, {x: 28, y: 45}, {x: 52, y: 43}, {x: 75, y: 44}] },
            { items: ['🏖️'], size: '3.5em', positions: [{x: 65, y: 58}] },
            { items: ['⛱️', '⛱️'], size: '3.2em', positions: [{x: 22, y: 62}, {x: 78, y: 65}] },
            { items: ['🐚', '🐚', '🐚', '⭐', '⭐'], size: '2em', positions: [{x: 18, y: 75}, {x: 42, y: 78}, {x: 68, y: 82}, {x: 35, y: 72}, {x: 58, y: 85}] },
            { items: ['🦀', '🦀'], size: '1.8em', positions: [{x: 25, y: 82}, {x: 72, y: 88}] },
            { items: ['🏄', '🏊'], size: '2.5em', positions: [{x: 38, y: 48}, {x: 15, y: 50}] },
            { items: ['⛵', '🚤'], size: '2.8em', positions: [{x: 75, y: 35}, {x: 45, y: 38}] },
            { items: ['🍹', '🥥'], size: '2em', positions: [{x: 80, y: 72}, {x: 85, y: 75}] },
            { items: ['🕶️'], size: '2em', positions: [{x: 70, y: 75}] },
            { items: ['🐠', '🐟', '🐡'], size: '1.9em', positions: [{x: 48, y: 46}, {x: 22, y: 48}, {x: 62, y: 50}] },
            { items: ['🪁'], size: '2.3em', positions: [{x: 65, y: 22}] },
            { items: ['🏐'], size: '2em', positions: [{x: 32, y: 68}] },
            { items: ['🩴'], size: '1.8em', positions: [{x: 75, y: 82}] },
            { items: ['🦜'], size: '2.2em', positions: [{x: 15, y: 25}] },
            { items: ['🪸'], size: '1.7em', positions: [{x: 52, y: 80}] }
        ]
    },
    {
        name: 'House Interior',
        background: 'linear-gradient(135deg, #8B7355 0%, #A0826D 50%, #D4C5B9 100%)',
        layers: [
            { items: ['🛋️'], size: '5em', positions: [{x: 42, y: 58}] },
            { items: ['📺'], size: '4em', positions: [{x: 15, y: 28}] },
            { items: ['🪴', '🪴'], size: '2.8em', positions: [{x: 75, y: 68}, {x: 8, y: 62}] },
            { items: ['🕯️', '🕯️'], size: '2em', positions: [{x: 52, y: 38}, {x: 58, y: 38}] },
            { items: ['📚', '📚', '📖'], size: '2.2em', positions: [{x: 82, y: 45}, {x: 85, y: 47}, {x: 44, y: 75}] },
            { items: ['🖼️', '🖼️'], size: '3em', positions: [{x: 35, y: 18}, {x: 65, y: 20}] },
            { items: ['⏰'], size: '2.2em', positions: [{x: 85, y: 28}] },
            { items: ['🎮'], size: '2em', positions: [{x: 36, y: 70}] },
            { items: ['☕', '🍪'], size: '2em', positions: [{x: 55, y: 65}, {x: 60, y: 66}] },
            { items: ['🧸'], size: '2.3em', positions: [{x: 68, y: 75}] },
            { items: ['💡'], size: '2.5em', positions: [{x: 12, y: 10}] },
            { items: ['🪟'], size: '3.5em', positions: [{x: 78, y: 22}] },
            { items: ['🎨'], size: '2.2em', positions: [{x: 25, y: 80}] },
            { items: ['🎸'], size: '2.8em', positions: [{x: 88, y: 72}] },
            { items: ['📷'], size: '1.9em', positions: [{x: 48, y: 45}] },
            { items: ['🕰️'], size: '2.2em', positions: [{x: 22, y: 35}] },
            { items: ['🪑'], size: '2.5em', positions: [{x: 70, y: 55}] },
            { items: ['🧺'], size: '2em', positions: [{x: 18, y: 72}] }
        ]
    },
    {
        name: 'Forest',
        background: 'linear-gradient(to bottom, #4A90E2 0%, #87CEEB 30%, #90EE90 60%, #228B22 100%)',
        layers: [
            { items: ['🌲', '🌲', '🌲', '🌳'], size: '5em', positions: [{x: 12, y: 38}, {x: 82, y: 35}, {x: 48, y: 32}, {x: 65, y: 40}] },
            { items: ['🌳'], size: '4.5em', positions: [{x: 28, y: 45}] },
            { items: ['🌻', '🌻', '🌹', '🌷', '🌺'], size: '2.3em', positions: [{x: 32, y: 68}, {x: 40, y: 70}, {x: 55, y: 72}, {x: 62, y: 69}, {x: 70, y: 73}] },
            { items: ['🦋', '🦋', '🐝'], size: '2em', positions: [{x: 42, y: 42}, {x: 68, y: 38}, {x: 52, y: 58}] },
            { items: ['🪺'], size: '2.2em', positions: [{x: 18, y: 32}] },
            { items: ['🌿', '🌿', '☘️', '🍃'], size: '1.8em', positions: [{x: 22, y: 78}, {x: 75, y: 82}, {x: 48, y: 80}, {x: 58, y: 85}] },
            { items: ['🐛'], size: '1.7em', positions: [{x: 35, y: 82}] },
            { items: ['🍄', '🍄', '🍄'], size: '2em', positions: [{x: 15, y: 70}, {x: 20, y: 72}, {x: 85, y: 75}] },
            { items: ['🪨', '🪨'], size: '2.2em', positions: [{x: 60, y: 78}, {x: 38, y: 75}] },
            { items: ['☀️'], size: '4em', positions: [{x: 80, y: 12}] },
            { items: ['🦉'], size: '2.3em', positions: [{x: 14, y: 38}] },
            { items: ['🦊'], size: '2.5em', positions: [{x: 72, y: 65}] },
            { items: ['🐌'], size: '1.6em', positions: [{x: 28, y: 85}] },
            { items: ['🦌'], size: '2.8em', positions: [{x: 55, y: 55}] },
            { items: ['🐿️'], size: '2em', positions: [{x: 85, y: 42}] },
            { items: ['🪵'], size: '2.2em', positions: [{x: 45, y: 82}] }
        ]
    },
    {
        name: 'School',
        background: 'linear-gradient(135deg, #FFF9E6 0%, #E8F4F8 100%)',
        layers: [
            { items: ['🏫'], size: '5em', positions: [{x: 45, y: 25}] },
            { items: ['📚', '📚', '📚'], size: '2.5em', positions: [{x: 15, y: 55}, {x: 20, y: 57}, {x: 25, y: 56}] },
            { items: ['📖', '📓', '📕'], size: '2.2em', positions: [{x: 65, y: 62}, {x: 70, y: 64}, {x: 75, y: 63}] },
            { items: ['✏️', '✏️', '🖊️'], size: '2em', positions: [{x: 35, y: 68}, {x: 40, y: 70}, {x: 45, y: 69}] },
            { items: ['🎒', '🎒'], size: '2.8em', positions: [{x: 12, y: 72}, {x: 82, y: 75}] },
            { items: ['🖍️', '🖍️'], size: '1.8em', positions: [{x: 52, y: 72}, {x: 56, y: 73}] },
            { items: ['📐', '📏'], size: '2em', positions: [{x: 48, y: 65}, {x: 43, y: 67}] },
            { items: ['🧮'], size: '2.2em', positions: [{x: 62, y: 70}] },
            { items: ['🗺️'], size: '3em', positions: [{x: 22, y: 30}] },
            { items: ['⏰'], size: '2.5em', positions: [{x: 75, y: 35}] },
            { items: ['🎨'], size: '2.3em', positions: [{x: 85, y: 55}] },
            { items: ['⚽', '🏀'], size: '2.2em', positions: [{x: 28, y: 78}, {x: 35, y: 80}] },
            { items: ['🔬'], size: '2.4em', positions: [{x: 58, y: 58}] },
            { items: ['🧪'], size: '2em', positions: [{x: 52, y: 60}] },
            { items: ['🎭'], size: '2.3em', positions: [{x: 68, y: 45}] },
            { items: ['🎺'], size: '2.2em', positions: [{x: 32, y: 48}] },
            { items: ['🍎'], size: '2em', positions: [{x: 78, y: 68}] },
            { items: ['🚌'], size: '3em', positions: [{x: 15, y: 82}] }
        ]
    }
];




function setStatus(msg) {

    statusEl.textContent = msg;
}



function setPhase(msg) {

    phaseEl.innerHTML = msg;
}


function logEvent(type, data) {

    if (!liveSession) return;

    liveSession.events.push({

        t_ms: Math.round(performance.now()),
        type,
        ...(data || {}),
    });
}

function updateHUD() {

    roundEl.textContent = gameState.round;
    itemsEl.textContent = gameState.difficulty;
    scoreEl.textContent = gameState.score;

    streakEl.textContent = gameState.streak;
}

function showFeedback(message, type) {

    feedbackEl.textContent = message;
    feedbackEl.className = 'feedback ' + type;

}

function computeMetrics(sess) {
    if (!sess) return null;

    const rounds = sess.rounds || [];
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalResponseTime = 0;
    let responseTimes = [];

    rounds.forEach(r => {

        if (r.result === "correct") {
            totalCorrect++;
            if (r.response_time_ms) {
                responseTimes.push(r.response_time_ms);
                totalResponseTime += r.response_time_ms;
            }
        } else {
            totalWrong++;
        }

    });

    const avgResponseTime = responseTimes.length > 0 
        ? Math.round(totalResponseTime / responseTimes.length) 
        : null;

    const median = (arr) => {
        if (!arr.length) return null;
        const sorted = [...arr].sort((a, b) => a - b);
        const m = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[m] : Math.round((sorted[m - 1] + sorted[m]) / 2);
    };

    return {
        total_rounds: rounds.length,
        correct: totalCorrect,
        incorrect: totalWrong,
        accuracy: rounds.length > 0 ? Number((totalCorrect / rounds.length).toFixed(3)) : 0,
        avg_response_time_ms: avgResponseTime,
        median_response_time_ms: median(responseTimes),
        final_score: sess.final_score,
        max_streak: sess.max_streak,
        final_difficulty: sess.final_difficulty
    };
}

function downloadText(filename, text, mime) {
    const blob = new Blob([text], { type: mime || "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2500);

}

function exportReport() {
    if (!session) {
        setStatus("No finished game yet — finish a game first.");
        return;
    }

    const base = `whats_missing_report_${session.timestamp_iso.replace(/[:.]/g, "-")}`;
    downloadText(`${base}.json`, JSON.stringify(session, null, 2), "application/json");

    if (session.metrics) {
        const m = session.metrics;
        const s = session.settings;

        const header = [
            "timestamp_iso",
            "total_rounds",
            "memorize_seconds",
            "total_rounds_played",
            "correct",
            "incorrect",
            "accuracy",
            "avg_response_time_ms",
            "median_response_time_ms",
            "final_score",
            "max_streak",
            "final_difficulty"
        ];

        const row = [
            session.timestamp_iso,
            s.total_rounds,
            s.memorize_seconds,
            m.total_rounds,
            m.correct,
            m.incorrect,
            m.accuracy,
            m.avg_response_time_ms,
            m.median_response_time_ms,
            m.final_score,
            m.max_streak,
            m.final_difficulty
        ];

        const csv = header.join(",") + "\n" + row.join(",") + "\n";
        downloadText(`${base}.csv`, csv, "text/csv");
    }
}

//scene rendering
function generateScene() {
    const template = sceneTemplates[Math.floor(Math.random() * sceneTemplates.length)];
    
    const numItems = gameState.difficulty;
    
    gameState.currentScene = [];
    let itemId = 0;
    let allItems = [];
    
    template.layers.forEach(layer => {
        layer.items.forEach((item, idx) => {
            const pos = layer.positions[idx];
            allItems.push({
                emoji: item,
                x: pos.x,
                y: pos.y,
                size: layer.size,
                id: itemId++
            });
        });
    });
    
    allItems.sort(() => Math.random() - 0.5);
    gameState.currentScene = allItems.slice(0, numItems);

    scene.style.background = template.background;
    
    // Log scene layout
    if (liveSession && liveSession.rounds.length > 0) {
        const currentRound = liveSession.rounds[liveSession.rounds.length - 1];
        currentRound.scene_name = template.name;
        currentRound.items = gameState.currentScene.map(item => ({
            emoji: item.emoji,
            x: Math.round(item.x),
            y: Math.round(item.y)
        }));
    }
    
    renderScene(gameState.currentScene);
}

function renderScene(items, clickable = false) {
    scene.innerHTML = '';
    
    items.forEach(item => {
        const element = document.createElement('div');
        element.className = 'scene-item';
        element.textContent = item.emoji;
        element.style.left = item.x + '%';
        element.style.top = item.y + '%';
        element.style.fontSize = item.size;
        element.dataset.id = item.id;
        
        if (clickable) {
            element.style.cursor = 'pointer';
            element.onclick = (e) => onItemClick(item.id, e);
        } else {
            element.style.cursor = 'default';
            element.onclick = null;
        }
        
        scene.appendChild(element);
    });
}

// game
function startGame() {
    resetGame(false);

    const maxRounds = Number(totalRoundsEl.value);
    const memorizeSeconds = Math.max(3, Math.min(15, Number(memorizeSecondsEl.value || 8)));

    gameState.maxRounds = maxRounds;
    gameState.memorizeTime = memorizeSeconds;

    // initialize session
    liveSession = {
        game: "whats_missing",
        timestamp_iso: new Date().toISOString(),
        settings: {
            total_rounds: maxRounds,
            memorize_seconds: memorizeSeconds,
            starting_difficulty: 6
        },
        rounds: [],
        events: [],
        metrics: null,
        final_score: 0,
        max_streak: 0,
        final_difficulty: 6
    };

    if (exportBtn) exportBtn.disabled = true;
    if (endGameBtn) endGameBtn.disabled = false;

    logEvent("game_start");
    nextRound();
}

function nextRound() {
    if (gameState.round >= gameState.maxRounds) {
        finishGame();
        return;
    }

    gameState.round++;
    state = 'memorize';
    updateHUD();
    
    feedbackEl.textContent = '';
    
    // Add new round to session
    if (liveSession) {
        liveSession.rounds.push({
            round_number: gameState.round,
            difficulty: gameState.difficulty,
            scene_name: null,
            items: [],
            removed_item: null,
            result: null,
            response_time_ms: null,
            t_start: null
        });
    }
    
    generateScene();
    startMemorizePhase();
}

function startMemorizePhase() {
    let timeLeft = gameState.memorizeTime;
    setPhase(`Study the scene carefully! (${timeLeft}s)`);
    setStatus(`Round ${gameState.round} of ${gameState.maxRounds} - Memorize the items...`);
    
    logEvent("memorize_start", { round: gameState.round, num_items: gameState.difficulty });
    
    countdownTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            setPhase(`Study the scene carefully! (${timeLeft}s)`);
        } else {
            clearInterval(countdownTimer);
            countdownTimer = null;
            startBlackScreen();
        }
    }, 1000);
}


function startBlackScreen() {
    state = 'blackscreen';
    
    logEvent("black_screen_start");
    
    const blackScreen = document.createElement('div');
    blackScreen.className = 'black-screen';
    blackScreen.textContent = 'Get Ready...';
    scene.appendChild(blackScreen);
    
    setPhase('');
    
    setTimeout(() => {
        blackScreen.remove();
        startRecallPhase();
    }, 1500);
}

function startRecallPhase() {
    state = 'active';
    
    // Remove random item
    const randomIndex = Math.floor(Math.random() * gameState.currentScene.length);
    gameState.removedItem = gameState.currentScene[randomIndex];
    
    const sceneWithoutItem = gameState.currentScene.filter((_, index) => index !== randomIndex);
    
    // Log to current round
    if (liveSession && liveSession.rounds.length > 0) {
        const currentRound = liveSession.rounds[liveSession.rounds.length - 1];
        currentRound.removed_item = {
            emoji: gameState.removedItem.emoji,
            x: Math.round(gameState.removedItem.x),
            y: Math.round(gameState.removedItem.y)
        };
        currentRound.t_start = performance.now();
    }
    
    logEvent("recall_start", { 
        round: gameState.round, 
        removed_item: gameState.removedItem.emoji 
    });
    
    setPhase('What\'s missing? Click it!');
    setStatus('Click the item that disappeared...');
    renderScene(sceneWithoutItem, true);
    
    t0 = performance.now();
    
    // Add click handler to empty space
    scene.onclick = (e) => {
        if (e.target === scene && state === 'active') {
            const rect = scene.getBoundingClientRect();
            const clickX = ((e.clientX - rect.left) / rect.width) * 100;
            const clickY = ((e.clientY - rect.top) / rect.height) * 100;
            
            const distance = Math.sqrt(
                Math.pow(clickX - gameState.removedItem.x, 2) + 
                Math.pow(clickY - gameState.removedItem.y, 2)
            );
            
            if (distance < 12) {
                checkAnswer(gameState.removedItem.id, e);
            }
        }
    };
}

function onItemClick(selectedId, event) {
    if (state !== 'active') return;
    checkAnswer(selectedId, event);
}

function checkAnswer(selectedId, event) {
    if (state !== 'active') return;
    
    state = 'feedback';
    scene.onclick = null;
    
    const responseTime = t0 ? performance.now() - t0 : null;
    const isCorrect = selectedId === gameState.removedItem.id;
    
    // Log click
    if (event) {
        const rect = scene.getBoundingClientRect();
        const clickX = event.clientX ? Math.round(event.clientX - rect.left) : null;
        const clickY = event.clientY ? Math.round(event.clientY - rect.top) : null;
        
        logEvent("click", { 
            x: clickX, 
            y: clickY, 
            clicked_item: selectedId,
            expected_item: gameState.removedItem.id,
            result: isCorrect ? "correct" : "wrong"
        });
    }
    
    // Update round data
    if (liveSession && liveSession.rounds.length > 0) {
        const currentRound = liveSession.rounds[liveSession.rounds.length - 1];
        currentRound.result = isCorrect ? "correct" : "wrong";
        currentRound.response_time_ms = responseTime ? Math.round(responseTime) : null;
    }
    
    renderScene(gameState.currentScene, false);
    const removedElement = document.querySelector(`[data-id="${gameState.removedItem.id}"]`);
    if (removedElement) {
        removedElement.style.filter = 'drop-shadow(0 0 25px gold) brightness(1.3)';
        removedElement.style.transform = 'scale(1.4)';
        removedElement.style.zIndex = '1000';
    }
    
    if (isCorrect) {
        const points = 15 + (gameState.streak * 5);
        gameState.score += points;
        gameState.streak++;
        
        gameState.difficulty += 2;
        
        logEvent("round_result", { 
            result: "correct", 
            points: points,
            new_difficulty: gameState.difficulty,
            streak: gameState.streak
        });
        
        showFeedback(`✓ Correct! +${points} points (Difficulty increased!)`, 'correct');
        setStatus(`Great job! Score: ${gameState.score}`);
    } else {
        gameState.streak = 0;
        gameState.difficulty = Math.max(6, gameState.difficulty - 2);
        
        logEvent("round_result", { 
            result: "wrong", 
            new_difficulty: gameState.difficulty 
        });
        
        showFeedback(`✗ Wrong! It was ${gameState.removedItem.emoji} (Difficulty decreased)`, 'incorrect');
        setStatus(`Try again! Score: ${gameState.score}`);
    }
    
    updateHUD();
    
    setTimeout(() => {
        nextRound();
    }, 2500);
}

function finishGame() {
    state = 'done';
    
    logEvent("game_done", { 
        final_score: gameState.score,
        max_streak: Math.max(gameState.streak, liveSession?.max_streak || 0),
        final_difficulty: gameState.difficulty
    });
    
    // Finalize session
    if (liveSession) {
        liveSession.final_score = gameState.score;
        liveSession.max_streak = Math.max(
            gameState.streak, 
            ...liveSession.rounds.map(r => r.streak || 0)
        );
        liveSession.final_difficulty = gameState.difficulty;
        liveSession.metrics = computeMetrics(liveSession);
        
        session = liveSession;
        liveSession = null;
    }
    
    setPhase('Game Complete!');
    setStatus(`Final Score: ${gameState.score} | Accuracy: ${session?.metrics?.accuracy ? (session.metrics.accuracy * 100).toFixed(1) : 0}%`);
    
    scene.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 20px;">
            <div style="font-size: 4em; margin-bottom: 20px;">🎉</div>
            <div style="font-size: 2.5em; font-weight: bold; color: #48bb78; margin-bottom: 10px;">${gameState.score}</div>
            <div style="font-size: 1.2em; color: #666;">Final Score</div>
            <div style="margin-top: 20px; font-size: 1em; color: #999;">
                ${session?.metrics?.accuracy ? `Accuracy: ${(session.metrics.accuracy * 100).toFixed(1)}%` : ''}
            </div>
        </div>
    `;
    
    if (exportBtn) exportBtn.disabled = false;
    if (endGameBtn) endGameBtn.disabled = true;
    
    console.log("SESSION_RESULT", session);
}

function endGame() {
    if (state === 'idle' || state === 'done') return;
    
    // Confirm
    if (!confirm('Are you sure you want to end the game early? Your progress will be saved.')) {
        return;
    }
    
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
    
    logEvent("game_ended_early", { 
        rounds_completed: gameState.round,
        score_at_end: gameState.score
    });
    
    // Force finish
    finishGame();
}

function resetGame(resetSettings = true) {
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = null;
    
    state = 'idle';
    gameState = {
        round: 0,
        score: 0,
        streak: 0,
        maxRounds: Number(totalRoundsEl.value) || 10,
        memorizeTime: Number(memorizeSecondsEl.value) || 8,
        currentScene: [],
        removedItem: null,
        difficulty: 6
    };
    
    t0 = null;
    
    scene.innerHTML = '';
    scene.style.background = '#e8f4f8';
    
    updateHUD();
    setPhase('Ready to test your visual memory?');
    setStatus('Choose settings, then press Start.');
    feedbackEl.textContent = '';
    
    if (exportBtn) exportBtn.disabled = true;
    if (endGameBtn) endGameBtn.disabled = true;
    
    if (resetSettings) {
        totalRoundsEl.value = "10";
        memorizeSecondsEl.value = "8";
    }
    
    liveSession = null;
}

// event Listeners
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", () => resetGame(false));
if (endGameBtn) endGameBtn.addEventListener("click", endGame);
if (exportBtn) exportBtn.addEventListener("click", exportReport);

// Initialize
resetGame(true);
