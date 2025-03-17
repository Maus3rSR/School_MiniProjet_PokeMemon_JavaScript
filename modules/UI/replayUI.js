const replayButtonHTML = document.querySelector("#rejouer");

function showReplayButton() {
  replayButtonHTML.style.display = "block";
}

function hideReplayButton() {
  replayButtonHTML.style.display = "none";
}

function onReplay(callback) {
  replayButtonHTML.addEventListener("click", callback);
}

export { showReplayButton, hideReplayButton, onReplay };
