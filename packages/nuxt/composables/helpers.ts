/* eslint-disable camelcase */
import { pokemon_v2_pokemonspecies } from 'pokeapi-js';

export interface Pokemon extends pokemon_v2_pokemonspecies {
  image_default?: string;
  image_artwork?: string;
  types?: any[];
  price?: number;
}

export const capitalizeWord = ([first, ...rest]: string) => first.toUpperCase() + rest.join('');

export const calculatePokemonPrice = (pokemon: Pokemon) => {
  let basePrice = 50;
  const calculate = (max_val: number, val: number) => 1 + (max_val - val) * 0.01;

  // add capture_rate to price, from 50 to 200
  basePrice *= calculate(200, pokemon?.capture_rate ?? 50);
  // add gender_rate to price, from 1 to 10
  basePrice *= calculate(10, pokemon?.gender_rate ?? 1);
  // add base_happiness to price, from 50 to 150
  basePrice *= calculate(150, pokemon?.gender_rate ?? 50);
  // add evolution pricing raise based on greater id,
  // all pokemons ids are in order of evolution: charmander = 1 & charmeleon = 2
  let evolutionPrice = 10;
  const evolutions = pokemon?.pokemon_v2_evolutionchain?.pokemon_v2_pokemonspecies?.map(
    (el) => el.id,
  ) as number[];
  if (Math.max(...evolutions) === pokemon.id) evolutionPrice = 80;
  if (Math.max(...evolutions) - 1 === pokemon.id) evolutionPrice = 40;
  basePrice *= 1 + (100 + evolutionPrice) * 0.01;
  return parseInt(basePrice.toFixed(0), 10);
};
