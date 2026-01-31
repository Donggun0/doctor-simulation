// Game Logic

// Name Data (Simple Generator)
const lastNames = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황", "안", "송", "류", "홍"];
const firstNames = ["민수", "지현", "서준", "서윤", "지훈", "하은", "준호", "지우", "현우", "수민", "건우", "예은", "우진", "채원", "도현", "민재", "지아", "연우", "다은", "성민"];

function generatePatientData() {
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const age = Math.floor(Math.random() * 60) + 10; // 10 ~ 70
    const gender = Math.random() > 0.5 ? 'M' : 'F';
    const patience = 35 + Math.floor(Math.random() * 20); // 35 ~ 55 seconds patience
    return { name: last + first, age, gender, patience: patience, maxPatience: patience };
}

// Simple Web Audio API Sound Manager
class SoundManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
    }

    playTone(freq, type, duration, vol = 0.1) {
        if (!this.enabled) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.error("Audio Error", e);
        }
    }

    playDingDong() {
        // Doorbell sound
        this.playTone(600, 'sine', 1.0, 0.1);
        setTimeout(() => this.playTone(450, 'sine', 1.0, 0.1), 300);
    }

    playAngry() {
        // Low buzzer
        this.playTone(150, 'sawtooth', 0.5, 0.15);
        this.playTone(100, 'square', 0.5, 0.15);
    }

    playCoin() {
        // High ping
        this.playTone(1200, 'sine', 0.3, 0.05);
        setTimeout(() => this.playTone(1600, 'sine', 0.6, 0.05), 50);
    }

    playAlert() {
        this.playTone(800, 'triangle', 0.2, 0.1);
    }
}

class Game {
    constructor() {
        this.resources = {
            hp: 100,
            mental: 100,
            adminRisk: 0,
            satisfaction: 50,
            revenue: 0
        };

        this.sound = new SoundManager(); // Init Sound

        this.scenarioManager = new ScenarioManager();
        this.currentScenario = null;
        this.isProcessing = false;

        // Time & Queue System
        this.waitingList = [];
        this.maxWait = 15; // Max capacity
        this.timer = null;
        this.timeLeft = 30; // 30 seconds per patient
        this.influxTimer = null;
        this.stressTimer = null;

        // Stats
        this.patientsSeen = 0;
        this.breakEvenGoal = 20;

        this.ui = {
            hpBar: document.getElementById('hp-bar'),
            mentalBar: document.getElementById('mental-bar'),
            adminBar: document.getElementById('admin-bar'),
            satisfactionBar: document.getElementById('satisfaction-bar'),

            dayDisplay: document.getElementById('day-display'),
            revenueDisplay: document.getElementById('revenue-amount'),
            patientCount: document.getElementById('patient-count'), // New
            goalCount: document.getElementById('goal-count'), // New

            patientDialogue: document.getElementById('patient-dialogue'),

            avatarVis: document.querySelector('.patient-visual'),
            patientImg: document.getElementById('patient-img'),
            timerFill: document.getElementById('patient-timer'), // New

            doctorContainer: document.getElementById('doctor-container'),
            doctorEmoji: document.getElementById('doctor-emoji'),
            hintBubble: document.getElementById('hint-bubble'),

            choiceContainer: document.getElementById('choices-container'),
            overlay: document.getElementById('overlay'),
            endingTitle: document.getElementById('ending-title'),
            endingDesc: document.getElementById('ending-desc'),
            restartBtn: document.getElementById('restart-btn'),

            // Tutorial
            tutorialBtn: document.getElementById('tutorial-btn'),
            tutorialModal: document.getElementById('tutorial-modal'),
            closeTutorialBtn: document.getElementById('close-tutorial'),

            // Waiting Room
            waitingCount: document.getElementById('waiting-count'),
            waitingListEl: document.getElementById('waiting-list'),
            wrStatus: document.getElementById('wr-status')
        };

        this.init();
    }

    init() {
        this.resources = { hp: 100, mental: 100, adminRisk: 0, satisfaction: 50, revenue: 0 };
        this.waitingList = [];
        this.patientsSeen = 0;
        this.scenarioManager = new ScenarioManager();

        this.updateUI(false);
        this.updateWaitingUI();
        this.initAdminMode();

        this.ui.overlay.classList.add('hidden');
        this.ui.hintBubble.classList.add('hidden');

        this.setupTutorial();
        this.setupHint();
        this.updateDoctorReaction('neutral');

        // Start Loops
        this.startInflux();
        this.startStressCheck();

        // Initial Patients
        for (let i = 0; i < 3; i++) this.addPatient(true); // Silent init

        // --- Intro Logic ---
        const startBtn = document.getElementById('start-game-btn');
        const introOverlay = document.getElementById('intro-overlay');

        if (startBtn && introOverlay) {
            // Wait for click
            startBtn.addEventListener('click', () => {
                introOverlay.style.opacity = '0';
                // Trigger nextTurn only after user clicks Start
                this.nextTurn();
                setTimeout(() => {
                    introOverlay.style.display = 'none';
                }, 500);
            });
        } else {
            // Fallback: auto start if no intro
            this.nextTurn();
        }

        this.ui.restartBtn.onclick = () => {
            clearInterval(this.influxTimer);
            clearInterval(this.stressTimer);
            clearInterval(this.timer);
            this.init();
        };
    }

    setupTutorial() {
        if (this.ui.tutorialBtn) {
            const toggle = () => this.ui.tutorialModal.classList.toggle('hidden');
            this.ui.tutorialBtn.onclick = toggle;
            this.ui.closeTutorialBtn.onclick = toggle;
        }
    }

    setupHint() {
        this.ui.doctorContainer.onclick = () => {
            if (this.ui.hintBubble.classList.contains('hidden')) {
                const hint = this.currentScenario ? (this.currentScenario.narrator || "특별한 힌트가 없습니다.") : "대기 중...";
                this.ui.hintBubble.textContent = hint;
                this.ui.hintBubble.classList.remove('hidden');
            } else {
                this.ui.hintBubble.classList.add('hidden');
            }
        };
    }

    // --- Real-time Logic ---

    startInflux() {
        if (this.influxTimer) clearInterval(this.influxTimer);
        this.influxTimer = setInterval(() => {
            // Stop adding if goal reached
            if (this.patientsSeen >= this.breakEvenGoal) {
                clearInterval(this.influxTimer);
                this.influxTimer = null;
                this.ui.wrStatus.textContent = "🛑 오늘 진료 접수가 마감되었습니다.";
                this.ui.wrStatus.style.color = '#fdcb6e';
                return;
            }

            // Randomly add patient every 3-7 seconds
            if (Math.random() > 0.3) { // 70% chance
                this.addPatient();
            }
        }, 5000);
    }

    addPatient(silent = false) {
        if (this.waitingList.length >= this.maxWait) {
            // Check for Game Over (Collapse)
            this.triggerEnding('collapse');
            return;
        }

        this.waitingList.push(generatePatientData());
        this.updateWaitingUI();

        if (!silent) {
            this.sound.playDingDong();
        }
    }

    startStressCheck() {
        if (this.stressTimer) clearInterval(this.stressTimer);
        this.stressTimer = setInterval(() => {

            // 1. Check Collapse
            if (this.waitingList.length >= 15) {
                this.triggerEnding('collapse');
                return;
            }

            // 2. Waiting Room Stress (Crowd)
            if (this.waitingList.length > 5) {
                this.resources.mental -= 1;
                this.resources.satisfaction -= 1;
                this.updateUI(true);

                this.ui.wrStatus.textContent = "🔥 폭동 직전! 빨리 진료하세요!";
                this.ui.wrStatus.style.color = '#d63031';
                this.ui.wrStatus.style.fontWeight = 'bold';
            } else {
                this.ui.wrStatus.textContent = "평화롭습니다";
                this.ui.wrStatus.style.color = '#00b894';
                this.ui.wrStatus.style.fontWeight = 'normal';
            }

            // 3. Decrease Patience
            let dropout = false;
            for (let i = this.waitingList.length - 1; i >= 0; i--) {
                this.waitingList[i].patience -= 1;
                if (this.waitingList[i].patience <= 0) {
                    // Dropout
                    const p = this.waitingList.splice(i, 1)[0];
                    this.dropoutPatient(p);
                    dropout = true;
                }
            }

            if (dropout) this.updateWaitingUI();

        }, 1000); // Check every 1s now (more frequent for patience)
    }

    dropoutPatient(p) {
        this.updateResources({ mental: -5, satisfaction: -10 });
        this.showFloatingText(-5, "💔 환자 이탈");
        this.sound.playAngry();

        // Notification
        const notif = document.createElement('div');
        notif.className = 'floating-log';
        notif.textContent = `📢 ${p.name}님이 기다리다 지쳐 집에 갔습니다!`;
        notif.style.color = '#ff6b6b';
        notif.style.fontSize = '1.2rem';
        this.ui.avatarVis.appendChild(notif);
        setTimeout(() => notif.remove(), 2000);
    }

    updateWaitingUI() {
        this.ui.waitingCount.textContent = this.waitingList.length;
        if (this.waitingList.length > 5) {
            this.ui.waitingCount.style.color = 'red';
        } else {
            this.ui.waitingCount.style.color = 'inherit';
        }

        // Render List
        this.ui.waitingListEl.innerHTML = '';
        this.waitingList.forEach(p => {
            const li = document.createElement('li');

            // Explicit extraction to prevent [object Object]
            let nameStr = "Unknown";
            let ageStr = "";

            if (typeof p === 'object' && p !== null) {
                nameStr = p.name || "Unknown";
                if (p.age) ageStr = ` (${p.age})`;
            } else {
                nameStr = String(p); // Fallback for plain strings
            }

            li.textContent = `${nameStr}${ageStr}`;

            // Urgency color
            if (p.patience && p.patience < 10) li.style.color = '#ff6b6b';

            this.ui.waitingListEl.appendChild(li);
        });
    }

    startTurnTimer() {
        if (this.timer) clearInterval(this.timer);
        this.timeLeft = 30; // 30 seconds
        this.updateTimerUI();

        this.timer = setInterval(() => {
            this.timeLeft -= 0.1;
            this.updateTimerUI();

            if (this.timeLeft <= 0) {
                this.handleTimeout();
            }
        }, 100);
    }

    stopTurnTimer() {
        if (this.timer) clearInterval(this.timer);
    }

    updateTimerUI() {
        const pct = (this.timeLeft / 30) * 100;
        this.ui.timerFill.style.width = `${pct}%`;

        if (this.timeLeft < 10) {
            this.ui.timerFill.style.backgroundColor = '#d63031'; // Red
        } else {
            this.ui.timerFill.style.backgroundColor = '#00b894'; // Teal
        }
    }

    handleTimeout() {
        this.stopTurnTimer();
        // Time Over Penalty
        this.updateResources({ mental: -10, satisfaction: -10 });
        this.showFloatingText("⏰ 시간 초과!", "header");
        this.sound.playAngry(); // Angry Sound
        this.ui.patientDialogue.textContent = "아 진짜 왜 이렇게 오래 걸려요!";
        this.ui.hintBubble.textContent = "환자가 화를 내며 나갔습니다.";
        this.ui.hintBubble.classList.remove('hidden');

        setTimeout(() => this.nextTurn(), 2000);
    }

    // --- Core Game Logic ---

    updateResources(effect) {
        // Apply effects
        if (effect.hp) this.resources.hp += effect.hp;
        if (effect.mental) this.resources.mental += effect.mental;
        if (effect.adminRisk) this.resources.adminRisk += effect.adminRisk;
        if (effect.satisfaction) this.resources.satisfaction += effect.satisfaction;
        if (effect.revenue) this.resources.revenue += effect.revenue;

        // Clamp values
        this.resources.hp = Math.max(0, Math.min(100, this.resources.hp));
        this.resources.mental = Math.max(0, Math.min(100, this.resources.mental));
        this.resources.adminRisk = Math.max(0, Math.min(100, this.resources.adminRisk));
        this.resources.satisfaction = Math.max(0, Math.min(100, this.resources.satisfaction));

        this.updateUI(true);
        this.updateDoctorReaction(null, effect);

        if (effect.revenue !== undefined) {
            this.showFloatingText(effect.revenue);
            if (effect.revenue > 0) this.sound.playCoin(); // Coin sound
        }

        this.checkGameStatus();
    }

    showFloatingText(amount, type) {
        const el = document.createElement('div');
        el.className = 'floating-log';

        if (typeof amount === 'string') {
            el.textContent = amount;
            el.style.color = '#d63031';
        } else {
            if (amount === 0) return;
            const sign = amount > 0 ? '+' : '';
            el.textContent = `${sign}₩${amount.toLocaleString()}`;
            if (amount > 0) el.style.color = '#fdcb6e';
            else el.style.color = '#d63031';
            if (type) el.textContent += ` (${type})`;
        }

        // Append to avatar for context
        this.ui.avatarVis.appendChild(el);
        setTimeout(() => el.remove(), 1500);
    }

    updateUI(animate) {
        const setBar = (el, val) => el.style.width = `${val}%`;

        setBar(this.ui.hpBar, this.resources.hp);
        setBar(this.ui.mentalBar, this.resources.mental);
        setBar(this.ui.adminBar, this.resources.adminRisk);
        setBar(this.ui.satisfactionBar, this.resources.satisfaction);

        // Update Revenue
        if (this.ui.revenueDisplay) {
            this.ui.revenueDisplay.textContent = this.resources.revenue.toLocaleString();
        }

        // Update Patient Counter
        if (this.ui.patientCount) {
            this.ui.patientCount.textContent = this.patientsSeen;
            this.ui.goalCount.textContent = this.breakEvenGoal;

            if (this.patientsSeen >= this.breakEvenGoal) {
                this.ui.patientCount.style.color = '#00b894'; // Goal reached
            }
        }

        if (animate && (this.resources.hp < 30 || this.resources.mental < 30)) {
            document.body.classList.add('shake');
            setTimeout(() => document.body.classList.remove('shake'), 500);
        }
    }

    updateDoctorReaction(state, lastEffect) {
        let emoji = '💬';
        if (this.resources.hp < 30) emoji = '🩸';
        else if (this.resources.mental < 30) emoji = '🤯';
        else if (this.resources.adminRisk > 70) emoji = '😨';

        if (lastEffect) {
            if (lastEffect.adminRisk > 10) emoji = '💦';
            if (lastEffect.mental < -10) emoji = '💢';
            if (lastEffect.satisfaction > 20) emoji = '🥰';
            if (lastEffect.revenue > 0) emoji = '💰';
        }

        if (this.ui.doctorEmoji) {
            this.ui.doctorEmoji.textContent = emoji;
            this.ui.doctorEmoji.style.animation = 'none';
            this.ui.doctorEmoji.offsetHeight;
            this.ui.doctorEmoji.style.animation = 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }
    }

    checkGameStatus() {
        if (this.resources.hp <= 0 || this.resources.mental <= 0) {
            this.triggerEnding('burnout');
        } else if (this.resources.adminRisk >= 100) {
            this.triggerEnding('lawsuit');
        } else {
            // Wait for nextTurn call
        }
    }

    nextTurn() {
        // Check if waiting list is empty
        if (this.waitingList.length === 0) {
            this.startBreak();
            return;
        }

        // Get the next patient from the waiting list
        const nextPatient = this.waitingList.shift();
        this.updateWaitingUI();

        this.currentScenario = this.scenarioManager.drawNext();

        if (!this.currentScenario) {
            this.triggerEnding('survival');
            return;
        }

        this.patientsSeen++;
        this.updateUI(false);
        this.renderScenario(this.currentScenario, nextPatient); // Pass nextPatient
        this.startTurnTimer();
    }

    startBreak() {
        if (this.timer) clearInterval(this.timer);
        this.isProcessing = true;

        // Hide Timer during break
        const timerWrapper = document.querySelector('.timer-wrapper');
        if (timerWrapper) timerWrapper.style.opacity = '0';

        // Show Break Visuals
        this.ui.avatarVis.style.opacity = '0';
        setTimeout(() => {
            this.ui.patientImg.style.backgroundImage = "url('assets/p_doctor_stressed.jpg')"; // Show Stressed Doctor
            this.ui.patientImg.style.backgroundPosition = 'center bottom';
            this.ui.patientImg.style.backgroundSize = 'contain';
            this.ui.patientDialogue.textContent = "(대기 환자가 없습니다. 잠시 숨을 돌립니다...)";

            // Add Choices
            this.ui.choiceContainer.innerHTML = '';

            if (this.patientsSeen >= this.breakEvenGoal) {
                const finishBtn = document.createElement('button');
                finishBtn.className = 'choice-btn primary-btn';
                finishBtn.style.textAlign = 'center';
                finishBtn.style.backgroundColor = '#00b894';
                finishBtn.style.color = 'white';
                finishBtn.innerHTML = "🏁 오늘의 진료 마무리하기 (퇴근)";
                finishBtn.onclick = () => {
                    this.triggerEnding('survival');
                };
                this.ui.choiceContainer.appendChild(finishBtn);
            } else {
                const breakChoices = [
                    { label: "기지개를 켠다", msg: "으차차... 몸이 천근만근이네." },
                    { label: "한숨을 내쉰다", msg: "하아... 점심 먹을 시간이나 있으려나." }
                ];

                breakChoices.forEach(choice => {
                    const btn = document.createElement('button');
                    btn.className = 'choice-btn';
                    btn.textContent = choice.label;
                    btn.onclick = () => {
                        this.ui.patientDialogue.textContent = `"${choice.msg}"`;
                        btn.disabled = true;
                        btn.style.opacity = '0.5';
                    };
                    this.ui.choiceContainer.appendChild(btn);
                });
            }

            this.ui.avatarVis.style.opacity = '1';

            // Recover Stats
            this.updateResources({ hp: +2, mental: +2 });
            this.showFloatingText(+2, "❤️ 휴식");

            this.ui.hintBubble.textContent = "의사가 지쳐 쓰러져 있습니다.";
            this.ui.hintBubble.classList.remove('hidden');
        }, 300);

        // Auto-resume if needed
        if (this.breakTimer) clearTimeout(this.breakTimer);
        this.breakTimer = setTimeout(() => {
            // If goal reached and no one is waiting, stay in break (Wait for user to click Finish or more to arrive if influx still active)
            if (this.patientsSeen >= this.breakEvenGoal && this.waitingList.length === 0) {
                return;
            }

            if (timerWrapper) timerWrapper.style.opacity = '1';
            if (this.waitingList.length === 0) {
                this.addPatient();
            }
            this.isProcessing = false;
            this.nextTurn();
        }, 4000);
    }

    renderScenario(scenario, patient) {
        this.ui.avatarVis.style.opacity = '0';

        setTimeout(() => {
            try {
                this.ui.patientDialogue.textContent = `"${scenario.text}"`;
                this.ui.hintBubble.classList.add('hidden');

                // Image Logic
                // Image Logic
                // Clear previous specific styles
                this.ui.patientImg.style.backgroundPosition = '';
                this.ui.patientImg.style.backgroundSize = '';

                if (scenario.sprite) {
                    this.ui.patientImg.style.backgroundImage = `url('${scenario.sprite.url}')`;
                    this.ui.patientImg.style.backgroundPosition = scenario.sprite.pos || 'center';
                    this.ui.patientImg.style.backgroundSize = scenario.sprite.size || 'cover';
                } else if (scenario.image) {
                    this.ui.patientImg.style.backgroundImage = `url('${scenario.image}')`;
                    this.ui.patientImg.style.backgroundPosition = 'center bottom';
                    this.ui.patientImg.style.backgroundSize = 'contain';
                } else {
                    // Random Fallback Patient Image
                    const patients = ['assets/patient_angry.png', 'assets/patient_pleading.png', 'assets/patient_smart.png'];
                    const randImg = patients[Math.floor(Math.random() * patients.length)];
                    this.ui.patientImg.style.backgroundImage = `url('${randImg}')`;
                    this.ui.patientImg.style.backgroundPosition = 'center bottom';
                    this.ui.patientImg.style.backgroundSize = 'contain';
                }

                // --- Update Chart ---
                // Safety check for UI elements
                // --- Update Chart (Force Refresh Refs) ---
                const chartName = document.getElementById('p-name');
                const chartInfo = document.getElementById('p-info');
                const chartBP = document.getElementById('p-bp');
                const chartHR = document.getElementById('p-hr');
                const chartBT = document.getElementById('p-bt');
                const chartHistory = document.getElementById('p-history');

                if (chartName) {
                    // Use Scenario Specific Data OR Random Defaults
                    const info = scenario.patientInfo || {};

                    // Prioritize scenario data for visual consistency (especially age/gender)
                    const pName = patient ? (patient.name || "Unknown") : "환자";
                    const pGender = info.gender || (patient ? (patient.gender || '?') : '?');
                    const pAge = info.age || (patient ? (patient.age || '?') : '?');
                    const pInfoStr = `(${pGender}/${pAge})`;

                    chartName.textContent = pName;
                    chartInfo.textContent = pInfoStr;

                    // Vitals Logic
                    const bp = info.bp || "120/80";
                    const hr = info.hr || "70";
                    const bt = info.bt || "36.5";
                    const history = info.history || "특이사항 없음";

                    chartBP.textContent = bp;
                    chartHR.textContent = hr;
                    chartBT.textContent = bt;
                    chartHistory.textContent = history;

                    // Color Logic for BP
                    if (typeof bp === 'string' && bp.includes('?')) {
                        chartBP.style.color = '#7f8c8d'; // Gray for unknown
                    } else if (parseInt(bp) >= 140) {
                        chartBP.style.color = '#d63031'; // Red for High BP
                    } else {
                        chartBP.style.color = '#fff'; // Default
                    }

                    // Color Logic for BT
                    if (parseFloat(bt) >= 37.6) {
                        chartBT.style.color = '#d63031'; // Fever
                    } else {
                        chartBT.style.color = '#fff';
                    }

                    // Highlight Warning logic
                    if (info.history && (info.history.includes('알러지') || info.history.includes('고혈압') || info.history.includes('당뇨') || info.history.includes('페니실린'))) {
                        chartHistory.style.color = '#d63031';
                    } else {
                        chartHistory.style.color = '#aaa';
                    }
                }
                // --------------------
                // --------------------

                this.ui.choiceContainer.innerHTML = '';
                scenario.choices.forEach(choice => {
                    const btn = document.createElement('button');
                    btn.className = 'choice-btn';
                    btn.textContent = choice.label;
                    btn.onclick = () => {
                        if (this.isProcessing) return;
                        this.isProcessing = true;
                        this.stopTurnTimer(); // STOP TIMER
                        this.handleChoice(choice);
                    };
                    this.ui.choiceContainer.appendChild(btn);
                });
            } catch (err) {
                console.error("Render Error:", err);
                this.ui.patientDialogue.textContent = "Error loading scenario.";
            } finally {
                // ALWAYS show content
                this.ui.avatarVis.style.opacity = '1';
                this.isProcessing = false;
            }
        }, 300);
    }

    handleChoice(choice) {
        if (choice.log) {
            this.ui.hintBubble.textContent = choice.log;
            this.ui.hintBubble.classList.remove('hidden');
            setTimeout(() => this.ui.hintBubble.classList.add('hidden'), 3000);
        }

        this.updateResources(choice.effect);
        setTimeout(() => this.nextTurn(), 2000);
    }


    // --- Admin Mode Logic ---
    initAdminMode() {
        this.adminState = {
            isOpen: false,
            editingCase: null,
            customScenarios: JSON.parse(localStorage.getItem('custom_scenarios') || '[]')
        };

        // Combine default and custom scenarios
        this.allScenarios = [...scenarios, ...this.adminState.customScenarios];

        // Access via Button
        const adminBtn = document.getElementById('admin-btn');
        if (adminBtn) adminBtn.onclick = () => this.toggleAdminMode();

        // Access via Shortcut: Shift + Alt + A
        window.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.altKey && e.code === 'KeyA') {
                this.toggleAdminMode();
            }
        });

        // Close Btn
        document.getElementById('close-admin').onclick = () => this.toggleAdminMode();

        // Save Btn
        document.getElementById('save-scenario-btn').onclick = () => this.saveEditedScenario();

        // Add Btn
        document.getElementById('add-scenario-btn').onclick = () => this.addNewScenario();

        // Export Btn
        document.getElementById('export-data-btn').onclick = () => this.exportScenarioData();

        this.refreshAdminScenarioList();
    }

    toggleAdminMode() {
        this.adminState.isOpen = !this.adminState.isOpen;
        const overlay = document.getElementById('admin-mode-overlay');
        if (this.adminState.isOpen) {
            overlay.classList.remove('hidden');
            this.refreshAdminScenarioList();
        } else {
            overlay.classList.add('hidden');
        }
    }

    refreshAdminScenarioList() {
        const listEl = document.getElementById('admin-scenario-list');
        listEl.innerHTML = '';
        this.allScenarios.forEach(s => {
            const li = document.createElement('li');
            li.textContent = `[${s.id}] ${s.text.substring(0, 20)}...`;
            li.onclick = () => this.loadScenarioToEditor(s.id);
            listEl.appendChild(li);
        });
    }

    loadScenarioToEditor(sid) {
        const s = this.allScenarios.find(item => item.id === sid);
        if (!s) return;

        this.adminState.editingCase = s;
        document.getElementById('edit-id').value = s.id;
        document.getElementById('edit-image').value = s.image || '';
        document.getElementById('edit-text').value = s.text || '';
        document.getElementById('edit-age').value = s.patientInfo?.age || '';
        document.getElementById('edit-gender').value = s.patientInfo?.gender || 'M';
        document.getElementById('edit-bp').value = s.patientInfo?.bp || '';
        document.getElementById('edit-hr').value = s.patientInfo?.hr || '';
        document.getElementById('edit-bt').value = s.patientInfo?.bt || '';

        // Load Choices
        const choicesListEl = document.getElementById('edit-choices-list');
        choicesListEl.innerHTML = '';
        (s.choices || []).forEach((c, idx) => {
            const row = document.createElement('div');
            row.className = 'choice-edit-row';
            row.innerHTML = `
                <label>Choice ${idx + 1} Text: <input type="text" class="edit-choice-text" value="${c.text}"></label>
                <div class="effects-grid">
                    <label>HP: <input type="number" class="edit-eff-hp" value="${c.effect.hp || 0}"></label>
                    <label>Mental: <input type="number" class="edit-eff-m" value="${c.effect.mental || 0}"></label>
                    <label>Risk: <input type="number" class="edit-eff-r" value="${c.effect.adminRisk || 0}"></label>
                    <label>Satisf: <input type="number" class="edit-eff-s" value="${c.effect.satisfaction || 0}"></label>
                    <label>Rev: <input type="number" class="edit-eff-v" value="${c.effect.revenue || 0}"></label>
                </div>
            `;
            choicesListEl.appendChild(row);
        });
    }

    saveEditedScenario() {
        if (!this.adminState.editingCase) return;

        // Collect Choices
        const choiceRows = document.querySelectorAll('.choice-edit-row');
        const updatedChoices = Array.from(choiceRows).map(row => ({
            text: row.querySelector('.edit-choice-text').value,
            effect: {
                hp: parseInt(row.querySelector('.edit-eff-hp').value),
                mental: parseInt(row.querySelector('.edit-eff-m').value),
                adminRisk: parseInt(row.querySelector('.edit-eff-r').value),
                satisfaction: parseInt(row.querySelector('.edit-eff-s').value),
                revenue: parseInt(row.querySelector('.edit-eff-v').value)
            }
        }));

        const updated = {
            ...this.adminState.editingCase,
            image: document.getElementById('edit-image').value,
            text: document.getElementById('edit-text').value,
            patientInfo: {
                age: parseInt(document.getElementById('edit-age').value),
                gender: document.getElementById('edit-gender').value,
                bp: document.getElementById('edit-bp').value,
                hr: parseInt(document.getElementById('edit-hr').value),
                bt: parseFloat(document.getElementById('edit-bt').value)
            },
            choices: updatedChoices
        };

        // Update in allScenarios
        const idx = this.allScenarios.findIndex(s => s.id === updated.id);
        this.allScenarios[idx] = updated;

        // Save custom ones to LocalStorage
        const customs = this.allScenarios.filter(s => !scenarios.find(orig => orig.id === s.id));
        localStorage.setItem('custom_scenarios', JSON.stringify(customs));

        alert('저장되었습니다. (현재 세션 및 LocalStorage)');
        this.refreshAdminScenarioList();
    }

    addNewScenario() {
        const newId = 'custom_' + Date.now();
        const newCase = {
            id: newId,
            image: "sprite_patient_m_01",
            text: "새로운 환자 시나리오입니다.",
            patientInfo: { age: 30, gender: "M", bp: "120/80", hr: 72, bt: 36.5 },
            choices: [
                { text: "옵션 1", effect: { hp: 0, mental: 0, revenue: 10000, satisfaction: 5 } },
                { text: "옵션 2", effect: { hp: -5, mental: -5, revenue: 50000, satisfaction: -10 } }
            ]
        };
        this.allScenarios.push(newCase);
        this.refreshAdminScenarioList();
        this.loadScenarioToEditor(newId);
    }

    exportScenarioData() {
        const dataStr = "const scenarios = " + JSON.stringify(this.allScenarios, null, 4) + ";";
        const blob = new Blob([dataStr], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.js';
        a.click();
    }

    triggerEnding(type) {
        this.stopTurnTimer();
        clearInterval(this.influxTimer);
        clearInterval(this.stressTimer);

        const ending = endings[type];

        // Final Evaluation Logic
        let evaluation = "\n\n[의사 유형 판정]\n";

        if (type === 'survival') {
            const revenue = this.resources.revenue;
            const risk = this.resources.adminRisk;
            const satisfaction = this.resources.satisfaction;

            if (this.patientsSeen >= this.breakEvenGoal) {
                evaluation += "✅ 오늘의 진료 목표(20명)를 달성하셨습니다!\n";
            } else {
                evaluation += "⚠️ 목표 인원을 다 채우지 못하고 퇴근하셨습니다.\n";
            }

            if (revenue > 80000 && risk > 40) {
                evaluation += "🤑 타락한 자본주의자\n(돈은 벌었지만 교도소 담장 위를 걷고 계시네요)";
            } else if (revenue < 30000 && satisfaction > 70) {
                evaluation += "😇 호구... 아니 슈바이처\n(환자들에겐 천사지만 병원은 망해갑니다)";
            } else if (this.resources.mental > 70 && this.resources.hp > 70) {
                evaluation += "🛡️ 멘탈갑 철벽 의사\n(방어 진료의 달인, 가늘고 길게 가시겠군요)";
            } else {
                evaluation += "😐 평범한 소시민 의사\n(오늘도 무사히 넘긴 것에 감사합니다)";
            }

            evaluation += `\n\n최종 진료 인원: ${this.patientsSeen}명`;
            evaluation += `\n최종 수익: ₩${revenue.toLocaleString()}`;
        } else if (type === 'burnout') {
            evaluation += "💀 과로사 직전\n(다음 생엔 건물주로 태어나세요)";
        } else if (type === 'lawsuit') {
            evaluation += "⚖️ 면허 취소 위기\n(변호사 선임비가 더 들겠습니다)";
        } else if (type === 'collapse') {
            ending = { title: "병원 마비", desc: "대기 환자들의 폭동으로 병원이 점거당했습니다.", color: "#d63031" };
            evaluation += "📢 대기실 통제 실패\n(진료 속도가 너무 느려서 망했습니다)";
        }

        this.ui.endingTitle.textContent = ending.title;
        this.ui.endingDesc.innerText = ending.desc + evaluation;
        this.ui.endingTitle.style.color = ending.color;

        this.ui.overlay.classList.remove('hidden');
    }
}

// Start Game
window.onload = () => {
    new Game();
};
