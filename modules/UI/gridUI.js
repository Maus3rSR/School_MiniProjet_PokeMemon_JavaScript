import { createPokemonHtml, createPokeballHtml } from "./pokemonElement.js";

const gridHTML = document.querySelector("#grille_de_jeu");
const boxListHTML = gridHTML.querySelectorAll(".box");

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

function revealPokemonHTML(bushPosition, pokemonEntity) {
  const pokemonHTML = createPokemonHtml(pokemonEntity);
  boxListHTML[bushPosition].appendChild(pokemonHTML);
}

function revealPokeballHTML(bushPosition) {
  const pokeballHTML = createPokeballHtml();
  boxListHTML[bushPosition].appendChild(pokeballHTML);
}

function onBoxClicked(callback) {
  boxListHTML.forEach((box) =>
    box.addEventListener("click", function (event) {
      const boxHTML = event.currentTarget;
      const position = Array.from(boxListHTML).indexOf(boxHTML);
      callback(position);
    })
  );
}

export {
  hideBushHTML,
  updateAllBushHTML,
  updateBushHTML,
  revealPokemonHTML,
  revealPokeballHTML,
  onBoxClicked,
};
