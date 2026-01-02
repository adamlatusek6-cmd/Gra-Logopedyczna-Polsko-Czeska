function initMiniGamePolskoCzeskieKable(gameInstance) {

    // JASNE, KONTRASTOWE KOLORY - KAŻDY INNY
    const CABLE_COLORS = [
        '#FF5722', // Czerwono-pomarańczowy - bardzo jasny
        '#2196F3', // Niebieski - klasyczny
        '#4CAF50', // Zielony - wyraźny
        '#FF9800', // Pomarańczowy - żywy
        '#9C27B0', // Fioletowy - intensywny
        '#607D8B', // Szaro-niebieski - elegancki
        '#795548', // Brązowy - ciepły
        '#E91E63'  // Różowy - wyrazisty
    ];

    // Funkcja do wyboru koloru tekstu (biały/czarny) dla maksymalnego kontrastu
    function getTextColor(backgroundColor) {
        const color = backgroundColor.replace('#', '');
        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);  
        const b = parseInt(color.substr(4, 2), 16);
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return brightness > 140 ? '#000000' : '#ffffff';
    }

    // Funkcja do ściemnienia koloru dla obramowania
    function darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    // PARY SŁÓW Z PRZYPISANYMI KOLORAMI
    const polishCzechPairs = [
        {polish: "dom", czech: "dům", color: CABLE_COLORS[0], name: "czerwony"},
        {polish: "woda", czech: "voda", color: CABLE_COLORS[1], name: "niebieski"},
        {polish: "chleb", czech: "chléb", color: CABLE_COLORS[2], name: "zielony"},
        {polish: "szkoła", czech: "škola", color: CABLE_COLORS[3], name: "pomarańczowy"},
        {polish: "książka", czech: "kniha", color: CABLE_COLORS[4], name: "fioletowy"},
        {polish: "kot", czech: "kočka", color: CABLE_COLORS[5], name: "szaro-niebieski"},
        {polish: "pies", czech: "pes", color: CABLE_COLORS[6], name: "brązowy"},
        {polish: "auto", czech: "auto", color: CABLE_COLORS[7], name: "różowy"}
    ];

    const canvas = document.getElementById('cablesCanvas');
    const ctx = canvas.getContext('2d');
    const polishContainer = document.getElementById('polishCables');
    const czechContainer = document.getElementById('czechCables');
    const resultDiv = document.getElementById('cablesResult');
    const resetBtn = document.getElementById('resetCablesBtn');

    let connections = [];
    let correctConnections = 0;
    let draggedElement = null;
    let currentPairs = [];

    function initGame() {
        // Użyj 6 pierwszych par
        currentPairs = polishCzechPairs.slice(0, Math.min(6, polishCzechPairs.length));
        connections = [];
        correctConnections = 0;
        setupCanvas();
        renderWords();
        resultDiv.textContent = `Połącz wszystkie kable! (0/${currentPairs.length})`;

        console.log('🎮 GRA KABLAMI - INICJALIZACJA:');
        console.log('Pary w grze:', currentPairs.map(p => `${p.polish}-${p.czech}: ${p.name} (${p.color})`));
    }

    function setupCanvas() {
        const container = document.querySelector('.cables-game-container');
        setTimeout(() => {
            const containerRect = container.getBoundingClientRect();
            canvas.width = containerRect.width;
            canvas.height = containerRect.height;
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
        }, 200);
    }

    function renderWords() {
        polishContainer.innerHTML = '';
        czechContainer.innerHTML = '';

        // Pomieszaj kolejność wyświetlania (ale zachowaj pary)
        const polishWords = [...currentPairs].sort(() => Math.random() - 0.5);
        const czechWords = [...currentPairs].sort(() => Math.random() - 0.5);

        polishWords.forEach((pair) => {
            const wordDiv = createWordElement(pair.polish, pair.color, 'polish', pair.czech, pair.name);
            polishContainer.appendChild(wordDiv);
        });

        czechWords.forEach((pair) => {
            const wordDiv = createWordElement(pair.czech, pair.color, 'czech', pair.polish, pair.name);
            czechContainer.appendChild(wordDiv);
        });
    }

    function createWordElement(word, color, language, matchWord, colorName) {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'cable-word';
        wordDiv.textContent = word;

        // USTAW KOLORY BEZPOŚREDNIO I WYMUŚ ICH ZASTOSOWANIE
        const textColor = getTextColor(color);
        const borderColor = darkenColor(color, 30);

        wordDiv.style.setProperty('background-color', color, 'important');
        wordDiv.style.setProperty('border-color', borderColor, 'important');
        wordDiv.style.setProperty('color', textColor, 'important');

        wordDiv.dataset.word = word;
        wordDiv.dataset.match = matchWord;
        wordDiv.dataset.language = language;
        wordDiv.dataset.baseColor = color;
        wordDiv.dataset.colorName = colorName;

        // Drag and drop
        wordDiv.draggable = true;
        wordDiv.addEventListener('dragstart', handleDragStart);
        wordDiv.addEventListener('dragend', handleDragEnd);
        wordDiv.addEventListener('dragover', handleDragOver);
        wordDiv.addEventListener('drop', handleDrop);

        console.log(`✅ Utworzono element: "${word}" (${colorName}) - kolor: ${color}, tekst: ${textColor}`);
        return wordDiv;
    }

    function handleDragStart(e) {
        draggedElement = e.target;
        e.target.classList.add('dragging');
        console.log(`🔗 Przeciąganie: ${e.target.textContent} (${e.target.dataset.colorName})`);
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
        draggedElement = null;
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        if (!draggedElement || e.target === draggedElement) return;

        // 🔒 BLOKADA: Jeśli element już jest połączony, przerwij
        if (draggedElement.classList.contains('connected') || e.target.classList.contains('connected')) {
            console.log('⚠️ Jeden z elementów jest już połączony!');
            return;
        }

        const draggedWord = draggedElement.dataset.word;
        const draggedMatch = draggedElement.dataset.match;
        const targetWord = e.target.dataset.word;
        const targetMatch = e.target.dataset.match;

        console.log(`🎯 Próba połączenia: ${draggedWord} -> ${targetWord}`);

        if (draggedMatch === targetWord || targetMatch === draggedWord) {
            makeConnection(draggedElement, e.target, true);
            console.log(`✅ POPRAWNE połączenie: ${draggedWord} ↔ ${targetWord}`);
        } else {
            makeConnection(draggedElement, e.target, false);
            console.log(`❌ BŁĘDNE połączenie: ${draggedWord} ↔ ${targetWord}`);
        }
    }

    function makeConnection(element1, element2, isCorrect) {
        if (isCorrect) {
            element1.classList.add('correct', 'connected');
            element2.classList.add('correct', 'connected');
            correctConnections++;

            connections.push({
                element1: element1,
                element2: element2,
                color: element1.dataset.baseColor,
                correct: true
            });

            resultDiv.textContent = `🎉 Świetnie! Połączono ${correctConnections}/${currentPairs.length}`;
            resultDiv.style.color = '#4CAF50';
            resultDiv.style.fontWeight = 'bold';

            if (correctConnections === currentPairs.length) {
                setTimeout(() => {
                    resultDiv.textContent = "🏆 GRATULACJE! Wszystkie kable połączone!";
                    resultDiv.style.fontSize = '20px';
                    gameInstance.hint4Unlocked = true;
                    if(gameInstance.EngMode === false) customAlert.success("🎊 Wszystkie kable połączone! Odblokowano nową wskazówkę!");
                    else customAlert.success1("🎊 All cables connected! New hint unlocked!");                }, 1000);
            }
        } else {
            element1.classList.add('incorrect');
            element2.classList.add('incorrect');
            setTimeout(() => {
                element1.classList.remove('incorrect');
                element2.classList.remove('incorrect');
            }, 1500);
        }
        drawConnections();
    }

    function drawConnections() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const container = document.querySelector('.cables-game-container');
        const containerRect = container.getBoundingClientRect();

        connections.forEach(conn => {
            if (conn.correct) {
                const rect1 = conn.element1.getBoundingClientRect();
                const rect2 = conn.element2.getBoundingClientRect();

                const x1 = rect1.right - containerRect.left;
                const y1 = (rect1.top + rect1.height/2) - containerRect.top;
                const x2 = rect2.left - containerRect.left;
                const y2 = (rect2.top + rect2.height/2) - containerRect.top;

                // Sprawdź granice
                if (x1 >= 0 && x1 <= canvas.width && x2 >= 0 && x2 <= canvas.width &&
                    y1 >= 0 && y1 <= canvas.height && y2 >= 0 && y2 <= canvas.height) {

                    // Rysuj grubą linię kabla
                    ctx.beginPath();
                    ctx.strokeStyle = conn.color;
                    ctx.lineWidth = 8;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';

                    // Dodaj cień
                    ctx.shadowColor = 'rgba(0,0,0,0.5)';
                    ctx.shadowBlur = 6;
                    ctx.shadowOffsetX = 3;
                    ctx.shadowOffsetY = 3;

                    // Rysuj krzywą linię
                    const midX = (x1 + x2) / 2;
                    const curve = Math.abs(y2 - y1) * 0.2;
                    ctx.moveTo(x1, y1);
                    ctx.quadraticCurveTo(midX, y1 - curve, midX, (y1 + y2) / 2);
                    ctx.quadraticCurveTo(midX, y2 + curve, x2, y2);
                    ctx.stroke();

                    // Resetuj cień
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                }
            }
        });
    }

    function resetGame() {
        console.log('🔄 RESET GRY');
        document.querySelectorAll('.cable-word').forEach(word => {
            word.classList.remove('connected', 'correct', 'incorrect');
        });
        connections = [];
        correctConnections = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        resultDiv.style.color = '';
        resultDiv.style.fontWeight = '';
        resultDiv.style.fontSize = '';
        renderWords();
        resultDiv.textContent = `Połącz wszystkie kable! (0/${currentPairs.length})`;
    }

    // Inicjalizacja
    console.log('🚀 URUCHOMIENIE GRY KABLAMI');
    initGame();
    resetBtn.onclick = resetGame;
    window.addEventListener('resize', setupCanvas);
}