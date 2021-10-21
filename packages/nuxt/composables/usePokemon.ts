/* eslint-disable camelcase */
import { computed, reactive } from '@nuxtjs/composition-api';
import { createClient } from 'pokemonapi-js';
import { calculatePokemonPrice, Pokemon, capitalizeWord } from './helpers';

export const usePokemon = () => {
  const state = reactive({
    pokemon: {} as unknown as Pokemon,
    loading: false,
    error: {
      load: null as any,
    },
  });

  const client = createClient();

  const load = async (pokemonId: number) => {
    try {
      state.loading = true;
      const [res] = await client.chain.query
        .pokemon_v2_pokemon({ where: { id: { _eq: pokemonId } } })
        .get({
          name: true,
          id: true,
          pokemon_v2_pokemonspecy: {
            capture_rate: true,
            gender_rate: true,
            base_happiness: true,
            pokemon_v2_evolutionchain: {
              pokemon_v2_pokemonspecies: {
                id: true,
              },
            },
          },
          pokemon_v2_pokemontypes: {
            pokemon_v2_type: {
              name: true,
              id: true,
            },
          },
        }) as any;
      state.pokemon = {
        ...res,
        price: calculatePokemonPrice(res.pokemon_v2_pokemonspecy),
        name: capitalizeWord(res.name),
        types: res.pokemon_v2_pokemontypes.map((el: any) => el.pokemon_v2_type),
        image_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${res.id}.png`,
        image_artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${res.id}.png`,
      };
      state.error.load = null;
    } catch (err) {
      state.error.load = err;
    } finally {
      state.loading = false;
    }
  };

  return {
    load,
    pokemon: computed(() => state.pokemon as Pokemon),
    loading: computed(() => state.loading),
    error: computed(() => state.error),
  };
};
