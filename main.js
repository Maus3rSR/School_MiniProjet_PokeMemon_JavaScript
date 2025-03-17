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

const pairOfPokemonIds = ["pikachu", "pikachu", "charmander", "charmander"];
const gridHTML = document.querySelector("#grille_de_jeu");
const boxListHTML = gridHTML.querySelectorAll(".box");
const catchedPokemonHTML = document.querySelector(".liste_pokemons_captures");
const countHTML = document.querySelector("#stat_nombre_de_coups");
const countRecordHTML = document.querySelector("#stat_nombre_de_coups_record");

function hideBushHTML(index) {
  boxListHTML[index].querySelector(".bush").style.display = "none";
}

function getPokemonData(index) {
  const pokemon_id = pairOfPokemonIds[index];
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

hideBushHTML(0);
revealPokemonHTML(0);
revealPokeballHTML(0);
catchPokemonHTML(getPokemonData(0));
updateCountHTML(3);
updateCountRecordHTML(4);
