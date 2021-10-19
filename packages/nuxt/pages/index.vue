<script lang="ts">
import {
  computed,
  defineComponent, useRoute, watch,
} from '@nuxtjs/composition-api';
import PokemonList from '@/components/PokemonList.vue';
import { usePokemonList } from '~/composables/usePokemonList';

export default defineComponent({
  components: {
    PokemonList,
  },
  setup() {
    const {
      pokemons, pagination, loading, load,
    } = usePokemonList();
    const route = useRoute();
    const query = computed(
      () => (route.value.query as unknown) as { page: number },
    );

    watch(
      query,
      () => {
        load({
          ...pagination.value,
          currentPage: (query.value.page ?? 1) - 1,
        });
      },
      { immediate: true },
    );

    return {
      pokemons,
      pagination,
      loading,
    };
  },
});
</script>
<template>
  <div>
    <PokemonList
      :pokemons="pokemons"
      :pagination="pagination"
      :loading="loading"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
