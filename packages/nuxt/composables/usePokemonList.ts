/* eslint-disable camelcase */
import { computed, reactive } from '@nuxtjs/composition-api';
import { createClient } from 'pokemonapi-js';
import {
  Pokemon,
  capitalizeWord,
  calculatePokemonPrice,
  getPagination,
  Pagination,
} from './helpers';

export const usePokemonList = () => {
  const state = reactive({
    pokemons: (null as unknown) as Pokemon[],
    pagination: (null as unknown) as Pagination | undefined | null,
    loading: false,
    error: {
      load: null as any,
    },
  });

  const client = createClient();

  const load = async (
    pagination: Pagination | undefined | null,
    search?: string,
  ) => {
    try {
      state.loading = true;
      state.pagination = pagination;
      const res = (await client.chain.query
        .pokemon_v2_pokemonspecies({
          where: search
            ? { generation_id: { _eq: 1 }, name: { _iregex: search } }
            : { generation_id: { _eq: 1 } },
          order_by: { id: 'asc' } as any,
          limit: state.pagination ? state.pagination.itemsPerPage : null,
          offset:
            state.pagination
            && state.pagination.currentPage
            && state.pagination.itemsPerPage
              ? state.pagination?.currentPage * state.pagination?.itemsPerPage
              : null,
        })
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
        })) as Pokemon[];
      state.pokemons = res.map((el) => ({
        ...el,
        price: calculatePokemonPrice(el),
        name: capitalizeWord(el.name),
        // issue with sprites not returning from graphql https://github.com/PokeAPI/pokeapi/issues/614
        image_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${el.id}.png`,
      })) as Pokemon[];
      state.error.load = null;
    } catch (err) {
      state.error.load = err;
    } finally {
      state.loading = false;
    }
  };

  state.pagination = getPagination();

  return {
    load,
    pagination: computed(
      () => state.pagination as Pagination | undefined | null,
    ),
    pokemons: computed(() => state.pokemons as Pokemon[]),
    loading: computed(() => state.loading),
    error: computed(() => state.error),
  };
};
