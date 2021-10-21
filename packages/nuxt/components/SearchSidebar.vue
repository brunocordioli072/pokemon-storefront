<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { SfSidebar, SfSearchBar } from '@storefront-ui/vue';
import debounce from 'lodash.debounce';
import { useUiState } from '@/composables/useUiState';
import PokemonList from '@/components/PokemonList.vue';
import { usePokemonList } from '@/composables/usePokemonList';

export default defineComponent({
  components: {
    SfSidebar,
    SfSearchBar,
    PokemonList,
  },
  setup() {
    const {
      pokemons, pagination, loading, load,
    } = usePokemonList();
    const { toggleSearchSidebar, isSearchSidebarOpen } = useUiState();
    const term = ref('');
    const handleSearchWithDebounce = debounce(() => {
      load(null, term.value);
    }, 1000);
    const handleSearch = async (paramValue: any, doDebounce = true) => {
      term.value = !paramValue.target ? paramValue : paramValue.target.value;
      if (doDebounce) {
        handleSearchWithDebounce();
      } else {
        handleSearchWithDebounce.cancel();
        await load(null, term.value);
      }
    };

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
      @keydown.enter="handleSearch($event, false)"
      @keydown.esc="toggleSearchSidebar"
    />
    <PokemonList
      :pokemons="pokemons"
      :loading="loading"
    />
  </SfSidebar>
</template>
