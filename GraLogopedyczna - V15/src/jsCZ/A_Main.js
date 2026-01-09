class VoiceFactoryGame {
    constructor() {
        this.currentJournalPage = 0;
        this.totalJournalPages = 5;
        this.unlockedJournalPages = 3;     // Při spuštění přístup pouze ke stránkám 0 a 1
        this.completedWords = [];
        this.completedKable = 0;
        this.score = 0;
        this.isListening = false;
        this.currentLevel = 0;
        this.hint2Unlocked = false;
        this.hint3Unlocked = false;
        this.hint4Unlocked = false;
        this.previousScreen = null;
        this.skrzynieWlaczone = false;
        this.minigra1 = false;
        this.minigra2 = false;
        this.minigra3 = false;
        this.EngMode = false;
        this.previousScreenBeforeJournal = null;
        this.gameerrorsound = 0;
        this.ruryEnd = false;
        this.ruryStart = false;
        this.sterujacaEnd = false;
        this.sterujacaHint = false;
        this.GameFinal = false;


        // NOWE: Stan mikrofonu
        this.micEnabled = false;  // Je mikrofon aktivní
        this.currentContext = null;  // Aktuální kontext (door, game, practice)

        this.levels = [
            {
                id: 1,
                name: "Vypadá to, že stroj na řízení továrny stále nefunguje. Musíme se pokusit jej opravit.",
                nameEng: "It looks like the factory control machine is still not working. We need to try to fix it.",
                hint: "Řekněte 'naprav mašinu' pro pokračování",
                hintEng: "Say 'naprav mašinu' to proceed",
                vocabulary: ["naprav mašinu"]
            },
            {
                id: 2,
                name: "Navzdory opravenému napájení stále není žádný proud. Zkontrolujte zdroj. ",
                nameEng: "Despite the repaired power supply, there is still no power. Check the power supply.",
                hint: "Řekněte 'Zkontroluj zdroj'",
                hintEng: "Say 'Check the power supply'",
                vocabulary: ["zkontroluj zdroj"]
            },
            {
                id: 3,
                name: "Napájecí kabely se zdají být rezavé.",
                nameEng: "The power supply cables seem to be rusty.",
                hint: "Řekněte 'Čištění kontaktů' a pak 'Zkontroluj vodivost'",
                hintEng: "Say 'Contact cleaning', then 'Check conductivity'",
                vocabulary: ["čištění kontaktů", "zkontroluj vodivost"]
            },
            {
                id: 4,
                name: "Napájení znovu funguje. Stroj se nyní může zapnout.",
                nameEng: "The power is back on. The machine can now be turned on.",
                hint: "Řekněte 'Zapni řídící stroj'",
                hintEng: "Say 'Turn on the control machine'",
                vocabulary: ["zapni řídící stroj"]
            },
            {
                id: 5,
                name: "Stroj se spustil. Však se okamžitě objevilo několik chyb. Je třeba je opravit. První chyba je vada senzoru. Podívejte se do stroje a vyměňte jej.",
                nameEng: "The machine has started up. However, several errors have immediately appeared. They need to be fixed. The first error is a sensor defect. Look inside the machine and replace it.",
                hint: "Řekněte 'Otevři stroj' a pak 'Vyměň senzor'",
                hintEng: "Say 'Open the machine', then 'Replace the sensor'",
                vocabulary: ["otevři stroj", "vyměň senzor"]
            },
            {
                id: 6,
                name: "Dalším problémem, který stroj označuje, je výměna ložiska a řídicího páky.",
                nameEng: "The next problem indicated by the machine is the replacement of the bearing and the control lever.",
                hint: "Řekněte 'Vyměň ložisko' a pak 'Vyměň páku'",
                hintEng: "Say 'Replace the bearing', then 'Replace the lever'",
                vocabulary: ["vyměň ložisko", "vyměň páku"]
            },
            {
                id: 7,
                name: "Skvělé. Již nejsou žádné mechanické vady. Posledním krokem je nová kalibrace komponent ve správném pořadí. Nejdříve zkalibrujte integrovaný obvod.",
                nameEng: "Great. There are no more mechanical faults. The last step is to recalibrate the components in the correct order. First, calibrate the integrated circuit.",
                hint: "Řekněte 'Zkalibruj integrovaný obvod'",
                hintEng: "Say 'Calibrate the integrated circuit'",
                vocabulary: ["zkalibruj integrovaný obvod"]
            },
            {
                id: 8,
                name: "Dalším je kalibrace procesoru.",
                nameEng: "Next is the calibration of the processor.",
                hint: "Řekněte 'Zkalibruj procesor'",
                hintEng: "Say 'Calibrate the processor'",
                vocabulary: ["zkalibruj procesor"]
            },
            {
                id: 9,
                name: "A nakonec zůstala kalibrace spájeného systému.",
                nameEng: "And finally, the calibration of the coupled system is left.",
                hint: "Řekněte 'Zkalibruj spojený systém'",
                hintEng: "Say 'Calibrate the coupled system'",
                vocabulary: ["zkalibruj spojený systém"]
            },
        ];

        this.init();
    }

    init() {
        this.bindUI();
        this.showMenu();
    }

    bindUI() {
        // Obrazovky
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

        // Hlavní tlačítka
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
        // NOVÝ: Globální tlačítko mikrofonu
        this.globalMicBtn = document.getElementById("globalMicBtn");

        // Odznaky
        this.badge1 = document.getElementById("badge1");//pkt
        this.badge2 = document.getElementById("badge2");
        this.badge3 = document.getElementById("badge3");
        this.badge4 = document.getElementById("badge4");
        this.badge5 = document.getElementById("badge5");//kable
        this.badge6 = document.getElementById("badge6");//sterująca
        this.badge7 = document.getElementById("badge7");//skrzynia
        this.badge8 = document.getElementById("badge8");//robot
        this.badge9 = document.getElementById("badge9");//maszyna 2
        this.badge10 = document.getElementById("badge10");//mistrz

        // Prvky zpětné vazby (bez tlačítek mikrofonu)
        this.doorSpeechResult = document.getElementById("doorSpeechResult");
        this.speechResult = document.getElementById("speechResult");
        this.kableSpeechResult = document.getElementById("kableSpeechResult");
        this.MazeSpeechResult = document.getElementById("mazeSpeechResult");
        this.SkrzynieGameResult = document.getElementById("skrzynie-speech-result");

        // Továrna
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
        // Hra
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

        // Deník
        this.nextPageBtn = document.getElementById("nextPageBtn");
        this.nextPageBtn1 = document.getElementById("nextPageBtn1");
        this.prevPageBtn = document.getElementById("prevPageBtn");
        this.prevPageBtn1 = document.getElementById("prevPageBtn1");

        // Posluchače akcí - MENU
        this.startBtn.addEventListener("click", () => this.startStory());
        this.startBtn1.addEventListener("click", () => this.startStory());
        this.helpBtn.addEventListener("click", () => this.showInstructions());
        this.helpBtn1.addEventListener("click", () => this.showInstructions());
        this.backFromInstructionsBtn.addEventListener("click", () => this.showMenu());

        // Posluchače akcí - INTRO
        this.introYesBtn.addEventListener("click", () => this.showDoorScreen());
        this.introYesBtn1.addEventListener("click", () => this.showDoorScreen());

        // Posluchače akcí - GLOBÁLNÍ MIKROFON
        this.globalMicBtn.addEventListener("click", () => this.toggleGlobalListening());

        // Posluchače akcí - TOVÁRNA
        this.machineBtn1.addEventListener("click", () => this.startGame());
        this.machineBtn2.addEventListener("click", () => this.startGameKable());
        this.machineBtn3.addEventListener("click", () => this.startGameMaze());
        this.machineBtn4.addEventListener("click", () => this.startGameSkrzynie());
        this.machineBtn5.addEventListener("click", () => this.startGameRury());

        // Posluchače akcí - HRA
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

        // Posluchače akcí - DENÍK
        this.journalBtn.addEventListener("click", () => this.showJournal());
        this.backFromJournalBtn.addEventListener("click", () => {
            this.closeJournal();
        });
        this.backFromJournalBtn1.addEventListener("click", () => {
            this.closeJournal();
        });
        this.prevPageBtn.addEventListener("click", () => {
            if (this.currentJournalPage > 0) {
                this.currentJournalPage--;
                this.showJournalPage();
            }
        });
        this.prevPageBtn1.addEventListener("click", () => {
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




        // V bindUI() - přidejte to po posluchači akcí machineBtn2:


        this.SkrzynieGameResult = document.getElementById("skrzynie-speech-result");

        this.angBtn = document.getElementById("angBtn");
        this.angBtn.addEventListener('click', () => {
            document.querySelectorAll('.ang').forEach(el => {
                el.style.display = el.style.display === 'block' ? 'none' : 'block';
            });
            document.querySelectorAll('.cs').forEach(el => {
                el.style.display = el.style.display === 'none' ? 'block' : 'none';
            });
            document.querySelectorAll('.intro-story-title1-ang').forEach(el => {
                el.style.display = el.style.display === 'block' ? 'none' : 'block';
            });
            this.updateRuryButtonsLanguage();
            if (this.EngMode === false) {
                this.EngMode = true;
                this.engMode();
            }
            else {
                this.EngMode = false;
                this.engMode();
            }
        });

    }

    // ===== SPRÁVA GLOBÁLNÍHO MIKROFONU =====

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
            if (!this.EngMode) this.showFeedback("Váš prohlížeč nepodporuje rozpoznávání řeči.", "#ef4444");
            else this.showFeedback("Your browser does not support speech recognition.", "#ef4444");
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
            if (!this.EngMode) this.showFeedback("Poslouchám...", "#fbbf24");
            else this.showFeedback("Listening...", "#fbbf24");
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            if (!this.EngMode) this.showFeedback(`Slyšel jsem: "${transcript}"`, "#e5e7eb");
            else this.showFeedback(`I heard: "${transcript}"`, "#e5e7eb");
            this.processTranscript(transcript);
        };

        this.recognition.onerror = (event) => {
            let errorMessage = '';

            switch (event.error) {
                case 'not-allowed':
                    if (!this.EngMode) errorMessage = '🔒 Mikrofon je zablokován! Změňte oprávnění v nastavení.';
                    else errorMessage = '🔒 Microphone blocked! Change permissions in settings.';
                    break;
                case 'no-speech':
                    if (!this.EngMode) errorMessage = '🔊 Neslyším řeč. Opakujte rychleji!';
                    else errorMessage = '🔊 I can’t hear any speech. Please repeat faster!';
                    break;
                case 'network':
                    if (!this.EngMode) errorMessage = '🌐 Problém se sítí.';
                    else errorMessage = '🌐 Network issue.';
                    break;
                default:
                    if (!this.EngMode) errorMessage = `Chyba: ${event.error}`;
                    else errorMessage = `Error: ${event.error}`;
            }

            this.showFeedback(errorMessage, "#ef4444");

            // Ukažte pokyn uživateli
            if (event.error === 'not-allowed') {
                setTimeout(() => {
                    customAlert.warning(
                        '🔒 Přístup k mikrofonu je zablokován',
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
        switch (this.currentContext) {
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
                if (!this.EngMode) this.showFeedback("Neznámý kontext", "#ef4444");
                else this.showFeedback("Unknown context", "#ef4444");
        }
    }

    showFeedback(message, color) {
        let feedbackElement;
        switch (this.currentContext) {
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

    // ===== SPRÁVA OBRAZOVEK =====

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

        // ZAPNI MIKROFON pro dveře
        this.enableMicrophone('door');

        this.previousScreen = "doorScreen";
    }

    showFactory() {
        this.hideAllScreens();
        this.factoryScreen.classList.add("active");
        this.journalBtn.style.display = "block";
        // VYPNI MIKROFON na obrazovce továrny
        this.disableMicrophone();

        if (this.GameFinal === true) {
            if (this.EngMode === false) {
                DialogSystem.showSequence([
                    { speakerId: null, text: 'Ne! Jak jste to mohli udělat' },
                    { speakerId: 'info', text: 'Běžíš k němu a chytáš sabotéra. Maska padá na zem.' },
                    { speakerId: 'info', text: 'Sabotér — malá, třesoucí se postava s mechanickým modulátorem u úst' },
                    { speakerId: 'wlasciciel', text: 'Proč jsi to udělal?' },
                    { speakerId: 'sabotazysta', text: 'Protože… protože j-já n-nemůžu mluvit správně…" – jeho hlas se chvěje, seplá jako dříve. – „Zničili mě a pak m-mě schovali… Myslel jsem, že pokud nikdo nebude mluvit správně, tak… tak se nebudu vyznačovat.' },
                    { speakerId: 'info', text: 'Nastane chvíle ticha. Majitel Továrny si těžce vzdechne a ty si klekneš vedle sabotéra.' },
                    { speakerId: 'detektyw', text: 'Mohl ses požádat o pomoc. Tady, v Továrně Hlasů, se každý zvuk dá opravit.' },
                    { speakerId: 'sabotazysta', text: 'O-opravit…? M-mě…?' },
                    { speakerId: 'detektyw', text: 'Ano, tebe.' },
                    { speakerId: 'sabotazysta', text: 'P-promiň… Už n-nebudu. P-prosím… opravte můj hlas.' },
                    { speakerId: 'wlasciciel', text: 'Detektive, bez tebe by se továrna neutrvala! Sabotér byl chycen a my konečně můžeme opravit nejen stroje, ale i… jeho.' },
                ]);


            } else {
                DialogSystem.showSequence([
                    { speakerId: null, text: 'No! How could you' },
                    { speakerId: 'info1', text: 'You run towards the villain and catch him. The mask falls to the ground.' },
                    { speakerId: 'info1', text: 'The saboteur — a small, trembling figure with a mechanical modulator at his mouth' },
                    { speakerId: 'wlasciciel', text: 'Why did you do it?' },
                    { speakerId: 'saboteur', text: 'Because… I-I c-cannot speak properly…” – his voice trembles, he lisps like before. – “They broke me, and then h-hid… I thought that if no one spoke correctly, then… I w-wouldn’t stand out.' },
                    { speakerId: 'info1', text: 'A moment of silence falls. The Factory Owner sighs heavily, and you kneel beside the saboteur.' },
                    { speakerId: 'detektyw', text: 'You could have asked for help. Here, at the Voice Factory, every sound can be fixed.' },
                    { speakerId: 'saboteur', text: 'F-fix…? M-me…?' },
                    { speakerId: 'detektyw', text: 'Yes, you.' },
                    { speakerId: 'saboteur', text: 'I-I’m sorry… I won’t do it anymore. P-please… fix my voice.' },
                    { speakerId: 'wlasciciel', text: 'Detective, without you the factory would not have survived! The villain has been caught, and we can finally fix not only the machines, but also… him.' },


                ]);

            }
            this.checkAllBadges();
        }

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
    // ===== BODOVÁNÍ ===== //
    async addPoints(points) {
        this.score += points;
        document.getElementById('score').textContent = `Body: ${this.score}`;
        document.getElementById('score1').textContent = `Points: ${this.score}`;
        this.checkPoints();
    }
    async checkPoints() {

        if (this.score >= 1000 && this.badge1.style.display === "none") {
            if (this.EngMode === false) {
                customAlert.info('BRAVO! Odemkl jsi první odznak za body v deníku!');
            } else {
                customAlert.info('CONGRATULATIONS! You have unlocked the first badge for points in the journal!');
            }
            this.badge1.style.display = "block";
        }

        if (this.score >= 1500 && this.badge2.style.display === "none") {
            if (this.EngMode === false) {
                customAlert.info('BRAVO! Odemkl jsi druhou odznak za body v deníku!');
            } else {
                customAlert.info('CONGRATULATIONS! You have unlocked the second badge for points in the journal!');
            }
            this.badge2.style.display = "block";
        }

        if (this.score >= 2000 && this.badge3.style.display === "none") {
            if (this.EngMode === false) {
                customAlert.info('BRAVO! Odemkl jsi třetí odznak za body v deníku!');
            } else {
                customAlert.info('CONGRATULATIONS! You have unlocked the third badge for points in the journal!');
            }
            this.badge3.style.display = "block";
        }

        if (this.score >= 2500 && this.badge4.style.display === "none") {
            if (this.EngMode === false) {
                customAlert.info('BRAVO! Odemkl jsi čtvrtou odznak za body v deníku!');
            } else {
                customAlert.info('CONGRATULATIONS! You have unlocked the fourth badge for points in the journal!');
            }
            this.badge4.style.display = "block";
        }
    }
    // ===== OVĚŘENÍ VŠECH ODZNAKŮ =====

    checkAllBadges() {
        // Sprawdź czy wszystkie 9 odznak są odblokowane (1-9)
        // badge10 = ostatnia złota odznaka
        const badge1Unlocked = this.badge1.style.display !== "none";
        const badge2Unlocked = this.badge2.style.display !== "none";
        const badge3Unlocked = this.badge3.style.display !== "none";
        const badge4Unlocked = this.badge4.style.display !== "none";
        const badge5Unlocked = this.badge5.style.display !== "none";
        const badge6Unlocked = this.badge6.style.display !== "none";
        const badge7Unlocked = this.badge7.style.display !== "none";
        const badge8Unlocked = this.badge8.style.display !== "none";
        const badge9Unlocked = this.badge9.style.display !== "none";



        // Jeśli WSZYSTKIE 9 odznak są odblokowone
        if (badge1Unlocked && badge2Unlocked && badge3Unlocked && badge4Unlocked &&
            badge5Unlocked && badge6Unlocked && badge7Unlocked && badge8Unlocked && badge9Unlocked) {

            // Sprawdź czy badge10 już został odblokowowany
            if (this.badge10 && this.badge10.style.display === "none") {
                // Pokaż alertu
                if (this.EngMode === false) {
                    customAlert.success(
                        'GRATULACE! Odemkl jsi všechny odznaky a dokončil hru na 100%! Obdržíš speciální odznak Mistra Továrny Hlasů!',
                        'Mistrovská Úroveň!'
                    );
                } else {
                    customAlert.success(
                        'CONGRATULATIONS! You have unlocked all badges and completed the game 100%! You receive a special Master of the Voice Factory badge!',
                        'Master Level!'
                    );
                }

                // Odblokowywanie ostatniej złotej odznaki
                if (this.badge10) {
                    this.badge10.style.display = "block";
                }
            }
        }
    }



    // ===== LOGIKA DVEŘÍ ===== //

    checkDoorAnswer(transcript) {
        if (transcript.includes("otevři dveře") || transcript.includes("otevri dveře") || transcript.includes("otevri dvere")) {
            if (this.EngMode === false) this.showFeedback("✅ Skvělé! Dveře se otevírají...", "#10b981");
            else this.showFeedback("✅ Great! The door is opening...", "#10b981");
            this.disableMicrophone();

            setTimeout(() => {
                this.showFactory();
            }, 2000);
            setTimeout(() => {
                if (this.EngMode === false) {
                    DialogSystem.showSequence([
                        { speakerId: 'info', text: 'Vstupujete do tmavé, bzučící haly. Všechny dráty jsou odpojeny a tma zahaluje celou továrnu.' },
                        { speakerId: 'wlasciciel', text: 'Sabotér vypnul napájení celé továrny. Chcete-li obnovit fungování systémů, musíte připojit dráty odpovídající barvám hlasů.' },
                        { speakerId: 'detektyw', text: 'Pojďme na to!' },
                    ]);
                } else {
                    DialogSystem.showSequence([
                        { speakerId: 'info1', text: 'You enter a dark, buzzing hall. All the wires are disconnected, and darkness envelops the entire factory.' },
                        { speakerId: 'owner', text: 'The saboteur has cut off the power to the entire factory. To restore the systems, you must reconnect the wires corresponding to the voice colors.' },
                        { speakerId: 'detective', text: 'Let\'s get to work!' },
                    ]);
                }
            }, 2050);
        } else {
            if (this.EngMode === false) this.showFeedback('❌ Zkuste znovu! Řekněte: "Otevři dveře"', "#ef4444");
            else this.showFeedback('❌ Try again! Say: "Open the door"', "#ef4444");
        }
    }

    // ===== LOGIKA HRY ŘÍDÍCÍ STROJ ===== //
    startGame() {
        this.hideAllScreens();
        this.enableMicrophone('game');
        this.gameScreen.classList.add("active");
        this.journalBtn.style.display = "block";
        this.loadLevel();
        this.gameerrorsound = 0;
        this.checkSkipLevel();


        if (this.EngMode === false) {
            DialogSystem.showSequence([
                { speakerId: 'info', text: 'Dveře se otevírají s vrzáním. Uvnitř je všechno promíchané - listy s pokyny leží na podlaze a obrazovky zobrazují náhodné haraburdí písmen.  ' },
                { speakerId: 'wlasciciel', text: 'W tym pomieszczeniu sabotażysta poplątał wszystkie instrukcje tak aby fabryka słów produkowała wadliwe słowa, musisz wypowiedzieć je poprawnie, aby przywrócić maszynę do normy. Poradzisz sobie?”' },
            ]);
        } else {
            //english
            DialogSystem.showSequence([
                { speakerId: 'info1', text: 'The door creaks open. Inside, everything is a mess — instruction sheets are scattered on the floor, and the screens display random jumbles of letters.' },
                { speakerId: 'owner', text: 'In this room, the saboteur has tangled all the instructions so that the word factory produces faulty words. You must pronounce them correctly to restore the machine to normal. Can you do it?”' },
            ]);
        }

        // ZAPNI MIKROFON pro hru\

        this.previousScreen = "gameScreen";
    }

    skipGame() {
        if (this.gameerrorsound >= 3) {
            this.completedWords = [];
            this.currentLevel++;
            this.loadLevel();
            this.addPoints(-100);
            this.gameerrorsound = 0;
            this.checkSkipLevel();
            if (this.EngMode === false) this.showFeedback("Úroveň byla přeskočena za cenu 100 bodů", "#f59e0b");
            else this.showFeedback("Level skipped but cost 100 points", "#f59e0b");
        }
    }
    checkSkipLevel() {
        if (this.gameerrorsound === 0) {
            if (this.gameScreen.classList.contains("active")) {
                this.skipButtonGame.textContent = "Přeskoč (0/3)";
                this.skipButtonGame1.textContent = "  Skip (0/3)";
            }
            else if (this.gameScreenKable.classList.contains("active")) {
                this.skipButtonGameKable.textContent = "Přeskoč (0/3)";
                this.skipButtonGameKable1.textContent = "  Skip (0/3)";
            }

        } else if (this.gameerrorsound === 1) {
            if (this.gameScreen.classList.contains("active")) {
                this.skipButtonGame.textContent = "Přeskoč (1/3)";
                this.skipButtonGame1.textContent = "  Skip (1/3)";
            }
            if (this.gameScreenKable.classList.contains("active")) {
                this.skipButtonGameKable.textContent = "Přeskoč (1/3)";
                this.skipButtonGameKable1.textContent = "  Skip (1/3)";
            }
        } else if (this.gameerrorsound === 2) {
            if (this.gameScreen.classList.contains("active")) {
                this.skipButtonGame.textContent = "Přeskoč (2/3)";
                this.skipButtonGame1.textContent = "Skip (2/3)";
            }
            if (this.gameScreenKable.classList.contains("active")) {
                this.skipButtonGameKable.textContent = "Přeskoč (2/3)";
                this.skipButtonGameKable1.textContent = "Skip (2/3)";
            }
        } else if (this.gameerrorsound === 3) {
            if (this.gameScreen.classList.contains("active")) {
                this.skipButtonGame.textContent = "Přeskoč (3/3)";
                this.skipButtonGame1.textContent = "Skip (3/3)";
            }
            else if (this.gameScreenKable.classList.contains("active")) {
                this.skipButtonGameKable.textContent = "Přeskoč (3/3)";
                this.skipButtonGameKable1.textContent = "Skip (3/3)";
            }

        }
    }

    loadLevel() {
        if (this.currentLevel >= this.levels.length) {
            this.endGame();
            return;
        }
        const level = this.levels[this.currentLevel];


        if (this.EngMode === false) {
            if (level.id === 5) {
                this.levelTitle.textContent = level.name;
                if (this.hint2Unlocked === true) this.levelHint.textContent = level.hint;
                else this.levelHint.textContent = "Žádné informace";
                this.speechResult.textContent = "";
                customAlert.info('Našel jsi nápovědu k dalším krokům. Najdeš ji v deníku na straně 3');


                this.sterujacaHint = true;
            } else {
                const level = this.levels[this.currentLevel];
                this.levelTitle.textContent = level.name;
                this.levelHint.textContent = level.hint;
                this.speechResult.textContent = "";

            }
        }
        else {
            if (level.id === 5) {
                this.levelTitle.textContent = level.nameEng;
                if (this.hint2Unlocked === true) this.levelHint.textContent = level.hint;
                else this.levelHint.textContent = "No information";
                this.speechResult.textContent = "";
                customAlert.info('You found a hint for the next steps. You can find it in the journal on page 3');
                this.sterujacaHint = true;
            } else {
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
            this.addPoints(50);
            this.completedWords.push(transcript);
            if (this.EngMode === false) this.showFeedback("✅ Skvělé!", "#10b981");
            else this.showFeedback("✅ Great!", "#10b981");
            this.gameerrorsound = 0;
            this.checkSkipLevel();
            setTimeout(() => {
                this.showFeedback("", "#e5e7eb");
            }, 1500);
            if (this.completedWords.length === level.vocabulary.length) {
                if (this.EngMode === false) this.showFeedback("✅ Skvělé! Przechodzisz dalej!", "#10b981");
                else this.showFeedback("✅ Great! You advance!", "#10b981");
                setTimeout(() => {
                    this.completedWords = [];
                    this.currentLevel++;
                    this.gameerrorsound = 0;
                    this.checkSkipLevel();
                    this.loadLevel();
                }, 1500);
            }
        } else if (this.completedWords.includes(transcript)) {
            if (this.EngMode === false) this.showFeedback("❌ Zkuste znovu! Příkaz již byl vyslovlen.", "#ef4444");
            else this.showFeedback("❌ Try again! The command has already been spoken.", "#ef4444");
        } else {
            if (this.EngMode === false) this.showFeedback("❌ Zkuste znovu! Nesprávná výslovnost. Řekl jsi " + transcript, "#ef4444");
            else this.showFeedback("❌ Try again! Incorrect pronunciation. You said " + transcript, "#ef4444");
            this.gameerrorsound++;
            this.checkSkipLevel();
        }
    }

    endGame() {
        if (this.EngMode === false) customAlert.success(`🎉 Gratulace! Stroj je plně funkční. Zkontrolujte, které stroje je třeba dále opravit. Obdrželi jste také odznak!`, "Stroj funkční");
        else customAlert.success1(`🎉 Congratulations! The machine is fully operational. Check which machines need to be repaired next. You also received a badge!`, "Machine Operational");
        this.levelTitle.textContent = "Konec hry";
        this.levelHint.textContent = "Skvělá práce, detektive!";
        this.machineBtn1.style.display = "none";
        this.machine1Nap.style.display = "block";
        this.machineBtn4.style.display = "block";
        this.badge6.style.display = "block";
        this.sterujacaEnd = true;
        this.disableMicrophone();
        if (this.EngMode === false) {
            DialogSystem.showSequence([
                { speakerId: null, text: 'To nic nezmění, slova se stejně ssspletou' },
                { speakerId: 'info', text: 'Slyšíte, jak hlas pochází ze stroje č. 3' },
                { speakerId: 'wlasciciel', text: 'Stroj č. 3! Běžme!' },
            ]);
        } else {
            //english
            DialogSystem.showSequence([
                { speakerId: null, text: '"It won\'t make any difference, the words will get jumbled anyway' },
                { speakerId: 'info1', text: 'You hear a voice coming from machine 3' },
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
        this.gameerrorsound = 0;
        this.checkSkipLevel();
        this.previousScreen = "gameScreenKable";

    }
    skipGameKable() {

        if (this.gameerrorsound >= 3) {
            this.addPoints(-100);
            this.gameerrorsound = 0;
            this.checkSkipLevel();
            if (this.EngMode === false) this.showFeedback("Úroveň byla přeskočena za cenu 100 bodů", "#10b981");
            else this.showFeedback("Level skipped but cost 100 points", "#10b981");

            if (this.KabCzerwony.style.display === "none") {
                this.KabCzerwony.style.display = "block";
                this.completedKable++;
            } else if (this.KabBrazowy.style.display === "none") {
                this.KabBrazowy.style.display = "block";
                this.completedKable++;
            } else if (this.KabPomaranczowy.style.display === "none") {
                this.KabPomaranczowy.style.display = "block";
                this.completedKable++;
            } else if (this.KabZolty.style.display === "none") {
                this.KabZolty.style.display = "block";
                this.completedKable++;
            } else if (this.KabGranatowy.style.display === "none") {
                this.KabGranatowy.style.display = "block";
                this.completedKable++;
            } else if (this.KabSzary.style.display === "none") {
                this.KabSzary.style.display = "block";
                this.completedKable++;
            }
            if (this.completedKable === 6) {
                this.endKableGame();
            }
        }
    }

    checkKableAnswer(transcript) {

        if (transcript.includes("cerveny") || transcript.includes("červený")) {
            this.KabCzerwony.style.display = "block";
            this.kableAnswear();
        } else if (transcript.includes("hnedy") || transcript.includes("hnědý")) {
            this.KabBrazowy.style.display = "block";
            this.kableAnswear();
        } else if (transcript.includes("oranyzovy") || transcript.includes("oranžový")) {
            this.KabPomaranczowy.style.display = "block";
            this.kableAnswear();
        } else if (transcript.includes("zluty") || transcript.includes("žlutý")) {
            this.KabZolty.style.display = "block";
            this.kableAnswear();
        } else if (transcript.includes("temne modry") || transcript.includes("tmavě modrý")) {
            this.KabGranatowy.style.display = "block";
            this.kableAnswear();
        } else if (transcript.includes("sedy") || transcript.includes("šedý")) {
            this.KabSzary.style.display = "block";
            this.kableAnswea
        }else {
            if (this.EngMode === false) this.showFeedback("❌ Zkuste znovu!", "#ef4444");
            else this.showFeedback("❌ Try again!", "#ef4444");
            this.gameerrorsound++;
            this.checkSkipLevel();
        }
    }
    
    kableAnswear() {
        this.completedKable++;
        this.addPoints(100);
        if (this.EngMode === false) this.showFeedback("✅ Skvělé!", "#10b981");
        else this.showFeedback("✅ Great!", "#10b981");
        this.gameerrorsound = 0;
        this.checkSkipLevel();
        setTimeout(() => {
            this.showFeedback("", "#e5e7eb");
        }, 2000);

        if (this.completedKable === 6) {
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
        if (this.EngMode === false) customAlert.success(`🎉 Gratulace! Stroj je plně funkční. Zkontrolujte, které stroje je třeba dále opravit. Obdrželi jste také odznak!`, "Kable naprawione");
        else customAlert.success1(`🎉 Congratulations! The machine is fully operational. Check which machines need to be repaired next. You also received a badge!`, "Cables Repaired");
        this.machineBtn2.style.display = "none";
        this.KableNap.style.display = "block";
        this.machineBtn1.style.display = "block";
        this.badge5.style.display = "block";

        this.disableMicrophone();
        if (this.EngMode === false) {
            DialogSystem.showSequence([
                { speakerId: 'detektyw', text: 'Skvělá práce! Připojení všech kabelů obnovilo napájení v továrně.' },
                { speakerId: 'info', text: 'Z hlubin trubek v blízkosti slyšíš syčící hlas' },
                { speakerId: null, text: 'Nikdy mě nechytíš…' },
                { speakerId: 'wlasciciel', text: 'Řídící stroj... Byl tam! Musíme se pohnout dál, než bude příliš pozdě!' },
            ]);

        } else {
            //english
            DialogSystem.showSequence([
                { speakerId: 'detective', text: 'Great job! Connecting all the cables restored power to the factory.' },
                { speakerId: 'info1', text: 'From deep within the pipes, you hear a hissing voice' },
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
        if (this.EngMode === false) {
            DialogSystem.showSequence([
                { speakerId: 'info', text: 'Páska se řítí nekoordinovaným způsobem. Slova jsou promíchána se slabikami a zvuky v úplném chaosu.' },
                { speakerId: 'wlasciciel', text: 'Sabotér přeprogramoval výrobní pásku tak, aby špatně třídila slova. Musíš nám pomoci je seřadit zpět. Pokud se nespospěšíme, celé město začne seplat. Pojďme na to rychle!' },
                { speakerId: 'wlasciciel', text: 'Vypadá to však, že všechny skříně jsou zamčeny. Možná v deníku najdeme nějaké nápovědy?' },
                { speakerId: 'info', text: 'Zkontroluj deník, zda jsi neodemkl novou mini hru' },
            ]);

        } else {
            //english
            DialogSystem.showSequence([
                { speakerId: 'info1', text: 'The tape is racing in an uncoordinated manner. Words are mixed with syllables and sounds in total chaos.' },
                { speakerId: 'owner', text: 'The saboteur reprogrammed the production line to sort words incorrectly. You need to help us sort them back. If we don\'t hurry, the whole city will start to slur its words, let\'s get to work quickly' },
                { speakerId: 'owner', text: 'It seems that all the crates are locked. Maybe we can find some clues in the journal?' },
                { speakerId: 'info1', text: 'Check the journal to see if you unlocked a new mini-game' },
            ]);
        }

        // ZAPNI MIKROFON pro hru skrzyni
        this.enableMicrophone('skrzynie');

        // Zainicjalizuj poziom
        if (this.skrzynieWlaczone === false) {
            if (this.hint3Unlocked === true) {
                initPoziomSkrzynie(this);
                this.skrzynieWlaczone = true;
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
        if (this.EngMode === false) {
            DialogSystem.showSequence([
                { speakerId: 'wlasciciel', text: 'Ó ne… nevíme, kam sabotér utekl. Co teď?' },
                { speakerId: null, text: 'Haló?? Haló? Je tu někdo?! Nemůžu ven!' },
                { speakerId: 'info', text: 'Hlas se ozývá zpoza velkého boxu. Přistupuješ — v něm sedí malý robot, dezorientovaný a uvězněný v bludišti z papírových stěn.' },
                { speakerId: 'robot', text: 'Sabotér mě sem dal! Pomoz mi ven!' },
                { speakerId: 'info', text: 'Aby mu pomohl, musíš vyslovit správné instrukce a vést ho ven z bludiště' },
            ]);

        } else {
            //english
            DialogSystem.showSequence([
                { speakerId: 'owner', text: 'Oh no... we don\'t know where the saboteur went. What now?' },
                { speakerId: null, text: 'Hello?? Is anyone there?! I can\'t get out!' },
                { speakerId: 'info1', text: 'The voice comes from behind a large box. You approach — inside sits a small robot, confused and trapped in a maze of cardboard walls.' },
                { speakerId: 'robot', text: 'The saboteur put me here! Help me get out!' },
                { speakerId: 'info1', text: 'To help him, you need to say the right instructions and lead him out of the maze.' },
            ]);
        }

        initMazeGame(this);
        this.previousScreen = "gameScreenMaze";
    }

    endMazeGame() {
        if (this.EngMode === false) customAlert.success(`🎉 Gratulace! Unikl si z bludiště!`, "Bludiště hotovo");
        else customAlert.success1(`🎉 Congratulations! You have escaped the maze!`, "Maze Completed"); document.getElementById('machineBtn3').style.display = 'none';
        document.getElementById('robot-nap').style.display = 'block';
        document.getElementById('badge8').style.display = 'block';
        this.machineBtn5.style.display = 'block';
        this.disableMicrophone();
        if (this.EngMode === false) {
            DialogSystem.showSequence([
                { speakerId: 'robot', text: 'Děkuji! Kdyby ne ty, nikdy bych odsud nevyšel' },
                { speakerId: 'wlasciciel', text: 'Víš kdo tě tak udělal? A kam šel?' },
                { speakerId: 'robot', text: 'Neviděl jsem ho, byl zamaskovaný, ale pošel tam směrem k potrubí' },
            ]);

        } else {
            //english
            DialogSystem.showSequence([
                { speakerId: 'robot', text: 'Thank you! If it weren\'t for you, I would never have gotten out of here' },
                { speakerId: 'owner', text: 'Do you know who did this to you? And where did he go?' },
                { speakerId: 'robot', text: 'I didn\'t see him, he was masked, but, but he went that way towards the pipeline' },
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
        if (this.hint4Unlocked === true && this.ruryEnd === true) this.endRuryGame();
        // Inicjalizuj stan rur
        if (!this.ruryStart) this.initRuryGame();
        this.ruryStart = true;
        if (this.ruryEnd === false) {
            if (this.EngMode === false) {
                DialogSystem.showSequence([
                    { speakerId: 'info', text: 'Vstupuješ do místnosti a vidíš, jak jsou potrubí zkroucena a zkřivena' },
                    { speakerId: 'wlasciciel', text: 'Ó ne! Toto je hlavní potrubí v továrně. Musíme to rychle opravit' },
                ]);

            } else {
                //english
                DialogSystem.showSequence([
                    { speakerId: 'info1', text: 'You walk into the room and the connected pipes are all bent and twisted.' },
                    { speakerId: 'wlasciciel', text: 'Oh no! This is the main pipeline in the factory. We need to fix it quickly.' },
                ]);
            }
        }
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
        this.showFeedback('🍎 Vyslov názvy ovoce, aby se potrubí otáčela!', '#3b82f6');
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
            this.skipButtonRury.textContent = '⏳ Přeskoč ovoce (-50 bodů)';

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
            '⏳ Ovoce přeskočeno. Bez otáčení potrubí!',
            '#f97316'
        );


        // ← NOWE: KARA PUNKTOWA
        this.addPoints(-50);

        // ← NOWE: FEEDBACK O KARZE
        this.showFeedback(
            '❌ Pokuta: -50 bodů za použití tlačítka!',
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
                `❌ Ovoce nerozpoznáno. Zkuste znovu! (${this.ruryErrorCount}/${this.ruryMaxErrors})`,
                '#ef4444'
            );


            // 🆕 SPRAWDZENIE LIMITU BŁĘDÓW
            if (this.ruryErrorCount >= this.ruryMaxErrors) {
                this.showSkipButtonRury();  // ← POKAŻ PRZYCISK

                this.showFeedback(
                    '⚠️ Dosáhl jsi 3 chyb! Tlačítko přeskočení se objevilo.',
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
                this.skipButtonRury.textContent = '⏳ Změň slova (-50 bodů)';
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
        if (this.hint4Unlocked === true) {
            if (this.EngMode === false) customAlert.success(`🎉 Gratulace! Všechna potrubí jsou správně uspořádána!`, 'Potrubí opraveno');
            else customAlert.success1(`🎉 Congratulations! All pipes are correctly arranged!`, 'Pipes Repaired');

            document.getElementById('machineBtn5').style.display = 'none';
            document.getElementById('2-nap').style.display = 'block';
            if (document.getElementById('badge9')) {
                document.getElementById('badge9').style.display = 'block';
            }
            this.GameFinal = true;

            this.addPoints(200);
            this.disableMicrophone();
            if (this.EngMode === false) {
                DialogSystem.showSequence([
                    { speakerId: 'info', text: 'Systém napájení potrubími byl správně uspořádán.' },
                    { speakerId: 'wlasciciel', text: 'Skvěle! To by mělo být všechno, aby továrna fungovala v plném rozsahu!' },
                    { speakerId: 'wlasciciel', text: 'Rychle tam u dveří!! Sabotér se snaží utéct. Tentokrát nám neutekne!' },
                ]);
            } else {
                //english
                DialogSystem.showSequence([
                    { speakerId: 'info1', text: 'The pipe power system has been correctly arranged.' },
                    { speakerId: 'wlasciciel', text: 'Excellent! This should be everything for the factory to operate at full capacity!' },
                    { speakerId: 'wlasciciel', text: 'Quickly, by the door!! The saboteur is trying to escape. He won\’t get away this time!' },
                ]);
            }
        } else {
            this.ruryEnd = true;
            if (this.EngMode === false) customAlert.success(`🎉 Gratulace! Všechna potrubí jsou správně uspořádána! Nicméně stále není průtok. V deníku najdeš další mini hru, která opraví čerpadlo.`, 'Potrubí nastaveno');
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



    // ===== OVĚŘENÍ VŠECH ODZNAKŮ =====




}


// Initialize game when page loads
document.addEventListener("DOMContentLoaded", () => {
    const game = new VoiceFactoryGame();
});



// ===== DIALOG SYSTEM - UNIWERSALNY =====
const DialogSystem = {
    // Konfiguracja dialogów
    dialogs: {
        robot: {
            iconUrl: 'assets/images/Postacie/robot-mini.png',
            name: 'Robot'
        },
        detektyw: {
            iconUrl: 'assets/images/Postacie/detektyw.png',
            name: 'Detektiv'
        },
        detective: {
            iconUrl: 'assets/images/Postacie/detektyw.png',
            name: 'Detective'
        },
        sabotazysta: {
            iconUrl: 'assets/images/Postacie/sprawca.png',
            name: 'Sabotér'
        },
        saboteur: {
            iconUrl: 'assets/images/Postacie/sprawca.png',
            name: 'Saboteur'
        },
        wlasciciel: {
            iconUrl: 'assets/images/Postacie/wlasciciel.png',
            name: 'Majitel Továrny'
        },
        owner: {
            iconUrl: 'assets/images/Postacie/wlasciciel.png',
            name: 'Factory Owner'
        },
        info: {
            iconUrl: 'assets/images/Postacie/info.png',
            name: 'Informace'
        },
        info1: {
            iconUrl: 'assets/images/Postacie/info.png',
            name: 'Information'
        }
    },

    sequence: [],
    currentIndex: 0,
    onSequenceComplete: null,

    // WYŚWIETL SEKWENCJĘ DIALOGÓW
    showSequence: function (dialogArray, onComplete) {
        this.sequence = dialogArray;
        this.currentIndex = 0;
        this.onSequenceComplete = onComplete;
        this.displayCurrentDialog();
    },

    // WYŚWIETL OBECNY DIALOG W SEKWENCJI
    displayCurrentDialog: function () {
        if (this.currentIndex >= this.sequence.length) {
            this.hide();
            if (this.onSequenceComplete) {
                this.onSequenceComplete();
            }
            return;
        }

        const current = this.sequence[this.currentIndex];
        const speaker = this.dialogs[current.speakerId] || { iconUrl: null, name: 'Nieznany' };

        // Aktualizuj ikonę
        const iconElement = document.getElementById('dialogIcon');
        if (speaker.iconUrl) {
            iconElement.innerHTML = `<img src="${speaker.iconUrl}" alt="${speaker.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        } else {
            iconElement.innerHTML = ''; // Brak ikony dla info
        }

        // Aktualizuj nazwę i tekst
        document.getElementById('dialogSpeakerName').textContent = speaker.name || 'Nieznany';
        document.getElementById('dialogText').textContent = current.text;

        // Pokaż overlay
        const overlay = document.getElementById('dialogOverlay');
        if (overlay) {
            overlay.classList.add('show');
        }
    },

    // NASTĘPNY DIALOG W SEKWENCJI
    nextInSequence: function () {
        this.currentIndex++;
        this.displayCurrentDialog();
    },

    // GŁÓWNA METODA - Wyświetlaj pojedynczy dialog
    show: function (speakerId, text) {
        const speaker = this.dialogs[speakerId] || { iconUrl: null, name: 'Nieznany' };

        // Aktualizuj ikonę
        const iconElement = document.getElementById('dialogIcon');
        if (speaker.iconUrl) {
            iconElement.innerHTML = `<img src="${speaker.iconUrl}" alt="${speaker.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        } else {
            iconElement.innerHTML = '';
        }

        // Aktualizuj nazwę i tekst
        document.getElementById('dialogSpeakerName').textContent = speaker.name || 'Nieznany';
        document.getElementById('dialogText').textContent = text;

        // Pokaż overlay
        const overlay = document.getElementById('dialogOverlay');
        if (overlay) {
            overlay.classList.add('show');
        }

        // Wyłącz sekwencję
        this.sequence = [];
        this.currentIndex = 0;
    },

    // ZAMKNIJ DIALOG
    hide: function () {
        const overlay = document.getElementById('dialogOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    },

    // DODAJ NOWĄ POSTAĆ
    addSpeaker: function (id, name, iconUrl) {
        this.dialogs[id] = { iconUrl: iconUrl, name: name };
    }
};

// ===== DIALOG EVENT LISTENERS - OBSŁUGA KLIKANIA =====

// Czekaj aż DOM się załaduje
document.addEventListener('DOMContentLoaded', function () {
    // Klikanie na przycisk zamknięcia (X)
    const closeBtn = document.getElementById('dialogCloseBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
            e.stopPropagation();

            if (DialogSystem.sequence && DialogSystem.sequence.length > 0 && DialogSystem.currentIndex < DialogSystem.sequence.length - 1) {
                // Jest jeszcze dialog w sekwencji
                DialogSystem.nextInSequence();
            } else {
                // Nie ma już dialogów - zamknij
                DialogSystem.hide();
            }
        });
    }

    // Klikanie na całą zawartość dialogu (dialog-box)
    const dialogBox = document.querySelector('.dialog-box');
    if (dialogBox) {
        dialogBox.addEventListener('click', function (e) {
            // Sprawdź czy kliknięto na sam dialog, nie na przyciski
            if (e.target.classList.contains('dialog-box') ||
                e.target.classList.contains('dialog-content') ||
                e.target.closest('.dialog-content')) {

                if (DialogSystem.sequence && DialogSystem.sequence.length > 0 && DialogSystem.currentIndex < DialogSystem.sequence.length - 1) {
                    DialogSystem.nextInSequence();
                } else {
                    DialogSystem.hide();
                }
            }
        });
    }

    // Klikanie na overlay (tło) - przechodzi dalej
    const overlay = document.getElementById('dialogOverlay');
    if (overlay) {
        overlay.addEventListener('click', function (e) {
            // Tylko jeśli kliknąłeś bezpośrednio na overlay, nie na dialog
            if (e.target.id === 'dialogOverlay') {
                if (DialogSystem.sequence && DialogSystem.sequence.length > 0 && DialogSystem.currentIndex < DialogSystem.sequence.length - 1) {
                    DialogSystem.nextInSequence();
                } else {
                    DialogSystem.hide();
                }
            }
        });
    }

    // Zamknięcie dialogu klawiszem ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            DialogSystem.hide();
        }
    });
});