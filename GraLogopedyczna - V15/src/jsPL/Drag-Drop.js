function initMiniGameFactoryDrag(gameInstance) {
  // Lista wszystkich możliwych elementów automatyki
  const factoryItems = [
    {
      name: "Bateria",
      cardImage: 'assets/images/DragDrop/bateria.png'
    },
    {
      name: "Przewód",
      cardImage: 'assets/images/DragDrop/Przewod.png',
    },
    {
      name: "Silnik elektryczny",
      cardImage: 'assets/images/DragDrop/silnik-elektryczny.png',
    },
    {
      name: "Zębatka",
      cardImage: 'assets/images/DragDrop/zebatka.png',
    },
    {
      name: "Żarówka",
      cardImage: 'assets/images/DragDrop/zarowka.png',
    },
    {
      name: "Kontakt",
      cardImage: 'assets/images/DragDrop/kontakt.png',
    },
    {
      name: "Procesor",
      cardImage: 'assets/images/DragDrop/procesor.png',
    },
    {
      name: "Śruba",
      cardImage: 'assets/images/DragDrop/srubka.png',
    },
    {
      name: "Klucz",
      cardImage: 'assets/images/DragDrop/klucz.png',
    },
    {
      name: "Soczekwa",
      cardImage: 'assets/images/DragDrop/soczewka.png',
    },

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

      // ✨ ZMIANA: Wyświetl zdjęcie z cardImage zamiast nazwy
      imgDiv.innerHTML = `<img src="${item.cardImage}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;">`;

      // Obsługa drag events
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

    // Pomieszaj kolejność opisów
    const shuffledItems = gameItems.slice().sort(() => Math.random() - 0.5);
    shuffledItems.forEach((item, idx) => {
      const targetDiv = document.createElement('div');
      targetDiv.className = 'drop-target';
      targetDiv.dataset.name = item.name;
      targetDiv.id = 'drop-' + idx;

      // Wyświetl OPIS, do którego należy dopasować zdjęcie
      targetDiv.innerHTML = `<p>${item.name}</p>`;

      // Obsługa drop events
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
          targetDiv.innerHTML = `<p style="color: #22c55e;">✓ ${item.name}</p>`;
          draggedElement.style.opacity = '0.5';
          draggedElement.style.pointerEvents = 'none';
          correctMatches++;

          if (correctMatches === gameItems.length) {
            setTimeout(() => {
              if (gameInstance.EngMode === false) {
                customAlert.success('Brawo! Wszystkie elementy dopasowane! Odblokowałeś zablokowaną skrzynie!');
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

  // Renderuj obie sekcje
  renderImages();
  renderTargets();
}
