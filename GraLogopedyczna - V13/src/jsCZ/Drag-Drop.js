function initMiniGameFactoryDrag(gameInstance) {
    // Lista wszystkich możliwych elementów automatyki
    const factoryItems = [
        { name: "PLC", description: "Sterownik programowalny" },
        { name: "Przekaźnik", description: "Przełącznik elektromagnetyczny" },
        { name: "Czujnik indukcyjny", description: "Wykrywa obiekty metalowe" },
        { name: "Siłownik", description: "Napęd liniowy lub obrotowy" },
        { name: "Enkoder", description: "Czujnik położenia i prędkości" },
        { name: "Falownik", description: "Sterownik prędkości silnika" },
        { name: "Przycisk awaryjny", description: "Bezpieczeństwo maszyny" },
        { name: "Lampka sygnalizacyjna", description: "Wskaźnik stanu" },
        { name: "Serwomechanizm", description: "Precyzyjny napęd" },
        { name: "Stycznik", description: "Przełącznik mocy" }
    ];
    
    // Losuj 5 z 10 elementów
    const gameItems = factoryItems.slice().sort(() => Math.random() - 0.5).slice(0, 5);
    let correctMatches = 0;
    let draggedElement = null;
    
    function renderImages() {
        const imgContainer = document.getElementById('factoryImages');
        imgContainer.innerHTML = '';
        
        gameItems.forEach((item, idx) => {
            const imgDiv = document.createElement('div');
            imgDiv.className = 'draggable-item';
            imgDiv.draggable = true;
            imgDiv.dataset.name = item.name;
            imgDiv.id = 'drag-' + idx;
            
            // Placeholder dla obrazka - w rzeczywistej implementacji byłyby prawdziwe obrazki
            imgDiv.innerHTML = `
                <div class="item-placeholder">
                    <span class="item-icon">⚙️</span>
                    <small class="item-hint">${item.description}</small>
                </div>
            `;
            
            // Obsługa drag events
            imgDiv.addEventListener('dragstart', (e) => {
                draggedElement = e.target;
                e.target.style.opacity = '0.5';
            });
            
            imgDiv.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
                draggedElement = null;
            });
            
            imgContainer.appendChild(imgDiv);
        });
    }
    
    function renderTargets() {
        const targetsContainer = document.getElementById('factoryTargets');
        targetsContainer.innerHTML = '';
        
        // Pomieszaj kolejność celów
        const shuffledItems = gameItems.slice().sort(() => Math.random() - 0.5);
        
        shuffledItems.forEach((item, idx) => {
            const targetDiv = document.createElement('div');
            targetDiv.className = 'drop-target';
            targetDiv.dataset.name = item.name;
            targetDiv.id = 'drop-' + idx;
            targetDiv.textContent = item.name;
            
            // Obsługa drop events
            targetDiv.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.target.classList.add('drag-over');
            });
            
            targetDiv.addEventListener('dragleave', (e) => {
                e.target.classList.remove('drag-over');
            });
            
            targetDiv.addEventListener('drop', (e) => {
                e.preventDefault();
                e.target.classList.remove('drag-over');
                
                if (draggedElement && draggedElement.dataset.name === e.target.dataset.name) {
                    // Poprawne dopasowanie
                    e.target.classList.add('correct-match');
                    e.target.innerHTML = `✓ ${e.target.dataset.name}`;
                    draggedElement.style.visibility = 'hidden';
                    correctMatches++;
                    
                    // Sprawdź czy wszystkie dopasowane
                    if (correctMatches === gameItems.length) {
                        setTimeout(() => {
                            document.getElementById('dragDropResult').innerHTML = 
                            '<div class="success-message">🎉 Gratulacje! Wszystkie elementy dopasowane!</div>';
                            gameInstance.hint3Unlocked = true;
                            customAlert.success("Odblokowałeś drugą wskazówkę w poziomie 3!");    
                        }, 500);
                    }
                } else {
                    // Niepoprawne dopasowanie
                    e.target.classList.add('incorrect-match');
                    setTimeout(() => {
                        e.target.classList.remove('incorrect-match');
                    }, 1000);
                }
            });
            
            targetsContainer.appendChild(targetDiv);
        });
    }
    
    function resetGame() {
        correctMatches = 0;
        document.getElementById('dragDropResult').innerHTML = '';
        renderImages();
        renderTargets();
    }
    
    // Inicjalizacja gry
    renderImages();
    renderTargets();
    
    // Przycisk reset
    document.getElementById('resetFactoryDragBtn').onclick = resetGame;
}