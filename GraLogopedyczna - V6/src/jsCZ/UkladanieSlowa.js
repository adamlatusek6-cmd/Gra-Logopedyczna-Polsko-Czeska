function initMiniGameUkadanieSowa(gameInstance) {
  const word = "Instrukce";
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
      gameOutput.textContent = "Skvělá práce! Správně jsi složil slovo!";
      if (gameInstance) gameInstance.hint2Unlocked = true;
      if(window.voiceFactoryGameInstance) {
        window.voiceFactoryGameInstance.terroryzujeMinigameCompleted = true;
      }
      customAlert.success("Odemkl jsi druhou nápovědu na úrovni!");
    } else if (attempted.length === word.length && attempted !== word) {
      gameOutput.textContent = "Chybné slovo, zkus znovu.";
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