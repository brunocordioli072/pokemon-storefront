<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { SfSidebar, SfSearchBar } from '@storefront-ui/vue';
import debounce from 'lodash.debounce';
import { useUiState } from '~/composables/useUiState';
import PokemonList from '@/components/PokemonList.vue';
import { usePokemon } from '~/composables/usePokemon';

export default defineComponent({
  components: {
    SfSidebar,
    SfSearchBar,
    PokemonList,
  },
  setup() {
    const {
      pokemons, pagination, loading, load,
    } = usePokemon();
    const { toggleSearchSidebar, isSearchSidebarOpen } = useUiState();
    const term = ref('');

    const handleSearch = debounce(async (paramValue: any) => {
      term.value = !paramValue.target ? paramValue : paramValue.target.value;

      await load({
        ...pagination.value,
      }, term.value);
    }, 1000);

    return {
      term,
      isSearchSidebarOpen,
      toggleSearchSidebar,
      handleSearch,
      pokemons,
      pagination,
      loading,
    };
  },
});
</script>
<template>
  <SfSidebar
    :visible="isSearchSidebarOpen"
    :button="false"
    title="Search"
    style="backgroud-color: red"
    class="sidebar sf-sidebar--left"
    @close="toggleSearchSidebar"
  >
    <SfSearchBar
      placeholder="Search pokemons"
      aria-label="Search"
      class="sf-search-bar"
      :value="term"
      @input="handleSearch"
      @keydown.enter="handleSearch($event)"
      @keydown.esc="toggleSearchSidebar"
    />
    <PokemonList
      :pokemons="pokemons"
      :loading="loading"
    />
  </SfSidebar>
</template>
