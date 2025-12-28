// Fabryka Głosów z Web Speech API - WERSJA Z GLOBALNYM MIKROFONEM
// PRZETŁUMACZONY NA CZESKI - JĘZYK ROZPOZNAWANIA MOWY
// Kod zachowany po polsku, tylko teksty wyświetlane przetłumaczone na czeski

class VoiceFactoryGame {

    constructor() {
        this.currentJournalPage = 0;
        this.totalJournalPages = 5;
        this.completedWords = [];
        this.completedKable = 0;
        this.score = 0;
        this.isListening = false;
        this.currentLevel = 0;
        this.hint2Unlocked = false;
        this.hint3Unlocked = false;
        this.previousScreen = null;

        // NOWE: Stan mikrofonu
        this.micEnabled = false; // Czy mikrofon jest aktywny
        this.currentContext = null; // Aktualny kontekst (door, game, practice)
        this.levels = [

            {

                id: 1,

                name: "Zdá se, že řídicí stroj továrny stále nefunguje. Musíme se ho pokusit opravit.",

                hint: "Řekni 'oprav stroj', abys pokračoval dál.",

                vocabulary: ["oprav stroj"]

            },

            {

                id: 2,

                name: "Navzdory opravenému napájení stále není proud. Zkontroluj zdroj.",

                hint: "Vyslov 'Zkontroluj zdroj'",

                vocabulary: ["zkontroluj zdroj"]

            },

            {

                id: 3,

                name: "Kabely zdroje se zdají být zrezavělé.",

                hint: "Vyslov 'Čištění kontaktů' a 'Zkontroluj vodivost'",

                vocabulary: ["čištění kontaktů", "zkontroluj vodivost"]

            },

            {

                id: 4,

                name: "Napájení opět funguje. Stroj se nyní může zapnout.",

                hint: "Vyslov 'Zapněte stroj'",

                vocabulary: ["zapněte stroj"]

            },

            {

                id: 5,

                name: "Stroj se spustil. Okamžitě se však objevilo několik chyb. Je je třeba opravit. První chybou je vada senzoru. Podívej se dovnitř stroje a vyměň jej.",

                hint: "Vyslov 'Otevři stroj' a 'Vyměň senzor'",

                vocabulary: ["otevři stroj", "vyměň senzor"]

            },

            {

                id: 6,

                name: "Dalším problémem, který stroj ukazuje, je výměna ložiska a řídicí páky.",

                hint: "Vyslov 'Vyměň ložisko' a 'Vyměň páku'",

                vocabulary: ["vyměň ložisko", "vyměň páku"]

            },

            {

                id: 7,

                name: "Skvělé. Nejsou žádné mechanické chyby. Poslední krok je opětovná kalibrace součástí v správném pořadí. Nejdřív zkalibruj integrovaný obvod.",

                hint: "Vyslov 'Zkalibrovat integrovaný obvod'",

                vocabulary: ["zkalibrovat integrovaný obvod"]

            },

            {

                id: 8,

                name: "Dále je kalibrace procesoru.",

                hint: "Vyslov 'Zkalibrovat procesor'",

                vocabulary: ["zkalibrovat procesor"]

            },

            {

                id: 9,

                name: "A nakonec zbývá kalibrace spřaženého systému.",

                hint: "Vyslov 'Zkalibovat spřažený systém'",

                vocabulary: ["zkalibrovat spřažený systém"]

            },

        ];

        this.init();

    }

    init() {
        this.bindUI();
        this.showMenu();
    }

    bindUI() {

        // Ekrany

        this.mainMenu = document.getElementById("mainMenu");

        this.storyIntroScreen = document.getElementById("storyIntroScreen");

        this.doorScreen = document.getElementById("doorScreen");

        this.factoryScreen = document.getElementById("factoryScreen");

        this.gameScreen = document.getElementById("gameScreen");

        this.gameScreenKable = document.getElementById("gameScreenKable");

        this.instructionsScreen = document.getElementById("instructionsScreen");

        this.journalScreen = document.getElementById("journalScreen");

        // Przyciski główne

        this.startBtn = document.getElementById("startGameBtn");

        this.introYesBtn = document.getElementById("introYesBtn");

        this.journalBtn = document.getElementById("journalBtn");

        this.helpBtn = document.getElementById("helpBtn");

        this.backBtn = document.getElementById("backBtn");

        this.backFromInstructionsBtn = document.getElementById("backFromInstructionsBtn");

        this.backFromJournalBtn = document.getElementById("backFromJournalBtn");

        this.backBtnKable = document.getElementById("backBtnKable");

        // NOWY: Globalny przycisk mikrofonu

        this.globalMicBtn = document.getElementById("globalMicBtn");

        // Elementy feedback (bez przycisków mikrofonu)

        this.doorSpeechResult = document.getElementById("doorSpeechResult");

        this.speechResult = document.getElementById("speechResult");

        // Fabryka

        this.machineBtn1 = document.getElementById("machineBtn1");

        this.machineBtn2 = document.getElementById("machineBtn2");

        this.machine1Nap = document.getElementById("1-nap");

        this.KableNap = document.getElementById("kable-nap");

        // Gra

        this.levelTitle = document.getElementById("levelTitle");

        this.levelHint = document.getElementById("levelHint");

        this.scoreDisplay = document.getElementById("scoreDisplay");

        this.Punkty = document.getElementById("score");

        //Kable

        this.KabCzerwony = document.getElementById("kab-czerwony");

        this.KabBrazowy = document.getElementById("kab-brazowy");

        this.KabPomaranczowy = document.getElementById("kab-pomaranczowy");

        this.KabZolty = document.getElementById("kab-zolty");

        this.KabGranatowy = document.getElementById("kab-granatowy");

        this.KabSzary = document.getElementById("kab-szary");

        // Dziennik

        this.nextPageBtn = document.getElementById("nextPageBtn");

        this.prevPageBtn = document.getElementById("prevPageBtn");

        // Event listeners - MENU

        this.startBtn.addEventListener("click", () => this.startStory());

        this.helpBtn.addEventListener("click", () => this.showInstructions());

        this.backFromInstructionsBtn.addEventListener("click", () => this.showMenu());

        // Event listeners - INTRO

        this.introYesBtn.addEventListener("click", () => this.showDoorScreen());

        // Event listeners - GLOBALNY MIKROFON

        this.globalMicBtn.addEventListener("click", () => this.toggleGlobalListening());

        // Event listeners - FABRYKA

        this.machineBtn1.addEventListener("click", () => this.startGame());

        this.machineBtn2.addEventListener("click", () => this.startGameKable());

        // Event listeners - GRA

        this.backBtn.addEventListener("click", () => this.returnToFactory());

        this.backBtnKable.addEventListener("click", () => this.returnToFactory());

        // Event listeners - DZIENNIK

        this.journalBtn.addEventListener("click", () => this.showJournal());

        this.backFromJournalBtn.addEventListener("click", () => this.closeJournal());

        this.prevPageBtn.addEventListener("click", () => {

            if (this.currentJournalPage > 0) {

                this.currentJournalPage--;

                this.showJournalPage();

            }

        });

        this.nextPageBtn.addEventListener("click", () => {

            if (this.currentJournalPage < this.totalJournalPages - 1) {

                this.currentJournalPage++;

                this.showJournalPage();

            }

        });

    }

    // ===== ZARZĄDZANIE GLOBALNYM MIKROFONEM =====

    enableMicrophone(context) {
        this.micEnabled = true;
        this.currentContext = context;
        this.globalMicBtn.style.display = "block";
        this.globalMicBtn.classList.remove("listening");
        this.globalMicBtn.textContent = "🎤";
    }

    disableMicrophone() {
        this.micEnabled = false;
        this.currentContext = null;
        this.globalMicBtn.style.display = "none";
        this.globalMicBtn.classList.remove("listening");
        this.stopListening();
    }

    toggleGlobalListening() {
        if (!this.micEnabled) return;
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (!this.micEnabled) return;
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showFeedback("Tvůj prohlížeč nepodporuje rozpoznávání řeči.", "#ef4444");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'cs-CZ';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.onstart = () => {
            this.isListening = true;
            this.globalMicBtn.textContent = "🔴";
            this.globalMicBtn.classList.add('listening');
            this.showFeedback("Poslouchám...", "#fbbf24");
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            this.showFeedback(`Slyšel jsem: "${transcript}"`, "#e5e7eb");
            this.processTranscript(transcript);
        };
        this.recognition.onerror = (event) => {
            this.showFeedback(`Chyba: ${event.error}`, "#ef4444");
            this.stopListening();
        };
        this.recognition.onend = () => {
            this.stopListening();
        };
        this.recognition.start();

    }

    stopListening() {

        this.isListening = false;
        this.globalMicBtn.textContent = "🎤";
        this.globalMicBtn.classList.remove('listening');
        if (this.recognition) {

            this.recognition.stop();

        }
    }
    processTranscript(transcript) {
        switch (this.currentContext) {
            case 'door':
                this.checkDoorAnswer(transcript);
                break;
            case 'game':
                this.checkGameAnswer(transcript);
                break;
            case 'kable':
                this.checkKableAnswer(transcript);
                break;
            default:
                this.showFeedback("Neznámý kontext", "#ef4444");
        }
    }

    showFeedback(message, color) {
        let feedbackElement;
        switch (this.currentContext) {
            case 'door':
                feedbackElement = this.doorSpeechResult;
                break;
            case 'game':
                feedbackElement = this.speechResult;
                break;
            case 'kable':
                feedbackElement = this.kableSpeechResult;
                break;
            default:
                return;

        }
        if (feedbackElement) {
            feedbackElement.textContent = message;
            feedbackElement.style.color = color;

        }

    }

    // ===== ZARZĄDZANIE EKRANAMI =====

    hideAllScreens() {

        this.mainMenu.classList.remove('active');
        this.storyIntroScreen.classList.remove('active');
        this.doorScreen.classList.remove('active');
        this.factoryScreen.classList.remove('active');
        this.gameScreen.classList.remove('active');
        this.gameScreenKable.classList.remove('active');
        this.instructionsScreen.classList.remove('active');
        this.journalScreen.classList.remove('active');

    }

    showMenu() {

        this.hideAllScreens();
        this.mainMenu.classList.add("active");
        this.journalBtn.style.display = "none";
        this.disableMicrophone();
        this.previousScreen = "mainMenu";

    }

    startStory() {

        this.hideAllScreens();
        this.storyIntroScreen.classList.add("active");
        this.journalBtn.style.display = "none";
        this.disableMicrophone();
        this.previousScreen = "storyIntroScreen";

    }

    showDoorScreen() {

        this.hideAllScreens();
        this.doorScreen.classList.add("active");
        this.journalBtn.style.display = "none";
        this.doorSpeechResult.textContent = "";

        // WŁĄCZ MIKROFON dla drzwi

        this.enableMicrophone('door');
        this.previousScreen = "doorScreen";

    }

    showFactory() {
        this.hideAllScreens();
        this.factoryScreen.classList.add("active");
        this.journalBtn.style.display = "block";
        this.Punkty.style.display = "block";
        // WYŁĄCZ MIKROFON na ekranie fabryki
        this.disableMicrophone();
        this.previousScreen = "factoryScreen";
    }

    returnToFactory() {
        this.showFactory();
    }

    showInstructions() {
        this.hideAllScreens();
        this.instructionsScreen.classList.add("active");
        this.journalBtn.style.display = "none";
        this.disableMicrophone();
        this.previousScreen = "instructionsScreen";
    }

    showJournal() {
        this.hideAllScreens();
        this.journalScreen.classList.add("active");
        this.currentJournalPage = 0;
        this.showJournalPage();
        this.disableMicrophone();
    }

    closeJournal() {
        this.journalScreen.classList.remove("active");
        if (this.previousScreen) {
            const previousScreenElement = document.getElementById(this.previousScreen);
            if (previousScreenElement) {
                previousScreenElement.classList.add("active");
                // Przywróć mikrofon jeśli był aktywny
                if (this.previousScreen === "doorScreen") {
                    this.enableMicrophone('door');
                } else if (this.previousScreen === "gameScreen") {
                    this.enableMicrophone('game');
                }
            }
        } else {
            this.showFactory();
        }
    }

    // ===== PUNKTACJA ===== //
    async addPoints() {
        this.score += 100;
        document.getElementById('score').textContent = `Body: ${this.score}`;
        this.checkPoints();
    }
    async checkPoints() {
        if (this.score == 500) {
            customAlert.success('Našel jsi nápovědu k dalším krokům. Najdeš ji v deníku na straně 3');
        }
    }

    // ===== LOGIKA DRZWI ===== //

    checkDoorAnswer(transcript) {

        if (transcript.includes("otevři dveře") || transcript.includes("otevri dvere")) {

            this.showFeedback("✅ Skvělé! Dveře se otevírají...", "#10b981");

            this.disableMicrophone();

            setTimeout(() => {

                this.showFactory();

            }, 2000);

        } else {

            this.showFeedback('❌ Zkus znovu! Řekni: "Otevři dveře"', "#ef4444");

        }

    }

    // ===== LOGIKA GRY MASZYNA STERUJĄCA ===== //

    startGame() {

        this.hideAllScreens();

        this.gameScreen.classList.add("active");

        this.journalBtn.style.display = "block";

        this.loadLevel();

        // WŁĄCZ MIKROFON dla gry

        this.enableMicrophone('game');

        this.previousScreen = "gameScreen";

    }

    loadLevel() {

        if (this.currentLevel >= this.levels.length) {

            this.endGame();

            return;

        }

        const level = this.levels[this.currentLevel];

        if (level.id === 5) {

            this.levelTitle.textContent = level.name;

            if (this.hint2Unlocked === true) this.levelHint.textContent = level.hint;

            else this.levelHint.textContent = "Žádné informace";

            this.scoreDisplay.textContent = `Body: ${this.score}`;

            this.speechResult.textContent = "";

        } else {

            const level = this.levels[this.currentLevel];

            this.levelTitle.textContent = level.name;

            this.levelHint.textContent = level.hint;

            this.scoreDisplay.textContent = `Body: ${this.score}`;

            this.speechResult.textContent = "";

        }

    }

    checkGameAnswer(transcript) {

        const level = this.levels[this.currentLevel];

        const correct = level.vocabulary.some(word =>

            transcript.includes(word.toLowerCase())

        );

        if (correct && !this.completedWords.includes(transcript)) {

            this.addPoints();

            this.completedWords.push(transcript);

            this.showFeedback("✅ Skvělé!", "#10b981");

            if (this.completedWords.length === level.vocabulary.length) {

                this.showFeedback("✅ Skvělé! Pokračuješ dál!", "#10b981");

                setTimeout(() => {

                    this.completedWords = [];

                    this.currentLevel++;

                    this.loadLevel();

                }, 2000);

            }

        } else if (this.completedWords.includes(transcript)) {

            this.showFeedback("❌ Zkus znovu! Příkaz již byl vyslovlen.", "#ef4444");

        } else {

            this.showFeedback("❌ Zkus znovu! Nesprávná výslovnost. Řekl jsi " + transcript, "#ef4444");

        }

    }

    endGame() {

        this.showFeedback(`🎉 Gratulace! Stroj je plně funkční. Zkontroluj, které stroje je třeba napravit dále. Získal jsi ${this.score} bodů!`, "#10b981");

        this.levelTitle.textContent = "Konec hry";

        this.levelHint.textContent = "Skvělá práce, detektive!";

        this.machineBtn1.style.display = "none";

        this.machine1Nap.style.display = "block";

        this.disableMicrophone();

    }

    // ===== LOGIKA GRY KABLE ===== //

    startGameKable() {

        this.hideAllScreens();

        this.gameScreenKable.classList.add("active");

        this.journalBtn.style.display = "block";

        this.loadLevel();

        this.enableMicrophone('kable');

        // Ukryj kabel na początek

        const cableElement = document.getElementById("cableImage");

        if (cableElement) {

            cableElement.classList.remove("show");

        }

        this.previousScreen = "gameScreenKable";

    }

    checkKableAnswer(transcript) {

        if (transcript.includes("červený")) {

            this.KabCzerwony.style.display = "block";

            this.completedKable++;

            if (this.completedKable === 6) {

                this.endKableGame();

            }

        } else if (transcript.includes("hnědý")) {

            this.KabBrazowy.style.display = "block";

            this.completedKable++;

            if (this.completedKable === 6) {

                this.endKableGame();

            }

        } else if (transcript.includes("oranžový")) {

            this.KabPomaranczowy.style.display = "block";

            this.completedKable++;

            if (this.completedKable === 6) {

                this.endKableGame();

            }

        } else if (transcript.includes("žlutý")) {

            this.KabZolty.style.display = "block";

            this.completedKable++;

            if (this.completedKable === 6) {

                this.endKableGame();

            }

        } else if (transcript.includes("tmavě modrý")) {

            this.KabGranatowy.style.display = "block";

            this.completedKable++;

            if (this.completedKable === 6) {

                this.endKableGame();

            }

        } else if (transcript.includes("šedý")) {

            this.KabSzary.style.display = "block";

            this.completedKable++;

            if (this.completedKable === 6) {

                this.endKableGame();

            }

        } else {

            this.showFeedback("❌ Zkus znovu!", "#ef4444");

        }

    }

    showCable() {

        const cableElement = document.getElementById("cableImage");

        if (cableElement) {

            cableElement.classList.add("show");

        }

    }

    endKableGame() {

        customAlert.success(`🎉 Gratulace! Stroj je plně funkční. Zkontroluj, které stroje je třeba napravit dále. Získal jsi ${this.score} bodů!`, "#10b981");

        this.levelTitle.textContent = "Konec hry";

        this.levelHint.textContent = "Skvělá práce, detektive!";

        this.machineBtn2.style.display = "none";

        this.KableNap.style.display = "block";

        this.disableMicrophone();

    }

    // ===== DZIENNIK ===== //

    showJournalPage() {

        // Ukryj wszystkie strony

        for (let i = 0; i < this.totalJournalPages; i++) {

            const page = document.getElementById(`page${i}`);

            if (page) page.style.display = "none";

        }

        // Pokaż aktualną stronę

        const currentPage = document.getElementById(`page${this.currentJournalPage}`);

        if (currentPage) currentPage.style.display = "block";

        // Zaktualizuj przyciski nawigacji

        this.prevPageBtn.disabled = (this.currentJournalPage === 0);

        this.nextPageBtn.disabled = (this.currentJournalPage === this.totalJournalPages - 1);

        // STRONA 2: Minigra Układania Słowa

        if (this.currentJournalPage === 2 && this.score >= 500) {

            const miniGameContainer = document.getElementById("miniGameUkadanieSowa");

            if (miniGameContainer) {

                initMiniGameUkadanieSowa(this);

            }

        }

        // STRONA 3: Minigra Drag & Drop

        if (this.currentJournalPage === 3 && this.score >= 600) {

            document.getElementById("page3-original-content").style.display = "none";

            document.getElementById("miniGameFactoryDrag").style.display = "block";

            initMiniGameFactoryDrag(this);

        } else if (this.currentJournalPage === 3) {

            document.getElementById("page3-original-content").style.display = "block";

            document.getElementById("miniGameFactoryDrag").style.display = "none";

        }

        // STRONA 4: Minigra Kable

        if (this.currentJournalPage === 4 && this.score >= 500) {

            document.getElementById("miniGamePolskoCzeskieKable").style.display = "block";

            initMiniGamePolskoCzeskieKable(this);

        } else if (this.currentJournalPage === 4) {

            document.getElementById("miniGamePolskoCzeskieKable").style.display = "none";

        }

    }

}

// Initialize game when page loads

document.addEventListener("DOMContentLoaded", () => {

    const game = new VoiceFactoryGame();

});