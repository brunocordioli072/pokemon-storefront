<script lang="ts">
import {
  defineComponent,
} from '@nuxtjs/composition-api';
import { usePokemons } from '@/composables/usePokemons';
import PokemonList from '@/components/PokemonList.vue';

export default defineComponent({
  components: {
    PokemonList,
  },
  setup() {
    const { result: pokemons, loading } = usePokemons();

    return {
      pokemons,
      loading,
    };
  },
});
</script>
<template>
  <div>
    <PokemonList
      :pokemons="pokemons"
      :loading="loading"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

.main {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
  &.section {
    padding: var(--spacer-xs);
    @include for-desktop {
      padding: 0;
    }
  }
}

.products {
  box-sizing: border-box;
  flex: 1;
  margin: 0;

  &__grid {
    justify-content: center;
    @include for-desktop {
      justify-content: flex-start;
    }
  }

  &__grid, &__list {
    display: flex;
    flex-wrap: wrap;
  }

  &__product-card {
    margin: 5px;
    border-radius: 20px;
    --product-card-title-margin: var(--spacer-base) 0 0 0;
    --product-card-title-font-weight: var(--font-weight--medium);
    --product-card-title-margin: var(--spacer-xs) 0 0 0;
    flex: 1 1 50%;
    @include for-desktop {
      --product-card-title-font-weight: var(--font-weight--normal);
      --product-card-add-button-bottom: var(--spacer-base);
      --product-card-title-margin: var(--spacer-sm) 0 0 0;
      ::v-deep .sf-image {
        --image-width: 14rem;
        --image-height: 11rem;
      }
    }
    @include for-mobile {
      ::v-deep .sf-image {
        --image-width: 10rem;
        --image-height: 8rem;
      }
    }
  }

  &__slide-enter {
    opacity: 0;
    transform: scale(0.5);
  }

  &__slide-enter-active {
    transition: all 0.2s ease;
    transition-delay: calc(0.1s * var(--index));
  }

  @include for-desktop {
    &__pagination {
      display: flex;
      justify-content: flex-start;
      margin: var(--spacer-xl) 0 0 0;
    }
    &__product-card {
      flex: 1 1 25%;
    }
    &__list {
      margin: 0 0 0 var(--spacer-sm);
    }
  }

  &__show-on-page {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;

    &__label {
      font-family: var(--font-family--secondary);
      font-size: var(--font-size--sm);
    }
  }
}

.loading {
  margin: var(--spacer-3xl) auto;
  @include for-desktop {
    margin-top: 6.25rem;
  }

  &--categories {
    @include for-desktop {
      margin-top: 3.75rem;
    }
  }
}

</style>
