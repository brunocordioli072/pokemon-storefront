/* eslint-disable camelcase */
import { computed, reactive, useStore } from '@nuxtjs/composition-api';
import { Pokemon } from './helpers';
import { usePokemonList } from './usePokemonList';

export interface Pagination {
  totalPages?: number;
  currentPage?: number;
  itemsPerPage?: number;
  pageOptions?: number[];
}

export const usePokemonPaginated = () => {
  const { load: loadPokemonList, pokemons, pagination } = usePokemonList();
  const store = useStore();
  const state = reactive({
    pokemons: (null as unknown) as Pokemon[],
    loading: false,
    error: {
      load: null as any,
    },
  });

  const load = async (page: number = 1) => {
    try {
      state.loading = true;
      if (!store.getters['pokemon/listPaginated'][page]) {
        await loadPokemonList({
          ...pagination.value,
          currentPage: (page ?? 1) - 1,
        });
        store.commit('pokemon/listPaginated', { page, pokemons: pokemons.value });
      }
      state.pokemons = store.getters['pokemon/listPaginated'][page];
      state.error.load = null;
    } catch (err) {
      state.error.load = err;
    } finally {
      state.loading = false;
    }
  };

  return {
    load,
    pagination,
    pokemons: computed(() => state.pokemons as Pokemon[]),
    loading: computed(() => state.loading),
    error: computed(() => state.error),
  };
};
