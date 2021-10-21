/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import {
  mount, Wrapper,
} from '@vue/test-utils';
import {
  SfSidebar, SfSearchBar,
} from '@storefront-ui/vue';
import SearchSidebar from './SearchSidebar.vue';
import PokemonList from './PokemonList.vue';

// prevent popping console.error
jest.mock('body-scroll-lock');

const usePokemonListLoad = jest.fn();
jest.mock('@/composables/usePokemonList', () => ({
  usePokemonList: () => ({
    pokemons: [], pagination: {}, loading: false, load: usePokemonListLoad,
  }),
}));

describe('SearchSidebar.vue', () => {
  let wrapper: Wrapper<any, Element>;

  test('should render', () => {
    wrapper = mount(SearchSidebar);

    expect(wrapper.find('.sidebar').exists()).toBe(true);
  });

  test('should render SearchBar and PokemonList', async () => {
    wrapper = mount(SearchSidebar, {
      data() {
        return {
          isSearchSidebarOpen: true,
        };
      },
    });

    const sideBar = wrapper.findComponent(SfSidebar);
    const searchBar = sideBar.findComponent(SfSearchBar);
    const pokemonList = sideBar.findComponent(PokemonList);

    expect(sideBar.exists()).toBe(true);
    expect(searchBar.exists()).toBe(true);
    expect(pokemonList.exists()).toBe(true);

    const input = searchBar.find('input');
    (input.element as any).value = 'charmander';
    await input.trigger('keydown.enter');
    expect(usePokemonListLoad).toBeCalledWith(null, 'charmander');
  });
});
