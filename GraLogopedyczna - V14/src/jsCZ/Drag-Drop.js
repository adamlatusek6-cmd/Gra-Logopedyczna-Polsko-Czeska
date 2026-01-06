function initMiniGameFactoryDrag(gameInstance) {

  // Seznam všech možných prvků automatizace 
  const factoryItems = [
    { name: "Baterie", cardImage: 'assets/images/DragDrop/bateria.png' },
    { name: "Vodič", cardImage: 'assets/images/DragDrop/Przewod.png', },
    { name: "Elektromotor", cardImage: 'assets/images/DragDrop/silnik-elektryczny.png', },
    { name: "Ozubené kolo", cardImage: 'assets/images/DragDrop/zebatka.png', },
    { name: "Žárovka", cardImage: 'assets/images/DragDrop/zarowka.png', },
    { name: "Kontakt", cardImage: 'assets/images/DragDrop/kontakt.png', },
    { name: "Procesor", cardImage: 'assets/images/DragDrop/procesor.png', },
    { name: "Šroub", cardImage: 'assets/images/DragDrop/srubka.png', },
    { name: "Klíč", cardImage: 'assets/images/DragDrop/klucz.png', },
    { name: "Čočka", cardImage: 'assets/images/DragDrop/soczewka.png', },
  ];

  // Vylosuj 5 z 10 prvků 
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
      // ✨ ZMĚNA: Zobraz obrázek z cardImage místo názvu 
      imgDiv.innerHTML = ``;
      // Obsluha drag events 
      imgDiv.addEventListener('dragstart', (e) => {
        draggedElement = imgDiv;
        e.dataTransfer.effectAllowed = 'copy';
      });
      imgDiv.addEventListener('dragend', () => {
        draggedElement = null;
      });
      imgContainer.appendChild(imgDiv);
    });
  }

  function renderTargets() {
    const targetsContainer = document.getElementById('factoryTargets');
    targetsContainer.innerHTML = '';
    // Promíchej pořadí popisů 
    const shuffledItems = gameItems.slice().sort(() => Math.random() - 0.5);
    shuffledItems.forEach((item, idx) => {
      const targetDiv = document.createElement('div');
      targetDiv.className = 'drop-target';
      targetDiv.dataset.name = item.name;
      targetDiv.id = 'drop-' + idx;
      // Zobraz POPIS, na který patří obrázek 
      targetDiv.innerHTML = `<div class="target-label">${item.name}</div>`;
      // Obsluha drop events 
      targetDiv.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        targetDiv.style.backgroundColor = 'rgba(34, 197, 94, 0.3)';
      });
      targetDiv.addEventListener('dragleave', () => {
        targetDiv.style.backgroundColor = '';
      });
      targetDiv.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedElement && draggedElement.dataset.name === item.name) {
          targetDiv.classList.add('matched');
          targetDiv.innerHTML = `<div class="target-label">✓ ${item.name}</div>`;
          draggedElement.style.opacity = '0.5';
          draggedElement.style.pointerEvents = 'none';
          correctMatches++;
          if (correctMatches === gameItems.length) {
            setTimeout(() => {
              if (gameInstance.EngMode === false) {
                customAlert.success('Bravo! Všechny prvky spárovány! Odemkl jsi uzamčenou skříň!');
              } else {
                customAlert.success1('Great! All items matched! You have unlocked the locked chest!');
              }
              gameInstance.hint3Unlocked = true;
            }, 500);
          }
        } else {
          targetDiv.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
          setTimeout(() => {
            targetDiv.style.backgroundColor = '';
          }, 500);
        }
      });
      targetsContainer.appendChild(targetDiv);
    });
  }

  // Renderuj oba oddíly 
  renderImages();
  renderTargets();
}
