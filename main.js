const gridHTML = document.querySelector("#grille_de_jeu");
const boxListHTML = gridHTML.querySelectorAll(".box");
const catchedPokemonHTML = document.querySelector(".liste_pokemons_captures");
const countHTML = document.querySelector("#stat_nombre_de_coups");
const countRecordHTML = document.querySelector("#stat_nombre_de_coups_record");
const replayButtonHTML = document.querySelector("#rejouer");

const gameState = {
  gridSize: 12,
  pokemonEntities: [], // La liste de tous les pokemons (ça peut être plus que la taille de la grille)
  pokemonListInBush: [],
  pokemonCatched: [],
  stats: {
    count: 0,
    countRecord: null, // null => Le record n'a pas encore été défini
  },
  getPokemonEntity(pokemonId) {
    return this.pokemonEntities.find((pokemon) => pokemon.name === pokemonId);
  },
  getRandomPokemonForGrid() {
    const pokemonIds = randomize(this.pokemonEntities)
      .filter((_, index) => index < this.gridSize / 2)
      .map((pokemon) => pokemon.name);

    return [...pokemonIds, ...pokemonIds];
  },
  updatePokemonStateOf(index, state) {
    this.pokemonListInBush[index].state = state;
  },
  pokemonsRevealedCount() {
    return this.pokemonsRevealed().length;
  },
  pokemonsRevealed() {
    return this.pokemonListInBush
      .map((pokemon, index) => ({
        ...pokemon,
        hideInBushIndex: index,
      }))
      .filter((pokemon) => pokemon.state === "REVEALED");
  },
  incrementStat() {
    this.stats.count++;
  },
  areAllPokemonCatched() {
    return this.pokemonCatched.length === this.pokemonListInBush.length / 2;
  },
  finishGame() {
    this.stats.countRecord = Math.min(
      this.stats.count,
      // Si record === null, on prend stats.count par défaut
      this.stats.countRecord ?? this.stats.count
    );
  },
  replay() {
    this.stats.count = 0;
    this.pokemonCatched = [];
    this.init();
  },
  init() {
    this.pokemonListInBush = this.getRandomPokemonForGrid().map(
      (pokemonId) => ({
        pokemonId,
        state: "HIDE",
      })
    );
  },
  loadState(state) {
    this.pokemonListInBush = state.pokemonListInBush.map((pokemon) => ({
      ...pokemon,
      // Dans une situation où on a quitté la partie avant que les pokemons révélés non identiques
      // soient cachées, on réinitialise l'état de ces pokemons à HIDE
      state: pokemon.state === "REVEALED" ? "HIDE" : pokemon.state,
    }));

    this.pokemonCatched = state.pokemonCatched;
    this.stats = state.stats;
  },
};

function randomize(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function hideBushHTML(index) {
  boxListHTML[index].querySelector(".bush").style.display = "none";
}

function updateAllBushHTML(pokemonsInBush) {
  boxListHTML.forEach((_, index) =>
    updateBushHTML(index, pokemonsInBush[index])
  );
}

function updateBushHTML(index, pokemonInBush) {
  const box = boxListHTML[index];

  if (pokemonInBush.state === "HIDE") {
    box.querySelector(".bush").style.display = "";
    box.querySelector(".pokemon")?.remove();
    box.querySelector(".pokeball")?.remove();
    return;
  }

  hideBushHTML(index);
  pokemonInBush.state === "REVEALED" && revealPokemonHTML(index);
  pokemonInBush.state === "CATCHED" && revealPokeballHTML(index);
}

function getPokemonIdFromIndex(index) {
  return gameState.pokemonListInBush[index]?.pokemonId;
}

function createPokemonHtml({ sprite }, animation = "tada") {
  const pokemonHTML = document.createElement("img");
  pokemonHTML.src = sprite;
  pokemonHTML.classList.add("pokemon");
  pokemonHTML.classList.add(`animate__animated`);
  pokemonHTML.classList.add(`animate__${animation}`);

  return pokemonHTML;
}

function createPokeballHtml() {
  const pokeballHTML = document.createElement("img");
  pokeballHTML.src = "./assets/pokeball.png";
  pokeballHTML.classList.add("pokeball");
  pokeballHTML.classList.add(`animate__animated`);
  pokeballHTML.classList.add(`animate__slideInRight`);

  return pokeballHTML;
}

function revealPokemonHTML(index) {
  const pokemon_id = getPokemonIdFromIndex(index);
  const pokemonHTML = createPokemonHtml(gameState.getPokemonEntity(pokemon_id));
  boxListHTML[index].appendChild(pokemonHTML);
}

function revealPokeballHTML(index) {
  const pokeballHTML = createPokeballHtml();
  boxListHTML[index].appendChild(pokeballHTML);
}

function updateCatchedPokemonListHTML(pokemonIds) {
  catchedPokemonHTML.innerHTML = "";

  pokemonIds.forEach((id) => {
    const pokemonHTML = createPokemonHtml(
      gameState.getPokemonEntity(id),
      "slideInRight"
    );
    catchedPokemonHTML.appendChild(pokemonHTML);
  });
}

function updateCountHTML(count) {
  countHTML.textContent = count;
}

function updateCountRecordHTML(count) {
  countRecordHTML.textContent = count;
}

function showReplayButton() {
  replayButtonHTML.style.display = "block";
}

function hideReplayButton() {
  replayButtonHTML.style.display = "none";
}

function revealPokemon(event) {
  const boxHTML = event.currentTarget;
  const indexOfPokemonHidden = Array.from(boxListHTML).indexOf(boxHTML);
  const pokemonInBush = gameState.pokemonListInBush[indexOfPokemonHidden];
  const pokemonsRevealedCount = gameState.pokemonsRevealedCount();

  if (pokemonInBush.state !== "HIDE" || pokemonsRevealedCount === 2) return;

  hideBushHTML(indexOfPokemonHidden);
  revealPokemonHTML(indexOfPokemonHidden);
  gameState.updatePokemonStateOf(indexOfPokemonHidden, "REVEALED");

  // 0 car au moment où je récupère ce comptage, je n'ai pas changé l'état du pokemon actuel à révélé
  // on a besoin d'un deuxième pokemon
  if (pokemonsRevealedCount === 0) return;

  const [pokemonA, pokemonB] = gameState.pokemonsRevealed();

  gameState.incrementStat();
  updateCountHTML(gameState.stats.count);

  if (pokemonA.pokemonId !== pokemonB.pokemonId) {
    setTimeout(function () {
      gameState.updatePokemonStateOf(pokemonA.hideInBushIndex, "HIDE");
      updateBushHTML(
        pokemonA.hideInBushIndex,
        gameState.pokemonListInBush[pokemonA.hideInBushIndex]
      );

      gameState.updatePokemonStateOf(pokemonB.hideInBushIndex, "HIDE");
      updateBushHTML(
        pokemonB.hideInBushIndex,
        gameState.pokemonListInBush[pokemonB.hideInBushIndex]
      );
    }, 1000);

    return;
  }

  gameState.updatePokemonStateOf(pokemonA.hideInBushIndex, "CATCHED");
  revealPokeballHTML(pokemonA.hideInBushIndex);

  gameState.updatePokemonStateOf(pokemonB.hideInBushIndex, "CATCHED");
  revealPokeballHTML(pokemonB.hideInBushIndex);

  gameState.pokemonCatched.push(pokemonA.pokemonId);
  updateCatchedPokemonListHTML(gameState.pokemonCatched);

  if (!gameState.areAllPokemonCatched()) return;

  gameState.finishGame();
  updateCountRecordHTML(gameState.stats.countRecord);
  showReplayButton();
}

function startGame() {
  gameState.init();

  boxListHTML.forEach((box) =>
    box.addEventListener("click", function (event) {
      revealPokemon(event);
      saveGame();
    })
  );

  replayButtonHTML.addEventListener("click", () => {
    gameState.replay();
    saveGame();

    updateAllBushHTML(gameState.pokemonListInBush);
    updateCountHTML(gameState.stats.count);
    updateCatchedPokemonListHTML(gameState.pokemonCatched);
    hideReplayButton();
  });

  loadGame();
}

function saveGame() {
  localStorage.setItem("pokememon_state", JSON.stringify(gameState));
}

function loadGame() {
  const storageValue = localStorage.getItem("pokememon_state");
  if (!storageValue) return;

  gameState.loadState(JSON.parse(storageValue));

  gameState.areAllPokemonCatched() && showReplayButton();
  updateAllBushHTML(gameState.pokemonListInBush);
  updateCountHTML(gameState.stats.count);
  updateCountRecordHTML(gameState.stats.countRecord ?? 0);
  updateCatchedPokemonListHTML(gameState.pokemonCatched);
}

fetch("data/pokemon.json")
  .then((response) => response.json())
  .then((pokemonData) => {
    gameState.pokemonEntities = pokemonData;
    startGame();
  });
