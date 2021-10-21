<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  useRoute,
} from '@nuxtjs/composition-api';
import { usePokemon } from '@/composables/usePokemon';
import Pokemon from '@/components/Pokemon.vue';

export default defineComponent({
  components: {
    Pokemon,
  },
  setup() {
    const { load, pokemon, loading } = usePokemon();
    const route = useRoute();
    const params = computed(() => route.value.params);
    onBeforeMount(async () => {
      await load(params.value.pokemon as any);
    });

    return {
      pokemon,
      loading,
    };
  },
});
</script>

<template>
  <div>
    <Pokemon
      :loading="loading"
      :pokemon="pokemon"
    />
  </div>
</template>
