import { createPokemonHtml } from "./pokemonElement.js";

const catchedPokemonHTML = document.querySelector(".liste_pokemons_captures");

function updateCatchedPokemonListHTML(pokemonEntities) {
  catchedPokemonHTML.innerHTML = "";

  pokemonEntities.forEach((pokemonEntity) => {
    const pokemonHTML = createPokemonHtml(pokemonEntity, "slideInRight");
    catchedPokemonHTML.appendChild(pokemonHTML);
  });
}

export { updateCatchedPokemonListHTML };
