// ===== LABIRYNT - PEŁNA INTEGRACJA Z GRĄ =====
// Dodaj ten plik do skryptów HTML w sekcji <script>

function initMazeGame(gameInstance) {
    console.log('🎮 INICJALIZACJA LABIRYNTU');

    const mazeContainer = document.getElementById('gameScreenMaze');
    if (!mazeContainer) return;

    // DANE LABIRYNTU
    const MAZE_WIDTH = 15;
    const MAZE_HEIGHT = 15;
    const CELL_SIZE = 30;
    let skippedWords = 0;
    let skipBool=false;
    
    // ŚCIEŻKA DO OBRAZKA TŁA - WKLEJ TUTAJ SWOJĄ ŚCIEŻKĘ
    const BACKGROUND_IMAGE_PATH = 'assets/images/lab.png'; // ZMIEŃ NA SWOJĄ ŚCIEŻKĘ
    
    // ŚCIEŻKA DO GRAFIKI ROBOTA - WKLEJ TUTAJ SWOJĄ ŚCIEŻKĘ
    const PLAYER_IMAGE_PATH = 'assets/images/robot-mini.png'; // ZMIEŃ NA SWOJĄ ŚCIEŻKĘ
    
    // STATYCZNY LABIRYNT - Zmień tutaj kształt labiryntu
    // STATYCZNY LABIRYNT - Zmień tutaj kształt labiryntu
    const STATIC_MAZE = [
        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
        [1,0,1,1,1,1,1,0,0,0,1,1,1,1,1],
        [1,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
        [1,1,1,0,0,1,1,1,1,1,1,0,1,1,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,0,0,0,1,1,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
        [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
        [1,1,1,0,1,0,0,0,0,0,1,0,1,1,1],
        [1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    // 20 SŁÓW DO LOSOWANIA
    const ALL_WORDS = [
    'kabel', 'sensor', 'zwora', 'prąd', 'sygnał',
    'części', 'przełącznik', 'obwód', 'maszyna', 'drut',
    'luz', 'rura', 'przewód', 'klucz', 'wał',
    'węzeł', 'tarcza', 'zawór', 'przepustka', 'śruba',
    'sprzęgło', 'łańcuch', 'koło', 'trzpień', 'iglica',
    'złącze', 'rozrusznik', 'bateria', 'cewka', 'filtr',
    'tłumik', 'zawias', 'sprężyna', 'opaska', 'łożysko',
    'dysza', 'dławik', 'wirnik', 'rotor', 'stator'
    ];
    
    let mazeState = {
        playerX: 13,
        playerY: 5,
        goalX: 1,
        goalY: 0,
        completed: false,
        moves: 0,
        availableMoves: [],
        backgroundImage: null
    };

    // Funkcja do załadowania obrazka tła
    function loadBackgroundImage() {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function() {
                mazeState.backgroundImage = img;
                resolve(true);
            };
            img.onerror = function() {
                console.warn('⚠️ Nie udało się załadować obrazka tła. Kontynuuję bez tła.');
                resolve(false);
            };
            img.src = BACKGROUND_IMAGE_PATH;
        });
    }

    // Funkcja do załadowania grafiki robota
    function loadPlayerImage() {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function() {
                mazeState.playerImage = img;
                resolve(true);
            };
            img.onerror = function() {
                console.warn('⚠️ Nie udało się załadować grafiki robota. Będzie domyślny niebieski krąg.');
                resolve(false);
            };
            img.src = PLAYER_IMAGE_PATH;
        });
    }

    // Funkcja do generowania dostępnych ruchów z losowymi słowami
    function generateAvailableMoves() {
        const available = [];
        const directions = [
            { dx: 0, dy: -1, direction: 'up' },      // góra
            { dx: 0, dy: 1, direction: 'down' },     // dół
            { dx: -1, dy: 0, direction: 'left' },    // lewo
            { dx: 1, dy: 0, direction: 'right' }     // prawo
        ];

        // Zbierz wszystkie możliwe ruchy
        for (let dir of directions) {
            const newX = mazeState.playerX + dir.dx;
            const newY = mazeState.playerY + dir.dy;
            
            if (newX >= 0 && newX < MAZE_WIDTH && 
                newY >= 0 && newY < MAZE_HEIGHT && 
                STATIC_MAZE[newY][newX] === 0) {
                available.push(dir);
            }
        }

        // Wybierz losowe słowa dla dostępnych ruchów
        const shuffledWords = [...ALL_WORDS].sort(() => Math.random() - 0.5);
        
        return available.map((dir, index) => ({
            ...dir,
            word: shuffledWords[index]
        }));
    }

    // Rysowanie labiryntu z tłem
    function drawMaze() {
        const canvas = document.getElementById('mazeCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const canvasWidth = MAZE_WIDTH * CELL_SIZE;
        const canvasHeight = MAZE_HEIGHT * CELL_SIZE;
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Rysuj tło (obrazek labiryntu)
        if (mazeState.backgroundImage) {
            ctx.drawImage(
                mazeState.backgroundImage,
                0,
                0,
                canvasWidth,
                canvasHeight
            );
        } else {
            // Fallback - szary ekran jeśli brak obrazka
            ctx.fillStyle = '#e5e7eb';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }

        // LABIRYNT JEST GENEROWANY ALE NIEWIDOCZNY - Używamy go tylko do kolizji
        // Nie rysujemy ścian labiryntu (ctx.fillRect dla ścian jest wyłączony)

        // CEL (skarb) - rysuj na wierzchu, ale pod graczem
        ctx.fillStyle = '#10b981';
        ctx.fillRect(mazeState.goalX * CELL_SIZE, mazeState.goalY * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        
        // Cień pod skarbem
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(
            (mazeState.goalX + 0.5) * CELL_SIZE,
            (mazeState.goalY + 0.8) * CELL_SIZE,
            CELL_SIZE / 2.5,
            CELL_SIZE / 4,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Ikona skarbu (złota gwiazda)
        drawStar(ctx, 
            (mazeState.goalX + 0.5) * CELL_SIZE, 
            (mazeState.goalY + 0.5) * CELL_SIZE, 
            5, 
            12, 
            8, 
            '#FFD700'
        );

        // GRACZ - rysuj na samym wierzchu
        const playerScreenX = (mazeState.playerX + 0.5) * CELL_SIZE;
        const playerScreenY = (mazeState.playerY + 0.5) * CELL_SIZE;
        const playerSize = CELL_SIZE;

        // Cień pod graczem
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.beginPath();
        ctx.ellipse(
            playerScreenX,
            playerScreenY + CELL_SIZE * 0.3,
            playerSize / 2.3,
            CELL_SIZE / 4,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Rysuj grafikę robota
        if (mazeState.playerImage) {
            ctx.drawImage(
                mazeState.playerImage,
                playerScreenX - playerSize / 2,
                playerScreenY - playerSize / 2,
                playerSize,
                playerSize
            );
        } else {
            // Fallback - domyślny niebieski krąg jeśli brak grafiki
            ctx.fillStyle = '#3b82f6';
            ctx.beginPath();
            ctx.arc(playerScreenX, playerScreenY, CELL_SIZE / 2.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#1e40af';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // Rysuj słowa dookoła gracza (na samym wierzchu)
        drawWordsAroundPlayer(ctx);

        // Licznik ruchów
        document.getElementById('mazeMoves').textContent = `Ruchy: ${mazeState.moves}`;
    }

    // Funkcja rysowania gwiazdy (ikona skarbu)
    function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
            rot += step;
            ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
            rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        
        // Cień gwiazdy
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }

    // Rysowanie słów wokół gracza
    function drawWordsAroundPlayer(ctx) {
        mazeState.availableMoves = generateAvailableMoves();
        
        const playerScreenX = (mazeState.playerX + 0.5) * CELL_SIZE;
        const playerScreenY = (mazeState.playerY + 0.5) * CELL_SIZE;
        const distance = 45;

        mazeState.availableMoves.forEach(move => {
            let textX, textY, textAlign, textBaseline;

            if (move.direction === 'up') {
                textX = playerScreenX;
                textY = playerScreenY - distance;
                textAlign = 'center';
                textBaseline = 'middle';
            } else if (move.direction === 'down') {
                textX = playerScreenX;
                textY = playerScreenY + distance;
                textAlign = 'center';
                textBaseline = 'middle';
            } else if (move.direction === 'left') {
                textX = playerScreenX - distance;
                textY = playerScreenY;
                textAlign = 'center';
                textBaseline = 'middle';
            } else if (move.direction === 'right') {
                textX = playerScreenX + distance;
                textY = playerScreenY;
                textAlign = 'center';
                textBaseline = 'middle';
            }

            // Rysuj tło dla słowa
            ctx.fillStyle = 'rgba(59, 130, 246, 0.95)';
            ctx.strokeStyle = 'rgba(37, 99, 235, 1)';
            ctx.lineWidth = 1.5;

            const textMetrics = ctx.measureText(move.word.toUpperCase());
            const textWidth = textMetrics.width;
            const textHeight = 16;
            const padding = 5;

            let rectX = textX - (textWidth / 2 + padding);
            let rectY = textY - (textHeight / 2 + padding);

            // Rysuj zaokrąglony prostokąt
            ctx.beginPath();
            ctx.roundRect(rectX, rectY, textWidth + padding * 2, textHeight + padding * 2, 5);
            ctx.fill();
            ctx.stroke();

            // Rysuj tekst
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = textAlign;
            ctx.textBaseline = textBaseline;
            ctx.fillText(move.word.toUpperCase(), textX, textY);
        });
    }

    // Poruszanie graczem
    function movePlayer(dx, dy, wordUsed) {
        const newX = mazeState.playerX + dx;
        const newY = mazeState.playerY + dy;

        if (newX >= 0 && newX < MAZE_WIDTH && 
            newY >= 0 && newY < MAZE_HEIGHT && 
            STATIC_MAZE[newY][newX] === 0) {
            
            mazeState.playerX = newX;
            mazeState.playerY = newY;
            if(skipBool===true){
                skippedWords++;
                skipBool=false;
            }
            mazeState.moves++;

            gameInstance.showFeedback(`➡️ Wybrałeś "${wordUsed.toUpperCase()}"`, '#3b82f6');
            error=0;

            if (mazeState.playerX === mazeState.goalX && 
                mazeState.playerY === mazeState.goalY) {
                completeMaze();
            }

            drawMaze();
        }
    }

    // Obsługiwanie poleceń głosowych
    gameInstance.processMazeCommand = function(transcript) {
        const t = transcript.toLowerCase().trim();
        
        const matchedMove = mazeState.availableMoves.find(move => 
            t.includes(move.word)
        );

        if (matchedMove) {
            movePlayer(matchedMove.dx, matchedMove.dy, matchedMove.word);
        } else {
            gameInstance.showFeedback('❌ To słowo nie jest dostępne. Spróbuj innego.', '#ef4444');
            if(error<3){
                error++;
                if(error===3){
                    gameInstance.showFeedback('💡 Podpowiedź: Kliknij na słowo, aby się poruszyć i je pominąć.', '#f59e0b');
                }
            }
            
        }
    };

    function completeMaze() {
        mazeState.completed = true;
        const pointsEarned = Math.max(100, 500 - ((mazeState.moves-skippedWords) * 2));
        
        gameInstance.addPoints(pointsEarned);
        gameInstance.showFeedback(`✅ Wygrałeś! +${pointsEarned} pkt (${mazeState.moves} ruchów)`, '#10b981');
        gameInstance.disableMicrophone();

        setTimeout(() => {
            gameInstance.endMazeGame();
        }, 2000);
    }

    function resetMaze() {
        mazeState.playerX = 13;
        mazeState.playerY = 5;
        mazeState.moves = 0;
        mazeState.completed = false;
        drawMaze();
    }

    // Inicjalizacja HTML
    mazeContainer.innerHTML = `
        <div class="maze-game-wrapper">
            <canvas id="mazeCanvas" style="border: 2px solid #1f2937; margin: 20px auto; display: block; background: white; cursor: pointer;"></canvas>
            <div id="mazeSpeechResult" class="speech-feedback" style="text-align: center; margin-top: 10px;"></div>
            <button id="resetMazeBtn" class="btn btn-secondary pl" style="margin-top: 15px;">Resetuj</button>
            <button id="resetMazeBtn1" class="btn btn-secondary ang" style="margin-top: 15px;">Reset</button>
            <button id="backMazeBtn" class="btn btn-secondary pl">Powrót</button>
            <button id="backMazeBtn1" class="btn btn-secondary ang">Back</button>
        </div>
    `;
    updateLanguageDisplay();
    watchLanguageChanges();

    // Event listenery na canvas dla kliknięć
    let error=0;
    const canvas = document.getElementById('mazeCanvas');
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        const playerScreenX = (mazeState.playerX + 0.5) * CELL_SIZE;
        const playerScreenY = (mazeState.playerY + 0.5) * CELL_SIZE;
        const distance = 45;

        // Sprawdzaj każdy dostępny ruch
        mazeState.availableMoves.forEach(move => {
            let textX, textY;

            if (move.direction === 'up') {
                textX = playerScreenX;
                textY = playerScreenY - distance;
            } else if (move.direction === 'down') {
                textX = playerScreenX;
                textY = playerScreenY + distance;
            } else if (move.direction === 'left') {
                textX = playerScreenX - distance;
                textY = playerScreenY;
            } else if (move.direction === 'right') {
                textX = playerScreenX + distance;
                textY = playerScreenY;
            }

            const tolerance = 25;
            if (Math.abs(clickX - textX) < tolerance && Math.abs(clickY - textY) < tolerance) {
                if(error===3){
                    error=0;
                    skipBool=true;
                    movePlayer(move.dx, move.dy, move.word);
                }
            }
        });
    });

    document.getElementById('resetMazeBtn').addEventListener('click', resetMaze);
    document.getElementById('resetMazeBtn1').addEventListener('click', resetMaze);
    document.getElementById('backMazeBtn').addEventListener('click', () => {
        gameInstance.returnToFactory();
    });
    document.getElementById('backMazeBtn1').addEventListener('click', () => {
        gameInstance.returnToFactory();
    });

    // Załaduj obrazki i rysuj labirynt
    Promise.all([loadBackgroundImage(), loadPlayerImage()]).then(() => {
        setTimeout(() => drawMaze(), 100);
    });

    return mazeState;
    // OBSŁUGA ZMIANY JĘZYKA W REALTIME (IDENTYCZNA JAK W PoziomSkrzynie.js)
    function updateLanguageDisplay() {
        const isEnglish = gameInstance.EngmMode;
        
        // Ukryj/pokaż elementy PL i ANG
        const plElements = document.querySelectorAll('.pl');
        const angElements = document.querySelectorAll('.ang');
        
        plElements.forEach(el => {
            el.style.display = isEnglish ? 'none' : 'block';
        });
        angElements.forEach(el => {
            el.style.display = isEnglish ? 'block' : 'none';
        });
        
        console.log('Język zmieniony na', isEnglish ? 'ENGLISH' : 'POLSKI');
    }

    // Obserwuj zmiany na przycisku angBtn
    function watchLanguageChanges() {
        const angBtn = document.getElementById('angBtn');
        if (angBtn) {
            // Obserwuj zmianę tekstu/kliknięcia
            angBtn.addEventListener('click', () => {
                // Czekaj chwilę aż gameInstance.EngmMode się zmieni
                setTimeout(updateLanguageDisplay, 50);
            });
        }
    }

    // Wywołaj na koniec (po inicjalizacji HTML)
    
}

