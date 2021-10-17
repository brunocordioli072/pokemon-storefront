<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api';
import {
  SfLoader, SfProductCard, SfPagination,
} from '@storefront-ui/vue';
import { Pokemon } from '@/composables/usePokemons';

export default defineComponent({
  components: {
    SfLoader,
    SfProductCard,
    // SfPagination,
  },
  props: {
    pokemons: {
      type: Array as PropType<Pokemon[]>,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
  },
  setup(props) {

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
            @click="$router.push(`/p/${pokemon.id}`)"
          />
        </transition-group>
        <!-- <SfPagination
          v-if="!categoriesLoading || !loading"
          v-show="pagination.totalPages > 1"
          class="products__pagination"
          :current="pagination.currentPage"
          :total="pagination.totalPages"
          :visible="5"
        />
        <div
          v-show="pagination.totalPages > 1"
          class="products__show-on-page"
        >
          <SfSelect
            :value="pagination.itemsPerPage.toString()"
            class="products__items-per-page"
            @input="th.changeItemsPerPage"
          >
            <SfSelectOption
              v-for="option in pagination.pageOptions"
              :key="option"
              :value="option"
              class="products__items-per-page__option"
            >
              {{ option }}
            </SfSelectOption>
          </SfSelect>
        </div> -->
      </div>
    </SfLoader>
  </div>
</template>

<style>

</style>
