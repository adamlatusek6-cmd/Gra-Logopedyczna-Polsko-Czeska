// Fabryka Głosów z Web Speech API - WERSJA Z GLOBALNYM MIKROFONEM

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
        this.micEnabled = false;  // Czy mikrofon jest aktywny
        this.currentContext = null;  // Aktualny kontekst (door, game, practice)
        
        this.levels = [
            {
                id: 1,
                name: "Wygląda na to, że maszyna do sterowania fabryką nadal nie działa. Trzeba spróbować ją naprawić.",
                hint: "Wypowiedz 'napraw maszynę' by przejść dalej",
                vocabulary: ["napraw maszynę"]
            },
            {
                id: 2,
                name: "Pomimo naprawionego zasilania wciąż brak prądu. Sprawdź zasilacz. ",
                hint: "Wypowiedz 'Sprawdź zasilacz'",
                vocabulary: ["sprawdź zasilacz"]
            },
            {
                id: 3,
                name: "Kable zasilacza wydają się być zardzewiałe.",
                hint: "Wypowiedz 'Czyszczenie styków' oraz'Sprawdź przewodność'",
                vocabulary: ["czyszczenie styków","sprawdź przewodność"]
            },
            {
                id: 4,
                name: "Zasilanie ponownie działa. Maszyna może się teraz włączyć.",
                hint: "Wypowiedz 'Włącz maszynę sterowania'",
                vocabulary: ["włącz maszynę sterowania"]
            },
            {
                id: 5,
                name: "Maszyna uruchomiła się. Jednak od razu wyskoczyło kilka błedów. Należy je naprawić. Pierwszym błędem jest wada czujnika. Zajrzyj do maszyny i go wymień.",
                hint: "Wypowiedz 'Otwórz maszynę' oraz 'Wymień czujnik'",
                vocabulary: ["otwórz maszynę","wymień czujnik"]
            },
            {
                id: 6,
                name: "Kolejnym problemem jaki maszyna wskazuje jest wymiana łożyska i dźwigni sterującej.",
                hint: "Wypowiedz 'Wymień łożysko' oraz 'Wymień dźwignię'",
                vocabulary: ["wymień łożysko","wymień dźwignię"]
            },
            {
                id: 7,
                name: "Super. Już nie ma żadnych usterek mechanicznych. Ostatnim krokiem jest ponowna kalibracja komponentów w odpowiedniej kolejności. Najpierw skalibruj układ scalony.",
                hint: "Wypowiedz 'Skalibruj układ scalony'",
                vocabulary: ["skalibruj układ scalony"]
            },
            {
                id: 8,
                name: "Następna jest kalibracja przetwarzacza.",
                hint: "Wypowiedz 'Skalibruj przetwarzacz'",
                vocabulary: ["skalibruj przetwarzać"]
            },
            {
                id: 9,
                name: "I na koniec została kalibracja układu sprzężonego.",
                hint: "Wypowiedz 'Skalibruj układ sprzężony'",
                vocabulary: ["skalibruj układ sprzężony"]
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
        this.kableSpeechResult = document.getElementById("kableSpeechResult");
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
        this.prevPageBtn.addEventListener(  "click", () => {
            if(this.currentJournalPage > 0) {
                this.currentJournalPage--;
                this.showJournalPage();
            }
        });
        this.nextPageBtn.addEventListener("click", () => {
            if(this.currentJournalPage < this.totalJournalPages-1) {
                this.currentJournalPage++;
                this.showJournalPage();
            }
        });

        // TYMCZASOWE
        // W bindUI() - dodaj to po this.gameScreenKable:
        this.gameScreenSkrzynie = document.getElementById("gameScreenSkrzynie");

        // W bindUI() - dodaj to po this.machineBtn2:
        this.machineBtn4 = document.getElementById("machineBtn4");

        // W bindUI() - dodaj to po event listener machineBtn2:
        this.machineBtn4.addEventListener("click", () => this.startGameSkrzynie());

        this.SkrzynieGameResult = document.getElementById("skrzynie-speech-result");

        this.angBtn = document.getElementById("angBtn");
        this.ang = document.querySelector(".ang");
        this.angBtn.addEventListener('click', () => {
        document.querySelectorAll('.ang').forEach(el => {
        el.style.display = el.style.display === 'block' ? 'none' : 'block';
            });
        document.querySelectorAll('.intro-story-title1-ang').forEach(el => {
        el.style.display = el.style.display === 'block' ? 'none' : 'block';
            });
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
            this.showFeedback("Twoja przeglądarka nie wspiera rozpoznawania mowy.", "#ef4444");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'pl-PL';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.globalMicBtn.textContent = "🔴";
            this.globalMicBtn.classList.add('listening');
            this.showFeedback("Słucham...", "#fbbf24");
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            this.showFeedback(`Usłyszałem: "${transcript}"`, "#e5e7eb");
            this.processTranscript(transcript);
        };

        this.recognition.onerror = (event) => {
            this.showFeedback(`Błąd: ${event.error}`, "#ef4444");
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
        switch(this.currentContext) {
            case 'door':
                this.checkDoorAnswer(transcript);
                break;
            case 'game':
                this.checkGameAnswer(transcript);
                break;
            case 'kable':
                this.checkKableAnswer(transcript);
                break;
            case 'skrzynie':
                this.customSkrzynieProcessor(transcript);
                break;
            default:
                this.showFeedback("Nieznany kontekst", "#ef4444");
        }
    }

    showFeedback(message, color) {
        let feedbackElement;
        
        switch(this.currentContext) {
            case 'door':
                feedbackElement = this.doorSpeechResult;
                break;
            case 'game':
                feedbackElement = this.speechResult;
                break;
            case 'kable':
                feedbackElement = this.kableSpeechResult;
                break;
            case 'skrzynie':
                feedbackElement = this.SkrzynieGameResult;
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
        this.gameScreenSkrzynie.classList.remove('active');
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
        this.Punkty.style.display ="block";
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
                } else if (this.previousScreen === "gameScreenKable") {
                    this.enableMicrophone('kable');
                } else if (this.previousScreen === "gameScreenSkrzynie") {
                    this.enableMicrophone('skrzynie');
                }
            }
        } else {
            this.showFactory();
        }
    }
    // ===== PUNKTACJA ===== //
    async addPoints(points){
        this.score +=points;
        document.getElementById('score').textContent = `Punkty: ${this.score}`;
        this.checkPoints();
    }
    async checkPoints(){
        if(this.score == 1100){
            customAlert.info('Znalazłeś wskazówkę do następnych kroków. Znajdziejsz ją w dzienniku na stronie 3');
        }
    }

    // ===== LOGIKA DRZWI ===== //

    checkDoorAnswer(transcript) {
        if (transcript.includes("otwórz drzwi") || transcript.includes("otworz drzwi")) {
            this.showFeedback("✅ Świetnie! Drzwi się otwierają...", "#10b981");
            this.disableMicrophone();
            
            setTimeout(() => {
                this.showFactory();
            }, 2000);
            setTimeout(() => {
                DialogSystem.showSequence([
                { speakerId: 'info', text: 'Wchodzicie do ciemnej, brzęczącej hali. Wszystkie przewody są rozłączone, a ciemność spowija całą fabrykę.' },
                { speakerId: 'właściciel', text: 'Sabotażysta odciął zasilanie całej fabryki. Żeby przywrócić działanie systemów, musisz połączyć przewody odpowiadające za kolory głosów.' },
            ]);
            }, 2050);
        } else { 
            this.showFeedback('❌ Spróbuj ponownie! Powiedz: "Otwórz drzwi"', "#ef4444");
        }
    }

    // ===== LOGIKA GRY MASZYNA STERUJĄCA ===== //
    startGame() {
        this.hideAllScreens();
        this.enableMicrophone('game');
        this.gameScreen.classList.add("active");
        this.journalBtn.style.display = "block";
        this.loadLevel();
        
        // WŁĄCZ MIKROFON dla gry\
        
        this.previousScreen = "gameScreen";
    }

    loadLevel() {
        if (this.currentLevel >= this.levels.length) {
            this.endGame();
            return;
        }
            const level = this.levels[this.currentLevel];

            
        if( level.id === 5){
            this.levelTitle.textContent = level.name;
            if( this.hint2Unlocked===true) this.levelHint.textContent = level.hint;
            else this.levelHint.textContent = "Brak informacji";
            this.scoreDisplay.textContent = `Punkty: ${this.score}`;
            this.speechResult.textContent = "";
        } else{
            const level = this.levels[this.currentLevel];
            this.levelTitle.textContent = level.name;
            this.levelHint.textContent = level.hint;
            this.scoreDisplay.textContent = `Punkty: ${this.score}`;
            this.speechResult.textContent = "";
        
        }
    }

    checkGameAnswer(transcript) {
        const level = this.levels[this.currentLevel];
        const correct = level.vocabulary.some(word =>
            transcript.includes(word.toLowerCase())
        );

        if (correct && !this.completedWords.includes(transcript)) {
            this.addPoints(100);
            this.completedWords.push(transcript);
            this.showFeedback("✅ Świetnie!", "#10b981");
                setTimeout(() => {
                    this.showFeedback("", "#e5e7eb");
                }, 1500);
            if (this.completedWords.length === level.vocabulary.length) {
                this.showFeedback("✅ Świetnie! Przechodzisz dalej!", "#10b981");
                setTimeout(() => {
                    this.completedWords = [];
                    this.currentLevel++;
                    this.loadLevel();
                }, 1500);
            }
        } else if (this.completedWords.includes(transcript)){
            this.showFeedback("❌ Spróbuj ponownie! Komenda już została wypowiedziana.", "#ef4444");
        } else {
            this.showFeedback("❌ Spróbuj ponownie! Błędna wymowa. Powiedziałeś "+transcript, "#ef4444");
        }
    }

    endGame() {
        this.showFeedback(`🎉 Gratulacje! Maszyna jest w pełni sprawna. Sprawdź jakie maszyny należy naprawić jako następne. Otrzymałeś ${this.score} punktów!`, "#10b981");
        this.levelTitle.textContent = "Koniec gry";
        this.levelHint.textContent = "Świetna robota, detektywie!";
        this.machineBtn1.style.display="none";
        this.machine1Nap.style.display="block";
        this.machineBtn4.style.display="block";
        this.disableMicrophone();
    }
    // ===== LOGIKA GRY KABLE ===== //
    startGameKable() {
        this.hideAllScreens();
        this.gameScreenKable.classList.add("active");
        this.journalBtn.style.display = "block";
        this.enableMicrophone('kable');
        this.previousScreen = "gameScreenKable";
    }
    
    checkKableAnswer(transcript) {
        if (transcript.includes("czerwony")) {
            this.KabCzerwony.style.display = "block";
            this.kableAnswear();
        }else if (transcript.includes("brązowy")) {
            this.KabBrazowy.style.display = "block";
            this.kableAnswear();
        }else if (transcript.includes("pomarańczowy")) {
            this.KabPomaranczowy.style.display = "block";
            this.kableAnswear();
        }else if (transcript.includes("żółty")) {
            this.KabZolty.style.display = "block";
            this.kableAnswear();
        }else if (transcript.includes("granatowy")) {
            this.KabGranatowy.style.display = "block";
            this.kableAnswear();
        }else if (transcript.includes("szary")) {
            this.KabSzary.style.display = "block";
            this.kableAnswear();
        }else {
            this.showFeedback("❌ Spróbuj ponownie!", "#ef4444");
        }
    }
    kableAnswear() { 
        this.completedKable++;
        this.addPoints(100);
        this.showFeedback("✅ Świetnie!", "#10b981");
        setTimeout(() => {
            this.showFeedback("", "#e5e7eb");
        }, 2000);
         
         if(this.completedKable===6){
            this.endKableGame();
        }
    }
    showCable() {
        const cableElement = document.getElementById("cableImage");
        if (cableElement) {
            cableElement.classList.add("show");
        }
    }
    endKableGame() {
        customAlert.success(`🎉 Gratulacje! Maszyna jest w pełni sprawna. Sprawdź jakie maszyny należy naprawić jako następne. Otrzymałeś ${this.score} punktów!`, "Kable naprawione");
        this.machineBtn2.style.display="none";
        this.KableNap.style.display="block";
        this.machineBtn1.style.display="block";
        this.disableMicrophone();
        DialogSystem.showSequence([
            { speakerId: 'Detektyw', text: 'Świetna robota! Połączenie wszystkich kabli przywróciło zasilanie w fabryce.' },
            { speakerId: 'info', text: 'Z głębi rur w pobliżu słyszysz syczący głos' },
            { speakerId: null, text: 'Nigdy mnie nie zlapiessss…' },
            { speakerId: 'właściciel', text: 'Maszyna sterująca... On tam był!. Musimy ruszać dalej zanim będzie za późno!' },
        ]);
    }
    // ===== LOGIKA GRY SKRZYNIE =====

    startGameSkrzynie() {
        this.hideAllScreens();
        this.gameScreenSkrzynie.classList.add("active");
        this.journalBtn.style.display = "block";
        
        // WŁĄCZ MIKROFON dla gry skrzyni
        this.enableMicrophone('skrzynie');
        
        // Zainicjalizuj poziom
        initPoziomSkrzynie(this);
        
        this.previousScreen = "gameScreenSkrzynie";
    }

    // ===== DZIENNIK ===== //

    showJournalPage() {
        // Ukryj wszystkie strony
        for(let i = 0; i < this.totalJournalPages; i++) {
            const page = document.getElementById(`page${i}`);
            if(page) page.style.display = "none";
        }
        
        // Pokaż aktualną stronę
        const currentPage = document.getElementById(`page${this.currentJournalPage}`);
        if(currentPage) currentPage.style.display = "block";
        
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
// ========== DIALOG SYSTEM - UNIWERSALNY =========

        const DialogSystem = {
            // Konfiguracja dialogów - ŁATWE DO EDYTOWANIA
            dialogs: {
                robot: { icon: '🤖', name: 'Robot' },
                Detektyw: { icon: '👨‍💼', name: 'Detektyw' },
                właściciel: { icon: '🏭', name: 'Właściciel Fabryki' },
                info: { icon: ' ', name: ' ' },
                
            },

            // SEKWENCJA DIALOGÓW
            sequence: [],
            currentIndex: 0,

            // WYŚWIETL SEKWENCJĘ DIALOGÓW - Przechodź przez wiele dialogów
            showSequence: function(dialogArray, onComplete) {
                this.sequence = dialogArray;
                this.currentIndex = 0;
                this.onSequenceComplete = onComplete;
                this.displayCurrentDialog();
            },

            // WYŚWIETL OBECNY DIALOG W SEKWENCJI
            displayCurrentDialog: function() {
                if (this.currentIndex >= this.sequence.length) {
                    this.hide();
                    if (this.onSequenceComplete) {
                        this.onSequenceComplete();
                    }
                    return;
                }

                const current = this.sequence[this.currentIndex];
                const speaker = this.dialogs[current.speakerId] || {};
                
                // Aktualizuj elementy DOM
                document.getElementById('dialogIcon').textContent = current.icon || speaker.icon || '💬';
                document.getElementById('dialogSpeakerName').textContent = speaker.name || 'Nieznany';
                document.getElementById('dialogText').textContent = current.text;
                
                // Pokaż overlay
                document.getElementById('dialogOverlay').classList.add('show');
            },

            // NASTĘPNY DIALOG W SEKWENCJI
            nextInSequence: function() {
                this.currentIndex++;
                this.displayCurrentDialog();
            },

            // GŁÓWNA METODA - Wyświetlaj pojedynczy dialog
            show: function(speakerId, icon, text) {
                const speaker = this.dialogs[speakerId] || {};
                
                // Aktualizuj elementy DOM
                document.getElementById('dialogIcon').textContent = icon || speaker.icon || '💬';
                document.getElementById('dialogSpeakerName').textContent = speaker.name || 'Nieznany';
                document.getElementById('dialogText').textContent = text;
                
                // Pokaż overlay
                document.getElementById('dialogOverlay').classList.add('show');
                
                // Wyczyść sekwencję jeśli wywoływana jest pojedyncza funkcja
                this.sequence = [];
                this.currentIndex = 0;
            },

            // ZAMKNIJ DIALOG
            hide: function() {
                document.getElementById('dialogOverlay').classList.remove('show');
            },

            // DODAJ NOWĄ POSTAĆ (opcjonalnie)
            addSpeaker: function(id, icon, name) {
                this.dialogs[id] = { icon, name };
            }
        };

        // ========== EVENT LISTENERS =========

        // Zamknij dialog lub przejdź do następnego klikając X
        document.getElementById('dialogCloseBtn').addEventListener('click', () => {
            if (DialogSystem.sequence.length > 0) {
                DialogSystem.nextInSequence();
            } else {
                DialogSystem.hide();
            }
        });

        // Zamknij dialog lub przejdź do następnego klikając na overlay
        document.getElementById('dialogOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'dialogOverlay') {
                if (DialogSystem.sequence.length > 0) {
                    DialogSystem.nextInSequence();
                } else {
                    DialogSystem.hide();
                }
            }
        });

        // Przejdź do następnego dialogu lub zamknij klikając na dialog-box
        document.querySelector('.dialog-box').addEventListener('click', (e) => {
            if (e.target.className === 'dialog-box' || e.target.closest('.dialog-content')) {
                if (DialogSystem.sequence.length > 0) {
                    DialogSystem.nextInSequence();
                } else {
                    DialogSystem.hide();
                }
            }
        });

        // Zamknij dialog klawiszem ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                DialogSystem.hide();
            }
        });