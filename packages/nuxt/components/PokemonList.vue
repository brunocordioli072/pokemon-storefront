<script lang="ts">
import { defineComponent, PropType, useRouter } from '@nuxtjs/composition-api';
import { SfLoader, SfProductCard, SfPagination } from '@storefront-ui/vue';
import { Pokemon } from '@/composables/usePokemonList';
import { useUiState } from '@/composables/useUiState';

export default defineComponent({
  components: {
    SfLoader,
    SfProductCard,
    SfPagination,
  },
  props: {
    pokemons: {
      type: Array as PropType<Pokemon[]>,
      default: () => [],
    },
    pagination: {
      type: Object,
      default: () => null,
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
  },
  setup() {
    const { isSearchSidebarOpen, toggleSearchSidebar } = useUiState();
    const router = useRouter();
    const handleClick = (pokemon: Pokemon) => {
      if (isSearchSidebarOpen) toggleSearchSidebar();
      router.push(`/${pokemon.id}`);
    };
    return {
      handleClick,
    };
  },
});
</script>

<template>
  <div class="main section">
    <SfLoader
      class="loading"
      :loading="loading"
    >
      <div
        v-if="!loading"
        class="products"
      >
        <transition-group
          appear
          name="products__slide"
          tag="div"
          class="products__grid"
        >
          <SfProductCard
            v-for="(pokemon, i) in pokemons"
            :key="i"
            class="products__product-card"
            :style="{ '--index': i }"
            :regular-price="`$${pokemon.price}`"
            :title="`${pokemon.name} - #${pokemon.id}`"
            :image="pokemon.image_default"
            wishlist-icon=""
            is-on-wishlist-icon=""
            @click="handleClick(pokemon)"
          />
        </transition-group>
        <SfPagination
          v-if="!loading && pagination"
          v-show="pagination.totalPages > 1"
          class="products__pagination"
          :current="pagination.currentPage"
          :total="pagination.totalPages"
          :visible="5"
        />
      </div>
    </SfLoader>
  </div>
</template>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

.main {
  box-sizing: border-box;
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
    @include for-desktop {
      justify-content: flex-start;
    }
  }

  &__grid,
  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
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
  margin: var(--spacer-2xl) auto;
  @include for-desktop {
    margin-top: 6.25rem;
  }

  &--categories {
    @include for-desktop {
      margin-top: 3.75rem;
    }
  }
}

.sf-pagination {
  --pagination-item-color: white;

  ::v-deep .sf-icon {
    fill: white;
  }
}

</style>
