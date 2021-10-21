/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import {
  mount, Wrapper, createLocalVue,
} from '@vue/test-utils';
import {
  SfLink, SfImage, SfBadge,
} from '@storefront-ui/vue';
import VueRouter from 'vue-router';
import Pokemon from './Pokemon.vue';

describe('Pokemon.vue', () => {
  let wrapper: Wrapper<any, Element>;

  test('should render', () => {
    wrapper = mount(Pokemon, {
      propsData: {
        pokemon: {
          image_artwork: '',
          name: '',
          types: [{
            id: '',
            name: '',
          }],
        },
      },
    });
    expect(wrapper.find('.product').exists()).toBe(true);
  });

  test('should render pokemon iamge, name and types', async () => {
    const localVue = createLocalVue();
    localVue.use(VueRouter);
    const router = new VueRouter();
    router.push = jest.fn();
    wrapper = mount(Pokemon, {
      localVue,
      router,
      propsData: {
        pokemon: {
          image_artwork: 'http://imagesite.com/charmander.png',
          name: 'charmander',
          types: [{
            id: '1',
            name: 'fire',
          }, {
            id: '2',
            name: 'cuteness',
          }],
        },
      },
    });
    const goBack = wrapper.findComponent(SfLink);
    const pokemonImage = wrapper.findComponent(SfImage);
    const pokemonName = wrapper.find('.product__description');
    const pokemonTypes = wrapper.findAllComponents(SfBadge);
    const pokemonImageProps = pokemonImage.props();

    expect(goBack.exists()).toBe(true);
    expect(pokemonImage.exists()).toBe(true);
    expect(pokemonName.exists()).toBe(true);
    expect(pokemonTypes.exists()).toBe(true);

    expect(pokemonImageProps.src).toBe('charmander.png');
    expect(pokemonName.text()).toBe('charmander');
    expect(pokemonTypes.length).toBe(2);
    goBack.trigger('click');
    expect(router.push).toBeCalledTimes(1);
  });
});
