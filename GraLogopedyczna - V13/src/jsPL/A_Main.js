// Fabryka Głosów z Web Speech API - WERSJA Z GLOBALNYM MIKROFONEM
class VoiceFactoryGame {
    constructor() {
        this.currentJournalPage = 0;
        this.totalJournalPages = 5;
        this.unlockedJournalPages = 2;     // Na starcie dostęp tylko do stron 0 i 1
        this.completedWords = [];
        this.completedKable = 0;
        this.score = 0;
        this.isListening = false;
        this.currentLevel = 0;
        this.hint2Unlocked = false;
        this.hint3Unlocked = false;
        this.hint4Unlocked = false;
        this.previousScreen = null;
        this.skrzynieWlaczone=false;
        this.minigra1=false;
        this.minigra2=false;
        this.minigra3=false;
        this.EngMode=false;
        this.previousScreenBeforeJournal = null;
        this.gameerrorsound=0;
        this.ruryEnd=false;
        this.ruryStart=false;
        this.sterujacaEnd=false;
        this.sterujacaHint=false;


        // NOWE: Stan mikrofonu
        this.micEnabled = false;  // Czy mikrofon jest aktywny
        this.currentContext = null;  // Aktualny kontekst (door, game, practice)
        
        this.levels = [
            {
                id: 1,
                name: "Wygląda na to, że maszyna do sterowania fabryką nadal nie działa. Trzeba spróbować ją naprawić.",
                nameEng: "It looks like the factory control machine is still not working. We need to try to fix it.",
                hint: "Wypowiedz 'napraw maszynę' by przejść dalej",
                hintEng: "Say 'napraw maszynę' to proceed",
                vocabulary: ["napraw maszynę"]
            },
            {
                id: 2,
                name: "Pomimo naprawionego zasilania wciąż brak prądu. Sprawdź zasilacz. ",
                nameEng: "Despite the repaired power supply, there is still no power. Check the power supply.",
                hint: "Wypowiedz 'Sprawdź zasilacz'",
                hintEng: "Say 'Sprawdź zasilacz'",
                vocabulary: ["sprawdź zasilacz"]
            },
            {
                id: 3,
                name: "Kable zasilacza wydają się być zardzewiałe.",
                nameEng: "The power supply cables seem to be rusty.",
                hint: "Wypowiedz 'Czyszczenie styków', a następnie 'Sprawdź przewodność'",
                hintEng: "Say 'Czyszczenie styków', then 'Sprawdź przewodność'",
                vocabulary: ["czyszczenie styków","sprawdź przewodność"]
            },
            {
                id: 4,
                name: "Zasilanie ponownie działa. Maszyna może się teraz włączyć.",
                nameEng: "The power is back on. The machine can now be turned on.",
                hint: "Wypowiedz 'Włącz maszynę sterowania'",
                hintEng: "Say 'Włącz maszynę sterowania'",
                vocabulary: ["włącz maszynę sterowania"]
            },
            {
                id: 5,
                name: "Maszyna uruchomiła się. Jednak od razu wyskoczyło kilka błedów. Należy je naprawić. Pierwszym błędem jest wada czujnika. Zajrzyj do maszyny i go wymień.",
                nameEng: "The machine has started up. However, several errors have immediately appeared. They need to be fixed. The first error is a sensor defect. Look inside the machine and replace it.",
                hint: "Wypowiedz 'Otwórz maszynę', a następnie 'Wymień czujnik'",
                hintEng: "Say 'Otwórz maszynę', then 'Wymień czujnik'",
                vocabulary: ["otwórz maszynę","wymień czujnik"]
            },
            {
                id: 6,
                name: "Kolejnym problemem jaki maszyna wskazuje jest wymiana łożyska i dźwigni sterującej.",
                nameEng: "The next problem indicated by the machine is the replacement of the bearing and the control lever.",
                hint: "Wypowiedz 'Wymień łożysko', a następnie 'Wymień dźwignię'",
                hintEng: "Say 'Wymień łożysko', then 'Wymień dźwignię'",
                vocabulary: ["wymień łożysko","wymień dźwignię"]
            },
            {
                id: 7,
                name: "Super. Już nie ma żadnych usterek mechanicznych. Ostatnim krokiem jest ponowna kalibracja komponentów w odpowiedniej kolejności. Najpierw skalibruj układ scalony.",
                nameEng: "Great. There are no more mechanical faults. The last step is to recalibrate the components in the correct order. First, calibrate the integrated circuit.",
                hint: "Wypowiedz 'Skalibruj układ scalony'",
                hintEng: "Say 'Skalibruj układ scalony'",
                vocabulary: ["skalibruj układ scalony"]
            },
            {
                id: 8,
                name: "Następna jest kalibracja przetwarzacza.",
                nameEng: "Next is the calibration of the processor.",
                hint: "Wypowiedz 'Skalibruj przetwarzacz'",
                hintEng: "Say 'Skalibruj przetwarzacz'",
                vocabulary: ["skalibruj przetwarzać"]
            },
            {
                id: 9,
                name: "I na koniec została kalibracja układu sprzężonego.",
                nameEng: "And finally, the calibration of the coupled system is left.",
                hint: "Wypowiedz 'Skalibruj układ sprzężony'",
                hintEng: "Say 'Skalibruj układ sprzężony'",
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
        this.gameScreenMaze = document.getElementById("gameScreenMaze");
        this.gameScreenSkrzynie = document.getElementById("gameScreenSkrzynie");
        this.gameScreenRury = document.getElementById("gameScreenRury");

        // Przyciski główne
        this.startBtn = document.getElementById("startGameBtn");
        this.startBtn1 = document.getElementById("startGameBtn1");
        this.introYesBtn = document.getElementById("introYesBtn");
        this.introYesBtn1 = document.getElementById("introYesBtn1");
        this.journalBtn = document.getElementById("journalBtn");
        this.helpBtn = document.getElementById("helpBtn");
        this.helpBtn1 = document.getElementById("helpBtn1");
        this.backBtn = document.getElementById("backBtn");
        this.backBtn1 = document.getElementById("backBtn1");
        this.backFromInstructionsBtn = document.getElementById("backFromInstructionsBtn");
        this.backFromJournalBtn = document.getElementById("backFromJournalBtn");
        this.backFromJournalBtn1 = document.getElementById("backFromJournalBtn1");
        this.backBtnKable = document.getElementById("backBtnKable");
        this.backBtnKable1 = document.getElementById("backBtnKable1");
        this.backBtnRury = document.getElementById('backBtnRury'); 
        this.backBtnRury1 = document.getElementById('backBtnRury1'); 

        this.skipButtonGame = document.getElementById("skipButtonGame");
        this.skipButtonGame1 = document.getElementById("skipButtonGame1");
        this.skipButtonGameKable = document.getElementById("skipButtonGameKable");
        this.skipButtonGameKable1 = document.getElementById("skipButtonGameKable1");
        // NOWY: Globalny przycisk mikrofonu
        this.globalMicBtn = document.getElementById("globalMicBtn");

        // Odznaki
        this.badge1 = document.getElementById("badge1");//pkt
        this.badge2 = document.getElementById("badge2");
        this.badge3 = document.getElementById("badge3");
        this.badge4 = document.getElementById("badge4");
        this.badge5 = document.getElementById("badge5");//kable
        this.badge6 = document.getElementById("badge6");//sterująca
        this.badge7 = document.getElementById("badge7");//skrzynia
        this.badge8 = document.getElementById("badge8");//robot

        // Elementy feedback (bez przycisków mikrofonu)
        this.doorSpeechResult = document.getElementById("doorSpeechResult");
        this.speechResult = document.getElementById("speechResult");
        this.kableSpeechResult = document.getElementById("kableSpeechResult");
        this.MazeSpeechResult = document.getElementById("mazeSpeechResult");
        this.SkrzynieGameResult = document.getElementById("skrzynie-speech-result");

        // Fabryka
        this.machineBtn1 = document.getElementById("machineBtn1");
        this.machineBtn2 = document.getElementById("machineBtn2"); 
        this.machineBtn3 = document.getElementById("machineBtn3");
        
        this.machineBtn4 = document.getElementById("machineBtn4");
        this.machineBtn5 = document.getElementById("machineBtn5");
        
        this.machine1Nap = document.getElementById("1-nap");
        this.KableNap = document.getElementById("kable-nap");
        this.machine2Nap = document.getElementById("2-nap");
        this.skrzyniaNap = document.getElementById("skrzynie-nap");
        this.robotNap = document.getElementById("robot-nap");
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
        this.nextPageBtn1 = document.getElementById("nextPageBtn1");
        this.prevPageBtn = document.getElementById("prevPageBtn");
        this.prevPageBtn1 = document.getElementById("prevPageBtn1");

        // Event listeners - MENU
        this.startBtn.addEventListener("click", () => this.startStory());
        this.startBtn1.addEventListener("click", () => this.startStory());
        this.helpBtn.addEventListener("click", () => this.showInstructions());
        this.helpBtn1.addEventListener("click", () => this.showInstructions());
        this.backFromInstructionsBtn.addEventListener("click", () => this.showMenu());

        // Event listeners - INTRO
        this.introYesBtn.addEventListener("click", () => this.showDoorScreen());
        this.introYesBtn1.addEventListener("click", () => this.showDoorScreen());

        // Event listeners - GLOBALNY MIKROFON
        this.globalMicBtn.addEventListener("click", () => this.toggleGlobalListening());

        // Event listeners - FABRYKA
        this.machineBtn1.addEventListener("click", () => this.startGame());
        this.machineBtn2.addEventListener("click", () => this.startGameKable());
        this.machineBtn3.addEventListener("click", () => this.startGameMaze());
        this.machineBtn4.addEventListener("click", () => this.startGameSkrzynie());
        this.machineBtn5.addEventListener("click", () => this.startGameRury());

        // Event listeners - GRA
        this.backBtn.addEventListener("click", () => this.returnToFactory());
        this.backBtn1.addEventListener("click", () => this.returnToFactory());
  
        this.backBtnKable.addEventListener("click", () => this.returnToFactory());
        this.backBtnKable1.addEventListener("click", () => this.returnToFactory());
        this.backBtnRury.addEventListener('click', () => this.returnToFactory()); // ← NOWY!
        this.backBtnRury1.addEventListener('click', () => this.returnToFactory()); // ← NOWY!

        this.skipButtonGame.addEventListener("click", () => this.skipGame());
        this.skipButtonGame1.addEventListener("click", () => this.skipGame());
        this.skipButtonGameKable.addEventListener("click", () => this.skipGameKable());
        this.skipButtonGameKable1.addEventListener("click", () => this.skipGameKable());

        // Event listeners - DZIENNIK
        this.journalBtn.addEventListener("click", () => this.showJournal());
        this.backFromJournalBtn.addEventListener("click", () => {
            this.closeJournal(); 
        });
        this.backFromJournalBtn1.addEventListener("click", () => {
            this.closeJournal(); 
        });
        this.prevPageBtn.addEventListener(  "click", () => {
            if (this.currentJournalPage > 0) {
                this.currentJournalPage--;
                this.showJournalPage();
            }
        });
        this.prevPageBtn1.addEventListener(  "click", () => {
            if (this.currentJournalPage > 0) {
                this.currentJournalPage--;
                this.showJournalPage();
            }
        });
        this.nextPageBtn.addEventListener("click", () => {
            if (this.currentJournalPage < this.unlockedJournalPages - 1) {
                this.currentJournalPage++;
                this.showJournalPage();
            }
        });
        this.nextPageBtn1.addEventListener("click", () => {
            if (this.currentJournalPage < this.unlockedJournalPages - 1) {
                this.currentJournalPage++;
                this.showJournalPage();
            }
        });

        // TYMCZASOWE
        

        

        // W bindUI() - dodaj to po event listener machineBtn2:
        

        this.SkrzynieGameResult = document.getElementById("skrzynie-speech-result");

        this.angBtn = document.getElementById("angBtn");
        this.angBtn.addEventListener('click', () => {
            document.querySelectorAll('.ang').forEach(el => {
                el.style.display = el.style.display === 'block' ? 'none' : 'block';
            });
            document.querySelectorAll('.pl').forEach(el => {
                el.style.display = el.style.display === 'none' ? 'block' : 'none';
            });
            document.querySelectorAll('.intro-story-title1-ang').forEach(el => {
                el.style.display = el.style.display === 'block' ? 'none' : 'block';
            });
            this.updateRuryButtonsLanguage();
            if(this.EngMode===false){
                 this.EngMode=true;
                 this.engMode();
            } 
            else{
                this.EngMode=false;
                this.engMode();
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
            if(!this.EngMode) this.showFeedback("Twoja przeglądarka nie wspiera rozpoznawania mowy.", "#ef4444");
            else this.showFeedback("Your browser does not support speech recognition.", "#ef4444");
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
            if(!this.EngMode) this.showFeedback("Słucham...", "#fbbf24");
            else this.showFeedback("Listening...", "#fbbf24");
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            if(!this.EngMode) this.showFeedback(`Usłyszałem: "${transcript}"`, "#e5e7eb");
            else this.showFeedback(`I heard: "${transcript}"`, "#e5e7eb");
            this.processTranscript(transcript);
        };

        this.recognition.onerror = (event) => {
            let errorMessage = '';
            
            switch(event.error) {
                case 'not-allowed':
                if(!this.EngMode) errorMessage = '🔒 Mikrofon zablokowany! Zmień uprawnienia w ustawieniach.';
                else errorMessage = '🔒 Microphone blocked! Change permissions in settings.';
                break;
                case 'no-speech':
                if(!this.EngMode) errorMessage = '🔊 Nie słyszę mowy. Powtórz szybciej!';
                else errorMessage = '🔊 I can’t hear any speech. Please repeat faster!';
                break;
                case 'network':
                if(!this.EngMode) errorMessage = '🌐 Problem z siecią.';
                else errorMessage = '🌐 Network issue.';
                break;
                default:
                if(!this.EngMode) errorMessage = `Błąd: ${event.error}`;
                else errorMessage = `Error: ${event.error}`;
            }
            
            this.showFeedback(errorMessage, "#ef4444");
            
            // Pokaż instrukcję dla użytkownika
            if (event.error === 'not-allowed') {
                setTimeout(() => {
                customAlert.warning(
                    '🔒 Dostęp do Mikrofonu Zablokowany',
                    `Aby grać, musisz zezwolić na dostęp do mikrofonu.\n\n` +
                    `1. Szukaj ikony 🔒 w pasku adresu\n` +
                    `2. Kliknij i wybierz "Zezwól"\n` +
                    `3. Odśwież stronę i spróbuj ponownie`,
                    [{ text: 'OK', class: 'confirm-yes' }]
                );
                }, 500);
            }
            
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
                this.checkDoorAnswer(transcript); break;
            case 'game': 
                this.checkGameAnswer(transcript); break;
            case 'kable': 
                this.checkKableAnswer(transcript); break;
            case 'skrzynie': 
                this.customSkrzynieProcessor(transcript); break;
            case 'maze': 
                if (this.processMazeCommand) this.processMazeCommand(transcript); break;
            case 'Rury':
                this.checkRuryAnswer(transcript); break;
            default: 
                if(!this.EngMode) this.showFeedback("Nieznany kontekst", "#ef4444");
                else this.showFeedback("Unknown context", "#ef4444");
        }
    }

    showFeedback(message, color) {
        let feedbackElement;
        switch(this.currentContext) {
            case 'door':
                 feedbackElement = this.doorSpeechResult; break;
            case 'game':
                feedbackElement = this.speechResult; break;
            case 'kable':
                feedbackElement = this.kableSpeechResult; break;
            case 'skrzynie':
                feedbackElement = this.SkrzynieGameResult; break;
            case 'maze':
                feedbackElement = document.getElementById("mazeSpeechResult"); break;
            case 'Rury':
                feedbackElement = document.getElementById("RurySpeechResult"); break;
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
        this.gameScreenMaze.classList.remove('active');
        this.gameScreenRury.classList.remove('active');
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
        
        // ← DODAJ TĘ LINIĘ: Zapamiętaj gdzie byłeś PRZED dziennika
        this.previousScreenBeforeJournal = this.previousScreen;
        
        // ← DODAJ TĘ LINIĘ: Ustaw dziennik jako aktualny ekran
        this.previousScreen = "journalScreen";
    }


    closeJournal() {
        this.journalScreen.classList.remove("active");
        
        // ← ZMIANA: Użyj zapamiętanego ekranu, nie this.previousScreen
        if (this.previousScreenBeforeJournal) {
            const previousScreenElement = document.getElementById(this.previousScreenBeforeJournal);
            
            if (previousScreenElement) {
                previousScreenElement.classList.add("active");
                
                // Przywróć mikrofon jeśli był aktywny
                if (this.previousScreenBeforeJournal === "doorScreen") {
                    this.enableMicrophone('door');
                } else if (this.previousScreenBeforeJournal === "gameScreen") {
                    this.enableMicrophone('game');
                    this.startGame();
                } else if (this.previousScreenBeforeJournal === "gameScreenKable") {
                    this.enableMicrophone('kable');
                    this.startGameKable();
                } else if (this.previousScreenBeforeJournal === "gameScreenSkrzynie") {
                    this.enableMicrophone('skrzynie');
                    this.startGameSkrzynie();
                } else if (this.previousScreenBeforeJournal === "gameScreenMaze") {
                    this.enableMicrophone('maze');
                    this.startGameMaze();
                } else if (this.previousScreenBeforeJournal === "gameScreenRury") {
                    this.enableMicrophone('Rury');
                    this.startGameRury();
                }
                
                // ← DODAJ TĘ LINIĘ: Przywróć previousScreen na oryginalny
                this.previousScreen = this.previousScreenBeforeJournal;
            }
        } else {
            this.showFactory();
        }
    }

    engMode() {
        if (this.previousScreen) {
            const previousScreenElement = document.getElementById(this.previousScreen);
            if (previousScreenElement) {
                previousScreenElement.classList.add("active");
                
                // Przywróć mikrofon jeśli był aktywny
                if (this.previousScreen === "doorScreen") {
                    this.enableMicrophone('door');
                } else if (this.previousScreen === "gameScreen") {
                    this.enableMicrophone('game');
                    this.startGame();
                } else if (this.previousScreen === "gameScreenKable") {
                    this.enableMicrophone('kable');
                    this.startGameKable();
                } else if (this.previousScreen === "gameScreenSkrzynie") {
                    this.enableMicrophone('skrzynie');
                    this.startGameSkrzynie();
                } else if (this.previousScreen === "gameScreenMaze") {
                    this.enableMicrophone('maze');
                    this.startGameMaze();
                }
            } else {
                this.showFactory();
            }
        }
    }
    // ===== PUNKTACJA ===== //
    async addPoints(points){
        this.score +=points;
        document.getElementById('score').textContent = `Punkty: ${this.score}`;
        document.getElementById('score1').textContent = `Points: ${this.score}`;
        this.checkPoints();
    }
    async checkPoints(){

    if(this.score >= 1000 && this.badge1.style.display === "none"){
        if(this.EngMode === false) {
            customAlert.info('BRAWO! Odblokowałeś pierwszą odznakę za punkty w dzienniku!');
        } else {
            customAlert.info('CONGRATULATIONS! You have unlocked the first badge for points in the journal!');
        }
        this.badge1.style.display = "block";
    }

    if(this.score >= 1500 && this.badge2.style.display === "none"){
        if(this.EngMode === false) {
            customAlert.info('BRAWO! Odblokowałeś drugą odznakę za punkty w dzienniku!');
        } else {
            customAlert.info('CONGRATULATIONS! You have unlocked the second badge for points in the journal!');
        }
        this.badge2.style.display = "block";
    }

    if(this.score >= 2000 && this.badge3.style.display === "none"){
        if(this.EngMode === false) {
            customAlert.info('BRAWO! Odblokowałeś trzecią odznakę za punkty w dzienniku!');
        } else {
            customAlert.info('CONGRATULATIONS! You have unlocked the third badge for points in the journal!');
        }
        this.badge3.style.display = "block";
    }

    if(this.score >= 2500 && this.badge4.style.display === "none"){
        if(this.EngMode === false) {
            customAlert.info('BRAWO! Odblokowałeś czwartą odznakę za punkty w dzienniku!');
        } else {
            customAlert.info('CONGRATULATIONS! You have unlocked the fourth badge for points in the journal!');
        }
        this.badge4.style.display = "block";
    }
}


    // ===== LOGIKA DRZWI ===== //

    checkDoorAnswer(transcript) {
        if (transcript.includes("otwórz drzwi") || transcript.includes("otworz drzwi")) {
            if(this.EngMode === false) this.showFeedback("✅ Świetnie! Drzwi się otwierają...", "#10b981");
            else this.showFeedback("✅ Great! The door is opening...", "#10b981");
            this.disableMicrophone();
            
            setTimeout(() => {
                this.showFactory();
            }, 2000);
            setTimeout(() => {
                if(this.EngMode===false){
                    DialogSystem.showSequence([
                        { speakerId: 'info', text: 'Wchodzicie do ciemnej, brzęczącej hali. Wszystkie przewody są rozłączone, a ciemność spowija całą fabrykę.' },
                        { speakerId: 'właściciel', text: 'Sabotażysta odciął zasilanie całej fabryki. Żeby przywrócić działanie systemów, musisz połączyć przewody odpowiadające za kolory głosów.' },
                    ]);
                } else{
                    DialogSystem.showSequence([
                        { speakerId: 'info', text: 'You enter a dark, buzzing hall. All the wires are disconnected, and darkness envelops the entire factory.' },
                        { speakerId: 'owner', text: 'The saboteur has cut off the power to the entire factory. To restore the systems, you must reconnect the wires corresponding to the voice colors.' },
                    ]);
                }
            }, 2050);
        } else {
            if(this.EngMode === false) this.showFeedback('❌ Spróbuj ponownie! Powiedz: "Otwórz drzwi"', "#ef4444");
            else this.showFeedback('❌ Try again! Say: "Open the door"', "#ef4444");
        }
    }

    // ===== LOGIKA GRY MASZYNA STERUJĄCA ===== //
    startGame() {
        this.hideAllScreens();
        this.enableMicrophone('game');
        this.gameScreen.classList.add("active");
        this.journalBtn.style.display = "block";
        this.loadLevel();
        this.gameerrorsound=0;
        this.checkSkipLevel();
        

        if(this.EngMode===false){
            DialogSystem.showSequence([
                { speakerId: 'info', text: 'Drzwi otwierają się z jękiem. W środku wszystko jest pomieszane — kartki z instrukcjami leżą na podłodze, a ekrany wyświetlają losowe zbitki liter.  ' },
                { speakerId: 'właściciel', text: 'W tym pomieszczeniu sabotażysta poplątał wszystkie instrukcje tak aby fabryka słów produkowała wadliwe słowa, musisz wypowiedzieć je poprawnie, aby przywrócić maszynę do normy. Poradzisz sobie?”' },
            ]);
        } else {
            //english
           DialogSystem.showSequence([
                { speakerId: 'info', text: 'The door creaks open. Inside, everything is a mess — instruction sheets are scattered on the floor, and the screens display random jumbles of letters.' },
                { speakerId: 'owner', text: 'In this room, the saboteur has tangled all the instructions so that the word factory produces faulty words. You must pronounce them correctly to restore the machine to normal. Can you do it?”' },
            ]);
        }
        
        // WŁĄCZ MIKROFON dla gry\
        
        this.previousScreen = "gameScreen";
    }

    skipGame(){
        if(this.gameerrorsound>=3){
            this.completedWords = [];
            this.currentLevel++;
            this.loadLevel();
            this.addPoints(-100);
            this.gameerrorsound=0;
            this.checkSkipLevel();
            if(this.EngMode === false) this.showFeedback("Poziom został pominięty za cene 100pkt", "#f59e0b");
            else this.showFeedback("Level skipped but cost 100 points", "#f59e0b");
        }
    }
    checkSkipLevel(){
        if(this.gameerrorsound===0){
            if(this.gameScreen.classList.contains("active")){
                this.skipButtonGame.textContent="Pomiń (0/3)";
                this.skipButtonGame1.textContent="  Skip (0/3)";
            }
            else if(this.gameScreenKable.classList.contains("active")){
                this.skipButtonGameKable.textContent="Pomiń (0/3)";
                this.skipButtonGameKable1.textContent="  Skip (0/3)";
            }

        }else if(this.gameerrorsound===1){
            if(this.gameScreen.classList.contains("active")){
                this.skipButtonGame.textContent="Pomiń (1/3)";
                this.skipButtonGame1.textContent="  Skip (1/3)";
            }
            if(this.gameScreenKable.classList.contains("active")){
                this.skipButtonGameKable.textContent="Pomiń (1/3)";
                this.skipButtonGameKable1.textContent="  Skip (1/3)";
            }
        } else if(this.gameerrorsound===2){
            if(this.gameScreen.classList.contains("active")){
                this.skipButtonGame.textContent="Pomiń (2/3)";
                this.skipButtonGame1.textContent="Skip (2/3)";
            }
            if(this.gameScreenKable.classList.contains("active")){
                this.skipButtonGameKable.textContent="Pomiń (2/3)";
                this.skipButtonGameKable1.textContent="Skip (2/3)";
            }
        } else if(this.gameerrorsound===3){
            if(this.gameScreen.classList.contains("active")){
                this.skipButtonGame.textContent="Pomiń (3/3)";
                this.skipButtonGame1.textContent="Skip (3/3)";
            }
            else if(this.gameScreenKable.classList.contains("active")){
                this.skipButtonGameKable.textContent="Pomiń (3/3)";
                this.skipButtonGameKable1.textContent="Skip (3/3)";
            }
            
        }
    }

    loadLevel() {
        if (this.currentLevel >= this.levels.length) {
            this.endGame();
            return;
        }
            const level = this.levels[this.currentLevel];

        
        if(this.EngMode===false){
                if( level.id === 5){
                this.levelTitle.textContent = level.name;
                if( this.hint2Unlocked===true) this.levelHint.textContent = level.hint;
                else this.levelHint.textContent = "Brak informacji";
                this.speechResult.textContent = "";
                customAlert.info('Znalazłeś wskazówkę do następnych kroków. Znajdziesz ją w dzienniku na stronie 3');
                
                this.sterujacaHint=true;
            } else{
                const level = this.levels[this.currentLevel];
                this.levelTitle.textContent = level.name;
                this.levelHint.textContent = level.hint;
                this.speechResult.textContent = "";
                
            }
        }
        else{
            if( level.id === 5){
                this.levelTitle.textContent = level.nameEng;
                if( this.hint2Unlocked===true) this.levelHint.textContent = level.hint;
                else this.levelHint.textContent = "No information";
                this.speechResult.textContent = "";
                customAlert.info('You found a hint for the next steps. You can find it in the journal on page 3');
                this.sterujacaHint=true;
            } else{
                const level = this.levels[this.currentLevel];
                this.levelTitle.textContent = level.nameEng;
                this.levelHint.textContent = level.hintEng;
                this.speechResult.textContent = "";
            
            }
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
            if(this.EngMode === false) this.showFeedback("✅ Świetnie!", "#10b981");
            else this.showFeedback("✅ Great!", "#10b981");
            this.gameerrorsound=0;
            this.checkSkipLevel();
            setTimeout(() => {
                this.showFeedback("", "#e5e7eb");
            }, 1500);
            if (this.completedWords.length === level.vocabulary.length) {
                if(this.EngMode === false) this.showFeedback("✅ Świetnie! Przechodzisz dalej!", "#10b981");
                else this.showFeedback("✅ Great! You advance!", "#10b981");
                setTimeout(() => {
                    this.completedWords = [];
                    this.currentLevel++;
                    this.gameerrorsound=0;
                    this.checkSkipLevel();
                    this.loadLevel();
                }, 1500);
            }
        } else if (this.completedWords.includes(transcript)){
            if(this.EngMode === false) this.showFeedback("❌ Spróbuj ponownie! Komenda już została wypowiedziana.", "#ef4444");
            else this.showFeedback("❌ Try again! The command has already been spoken.", "#ef4444");
        } else {
            if(this.EngMode === false) this.showFeedback("❌ Spróbuj ponownie! Błędna wymowa. Powiedziałeś "+transcript, "#ef4444");
            else this.showFeedback("❌ Try again! Incorrect pronunciation. You said "+transcript, "#ef4444");
            this.gameerrorsound++;
            this.checkSkipLevel();
        }
    }

    endGame() {
        if(this.EngMode === false) customAlert.success(`🎉 Gratulacje! Maszyna jest w pełni sprawna. Sprawdź jakie maszyny należy naprawić jako następne. Otrzymałeś także odznakę!`, "Maszyna sprawna");
        else customAlert.success1(`🎉 Congratulations! The machine is fully operational. Check which machines need to be repaired next. You also received a badge!`, "Machine Operational");
        this.levelTitle.textContent = "Koniec gry";
        this.levelHint.textContent = "Świetna robota, detektywie!";
        this.machineBtn1.style.display="none";
        this.machine1Nap.style.display="block";
        this.machineBtn4.style.display="block";
        this.badge6.style.display="block";
        this.sterujacaEnd=true;
        this.disableMicrophone();
        if(this.EngMode===false){
            DialogSystem.showSequence([
                { speakerId: null, text: 'To nic nie zmieni, slowa i tak ssssie pomylą' },
                { speakerId: 'info', text: 'Szłyszysz jak głos dochodzi z maszyny nr 3' },
                { speakerId: 'właściciel', text: 'Maszyna nr 3! Pędzimy!' },
            ]);
        } else {
            //english
            DialogSystem.showSequence([
                { speakerId: null, text: '"It won\'t make any difference, the words will get jumbled anyway' },
                { speakerId: 'info', text: 'You hear a voice coming from machine 3' },
                { speakerId: 'owner', text: 'Machine 3! Let\'s go!' },
            ]);
        }
    }
    // ===== LOGIKA GRY KABLE ===== //
    startGameKable() {
        this.hideAllScreens();
        this.gameScreenKable.classList.add("active");
        this.journalBtn.style.display = "block";
        this.enableMicrophone('kable');
        this.gameerrorsound=0;
        this.checkSkipLevel();
        this.previousScreen = "gameScreenKable";
        
    }
    skipGameKable(){
        
        if(this.gameerrorsound>=3){
            this.addPoints(-100);
            this.gameerrorsound=0;
            this.checkSkipLevel();
            if(this.EngMode === false) this.showFeedback("Poziom został pominięty za cene 100pkt", "#10b981");
            else this.showFeedback("Level skipped but cost 100 points", "#10b981");
        
            if (this.KabCzerwony.style.display === "none") {
                this.KabCzerwony.style.display = "block";
                this.completedKable++;
            }else if (this.KabBrazowy.style.display === "none") {
                this.KabBrazowy.style.display = "block";
                this.completedKable++;
            }else if (this.KabPomaranczowy.style.display === "none") {
                this.KabPomaranczowy.style.display = "block";
                this.completedKable++;
            }else if (this.KabZolty.style.display === "none") {
                this.KabZolty.style.display = "block";
                this.completedKable++;
            }else if (this.KabGranatowy.style.display === "none") {
                this.KabGranatowy.style.display = "block";
                this.completedKable++;
            }else if (this.KabSzary.style.display === "none") {
                this.KabSzary.style.display = "block";
                this.completedKable++;
            }
            if(this.completedKable===6){
                this.endKableGame();
            }
        }
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
            if(this.EngMode === false) this.showFeedback("❌ Spróbuj ponownie!", "#ef4444");
            else this.showFeedback("❌ Try again!", "#ef4444");
            this.gameerrorsound++;
            this.checkSkipLevel();
        }
    }
    kableAnswear() { 
        this.completedKable++;
        this.addPoints(100);
        if(this.EngMode === false) this.showFeedback("✅ Świetnie!", "#10b981");
        else this.showFeedback("✅ Great!", "#10b981");
        this.gameerrorsound=0;
        this.checkSkipLevel();
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
        if(this.EngMode===false) customAlert.success(`🎉 Gratulacje! Maszyna jest w pełni sprawna. Sprawdź jakie maszyny należy naprawić jako następne. Otrzymałeś także odznakę!`, "Kable naprawione");
        else customAlert.success1(`🎉 Congratulations! The machine is fully operational. Check which machines need to be repaired next. You also received a badge!`, "Cables Repaired");    
        this.machineBtn2.style.display="none";
        this.KableNap.style.display="block";
        this.machineBtn1.style.display="block";
        this.badge5.style.display="block";
        this.disableMicrophone();
        if(this.EngMode===false){
            DialogSystem.showSequence([
                { speakerId: 'Detektyw', text: 'Świetna robota! Połączenie wszystkich kabli przywróciło zasilanie w fabryce.' },
                { speakerId: 'info', text: 'Z głębi rur w pobliżu słyszysz syczący głos' },
                { speakerId: null, text: 'Nigdy mnie nie złapiesz…' },
                { speakerId: 'właściciel', text: 'Maszyna sterująca... On tam był!. Musimy ruszać dalej zanim będzie za późno!' },
            ]);
        } else {
            //english
            DialogSystem.showSequence([
                { speakerId: 'Detective', text: 'Great job! Connecting all the cables restored power to the factory.' },
                { speakerId: 'info', text: 'From deep within the pipes, you hear a hissing voice' },
                { speakerId: null, text: 'You\'ll never catch me…' },
                { speakerId: 'owner', text: 'The control machine... He was there!. We must move on before it\'s too late!' },
            ]);
        }
    }
    // ===== LOGIKA GRY SKRZYNIE =====

    startGameSkrzynie() {
        this.hideAllScreens();
        this.gameScreenSkrzynie.classList.add("active");
        this.journalBtn.style.display = "block";
        if(this.EngMode===false){
            DialogSystem.showSequence([
                { speakerId: 'info', text: 'Taśma pędzi w nieskoordynowany sposób. Słowa wymieszane są z sylabami i głoskami w całkowitym chaosie.' },
                { speakerId: 'właściciel', text: 'Sabotażysta przeprogramował taśmę produkcyjną tak by źle sortowała słowa, Musisz nam pomóc posegregować je z powrotem. Jeśli się nie pospieszymy cale miasto zacznie seplenić, szybko bierzmy się do roboty' },
                { speakerId: 'właściciel', text: 'Wygląda na to jednak, że wszystkie skrzynie są zablokowane. Może dzienniku znajdziemy jakieś wskazówki?' },
                { speakerId: 'info', text: 'Sprawdź dziennik czy nie odblokowałeś nowej mini gry' },
            ]);
        } else {
            //english
            DialogSystem.showSequence([
                { speakerId: 'info', text: 'The tape is racing in an uncoordinated manner. Words are mixed with syllables and sounds in total chaos.' },
                { speakerId: 'owner', text: 'The saboteur reprogrammed the production line to sort words incorrectly. You need to help us sort them back. If we don\'t hurry, the whole city will start to slur its words, let\'s get to work quickly' },
                { speakerId: 'owner', text: 'It seems that all the crates are locked. Maybe we can find some clues in the journal?' },
                { speakerId: 'info', text: 'Check the journal to see if you unlocked a new mini-game' },
            ]);
        }

        // WŁĄCZ MIKROFON dla gry skrzyni
        this.enableMicrophone('skrzynie');
        
        // Zainicjalizuj poziom
        if(this.skrzynieWlaczone===false){
            if(this.hint3Unlocked===true){
                initPoziomSkrzynie(this);
                this.skrzynieWlaczone=true;
            }
            else initPoziomSkrzynie(this);
        }
        
        this.previousScreen = "gameScreenSkrzynie";
    }
    

    // ===== LOGIKA GRY LABIRYNT ===== //
    startGameMaze() {
        this.hideAllScreens();
        this.gameScreenMaze.classList.add('active');
        this.journalBtn.style.display = 'block';
        this.enableMicrophone('maze');
        if (!this.EngMode) {
            window.isEnglishMode = true;
        } else {
            window.isEnglishMode = false;
        }
        if(this.EngMode===false){
            DialogSystem.showSequence([
                { speakerId: 'właściciel', text: 'O nie… nie wiemy, gdzie uciekł sabotażysta. Co teraz?' },
                { speakerId: null, text: 'Halo?? Halo? Jest tu ktoś?! Nie umiem wyjść!' },
                { speakerId: 'info', text: 'Głos dobiega zza wielkiego pudła. Podchodzicie — w środku siedzi malutki robot, zdezorientowany i uwięziony w labiryncie z kartonowych ścianek. ' },
                { speakerId: 'robot', text: 'Sabotażysta mnie tu włożył! Pomóżcie mi wyjść!' },
                { speakerId: 'info', text: 'Żeby mu pomóc musisz wypowiedzieć odpowiednie instrukcje i wyprowadzić go z labiryntu ' },

        ]);
        } else {
            //english
            DialogSystem.showSequence([
                { speakerId: 'owner', text: 'Oh no... we don\'t know where the saboteur went. What now?' },
                { speakerId: null, text: 'Hello?? Is anyone there?! I can\'t get out!' },
                { speakerId: 'info', text: 'The voice comes from behind a large box. You approach — inside sits a small robot, confused and trapped in a maze of cardboard walls.' },
                { speakerId: 'robot', text: 'The saboteur put me here! Help me get out!' },
                { speakerId: 'info', text: 'To help him, you need to say the right instructions and lead him out of the maze.' },
            ]);
        }

        initMazeGame(this);
        this.previousScreen = "gameScreenMaze";
    }

    endMazeGame() {
        if(this.EngMode===false) customAlert.success(`🎉 Gratulacje! Wydostałeś się z labiryntu!`, "Labirynt ukończony");
        else customAlert.success1(`🎉 Congratulations! You have escaped the maze!`, "Maze Completed");        document.getElementById('machineBtn3').style.display = 'none';
        document.getElementById('robot-nap').style.display = 'block';
        document.getElementById('badge8').style.display = 'block';
        this.machineBtn5.style.display='block';
        this.disableMicrophone();
        if(this.EngMode===false){
            DialogSystem.showSequence([
                { speakerId: 'robot', text: 'Dziękuję! Gdyby nie ty nigdy bym stąd nie wyszedł' },
                { speakerId: 'właściciel', text: 'Wiesz kto Cię tak urządził? I gdzie poszedł?' },
                { speakerId: 'robot', text:  'Nie widziałem go był zamaskowany, ale, ale poszedł tam w kierunku rurociągu' },
            ]);
        } else {
            //english
            DialogSystem.showSequence([
                { speakerId: 'robot', text: 'Thank you! If it weren\'t for you, I would never have gotten out of here' },
                { speakerId: 'owner', text: 'Do you know who did this to you? And where did he go?' },
                { speakerId: 'robot', text:  'I didn\'t see him, he was masked, but, but he went that way towards the pipeline' },
            ]);
        }
    }

// ===== LOGIKA GRY RURY ===== //

// BAZA OWOCÓW - BEZ POWTÓRZEŃ MIĘDZY LEWYMI A PRAWYMI
RURY_FRUITS_DATABASE = {
  left: [
    'jabłko', 'gruszka', 'śliwka', 'brzoskwinia', 'nektaryna',
    'truskawka', 'malina', 'jeżyna', 'porzeczka', 'agrest',
    'borówka', 'żurawina', 'pigwa', 'nispero', 'owoce leśne',
    'morwa', 'winia', 'cały arbuz', 'wielkie mango', 'słodki banan',
    'świeża brzoskwinia', 'dojrzały kiwi', 'soczyste gruszki', 'czerwone truskawki', 'czarne jeżyny'
  ],
  right: [
    'banan', 'ananas', 'wiśnia', 'czereśnia', 'morela',
    'melon', 'arbuz', 'grejpfrut', 'jagoda', 'aronia',
    'dzika róża', 'acerola', 'liczi', 'pitaja',
    'rambutan', 'durian', 'karambola', 'cherimoya',
    'granatowiec', 'kumkwat', 'żurawina amerykańska', 'owoce aronii', 'świeży ananas'
  ]
};

startGameRury() {
  this.hideAllScreens();
  this.gameScreenRury.classList.add('active');
  this.journalBtn.style.display = 'block';
  this.enableMicrophone('Rury');
  this.previousScreen = 'gameScreenRury';
  if(this.hint4Unlocked===true && this.ruryEnd===true)this.endRuryGame();
  // Inicjalizuj stan rur
  if (!this.ruryStart) this.initRuryGame();
  this.ruryStart = true;
}
displayRuryInitialRotations() {
  for (let i = 1; i <= 4; i++) {
    const ruraId = `rura${i}`;
    const ruraElement = document.getElementById(ruraId);
    if (ruraElement) {
      const ruraImageItem = ruraElement.querySelector('.rura-image-item');
      if (ruraImageItem) {
        ruraImageItem.style.transform = `rotate(${this.ruryState[ruraId]}deg)`;
      }
    }
  }
}


initRuryGame() {
    this.RURY_ROTATION_ANGLE = 45;
    this.ruryState = { rura1: 90, rura2: 180, rura3: 225, rura4: 225 };
    
    // 🆕 NOWE ZMIENNE DLA SYSTEMU BŁĘDÓW I PRZYCISKÓW
    this.ruryErrorCount = 0;           // Licznik błędów dla bieżącej rury
    this.ruryMaxErrors = 3;            // Limit błędów
    this.skipButtonRury = null;        // Przycisk pominięcia
    
    this.displayRuryInitialRotations();
    this.generateRuryWords();
    document.getElementById('RurySpeechResult').textContent = '';
    this.showFeedback('🍎 Wymów nazwy owoców aby obracać rury!', '#3b82f6');
}


generateRuryWords() {
  // KLUCZOWE: Tworzymy nowe pule słów dla każdej rury
  // Każda rura dostanie UNIKALNE słowo z bazy
  
  const leftWordsPool = [...this.RURY_FRUITS_DATABASE.left];  // Kopia lewych owoców
  const rightWordsPool = [...this.RURY_FRUITS_DATABASE.right]; // Kopia prawych owoców
  
  this.ruryWords = {};
  
  // Dla każdej rury losuj RÓŻNE słowa
  for (let i = 1; i <= 4; i++) {
    const ruraId = `rura${i}`;
    
    // Losuj owoc dla lewej strony (i usuń go z puli aby się nie powtórzył)
    const leftIndex = Math.floor(Math.random() * leftWordsPool.length);
    const leftFruit = leftWordsPool[leftIndex];
    leftWordsPool.splice(leftIndex, 1); // ← USUŃ aby się nie powtórzył
    
    // Losuj owoc dla prawej strony (i usuń go z puli aby się nie powtórzył)
    const rightIndex = Math.floor(Math.random() * rightWordsPool.length);
    const rightFruit = rightWordsPool[rightIndex];
    rightWordsPool.splice(rightIndex, 1); // ← USUŃ aby się nie powtórzył
    
    // Przydziel owoce do tej rury
    this.ruryWords[ruraId] = {
      left: leftFruit,
      right: rightFruit
    };
  }
  
  // Pokaż słowa dla każdej rury
  this.displayRuryWords();
  
  // Debug log
  console.log('🍎 Wylosowane owoce dla rur (BEZ POWTÓRZEŃ):', this.ruryWords);
}

displayRuryWords() {
  for (let i = 1; i <= 4; i++) {
    const ruraId = `rura${i}`;
    const ruraElement = document.getElementById(ruraId);
    
    if (ruraElement) {
      // Usuń stare słowa jeśli istnieją
      const oldWordsContainer = ruraElement.querySelector('.rura-words-container');
      if (oldWordsContainer) oldWordsContainer.remove();
      
      // Dodaj nowe słowa
      const wordsDiv = document.createElement('div');
      wordsDiv.className = 'rura-words-container';
      
      const leftDiv = document.createElement('div');
      leftDiv.className = 'rura-words-left';
      leftDiv.textContent = `${this.ruryWords[ruraId].left}`;
      
      const rightDiv = document.createElement('div');
      rightDiv.className = 'rura-words-right';
      rightDiv.textContent = `${this.ruryWords[ruraId].right}`;
      
      wordsDiv.appendChild(leftDiv);
      wordsDiv.appendChild(rightDiv);
      ruraElement.appendChild(wordsDiv);
    }
  }
}
// ===== 🆕 NOWA METODA - Pokazanie przycisku pominięcia =====
showSkipButtonRury() {
    if (this.skipButtonRury) return;
    
    this.skipButtonRury = document.createElement('button');
    
    // 🆕 JĘZYK-ZALEŻNY TEKST
    if (this.EngMode) {
        this.skipButtonRury.textContent = '⏳ Skip Fruit (-50 pts)';
    } else {
        this.skipButtonRury.textContent = '⏳ Pomiń owoc (-50 pkt)';
    }
    
    this.skipButtonRury.className = 'btn btn-secondary';
    this.skipButtonRury.style.fontSize = '14px';
    this.skipButtonRury.style.padding = '10px 20px';
    
    this.skipButtonRury.addEventListener('click', () => {
        this.skipRuryFruit();
    });
    
    const backButton = document.getElementById('backBtnRury');
    if (backButton && backButton.parentElement) {
        backButton.style.marginRight = '10px';
        backButton.parentElement.appendChild(this.skipButtonRury);
    }
}



// ===== 🆕 NOWA METODA - Obsługa kliknięcia przycisku pominięcia =====
skipRuryFruit() {
    this.showFeedback(
        '⏳ Owoc pominięty. Brak obrotu rury!',
        '#f97316'
    );
    
    // ← NOWE: KARA PUNKTOWA
    this.addPoints(-50);
    
    // ← NOWE: FEEDBACK O KARZE
    this.showFeedback(
        '❌ Kara: -50 punktów za użycie przycisku!',
        '#ef4444'
    );
    
    // Reszta bez zmian
    this.ruryErrorCount = 0;
    
    if (this.skipButtonRury) {
        this.skipButtonRury.remove();
        this.skipButtonRury = null;
    }
    
    this.generateRuryWords();
    this.displayRuryWords();
    
    this.showFeedback('🔄 Nowe owoce! Spróbuj ponownie.', '#3b82f6');
}


// ===== CAŁKOWICIE ZMIENIONA checkRuryAnswer() =====
checkRuryAnswer(transcript) {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    let rotated = false;
    let matchedRura = null;
    
    // 🔄 Sprawdzaj każdą rurę, ale obróć TYLKO JEDNĄ
    for (let i = 1; i <= 4; i++) {
        const ruraId = `rura${i}`;
        const words = this.ruryWords[ruraId];
        
        // Jeśli znalazłeś już dopasowanie, nie szukaj więcej
        if (matchedRura) break;
        
        // ✅ Sprawdzenie LEWEGO słowa
        if (lowerTranscript.includes(words.left.toLowerCase())) {
            this.rotateRura(ruraId, -1);
            this.showFeedback(`✅ ${words.left} - Rura ${i} w lewo!`, '#10b981');
            
            rotated = true;
            matchedRura = i;
            
            // 🆕 RESET licznika błędów na poprawne słowo
            this.ruryErrorCount = 0;
            
            // ✅ Usuń przycisk jeśli istnieje
            if (this.skipButtonRury) {
                this.skipButtonRury.remove();
                this.skipButtonRury = null;
            }
            
            // 🔄 Zmień słowa na NOWE
            this.changeFruitForRura(ruraId);
            this.displayRuryWords();
            
            break;
        }
        
        // ✅ Sprawdzenie PRAWEGO słowa
        else if (lowerTranscript.includes(words.right.toLowerCase())) {
            this.rotateRura(ruraId, 1);
            this.showFeedback(`✅ ${words.right} - Rura ${i} w prawo!`, '#10b981');
            
            rotated = true;
            matchedRura = i;
            
            // 🆕 RESET licznika błędów na poprawne słowo
            this.ruryErrorCount = 0;
            
            // ✅ Usuń przycisk jeśli istnieje
            if (this.skipButtonRury) {
                this.skipButtonRury.remove();
                this.skipButtonRury = null;
            }
            
            // 🔄 Zmień słowa na NOWE
            this.changeFruitForRura(ruraId);
            this.displayRuryWords();
            
            break;
        }
    }
    
    // ❌ NIE ZNALEZIONO DOPASOWANIA
    if (!rotated) {
        // 🆕 ZWIĘKSZ licznik błędów
        this.ruryErrorCount++;
        
        this.showFeedback(
            `❌ Nie rozpoznano owocu. Spróbuj ponownie! (${this.ruryErrorCount}/${this.ruryMaxErrors})`,
            '#ef4444'
        );
        
        // 🆕 SPRAWDZENIE LIMITU BŁĘDÓW
        if (this.ruryErrorCount >= this.ruryMaxErrors) {
            this.showSkipButtonRury();  // ← POKAŻ PRZYCISK
            
            this.showFeedback(
                '⚠️ Osiągnąłeś 3 błędy! Pojawił się przycisk pominięcia.',
                '#f97316'
            );
        }
        
        this.recordFailedAttempt('rury');
    }
    
    // Sprawdzenie czy wszystkie rury są poprawnie ustawione
    setTimeout(() => this.checkRuryComplete(), 600);
}


// 🆕 NOWA METODA - ZMIENIA SŁOWA DLA WYBRANEJ RURY
changeFruitForRura(ruraId) {
  // Pobierz wszystkie INNE rury (które już mają słowa)
  const usedLeftFruits = new Set();
  const usedRightFruits = new Set();
  
  for (let i = 1; i <= 4; i++) {
    const otherRuraId = `rura${i}`;
    if (otherRuraId !== ruraId) {
      usedLeftFruits.add(this.ruryWords[otherRuraId].left);
      usedRightFruits.add(this.ruryWords[otherRuraId].right);
    }
  }
  
  // Stwórz pule dostępnych owoców (wyłącz już używane)
  let availableLeftFruits = this.RURY_FRUITS_DATABASE.left.filter(
    fruit => !usedLeftFruits.has(fruit)
  );
  let availableRightFruits = this.RURY_FRUITS_DATABASE.right.filter(
    fruit => !usedRightFruits.has(fruit)
  );
  
  // Jeśli brakuje dostępnych owoców (co jest rzadkie), resetuj
  if (availableLeftFruits.length === 0) {
    availableLeftFruits = this.RURY_FRUITS_DATABASE.left;
  }
  if (availableRightFruits.length === 0) {
    availableRightFruits = this.RURY_FRUITS_DATABASE.right;
  }
  
  // Losuj NOWE owoce dla tej rury
  const newLeftFruit = availableLeftFruits[
    Math.floor(Math.random() * availableLeftFruits.length)
  ];
  const newRightFruit = availableRightFruits[
    Math.floor(Math.random() * availableRightFruits.length)
  ];
  
  // Przydziel NOWE owoce
  this.ruryWords[ruraId] = {
    left: newLeftFruit,
    right: newRightFruit
  };
  
  // 🔄 ZAKTUALIZUJ WYŚWIETLANE SŁOWA NA EKRANIE
  this.updateRuraWordsDisplay(ruraId);
  
  console.log(`🔄 Rura ${ruraId.replace('rura', '')} - NOWE SŁOWA:`, this.ruryWords[ruraId]);
}

// 🆕 METODA - AKTUALIZUJE JĘZYK PRZYCISKÓW
updateRuryButtonsLanguage() {
    
    
    if (this.skipButtonRury) {
        if (this.EngMode) {
            this.skipButtonRury.textContent = '⏳ Zmień słowa(-50 pkt)';
        } else {
            this.skipButtonRury.textContent = '⏳ Change words (-50 pts)';
        }
    }
}

// 🆕 METODA - AKTUALIZUJE WYŚWIETLANE SŁOWA NA EKRANIE
    updateRuraWordsDisplay(ruraId) {
        const ruraElement = document.getElementById(ruraId);
        
        if (ruraElement) {
            // Usuń stare słowa
            const oldWordsContainer = ruraElement.querySelector('.rura-words-container');
            if (oldWordsContainer) oldWordsContainer.remove();
            
            // Dodaj NOWE słowa
            const wordsDiv = document.createElement('div');
            wordsDiv.className = 'rura-words-container';
            
            const leftDiv = document.createElement('div');
            leftDiv.className = 'rura-words-left';
            leftDiv.textContent = `⬅️ ${this.ruryWords[ruraId].left}`;
            
            const rightDiv = document.createElement('div');
            rightDiv.className = 'rura-words-right';
            rightDiv.textContent = `${this.ruryWords[ruraId].right} ➡️`;
            
            wordsDiv.appendChild(leftDiv);
            wordsDiv.appendChild(rightDiv);
            ruraElement.appendChild(wordsDiv);
        }
    }


// ✅ NOWA WERSJA
    rotateRura(ruraId, direction) {
    this.ruryState[ruraId] += direction * this.RURY_ROTATION_ANGLE;
    const ruraElement = document.getElementById(ruraId);
    const ruraImageItem = ruraElement.querySelector('.rura-image-item');
    if (ruraImageItem) {
        ruraImageItem.style.transform = `rotate(${this.ruryState[ruraId]}deg)`;
    }
    }


    checkRuryComplete() {
        // Sprawdź czy WSZYSTKIE rury mają obrót = 0 (wielokrotność 360)
        let allCorrect = true;
        
        for (let i = 1; i <= 4; i++) {
            const ruraId = `rura${i}`;
            // Normalizuj obrót do zakresu 0-360
            const normalizedRotation = ((this.ruryState[ruraId] % 360) + 360) % 360;
            
            // Jeśli obrót to nie 0, rura nie jest prawidłowo ustawiona
            if (normalizedRotation !== 0) {
            allCorrect = false;
            break;
            }
        }
        
        if (allCorrect) {
            this.endRuryGame();
        }
    }

    endRuryGame() {
        if(this.hint4Unlocked===true){
            if(this.EngMode===false) customAlert.success(`🎉 Gratulacje! Wszystkie rury są prawidłowo ułożone!`, 'Rury naprawione');
            else customAlert.success1(`🎉 Congratulations! All pipes are correctly arranged!`, 'Pipes Repaired');
            
            document.getElementById('machineBtn5').style.display = 'none';
            document.getElementById('2-nap').style.display = 'block';
            if (document.getElementById('badge9')) {
                document.getElementById('badge9').style.display = 'block';
            }
            
            this.addPoints(200);
            this.disableMicrophone();
            if(this.EngMode===false){
                DialogSystem.showSequence([
                { speakerId: 'info', text: 'Rurami systemu zasilania zostały prawidłowo ułożone.' },
                { speakerId: 'właściciel', text: 'Doskonale! Jesteśmy coraz bliżej przywrócenia systemu do pracy!' },
                ]);
            } else {
                //english
            DialogSystem.showSequence([
                { speakerId: 'info', text: 'The power system pipes have been correctly arranged.' },
                { speakerId: 'właściciel', text: 'Excellent! We are getting closer to restoring the system to operation!' },
            ]);
            }
        } else {
            this.ruryEnd=true;
            if(this.EngMode===false) customAlert.success(`🎉 Gratulacje! Wszystkie rury są prawidłowo ułożone! Jednak nie ma nadal przepływu. W dzienniku znajdziesz kolejną minigrę która naprawi pompę.`, 'Rury ustawione');
            else customAlert.success1(`🎉 Congratulations! All pipes are correctly arranged! However, there is still no flow. In the journal, you will find another mini-game that will fix the pump.`, 'Pipes Repaired');

        }
    }


// ===== DZIENNIK ===== //
        showJournalPage() {

            // 1. AKTUALIZUJ DOSTĘPNE STRONY na podstawie odblokowań
            let unlockedPages = 2; // Zawsze min 2 (strony 0 i 1)
            
            if (this.sterujacaHint === true) {
                unlockedPages = Math.max(unlockedPages, 3); // Strona 2 dostępna
            }
            if (this.sterujacaEnd === true) {
                unlockedPages = Math.max(unlockedPages, 4); // Strona 3 dostępna
            }
            if (this.ruryEnd === true) {
                unlockedPages = Math.max(unlockedPages, 5); // Strona 4 dostępna
            }
            
            this.unlockedJournalPages = unlockedPages;

            // 2. ZABEZPIECZ - Jeśli jesteś na niedostępnej stronie, wróć do ostatniej dostępnej
            if (this.currentJournalPage >= this.unlockedJournalPages) {
                this.currentJournalPage = this.unlockedJournalPages - 1;
            }

            // 3. Ukryj wszystkie strony
            for (let i = 0; i < this.totalJournalPages; i++) {
                const page = document.getElementById(`page${i}`);
                if (page) {
                    if (i < this.unlockedJournalPages) {
                        page.style.display = "none"; // Będzie pokazana w kroku 5
                    } else {
                        page.style.display = "none"; // Niedostępna - zawsze ukryta
                    }
                }
            }

            // 4. Pokaż TYLKO aktualną stronę (jeśli jest dostępna)
            const currentPage = document.getElementById(`page${this.currentJournalPage}`);
            if (currentPage) currentPage.style.display = "block";

            // 5. Zaktualizuj przyciski nawigacji
            // Prev: wyłącz na stronie 0
            this.prevPageBtn.disabled = (this.currentJournalPage === 0);
            
            // Next: wyłącz na ostatniej DOSTĘPNEJ stronie
            this.nextPageBtn.disabled = (this.currentJournalPage >= this.unlockedJournalPages - 1);

            // 6. DOMYŚLNY STAN: ukryj wszystkie minigry
            const miniGameUkadanie = document.getElementById("miniGameUkadanieSowa");
            const miniGameDrag = document.getElementById("miniGameFactoryDrag");
            const miniGameKable = document.getElementById("miniGamePolskoCzeskieKable");
            const page3Original = document.getElementById("page3-original-content");

            if (miniGameUkadanie) miniGameUkadanie.style.display = "none";
            if (miniGameDrag) miniGameDrag.style.display = "none";
            if (miniGameKable) miniGameKable.style.display = "none";
            if (page3Original) page3Original.style.display = "block";

            // 7. STRONA 2: Minigra Układanie Słowa (dostępna gdy sterujacaHint = true)
            if (this.currentJournalPage === 2 && this.sterujacaHint === true) {
                if (miniGameUkadanie) {
                    miniGameUkadanie.style.display = "block";
                    if (this.minigra1 === false) {
                        initMiniGameUkadanieSowa(this);
                        this.minigra1 = true;
                    }
                }
            }

            // 8. STRONA 3: Minigra Drag & Drop (dostępna gdy sterujacaEnd = true)
            if (this.currentJournalPage === 3 && this.sterujacaEnd === true) {
                if (page3Original) page3Original.style.display = "none";
                if (miniGameDrag) {
                    miniGameDrag.style.display = "block";
                    if (this.minigra2 === false) {
                        initMiniGameFactoryDrag(this);
                        this.minigra2 = true;
                    }
                }
            }

            // 9. STRONA 4: Minigra Kable (dostępna gdy ruryEnd = true)
            if (this.currentJournalPage === 4 && this.ruryEnd === true) {
                if (miniGameKable) {
                    miniGameKable.style.display = "block";
                    if (this.minigra3 === false) {
                        initMiniGamePolskoCzeskieKable(this);
                        this.minigra3 = true;
                    }
                }
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
                Detective: { icon: '👨‍💼', name: 'Detective' },
                
                sabotażysta: { icon: '🕵️‍♂️', name: 'Sabotażysta' },
                saboteur: { icon: '🕵️‍♂️', name: 'Saboteur' },
                
                właściciel: { icon: '🏭', name: 'Właściciel Fabryki' },
                owner: { icon: '🏭', name: 'Factory Owner' },
                
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