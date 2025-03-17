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

function getPokemonData(index) {
  const pokemon_id = gameState.pokemonListInBush[index].pokemonId;
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
  const pokemonHTML = createPokemonHtml(getPokemonData(index));
  boxListHTML[index].appendChild(pokemonHTML);
}

function revealPokeballHTML(index) {
  const pokeballHTML = createPokeballHtml();
  boxListHTML[index].appendChild(pokeballHTML);
}

function catchPokemonHTML(pokemon) {
  const pokemonHTML = createPokemonHtml(pokemon);
  catchedPokemonHTML.appendChild(pokemonHTML);
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
    return;
  }

  // TODO: Reset
  console.log("RESET");
}

function startGame() {
  boxListHTML.forEach((box) => box.addEventListener("click", revealPokemon));
}

startGame();
