<script lang="ts">
import {
  computed,
  defineComponent,
  useRoute,
  watch,
} from '@nuxtjs/composition-api';
import PokemonList from '@/components/PokemonList.vue';
import { usePokemonPaginated } from '~/composables/usePokemonPaginated';

export default defineComponent({
  components: {
    PokemonList,
  },
  setup() {
    const {
      pokemons, loading, load, pagination,
    } = usePokemonPaginated();
    const route = useRoute();
    const query = computed(
      () => route.value.query as unknown as { page: number },
    );
    watch(
      query,
      async () => {
        await load(query.value.page);
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

<style lang="scss" scoped></style>
