/* eslint-disable camelcase */
import { computed, reactive } from '@nuxtjs/composition-api';
import { createClient } from 'pokeapi-js';
import { Pokemon, capitalizeWord, calculatePokemonPrice } from './helpers';

export interface Pagination {
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  pageOptions: number[];
}

export const usePokemonList = () => {
  const state = reactive({
    pokemons: (null as unknown) as Pokemon[],
    pagination: (null as unknown) as Pagination,
    loading: false,
    error: {
      load: null as any,
    },
  });

  const client = createClient();

  const getPagination = () => {
    // number of pokemons in first generation = 151
    const maxPokemons = 151;
    const itemsPerPage = 20;
    const totalPages = Math.ceil(maxPokemons / itemsPerPage);
    const pageOptions = [];
    for (let i = 0; i < totalPages; i++) {
      pageOptions.push(i);
    }
    const pagination: Pagination = {
      itemsPerPage,
      totalPages,
      currentPage: 0,
      pageOptions,
    };
    return pagination;
  };

  const load = async (pagination: Pagination, search?: string) => {
    try {
      state.loading = true;
      state.pagination = pagination;
      const res = (await client.chain.query
        .pokemon_v2_pokemonspecies({
          where: search
            ? { generation_id: { _eq: 1 }, name: { _iregex: search } }
            : { generation_id: { _eq: 1 } },
          order_by: { id: 'asc' } as any,
          limit: state.pagination.itemsPerPage,
          offset: state.pagination.currentPage * state.pagination.itemsPerPage,
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
    pagination: computed(() => state.pagination as Pagination),
    pokemons: computed(() => state.pokemons as Pokemon[]),
    loading: computed(() => state.loading),
    error: computed(() => state.error),
  };
};
