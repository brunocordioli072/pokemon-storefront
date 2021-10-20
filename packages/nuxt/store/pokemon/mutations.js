/* eslint-disable no-param-reassign */
export default {
  listPaginated(state, { page, pokemons }) {
    state.listPaginated[page] = pokemons;
  },
};
