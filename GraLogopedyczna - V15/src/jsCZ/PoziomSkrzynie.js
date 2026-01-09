function initPoziomSkrzynie(gameInstance) {
    console.log('🎮 INICIALIZACE ÚROVNĚ SKŘÍNÍ');


    let zablokowana = true;
    if (gameInstance.hint3Unlocked === true) {
        zablokowana = false;
    }
    // Dane - słowa i ich kategorie (skrzynie)
    const boxCategories = [
        {
            id: 'animals',
            name: 'Elektronické prvky',
            color: '#FF6B6B',
            image: 'assets/images/SkrzynieGra/sk-pusta.png',
            words: ['integrovaný obvod', 'senzor', 'kondenzátor', 'rezistor'],
            locked: zablokowana
        },
        {
            id: 'fruits',
            name: 'Technické procesy',
            color: '#4ECDC4',
            image: 'assets/images/SkrzynieGra/sk-pusta.png',
            words: ['synchronizace', 'přenos', 'komprese', 'kalibrace'],
            locked: zablokowana
        },
        {
            id: 'colors',
            name: 'Napájení',
            color: '#A8E6CF',
            image: 'assets/images/SkrzynieGra/sk-pusta.png',
            words: ['baterie', 'akumulátor', 'zdroj', 'zásuvka'],
            locked: zablokowana
        },
        {
            id: 'objects',
            name: 'Programování',
            color: '#E0BBE4',
            image: 'assets/images/SkrzynieGra/sk-pusta.png',
            words: ['kód', 'algoritmus', 'smyčka', 'funkce'],
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

    function createGameHTML() {
        const gameContainer = document.getElementById('gameScreenSkrzynie');
        if (!gameContainer) return;

        const gameContent = document.createElement('div');
        gameContent.className = 'skrzynie-game-container';
        gameContent.innerHTML = `
            <div class="skrzynie-header">
                <h2 class="levels-instructions pl">Třídění do skříní</h2>
                <h2 class="levels-instructions ang">Box sorting</h2>
                <p class="level-hints pl">Vyslov každé slovo, aby ho odemkl, a pak jej přetáhni do správné kategorie</p>
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
                <button id="skipBtn" class="btn btn-outline" disabled>Přeskoč (0/3)</button>
                <button id="backBtnSkrzynie" class="btn btn-secondary pl">Zpět</button>
                <button id="backBtnSkrzynie1" class="btn btn-secondary ang">Back</button>
            </div>
        `;

        gameContainer.innerHTML = gameContent.innerHTML;

        document.getElementById('backBtnSkrzynie').addEventListener('click', () => {
            gameInstance.returnToFactory();
        });
        document.getElementById('backBtnSkrzynie1').addEventListener('click', () => {
            gameInstance.returnToFactory();
        });
        document.getElementById('skipBtn').addEventListener('click', handleSkipButton);
    }

    function renderWords() {
        const container = document.getElementById('wordsContainer');

        if (gameState.allWords.length === 0) {
            container.innerHTML = '';

            gameState.allWords = [];
            boxCategories.forEach(category => {
                category.words.forEach(word => {
                    gameState.allWords.push({ word, categoryId: category.id, categoryName: category.name });
                });
            });

            gameState.allWords.sort(() => Math.random() - 0.5);
        }

        updateSkipButton();

        gameState.allWords.forEach((item, idx) => {
            let wordDiv = document.getElementById(`word-${idx}`);

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
                    const newWordDiv = wordDiv.cloneNode(true);
                    wordDiv.parentNode.replaceChild(newWordDiv, wordDiv);
                    wordDiv = newWordDiv;

                    wordDiv.addEventListener('dragstart', handleDragStart);
                    wordDiv.addEventListener('dragend', handleDragEnd);
                }
            } else {
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

            if (isLocked) {
                boxDiv.classList.add('locked');
            }

            boxDiv.addEventListener('dragover', handleDragOver);
            boxDiv.addEventListener('drop', (e) => handleDrop(e, category.id));

            container.appendChild(boxDiv);

            updateBoxContent(category.id);
        });
    }

    function updateBoxContent(categoryId) {
        const contentDiv = document.getElementById(`box-content-${categoryId}`);
        if (!contentDiv) return;

        const matched = gameState.matchedPairs.filter(p => p.categoryId === categoryId);
        contentDiv.innerHTML = matched.map(p => `
            <div class="box-word-item">${p.word}</div>
        `).join('');
    }

    function unlockWord(wordText) {
        const wordExists = gameState.allWords.some(w => w.word.toLowerCase() === wordText.toLowerCase());
        if (!wordExists) {
            if (gameInstance.EngMode === false) {
                gameInstance.showFeedback('Toto slovo není ve hře. Zkuste znovu.', '#ef4444');
            } else {
                gameInstance.showFeedback('This word is not in the game. Please try again.', '#ef4444');
            }
            gameState.skipAttempts = Math.min(gameState.skipAttempts + 1, 3);
            updateSkipButton();
            return false;
        }

        else if (gameState.unlockedWords.includes(wordText)) {
            if (gameInstance.EngMode === false) {
                gameInstance.showFeedback(`Slovo "${wordText}" je již odemčeno!`, '#f59e0b');
            } else {
                gameInstance.showFeedback(`The word "${wordText}" is already unlocked!`, '#f59e0b');
            }
            return false;
        }

        else {
            gameState.unlockedWords.push(wordText);
            if (gameInstance.EngMode === false) {
                gameInstance.showFeedback(`Slovo "${wordText}" odemčeno! Nyní jej můžeš přesunout.`, '#10b981');
            } else {
                gameInstance.showFeedback(`The word "${wordText}" is unlocked! You can now move it.`, '#10b981');
            }
            renderWords();
            return true;
        }
    }

    function handleSkipButton() {
        if (!gameState.skipButtonEnabled || gameState.skipAttempts < 3) {
            return;
        }

        const firstLockedWord = gameState.allWords.find(item =>
            !gameState.unlockedWords.includes(item.word) &&
            !gameState.matchedWords.has(item.word)
        );

        if (firstLockedWord) {
            unlockWord(firstLockedWord.word);
            gameState.skipButtonEnabled = false;
            updateSkipButton();

            if (gameInstance.EngMode === false) {
                gameInstance.showFeedback(`Slovo "${firstLockedWord.word}" bylo odemčeno tlačítkem Přeskoč!`, '#10b981');
                gameState.skipAttempts = 0;
                updateSkipButton()
            } else {
                gameInstance.showFeedback(`Word "${firstLockedWord.word}" unlocked with Skip button!`, '#10b981');
            }
        }
    }

    function updateSkipButton() {
        const skipBtn = document.getElementById('skipBtn');
        if (!skipBtn) return;

        if (gameState.skipAttempts >= 3 && !gameState.skipButtonEnabled) {
            gameState.skipButtonEnabled = true;
            skipBtn.disabled = false;
            skipBtn.textContent = gameInstance.EngMode === false ? 'Přeskoč' : 'Skip';
            skipBtn.classList.remove('disabled');
        } else {
            gameState.skipButtonEnabled = false;
            skipBtn.disabled = true;
            skipBtn.textContent = `${gameInstance.EngMode === false ? 'Přeskoč' : 'Skip'} (${gameState.skipAttempts}/3)`;
            skipBtn.classList.add('disabled');
        }
    }

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

        if (gameState.unlockedBoxes.has(categoryId) === false && boxCategories.find(b => b.id === categoryId).locked) {
            if (gameInstance.EngMode === false) gameInstance.showFeedback('🔒 Tato skřín je zamčena! Nejdřív ji odemkni.', '#ef4444');
            else gameInstance.showFeedback('🔒 This box is locked! Unlock it first.', '#ef4444');
            return;
        }

        const wordText = gameState.draggedWord.dataset.word;
        const correctCategoryId = gameState.draggedWord.dataset.categoryId;

        if (correctCategoryId === categoryId) {
            const pair = { word: wordText, categoryId };

            if (!gameState.matchedPairs.find(p => p.word === wordText)) {
                gameState.matchedPairs.push(pair);
                gameState.matchedWords.add(wordText);

                if (gameInstance.EngMode === false) gameInstance.showFeedback(`✅ Skvěle! "${wordText}" došlo do "${boxCategories.find(b => b.id === categoryId).name}"`, '#10b981');
                else gameInstance.showFeedback(`✅ Great! "${wordText}" went to "${boxCategories.find(b => b.id === categoryId).name}"`, '#10b981');

                gameState.draggedWord.style.opacity = '0.5';
                gameState.draggedWord.classList.add('matched');
                gameState.draggedWord.draggable = false;

                updateBoxContent(categoryId);

                if (gameState.matchedPairs.length === gameState.allWords.length) {
                    endSkrzynieGame();
                }
            }
        } else {
            if (gameInstance.EngMode === false) gameInstance.showFeedback('❌ Toto není správná kategorie! Zkuste znovu.', '#ef4444');
            else gameInstance.showFeedback('❌ This is not the correct category! Try again.', '#ef4444');
        }
    }

    function endSkrzynieGame() {
        if (gameInstance.EngMode === false) gameInstance.showFeedback('🏆 Gratulace! Všechna slova byla správně roztříděna!', '#10b981');
        else gameInstance.showFeedback('🏆 Congratulations! All words have been correctly sorted!', '#10b981');
        gameInstance.addPoints(1000);
        document.getElementById('machineBtn4').style.display = 'none';
        document.getElementById('skrzynia-nap').style.display = 'block';
        document.getElementById('badge7').style.display = 'block';
        document.getElementById('machineBtn3').style.display = 'block';
        if (gameInstance.EngMode === false) {
            DialogSystem.showSequence([
                { speakerId: 'info', text: 'Náhle se v celé továrně ozývá hlasitý hlas:' },
                { speakerId: null, text: 'Skončí se vám mluvy! Skoro já nemůžu mluvit správně, nikdo nebude!' },
                { speakerId: 'wlascicel', text: 'On je někde tady... ale kde?! Tam hned u robota!' },
            ]);
        } else {
            DialogSystem.showSequence([
                { speakerId: 'info1', text: 'Suddenly, a loud voice echoes throughout the factory:' },
                { speakerId: null, text: 'Your talking is over! If I can\'t speak properly, no one will!' },
                { speakerId: 'owner', text: 'He\'s somewhere here... but where?! Right there by the robot!' },
            ]);
        }

        setTimeout(() => {
            gameInstance.returnToFactory();
        }, 2500);
    }

    function resetGame() {
        gameState = {
            unlockedWords: [],
            matchedPairs: [],
            draggedWord: null,
            allWords: [],
            matchedWords: new Set()
        };
        renderWords();
        renderBoxes();
        document.getElementById('skrzynie-speech-result').textContent = '';
    }

    function processVoiceInput(transcript) {
        console.log('🎤 Transkripce:', transcript);

        const lowerTranscript = transcript.toLowerCase().trim();

        let found = false;
        gameState.allWords.forEach(item => {
            if (lowerTranscript.includes(item.word.toLowerCase())) {
                unlockWord(item.word);
                found = true;
            }
        });

        if (!found) {
            if (gameInstance.EngMode === false) gameInstance.showFeedback('❌ Slovo nebylo nalezeno. Zkuste znovu.', '#ef4444');
            else gameInstance.showFeedback('❌ Word not found. Please try again.', '#ef4444');
        }
    }

    createGameHTML();
    renderWords();
    renderBoxes();

    gameInstance.customSkrzynieProcessor = function (transcript) {
        console.log('🎤 Transkripce Skříní:', transcript);

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
                gameInstance.showFeedback('❌ Slovo nebylo nalezeno. Zkuste znovu.', '#ef4444');
            } else {
                gameInstance.showFeedback('❌ Word not found. Please try again.', '#ef4444');
            }
            gameState.skipAttempts = Math.min(gameState.skipAttempts + 1, 3);
            updateSkipButton();
        }
    };

    gameInstance.SkrzynieGameResult = document.getElementById('skrzynie-speech-result');

    function updateLanguageDisplay() {
        const isEnglish = gameInstance.EngMode;

        const plElements = document.querySelectorAll('.pl');
        const angElements = document.querySelectorAll('.ang');

        plElements.forEach(el => el.style.display = isEnglish ? 'none' : 'block');
        angElements.forEach(el => el.style.display = isEnglish ? 'block' : 'none');

        const skipBtn = document.getElementById('skipBtn');
        if (skipBtn) {
            if (gameState.skipButtonEnabled) {
                skipBtn.textContent = isEnglish ? 'Skip' : 'Přeskoč';
            } else {
                skipBtn.textContent = `${isEnglish ? 'Skip' : 'Přeskoč'} (${gameState.skipAttempts}/3)`;
            }
        }

        console.log('🌐 Jazyk změněn na:', isEnglish ? 'ENGLISH' : 'ČESKÝ');
    }

    function watchLanguageChanges() {
        const angBtn = document.getElementById('angBtn');
        if (angBtn) {
            angBtn.addEventListener('click', () => {
                setTimeout(updateLanguageDisplay, 50);
            });
        }
    }

    updateLanguageDisplay();
    watchLanguageChanges();
}
