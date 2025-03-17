import {
  showReplayButton,
  hideReplayButton,
  onReplay,
} from "./modules/UI/replayUI.js";
import {
  updateCountHTML,
  updateCountRecordHTML,
} from "./modules/UI/statsUI.js";
import {
  hideBushHTML,
  updateAllBushHTML,
  updateBushHTML,
  revealPokemonHTML,
  revealPokeballHTML,
  onBoxClicked,
} from "./modules/UI/gridUI.js";
import { updateCatchedPokemonListHTML } from "./modules/UI/catchedUI.js";
import {
  retrieveGameState,
  persistGameState,
} from "./modules/gameStateStorage.js";
import { fetchPokemon } from "./modules/pokemonDatasource.js";
import gameState from "./modules/gameState.js";

function revealPokemon(positionOfPokemon) {
  const pokemonInBush = gameState.getPokemonStateInBush(positionOfPokemon);
  const pokemonsRevealedCount = gameState.pokemonsRevealedCount();

  if (pokemonInBush.state !== "HIDE" || pokemonsRevealedCount === 2) return;

  hideBushHTML(positionOfPokemon);
  revealPokemonHTML(
    positionOfPokemon,
    gameState.getPokemonEntity(pokemonInBush.pokemonId)
  );
  gameState.updatePokemonStateAt(positionOfPokemon, "REVEALED");

  // 0 car au moment où je récupère ce comptage, je n'ai pas changé l'état du pokemon actuel à révélé
  // on a besoin d'un deuxième pokemon
  if (pokemonsRevealedCount === 0) return;

  const [pokemonA, pokemonB] = gameState.pokemonsRevealed();

  gameState.incrementStat();
  updateCountHTML(gameState.statsCount());

  if (pokemonA.pokemonId !== pokemonB.pokemonId) {
    setTimeout(function () {
      gameState.updatePokemonStateAt(pokemonA.hideInBushIndex, "HIDE");
      updateBushHTML(
        pokemonA.hideInBushIndex,
        gameState.getPokemonStateInBush(pokemonA.hideInBushIndex)
      );

      gameState.updatePokemonStateAt(pokemonB.hideInBushIndex, "HIDE");
      updateBushHTML(
        pokemonB.hideInBushIndex,
        gameState.getPokemonStateInBush(pokemonB.hideInBushIndex)
      );
    }, 1000);

    return;
  }

  gameState.updatePokemonStateAt(pokemonA.hideInBushIndex, "CATCHED");
  revealPokeballHTML(pokemonA.hideInBushIndex);

  gameState.updatePokemonStateAt(pokemonB.hideInBushIndex, "CATCHED");
  revealPokeballHTML(pokemonB.hideInBushIndex);

  gameState.catchPokemon(pokemonA.pokemonId);
  updateCatchedPokemonListHTML(gameState.getPokemonEntitiesFromCatched());

  if (!gameState.areAllPokemonCatched()) return;

  gameState.finishGame();
  updateCountRecordHTML(gameState.statsCountRecord());
  showReplayButton();
}

async function startGame() {
  await loadGame();

  onBoxClicked(function (boxPosition) {
    revealPokemon(boxPosition);
  });

  onReplay(() => {
    gameState.replay();

    updateAllBushHTML(gameState.getPokemonEntitiesWithState());
    updateCountHTML(gameState.statsCount());
    updateCatchedPokemonListHTML(gameState.getPokemonEntitiesFromCatched());
    hideReplayButton();
  });
}

async function loadGame() {
  if (!gameState.load()) {
    gameState.init(await fetchPokemon());
    return;
  }

  gameState.areAllPokemonCatched() && showReplayButton();
  updateAllBushHTML(gameState.getPokemonEntitiesWithState());
  updateCountHTML(gameState.statsCount());
  updateCountRecordHTML(gameState.statsCountRecord());
  updateCatchedPokemonListHTML(gameState.getPokemonEntitiesFromCatched());
}

startGame();
