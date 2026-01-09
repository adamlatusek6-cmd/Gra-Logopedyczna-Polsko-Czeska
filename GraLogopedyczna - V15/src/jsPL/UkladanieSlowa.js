function initMiniGameUkadanieSowa(gameInstance) {
  const word = "pomoc";
  const lettersArr = word.split("");
  const shuffledArr = [...lettersArr].sort(() => Math.random() - 0.5);

  const gameLetters = document.getElementById("gameLetters");
  const gameOutput = document.getElementById("gameOutput");
  const resetBtn = document.getElementById("resetUkadanieSowaBtn");

  // <-- zawsze resetuj zaznaczenie przy inicjalizacji
  let selectedIndices = [];

  function renderTiles() {
    gameLetters.innerHTML = "";
    shuffledArr.forEach((ch, idx) => {
      if (selectedIndices.includes(idx)) return;
      const tile = document.createElement("span");
      tile.className = "letter-tile";
      tile.textContent = ch;
      tile.onclick = function () {
        selectedIndices.push(idx);
        renderTiles();
        updateWord();
      };
      gameLetters.appendChild(tile);
    });
  }

  function updateWord() {
    const attempted = selectedIndices.map(idx => shuffledArr[idx]).join("");
    gameOutput.textContent = attempted;
    if (attempted === word) {
      gameOutput.textContent = "Dobra robota! Ułożyłeś słowo poprawnie!";
      if (gameInstance) gameInstance.hint2Unlocked = true;
      if (window.voiceFactoryGameInstance) {
        window.voiceFactoryGameInstance.terroryzujeMinigameCompleted = true;
      }
      if (gameInstance.EngMode === false) {
        customAlert.success("Odblokowałeś drugą wskazówkę! Wróć do naprawiania maszyny sterującej");
      } else {
        customAlert.success1("You have unlocked the second hint! Return to fixing the control machine");
      }
    } else if (attempted.length === word.length && attempted !== word) {
      gameOutput.textContent = "Błędne słowo, spróbuj ponownie.";
    }
  }

  resetBtn.onclick = function () {
    selectedIndices = [];
    gameOutput.textContent = "";
    renderTiles();
  };

  // Inicjalizacja — zawsze wywołaj renderTiles na wejściu!
  renderTiles();
}