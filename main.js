const pokemonData = [
  {
    name: "charmander",
    sprite:
      "https://img.pokemondb.net/sprites/scarlet-violet/normal/charmander.png",
  },
  {
    name: "squirtle",
    sprite:
      "https://img.pokemondb.net/sprites/scarlet-violet/normal/squirtle.png",
  },
  {
    name: "bulbasaur",
    sprite:
      "https://img.pokemondb.net/sprites/scarlet-violet/normal/bulbasaur.png",
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

const gameState = {
  pokemonListInBush: [
    {
      pokemonId: "pikachu",
      state: "HIDE", // HIDE, REVEALED, CATCHED
    },
    {
      pokemonId: "pikachu",
      state: "HIDE",
    },
    {
      pokemonId: "charmander",
      state: "HIDE",
    },
    {
      pokemonId: "charmander",
      state: "HIDE",
    },
  ],
  pokemonCatched: [],
  stats: {
    count: 0,
    countRecord: 0,
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
};

function hideBushHTML(index) {
  boxListHTML[index].querySelector(".bush").style.display = "none";
}

function resetBushHTML(index) {
  const box = boxListHTML[index];
  box.querySelector(".bush").style.display = "";
  box.querySelector(".pokemon")?.remove();
  box.querySelector(".pokeball")?.remove();
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

function revealPokemon(event) {
  const boxHTML = event.currentTarget;
  const indexOfPokemonHidden = Array.from(boxListHTML).indexOf(boxHTML);
  const pokemonInBush = gameState.pokemonListInBush[indexOfPokemonHidden];
  const pokemonsRevealedCount = gameState.pokemonsRevealedCount();

  console.log("POKEMON REVEALED COUNT", pokemonsRevealedCount);

  if (pokemonInBush.state !== "HIDE" || pokemonsRevealedCount === 2) return;

  hideBushHTML(indexOfPokemonHidden);
  revealPokemonHTML(indexOfPokemonHidden);
  gameState.updatePokemonStateOf(indexOfPokemonHidden, "REVEALED");

  console.log("POKEMON REVEAL", pokemonInBush.pokemonId);

  // 0 car au moment où je récupère ce comptage, je n'ai pas changé l'état du pokemon actuel à révélé
  // on a besoin d'un deuxième pokemon
  if (pokemonsRevealedCount === 0) return;

  const [pokemonA, pokemonB] = gameState.pokemonsRevealed();

  if (pokemonA.pokemonId === pokemonB.pokemonId) {
    gameState.updatePokemonStateOf(pokemonA.hideInBushIndex, "CATCHED");
    revealPokeballHTML(pokemonA.hideInBushIndex);

    gameState.updatePokemonStateOf(pokemonB.hideInBushIndex, "CATCHED");
    revealPokeballHTML(pokemonB.hideInBushIndex);

    gameState.pokemonCatched.push(pokemonA.pokemonId);
    updateCatchedPokemonListHTML(gameState.pokemonCatched);

    return;
  }

  setTimeout(function () {
    gameState.updatePokemonStateOf(pokemonA.hideInBushIndex, "HIDE");
    resetBushHTML(pokemonA.hideInBushIndex);

    gameState.updatePokemonStateOf(pokemonB.hideInBushIndex, "HIDE");
    resetBushHTML(pokemonB.hideInBushIndex);
  }, 1000);
}

function startGame() {
  boxListHTML.forEach((box) => box.addEventListener("click", revealPokemon));
}

startGame();
