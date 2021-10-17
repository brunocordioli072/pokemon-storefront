/* eslint-disable camelcase */
import { computed, reactive } from '@nuxtjs/composition-api';
import { createClient, pokemon_v2_pokemonspecies } from 'pokeapi-js';

export interface Pokemon extends pokemon_v2_pokemonspecies {
  image_default?: string
  price?: number
}

const state = reactive({
  result: null as unknown as Pokemon[],
  loading: false,
  error: {
    load: null as any,
  },
});

export const usePokemons = () => {
  const client = createClient();

  const calculatePrice = (pokemon: Pokemon) => {
    let basePrice = 50;
    const calculate = (max_val: number, val: number) => (1 + (max_val - val) * 0.01);

    // add capture_rate to price, from 50 to 200
    basePrice *= calculate(200, pokemon?.capture_rate ?? 50);
    // add gender_rate to price, from 1 to 10
    basePrice *= calculate(10, pokemon?.gender_rate ?? 1);
    // add base_happiness to price, from 50 to 150
    basePrice *= calculate(150, pokemon?.gender_rate ?? 50);
    // add evolution pricing raise based on greater id,
    // all pokemons ids are in order of evolution: charmander = 1 & charmeleon = 2
    let evolutionPrice = 10;
    const evolutions = pokemon?.pokemon_v2_evolutionchain
      ?.pokemon_v2_pokemonspecies
      ?.map((el) => el.id) as number[];
    if (Math.max(...evolutions) === pokemon.id) evolutionPrice = 80;
    if (Math.max(...evolutions) - 1 === pokemon.id) evolutionPrice = 40;
    basePrice *= (1 + (100 + evolutionPrice) * 0.01);
    return parseInt(basePrice.toFixed(0), 10);
  };

  const load = async () => {
    try {
      state.loading = true;
      const res = await client.chain.query
        .pokemon_v2_pokemonspecies(
          { where: { generation_id: { _eq: 1 } }, order_by: { id: 'asc' } as any },
        )
        .get({
          name: true,
          id: true,
          capture_rate: true,
          gender_rate: true,
          base_happiness: true,
          pokemon_v2_evolutionchain: {
            pokemon_v2_pokemonspecies: {
              id: true,
            },
          },
        }) as Pokemon[];
      state.result = res.map((el) => ({
        ...el,
        price: calculatePrice(el),
        // issue with sprites https://github.com/PokeAPI/pokeapi/issues/614
        image_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${el.id}.png`,
      })) as Pokemon[];
      state.error.load = null;
    } catch (err) {
      state.error.load = err;
    } finally {
      state.loading = false;
    }
  };

  load();

  return {
    load,
    result: computed(() => state.result as Pokemon[]),
    loading: computed(() => state.loading),
    error: computed(() => state.error),
  };
};
