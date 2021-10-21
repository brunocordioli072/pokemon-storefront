/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import { SfPagination, SfProductCard } from '@storefront-ui/vue';
import {
  createLocalVue,
  mount, Wrapper,
} from '@vue/test-utils';
import VueRouter from 'vue-router';
import PokemonList from './PokemonList.vue';

describe('PokemonList.vue', () => {
  let wrapper: Wrapper<any, Element>;

  test('should render', () => {
    wrapper = mount(PokemonList);

    expect(wrapper.find('.main').exists()).toBe(true);
  });

  test('should render pokemon', async () => {
    const localVue = createLocalVue();
    localVue.use(VueRouter);
    const router = new VueRouter();
    router.push = jest.fn();

    wrapper = mount(PokemonList, {
      localVue,
      router,
      propsData: {
        pokemons: [{
          id: 1,
          name: 'charmander',
          price: 111,
          image_default: '',
        }],
      },
    });

    const products = wrapper.findAllComponents(SfProductCard);
    const product = products.at(0);
    const productProps = product.props();

    expect(products.length).toBe(1);
    expect(productProps.title).toBe('charmander - #1');
    expect(productProps.regularPrice).toBe('$111');

    await product.find('button').trigger('click');
    expect(router.push).toBeCalledTimes(1);
  });

  test('should render pagination', async () => {
    wrapper = mount(PokemonList, {
      propsData: {
        pagination: {
          totalPages: 1,
          currentPage: 1,
        },
      },
    });

    const pagination = wrapper.findComponent(SfPagination);
    const paginationProps = pagination.props();

    expect(paginationProps.total).toBe(1);
    expect(paginationProps.visible).toBe(5);
    expect(paginationProps.current).toBe(1);
  });

  test('should not render pagination', async () => {
    wrapper = mount(PokemonList, {
      propsData: {
        loading: true,
      },
    });

    const pagination = wrapper.findComponent(SfPagination);

    expect(pagination.exists()).toBe(false);
  });
});
