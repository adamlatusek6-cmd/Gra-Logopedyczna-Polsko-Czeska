function initPoziomSkrzynie(gameInstance) {
    console.log('🎮 INICJALIZACJA POZIOMU SKRZYNI');

    let zablokowana = true;
    if(gameInstance.hint3Unlocked === true){
        zablokowana=false;
    }
    // Dane - słowa i ich kategorie (skrzynie)
    const boxCategories = [
        {
            id: 'animals',
            name: 'Elementy elektroniczne',
            color: '#FF6B6B',
            image: 'assets/images/SkrzynieGra/sk-pusta.png',
            words: ['układ scalony','czujnik','kondensator','rezystor'],
            locked: zablokowana
        },
        {
            id: 'fruits',
            name: 'Procesy techniczne',
            color: '#4ECDC4',
            image: 'assets/images/SkrzynieGra/sk-pusta.png',
            words: ['synchronizacja','transmisja','kompresja','kalibracja'],
            locked: zablokowana
        },
        {
            id: 'colors',
            name: 'Zasilanie',
            color: '#A8E6CF',
            image: 'assets/images/SkrzynieGra/sk-pusta.png',
            words: ['bateria','akumulator','zasilacz','gniazdko'],
            locked: zablokowana
        },
        {
            id: 'objects',
            name: 'Programowanie',
            color: '#E0BBE4',
            image: 'assets/images/SkrzynieGra/sk-pusta.png',
            words: ['kod','algorytm','pętla','funkcja'],
            locked: zablokowana
        }
    ];


    let gameState = {
        unlockedWords: [],
        matchedPairs: [],
        draggedWord: null,
        allWords: [],
        matchedWords: new Set(),
        unlockedBoxes: new Set(),
        skipAttempts: 0,
        skipButtonEnabled: false
    };


    


    // Vytvoření HTML struktury
    function createGameHTML() {
        const gameContainer = document.getElementById('gameScreenSkrzynie');
        if (!gameContainer) return;


        const gameContent = document.createElement('div');
        gameContent.className = 'skrzynie-game-container';
                gameContent.innerHTML = `
            <div class="skrzynie-header">
                <h2 class="levels-instructions pl">Sortowanie do Skrzyń</h2>
                <h2 class="levels-instructions ang">Box sorting</h2>
                <p class="level-hints pl">Wypowiedz każde słowo, aby je odblokować, a następnie przeciągnij do właściwej kategorii</p>
                <p class="level-hints ang">Say each word to unlock it, then drag it to the correct category</p>
            </div>
            <div class="skrzynie-main">
                <div class="skrzynie-words-container" id="wordsContainer"></div>
                <div class="skrzynie-boxes-container" id="boxesContainer"></div>
            </div>
            <div>
                <p id="skrzynie-speech-result" class="speech-feedback"></p>
            </div>
            <div class="skrzynie-controls">
                <button id="skipBtn" class="btn btn-outline" disabled>Pomiń (0/3)</button>
                <button id="backBtnSkrzynie" class="btn btn-secondary pl">Powrót</button>
                <button id="backBtnSkrzynie1" class="btn btn-secondary ang">Back</button>
            </div>
        `;


        gameContainer.innerHTML = gameContent.innerHTML;
        

        // Event listenery
        document.getElementById('backBtnSkrzynie').addEventListener('click', () => {
            gameInstance.returnToFactory();
        });
        document.getElementById('backBtnSkrzynie1').addEventListener('click', () => {
            gameInstance.returnToFactory();
        });
        // Event listener dla przycisku pomijania
        document.getElementById('skipBtn').addEventListener('click', handleSkipButton);
    }


    // Rendering słów do przeciągnięcia
    function renderWords() {
        const container = document.getElementById('wordsContainer');
        
        // Jeśli to pierwsza inicjalizacja, wyczyść kontener
        if (gameState.allWords.length === 0) {
            container.innerHTML = '';
            
            // Zbierz wszystkie słowa
            gameState.allWords = [];
            boxCategories.forEach(category => {
                category.words.forEach(word => {
                    gameState.allWords.push({ word, categoryId: category.id, categoryName: category.name });
                });
            });
            
            // Pomieszaj słowa tylko przy pierwszej inicjalizacji
            gameState.allWords.sort(() => Math.random() - 0.5);
        } else {
            // Jeśli to update, tylko odśwież elementy DOM. Nie mieszaj i nie zmieniaj kolejności
        }
        
        // Aktualizuj stan przycisku pomijania
        updateSkipButton();


        // Stwórz/zaktualizuj elementy
        gameState.allWords.forEach((item, idx) => {
            let wordDiv = document.getElementById(`word-${idx}`);
            
            // Jeśli element istnieje, zaktualizuj go
            if (wordDiv) {
                const isUnlocked = gameState.unlockedWords.includes(item.word);
                const isMatched = gameState.matchedWords.has(item.word);
                
                wordDiv.classList.toggle('unlocked', isUnlocked);
                wordDiv.classList.toggle('locked', !isUnlocked);
                wordDiv.classList.toggle('matched', isMatched);
                
                if (isMatched) {
                    wordDiv.draggable = false;
                    wordDiv.style.opacity = '0.5';
                } else if (isUnlocked) {
                    wordDiv.draggable = true;
                    wordDiv.style.opacity = '1';
                    // Usuń stare listenery
                    const newWordDiv = wordDiv.cloneNode(true);
                    wordDiv.parentNode.replaceChild(newWordDiv, wordDiv);
                    wordDiv = newWordDiv;
                    
                    wordDiv.addEventListener('dragstart', handleDragStart);
                    wordDiv.addEventListener('dragend', handleDragEnd);
                }
            } else {
                // Stwórz nowy element
                wordDiv = document.createElement('div');
                wordDiv.className = 'skrzynie-word-item locked-word';
                wordDiv.dataset.word = item.word;
                wordDiv.dataset.categoryId = item.categoryId;
                wordDiv.dataset.categoryName = item.categoryName;
                wordDiv.id = `word-${idx}`;
                
                const isUnlocked = gameState.unlockedWords.includes(item.word);
                const isMatched = gameState.matchedWords.has(item.word);
                
                wordDiv.classList.toggle('unlocked', isUnlocked);
                wordDiv.classList.toggle('locked', !isUnlocked);
                wordDiv.classList.toggle('matched', isMatched);
                
                if (isMatched) {
                    wordDiv.draggable = false;
                    wordDiv.style.opacity = '0.5';
                    wordDiv.innerHTML = `<span>${item.word}</span>`;
                } else if (isUnlocked) {
                    wordDiv.draggable = true;
                    wordDiv.innerHTML = `<span>${item.word}</span>`;
                    wordDiv.addEventListener('dragstart', handleDragStart);
                    wordDiv.addEventListener('dragend', handleDragEnd);
                } else {
                    wordDiv.draggable = false;
                    wordDiv.innerHTML = `<span>${item.word}</span>`;
                }
                
                container.appendChild(wordDiv);
            }
        });
    }



    // Rendering skrzyń
    function renderBoxes() {
        const container = document.getElementById('boxesContainer');
        container.innerHTML = '';


        boxCategories.forEach(category => {
            const boxDiv = document.createElement('div');
            boxDiv.className = 'skrzynie-box';
            boxDiv.dataset.categoryId = category.id;
            boxDiv.id = `box-${category.id}`;


            const bgColor = category.color;
            const textColor = category.color_text || '#fff';


            const isLocked = category.locked && !gameState.unlockedBoxes.has(category.id);

            boxDiv.innerHTML = `
                <div class="box-wrapper" style="background-image: url('${category.image}');">
                    <div class="box-content" id="box-content-${category.id}"></div>
                    <div class="box-category-label">${category.name}</div>
                    ${isLocked ? '<div class="box-lock-icon">🔒</div>' : ''}
                </div>
            `;

            // Dodaj klasę locked
            if (isLocked) {
                boxDiv.classList.add('locked');
            }





            boxDiv.addEventListener('dragover', handleDragOver);
            boxDiv.addEventListener('drop', (e) => handleDrop(e, category.id));


            container.appendChild(boxDiv);


            // Renderuj zawartość skrzyni
            updateBoxContent(category.id);
        });
    }


    // Update zawartości skrzyni
    function updateBoxContent(categoryId) {
        const contentDiv = document.getElementById(`box-content-${categoryId}`);
        if (!contentDiv) return;


        const matched = gameState.matchedPairs.filter(p => p.categoryId === categoryId);
        contentDiv.innerHTML = matched.map(p => `
            <div class="box-word-item">${p.word}</div>
        `).join('');
    }


    // Odblokowanie słowa
function unlockWord(wordText) {
    // Sprawdź czy słowo istnieje w grze
    const wordExists = gameState.allWords.some(w => w.word.toLowerCase() === wordText.toLowerCase());
    if (!wordExists) {
        if (gameInstance.EngMode === false) {
            gameInstance.showFeedback('Tego słowa nie ma w grze. Spróbuj ponownie.', '#ef4444');
        } else {
            gameInstance.showFeedback('This word is not in the game. Please try again.', '#ef4444');
        }
        // Zwiększ licznik prób po nieudanej próbie
        gameState.skipAttempts = Math.min(gameState.skipAttempts + 1, 3);
        updateSkipButton();
        return false;
    }
    
    // Sprawdź czy nie jest już odblokowane
    else if (gameState.unlockedWords.includes(wordText)) {
        if (gameInstance.EngMode === false) {
            gameInstance.showFeedback(`Słowo "${wordText}" jest już odblokowane!`, '#f59e0b');
        } else {
            gameInstance.showFeedback(`The word "${wordText}" is already unlocked!`, '#f59e0b');
        }
        return false;
    }
    
    // Odblokuj słowo
    else {
        gameState.unlockedWords.push(wordText);
        if (gameInstance.EngMode === false) {
            gameInstance.showFeedback(`Słowo "${wordText}" odblokowane! Teraz możesz je przesunąć.`, '#10b981');
        } else {
            gameInstance.showFeedback(`The word "${wordText}" is unlocked! You can now move it.`, '#10b981');
        }
        renderWords();
        return true;
    }
}

// Funkcja obsługi przycisku pomijania
function handleSkipButton() {
    if (!gameState.skipButtonEnabled || gameState.skipAttempts < 3) {
        return;
    }
    
    // Znajdź pierwsze zablokowane słowo
    const firstLockedWord = gameState.allWords.find(item => 
        !gameState.unlockedWords.includes(item.word) && 
        !gameState.matchedWords.has(item.word)
    );
    
    if (firstLockedWord) {
        unlockWord(firstLockedWord.word);
        // Zablokuj przycisk ponownie
        gameState.skipButtonEnabled = false;
        updateSkipButton();
        
        if (gameInstance.EngMode === false) {
            gameInstance.showFeedback(`Słowo "${firstLockedWord.word}" zostało odblokowane przyciskiem Pomiń!`, '#10b981');
            gameState.skipAttempts = 0;
            updateSkipButton()
        } else {
            gameInstance.showFeedback(`Word "${firstLockedWord.word}" unlocked with Skip button!`, '#10b981');
        }
    }
}

// Funkcja aktualizacji przycisku pomijania
function updateSkipButton() {
    const skipBtn = document.getElementById('skipBtn');
    if (!skipBtn) return;
    
    if (gameState.skipAttempts >= 3 && !gameState.skipButtonEnabled) {
        gameState.skipButtonEnabled = true;
        skipBtn.disabled = false;
        skipBtn.textContent = gameInstance.EngMode === false ? 'Pomiń' : 'Skip';
        skipBtn.classList.remove('disabled');
    } else {
        gameState.skipButtonEnabled = false;
        skipBtn.disabled = true;
        skipBtn.textContent = `${gameInstance.EngMode === false ? 'Pomiń' : 'Skip'} (${gameState.skipAttempts}/3)`;
        skipBtn.classList.add('disabled');
    }
}



    // Drag & Drop handlers
    function handleDragStart(e) {
        gameState.draggedWord = e.target.closest('.skrzynie-word-item');
        gameState.draggedWord.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }


    function handleDragEnd(e) {
        if (gameState.draggedWord) {
            gameState.draggedWord.classList.remove('dragging');
        }
        gameState.draggedWord = null;
    }


    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.target.closest('.skrzynie-box')?.classList.add('drag-over');
    }


    function handleDrop(e, categoryId) {
        e.preventDefault();
        e.target.closest('.skrzynie-box')?.classList.remove('drag-over');

        if (!gameState.draggedWord) return;

        // DODAJ TO - Sprawdzenie czy skrzynia jest zablokowana
        if (gameState.unlockedBoxes.has(categoryId) === false && boxCategories.find(b => b.id === categoryId).locked) {
            if (gameInstance.EngMode === false) gameInstance.showFeedback('🔒 Ta skrzynia jest zablokowana! Najpierw ją odblokuj.', '#ef4444');
            else gameInstance.showFeedback('🔒 This box is locked! Unlock it first.', '#ef4444');
            return;
        }

    const wordText = gameState.draggedWord.dataset.word;
    const correctCategoryId = gameState.draggedWord.dataset.categoryId;

        // Sprawdź czy słowo trafiło do właściwej skrzyni
        if (correctCategoryId === categoryId) {
            // Poprawne!
            const pair = { word: wordText, categoryId };
            
            // Sprawdź czy już nie ma tego słowa
            if (!gameState.matchedPairs.find(p => p.word === wordText)) {
                gameState.matchedPairs.push(pair);
                gameState.matchedWords.add(wordText);  // ← Dodaj to

                if (gameInstance.EngMode === false) gameInstance.showFeedback(`✅ Świetnie! "${wordText}" trafiło do "${boxCategories.find(b => b.id === categoryId).name}"`, '#10b981');
                else gameInstance.showFeedback(`✅ Great! "${wordText}" went to "${boxCategories.find(b => b.id === categoryId).name}"`, '#10b981');

                // Usuń słowo z listy
                gameState.draggedWord.style.opacity = '0.5';
                gameState.draggedWord.classList.add('matched');
                gameState.draggedWord.draggable = false;

                // Update box content
                updateBoxContent(categoryId);

                // Sprawdź czy koniec gry
                if (gameState.matchedPairs.length === gameState.allWords.length) {
                    endSkrzynieGame();
                }
            }
        } else {
            // Błędne!
            if (gameInstance.EngMode === false) gameInstance.showFeedback('❌ To nie jest właściwa kategoria! Spróbuj jeszcze raz.', '#ef4444');
            else gameInstance.showFeedback('❌ This is not the correct category! Try again.', '#ef4444');
        }
    }



    // Koniec gry
    function endSkrzynieGame() {
        if (gameInstance.EngMode === false) gameInstance.showFeedback('🏆 Gratulacje! Wszystkie słowa zostały prawidłowo posortowane!', '#10b981');
        else gameInstance.showFeedback('🏆 Congratulations! All words have been correctly sorted!', '#10b981');
        gameInstance.addPoints(1000);
        document.getElementById('machineBtn4').style.display = 'none';
        document.getElementById('skrzynia-nap').style.display = 'block';
        document.getElementById('badge7').style.display = 'block';
        document.getElementById('machineBtn3').style.display='block';
        if(gameInstance.engMode===false){
            DialogSystem.showSequence([
            { speakerId: 'info', text: 'Nagle w całej fabryce rozlega się głośny głos:' },
            { speakerId: null, text: 'Skończy sssie wasssze mówienie! Skoro ja nie mówię dobrze, nikt nie będzie!' },
            { speakerId: 'właściciel', text: 'On gdzieś tu jest… ale gdzie?! Tam zaraz przy robocie!'},
            ]);
        }else{
            //english
            DialogSystem.showSequence([
                { speakerId: 'info', text: 'Suddenly, a loud voice echoes throughout the factory:' },
                { speakerId: null, text: 'Your talking is over! If I can\'t speak properly, no one will!' },
                { speakerId: 'owner', text: 'He\'s somewhere here... but where?! Right there by the robot!'},
        ]);
        }
        
        setTimeout(() => {
            gameInstance.returnToFactory();
        }, 2500);
    }


    // Reset gry
    // Reset gry
    function resetGame() {
        gameState = {
            unlockedWords: [],
            matchedPairs: [],
            draggedWord: null,
            allWords: [],
            matchedWords: new Set()  // ← Dodaj to
        };
        renderWords();
        renderBoxes();
        document.getElementById('skrzynie-speech-result').textContent = '';
    }



    // Przetwarzanie transkrypcji mowy
    function processVoiceInput(transcript) {
        console.log('🎤 Transkrypcja:', transcript);


        const lowerTranscript = transcript.toLowerCase().trim();
        
        // Spróbuj znaleźć słowo w grze
        let found = false;
        gameState.allWords.forEach(item => {
            if (lowerTranscript.includes(item.word.toLowerCase())) {
                unlockWord(item.word);
                found = true;
            }
        });


        if (!found) {
            if (gameInstance.EngMode === false) gameInstance.showFeedback('❌ Nie znaleziono słowa. Spróbuj ponownie.', '#ef4444');
            else gameInstance.showFeedback('❌ Word not found. Please try again.', '#ef4444');
        }
    }


    // Inicjalizacja
    createGameHTML();
    renderWords();
    renderBoxes();


    // Włącz mikrofon
    gameInstance.customSkrzynieProcessor = processVoiceInput;

    // Ustaw customSkrzynieProcessor dla tej gry
    gameInstance.customSkrzynieProcessor = function(transcript) {
        console.log('🎤 Transkrypcja Skrzynie:', transcript);
        
        const lowerTranscript = transcript.toLowerCase().trim();
        let found = false;
        
        gameState.allWords.forEach(item => {
            if (lowerTranscript.includes(item.word.toLowerCase())) {
                unlockWord(item.word);
                found = true;
            }
        });
        
        if (!found) {
            if (gameInstance.EngMode === false) {
                gameInstance.showFeedback('❌ Nie znaleziono słowa. Spróbuj ponownie.', '#ef4444');
            } else {
                gameInstance.showFeedback('❌ Word not found. Please try again.', '#ef4444');
            }
            // Zwiększ licznik prób
            gameState.skipAttempts = Math.min(gameState.skipAttempts + 1, 3);
            updateSkipButton();
        }
    };
    
    // Dodaj HTML element dla feedback
    gameInstance.SkrzynieGameResult = document.getElementById('skrzynie-speech-result');
        // ===== OBSŁUGA ZMIANY JĘZYKA W REALTIME =====
    function updateLanguageDisplay() {
        const isEnglish = gameInstance.EngMode;
        
        // Ukryj/pokaż elementy PL i ANG
        const plElements = document.querySelectorAll('.pl');
        const angElements = document.querySelectorAll('.ang');
        
        plElements.forEach(el => el.style.display = isEnglish ? 'none' : 'block');
        angElements.forEach(el => el.style.display = isEnglish ? 'block' : 'none');
        
        // Aktualizuj przycisk pomijania
        const skipBtn = document.getElementById('skipBtn');
        if (skipBtn) {
            if (gameState.skipButtonEnabled) {
                skipBtn.textContent = isEnglish ? 'Skip' : 'Pomiń';
            } else {
                skipBtn.textContent = `${isEnglish ? 'Skip' : 'Pomiń'} (${gameState.skipAttempts}/3)`;
            }
        }
        
        console.log('🌐 Język zmieniony na:', isEnglish ? 'ENGLISH' : 'POLSKI');
    }
    
    // Obserwuj zmiany na przycisku angBtn
    function watchLanguageChanges() {
        const angBtn = document.getElementById('angBtn');
        if (angBtn) {
            // Obserwaj zmianę tekstu/klikniętcia
            angBtn.addEventListener('click', () => {
                // Czekaj chwilę aż gameInstance.EngMode się zmieni
                setTimeout(updateLanguageDisplay, 50);
            });
        }
    }
    
    // Wywoaj przy inicjalizacji
    updateLanguageDisplay();
    
    // Wywoaj na koniec
    watchLanguageChanges();

}
