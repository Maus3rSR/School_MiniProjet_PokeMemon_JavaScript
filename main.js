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

function hideBush(index) {
  boxListHTML[index].querySelector(".bush").style.display = "none";
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

function revealPokemon(index) {
  const pokemonHTML = createPokemonHtml(
    getPokemonData(pairOfPokemonIds[index])
  );
  boxListHTML[index].appendChild(pokemonHTML);
}

hideBush(0);
revealPokemon(0);
