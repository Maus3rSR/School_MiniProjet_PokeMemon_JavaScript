function persistGameState(gameState) {
  localStorage.setItem("pokememon_state", JSON.stringify(gameState));
}

function retrieveGameState() {
  const storageValue = localStorage.getItem("pokememon_state");
  if (!storageValue) return;
  return JSON.parse(storageValue);
}

export { persistGameState, retrieveGameState };
