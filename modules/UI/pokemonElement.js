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

export { createPokemonHtml, createPokeballHtml };
