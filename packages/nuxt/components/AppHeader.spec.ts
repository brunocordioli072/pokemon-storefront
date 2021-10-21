/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import {
  mount, Wrapper, createLocalVue,
} from '@vue/test-utils';
import {
  SfIcon, SfButton, SfLink, SfImage,
} from '@storefront-ui/vue';
import VueRouter from 'vue-router';
import AppHeader from './AppHeader.vue';
import { useUiState } from '@/composables/useUiState';

describe('AppHeader.vue', () => {
  let wrapper: Wrapper<any, Element>;

  test('should render', () => {
    wrapper = mount(AppHeader);
    expect(wrapper.find('.sf-header').exists()).toBe(true);
  });

  test('should have search button', async () => {
    wrapper = mount(AppHeader);
    const { isSearchSidebarOpen } = useUiState();
    const buttons = wrapper.findAllComponents(SfButton);
    const searchButton = buttons.at(0);
    const searchIcon = searchButton.findComponent(SfIcon);

    expect(buttons.length).toBe(1);
    expect(searchIcon.exists()).toBe(true);

    expect(isSearchSidebarOpen.value).toBe(false);
    await searchButton.trigger('click');
    expect(isSearchSidebarOpen.value).toBe(true);
  });

  test('should have logo link', async () => {
    const localVue = createLocalVue();
    localVue.use(VueRouter);
    const router = new VueRouter();
    router.push = jest.fn();

    wrapper = mount(AppHeader, {
      localVue,
      router,
    });
    const links = wrapper.findAllComponents(SfLink);
    const logoLink = links.at(0);
    const logo = logoLink.findComponent(SfImage);
    const logoProps = logo.props();

    expect(links.length).toBe(1);
    expect(logo.exists()).toBe(true);
    expect(logoProps.src).toBe('/logo.svg');

    await logoLink.trigger('click');
    expect(router.push).toHaveBeenCalledTimes(1);
  });
});
