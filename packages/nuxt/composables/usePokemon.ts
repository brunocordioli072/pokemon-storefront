/* eslint-disable camelcase */
import { computed, ref } from '@nuxtjs/composition-api';
import { createClient } from 'pokeapi-js';
import { calculatePokemonPrice, Pokemon, capitalizeWord } from './helpers';

export const usePokemon = () => {
  const pokemon = ref({} as unknown as Pokemon);
  const loading = ref(true);
  const error = ref({
    load: null as any,
  });

  const client = createClient();

  const load = async (pokemonId: number) => {
    try {
      loading.value = true;
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
      pokemon.value = {
        ...res,
        price: calculatePokemonPrice(res.pokemon_v2_pokemonspecy),
        name: capitalizeWord(res.name),
        types: res.pokemon_v2_pokemontypes.map((el: any) => el.pokemon_v2_type),
        image_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${res.id}.png`,
        image_artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${res.id}.png`,
      };
      error.value.load = null;
    } catch (err) {
        console.log(err)
      error.value.load = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    load,
    pokemon: computed(() => pokemon.value as Pokemon),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
  };
};
