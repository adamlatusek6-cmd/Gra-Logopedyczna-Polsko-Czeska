function initPoziomSkrzynie(gameInstance) {
    console.log('🎮 INICJALIZACJA POZIOMU SKRZYNI');


    // Dane - słowa i ich kategorie (skrzynie)
    const boxCategories = [
        {
            id: 'animals',
            name: 'Zwierzęta',
            color: '#FF6B6B',
            image: 'assets/images/SkrzynieGra/sk-pusta.png',
            words: ['kot', 'pies', 'ptak', 'ryba']
        },
        {
            id: 'fruits',
            name: 'Owoce',
            color: '#4ECDC4',
            image: 'assets/images/SkrzynieGra/sk-pusta.png',
            words: ['jabłko', 'pomarańcza', 'banan', 'gruszka']
        },
        {
            id: 'colors',
            name: 'Kolory',
            color: '#FFE66D',
            image: 'assets/images/SkrzynieGra/sk-pusta.png',
            words: ['czerwony', 'niebieski', 'zielony', 'żółty']
        },
        {
            id: 'objects',
            name: 'Przedmioty',
            color: '#95E1D3',
            image: 'assets/images/SkrzynieGra/sk-pusta.png',
            words: ['ołówek', 'książka', 'stół', 'krzesło']
        }
    ];


    let gameState = {
        unlockedWords: [],
        matchedPairs: [],
        draggedWord: null,
        allWords: [],
        matchedWords: new Set()
    };


    // Vytvoření HTML struktury
    function createGameHTML() {
        const gameContainer = document.getElementById('gameScreenSkrzynie');
        if (!gameContainer) return;


        const gameContent = document.createElement('div');
        gameContent.className = 'skrzynie-game-container';
        gameContent.innerHTML = `
            <div class="skrzynie-header">
                <h2 class="levels-instructions">Sortowanie do Skrzyń</h2>
                <p class="level-hints">Wypowiedz każde słowo, aby je odblokować, a następnie przeciągnij do właściwej kategorii</p>
            </div>
            
            <div class="skrzynie-main">
                <div class="skrzynie-words-container" id="wordsContainer"></div>
                <div class="skrzynie-boxes-container" id="boxesContainer"></div>
            </div>
            
            <p id="skrzynie-speech-result" class="speech-feedback"></p>
            
            <div class="skrzynie-controls">
                <button id="resetSkrzynieBtn" class="btn btn-secondary">Reset gry</button>
                <button id="backBtnSkrzynie" class="btn btn-secondary">Powrót do fabryki</button>
            </div>
        `;


        gameContainer.innerHTML = gameContent.innerHTML;


        // Event listenery
        document.getElementById('backBtnSkrzynie').addEventListener('click', () => {
            gameInstance.returnToFactory();
        });


        document.getElementById('resetSkrzynieBtn').addEventListener('click', resetGame);
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
        // Jeśli to update, tylko odśwież elementy DOM
        // Nie mieszaj i nie zmieniaj kolejności
    }

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


            boxDiv.innerHTML = `
                <div class="box-wrapper" style="background-image: url('${category.image}');">
                    <div class="box-content" id="box-content-${category.id}"></div>
                    <div class="box-category-label">${category.name}</div>
                </div>
            `;




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
            gameInstance.showFeedback('❌ Tego słowa nie ma w grze. Spróbuj ponownie.', '#ef4444');
            return false;
        }


        // Sprawdź czy nie jest już odblokowane
        else if (gameState.unlockedWords.includes(wordText)) {
            gameInstance.showFeedback(`⚠️ Słowo "${wordText}" jest już odblokowane!`, '#f59e0b');
            return false;
        }


        // Odblokuj słowo
        else{
            gameState.unlockedWords.push(wordText);
            gameInstance.showFeedback(`🔓 Słowo "${wordText}" odblokowane! Teraz możesz je przesunąć.`, '#10b981');
        }

        renderWords();
        return true;
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
                
                gameInstance.showFeedback(`✅ Świetnie! "${wordText}" trafiło do "${boxCategories.find(b => b.id === categoryId).name}"`, '#10b981');
                

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
            gameInstance.showFeedback('❌ To nie jest właściwa kategoria! Spróbuj jeszcze raz.', '#ef4444');
        }
    }



    // Koniec gry
    function endSkrzynieGame() {
        gameInstance.showFeedback('🏆 Gratulacje! Wszystkie słowa zostały prawidłowo posortowane!', '#10b981');
        gameInstance.addPoints(3200);
        
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
            gameInstance.showFeedback('❌ Nie znaleziono słowa. Spróbuj ponownie.', '#ef4444');
        }
    }


    // Inicjalizacja
    createGameHTML();
    renderWords();
    renderBoxes();


    // Włącz mikrofon
    gameInstance.customSkrzynieProcessor = processVoiceInput;


    console.log('✅ Poziom Skrzyni zainicjalizowany');
}
