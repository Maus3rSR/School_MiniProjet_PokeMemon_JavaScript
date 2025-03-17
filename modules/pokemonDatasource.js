export async function fetchPokemon() {
  const response = await fetch("data/pokemon.json");
  return response.json();
}
