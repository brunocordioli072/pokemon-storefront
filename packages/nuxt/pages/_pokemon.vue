<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  useRoute,
} from '@nuxtjs/composition-api';
import {
  SfImage, SfLoader, SfBadge, SfIcon, SfLink,
} from '@storefront-ui/vue';
import { usePokemon } from '@/composables/usePokemon';

export default defineComponent({
  components: {
    SfImage,
    SfLoader,
    SfBadge,
    SfIcon,
    SfLink,
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
    <SfLoader
      class="loading"
      :loading="loading"
    >
      <div class="product">
        <div class="product__wrapper">
          <div class="product__background">
            <SfLink link="/">
              <SfIcon
                icon="arrow_left"
                size="lg"
              />
            </SfLink>
            <div class="product__image">
              <SfImage
                :src="pokemon.image_artwork"
                :width="250"
                :height="250"
                alt="pokemon"
                class="sf-header__logo"
              />
            </div>
          </div>
          <div class="product__description">
            <h1>
              {{ pokemon.name }}
            </h1>
          </div>
          <div
            v-if="pokemon.types"
            class="product__badges"
          >
            <SfBadge
              v-for="type in pokemon.types"
              :key="type.id"
              class="product__badges__badge"
            >
              {{ type.name }}
            </SfBadge>
          </div>
        </div>
      </div>
    </SfLoader>
  </div>
</template>
<style lang="scss" scoped>
.product {
  border-style: solid;
  border-radius: 23px;
  &__wrapper {
    border-radius: 20px;
    background-color: white;
    height: 600px;
  }
  &__background {
    background-color: #ffcb05;
    border-radius: 20px 20px 0 0;
    padding: 10px;
  }
  &__back {
    margin-top: 10px;
  }
  &__image {
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  &__description {
    position: relative;
    font: var(
      --product-card-title-font,
      var(--product-card-title-font-weight, var(--font-weight--normal))
        var(--product-card-title-font-size, var(--h5-font-size)) /
        var(--product-card-title-font-line-height, 1.6)
        var(--product-card-title-font-family, var(--font-family--secondary))
    );
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__badges {
    display: flex;
    justify-content: center;
    align-items: center;
    &__badge {
      margin: 2px;
    }
  }
}
</style>
