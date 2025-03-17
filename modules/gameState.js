import { randomizeArray } from "./random.js";
import { persistGameState, retrieveGameState } from "./gameStateStorage.js";

const gameState = {
  gridSize: 12,
  pokemonEntities: [], // La liste de tous les pokemons (ça peut être plus que la taille de la grille)
  pokemonListInBush: [],
  pokemonCatched: [],
  stats: {
    count: 0,
    countRecord: null, // null => Le record n'a pas encore été défini
  },
};

function statsCount() {
  return gameState.stats.count;
}

function statsCountRecord() {
  return gameState.stats.countRecord;
}

function getPokemonStateInBush(index) {
  // Je créé un nouvel objet pour éviter une mutation indésirable de l'extérieur
  return { ...gameState.pokemonListInBush[index] };
}

function getPokemonEntitiesWithState() {
  return gameState.pokemonListInBush.map((pokemon) => ({
    state: pokemon.state,
    entity: getPokemonEntity(pokemon.pokemonId),
  }));
}

function getPokemonEntitiesFromCatched() {
  return gameState.pokemonCatched.map((pokemonId) =>
    getPokemonEntity(pokemonId)
  );
}

function getPokemonEntity(pokemonId) {
  // Je créé un nouvel objet pour éviter une mutation indésirable de l'extérieur
  return {
    ...gameState.pokemonEntities.find((pokemon) => pokemon.name === pokemonId),
  };
}

function getRandomPokemonForGrid() {
  const pokemonIds = randomizeArray(gameState.pokemonEntities)
    .filter((_, index) => index < gameState.gridSize / 2)
    .map((pokemon) => pokemon.name);

  return [...pokemonIds, ...pokemonIds];
}

function updatePokemonStateAt(index, state) {
  gameState.pokemonListInBush[index].state = state;
  persistGameState(gameState);
}

function catchPokemon(pokemonId) {
  gameState.pokemonCatched.push(pokemonId);
}

function pokemonsRevealedCount() {
  return pokemonsRevealed().length;
}

function pokemonsRevealed() {
  return gameState.pokemonListInBush
    .map((pokemon, index) => ({
      ...pokemon,
      hideInBushIndex: index,
    }))
    .filter((pokemon) => pokemon.state === "REVEALED");
}

function incrementStat() {
  gameState.stats.count++;
}

function areAllPokemonCatched() {
  return (
    gameState.pokemonCatched.length === gameState.pokemonListInBush.length / 2
  );
}

function finishGame() {
  gameState.stats.countRecord = Math.min(
    gameState.stats.count,
    // Si record === null, on prend stats.count par défaut
    gameState.stats.countRecord ?? gameState.stats.count
  );
}

function replay() {
  gameState.count = 0;
  gameState.pokemonCatched = [];
  init();
  persistGameState(gameState);
}

function init(initialPokemonEntities) {
  gameState.pokemonEntities =
    initialPokemonEntities || gameState.pokemonEntities;

  gameState.pokemonListInBush = getRandomPokemonForGrid().map((pokemonId) => ({
    pokemonId,
    state: "HIDE",
  }));
}

function load() {
  const state = retrieveGameState();
  if (!state) return false;

  gameState.pokemonListInBush = state.pokemonListInBush.map((pokemon) => ({
    ...pokemon,
    // Dans une situation où on a quitté la partie avant que les pokemons révélés non identiques
    // soient cachées, on réinitialise l'état de ces pokemons à HIDE
    state: pokemon.state === "REVEALED" ? "HIDE" : pokemon.state,
  }));

  gameState.pokemonCatched = state.pokemonCatched;
  gameState.stats = state.stats;

  return true;
}

export default {
  catchPokemon,
  getPokemonStateInBush,
  getPokemonEntitiesWithState,
  getPokemonEntitiesFromCatched,
  getPokemonEntity,
  updatePokemonStateAt,
  pokemonsRevealedCount,
  pokemonsRevealed,
  incrementStat,
  areAllPokemonCatched,
  finishGame,
  replay,
  init,
  load,
  statsCount,
  statsCountRecord,
};
