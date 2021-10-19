/* eslint-disable camelcase */
import { computed, reactive } from '@nuxtjs/composition-api';
import { createClient, pokemon_v2_pokemonspecies } from 'pokeapi-js';

export interface Pokemon extends pokemon_v2_pokemonspecies {
  image_default?: string;
  price?: number;
}

export interface Pagination {
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  pageOptions: number[];
}

export const usePokemon = () => {
  const state = reactive({
    pokemons: (null as unknown) as Pokemon[],
    pagination: (null as unknown) as Pagination,
    loading: false,
    error: {
      load: null as any,
    },
  });

  const client = createClient();

  const capitalizeWord = ([first, ...rest]: string) => first.toUpperCase() + rest.join('');

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

  const calculatePrice = (pokemon: Pokemon) => {
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
        price: calculatePrice(el),
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
