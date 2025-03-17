const pokemonData = [
  {
    name: "charmander",
    sprite:
      "https://img.pokemondb.net/sprites/scarlet-violet/normal/charmander.png",
  },
  {
    name: "pikachu",
    sprite:
      "https://img.pokemondb.net/sprites/scarlet-violet/normal/pikachu.png",
  },
];

const gridHTML = document.querySelector("#grille_de_jeu");
const boxListHTML = gridHTML.querySelectorAll(".box");
const catchedPokemonHTML = document.querySelector(".liste_pokemons_captures");
const countHTML = document.querySelector("#stat_nombre_de_coups");
const countRecordHTML = document.querySelector("#stat_nombre_de_coups_record");
const replayButtonHTML = document.querySelector("#rejouer");

const gameState = {
  pokemonListInBush: [],
  pokemonCatched: [],
  stats: {
    count: 0,
    countRecord: null, // null => Le record n'a pas encore été défini
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
    this.pokemonListInBush = this.pokemonListInBush.map((pokemon) => ({
      ...pokemon,
      state: "HIDE",
    }));

    this.randomize();
  },
  randomize() {
    for (let i = this.pokemonListInBush.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.pokemonListInBush[i], this.pokemonListInBush[j]] = [
        this.pokemonListInBush[j],
        this.pokemonListInBush[i],
      ];
    }
  },
  init(pokemonData) {
    // [...pokemonData, ...pokemonData] permet de prendre la liste et faire un doublon
    this.pokemonListInBush = [...pokemonData, ...pokemonData].map(
      (pokemon) => ({
        pokemonId: pokemon,
        state: "HIDE",
      })
    );

    this.randomize();
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

function getPokemonData(pokemon_id) {
  return pokemonData.find((pokemon) => pokemon.name === pokemon_id);
}

function createPokemonHtml({ sprite }) {
  const pokemonHTML = document.createElement("img");
  pokemonHTML.src = sprite;
  pokemonHTML.classList.add("pokemon");

  return pokemonHTML;
}

function createPokeballHtml() {
  const pokeballHTML = document.createElement("img");
  pokeballHTML.src = "./assets/pokeball.png";
  pokeballHTML.classList.add("pokeball");

  return pokeballHTML;
}

function revealPokemonHTML(index) {
  const pokemon_id = getPokemonIdFromIndex(index);
  const pokemonHTML = createPokemonHtml(getPokemonData(pokemon_id));
  boxListHTML[index].appendChild(pokemonHTML);
}

function revealPokeballHTML(index) {
  const pokeballHTML = createPokeballHtml();
  boxListHTML[index].appendChild(pokeballHTML);
}

function updateCatchedPokemonListHTML(pokemonIds) {
  catchedPokemonHTML.innerHTML = "";

  pokemonIds.forEach((id) => {
    const pokemonHTML = createPokemonHtml(getPokemonData(id));
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
  gameState.init(pokemonData.map((pokemon) => pokemon.name));
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

loadGame();
startGame();
