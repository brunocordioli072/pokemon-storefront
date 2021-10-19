<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import {
  SfButton, SfImage, SfIcon, SfLink,
} from '@storefront-ui/vue';
import { useUiState } from '@/composables/useUiState';

export default defineComponent({
  components: {
    SfButton,
    SfImage,
    SfIcon,
    SfLink,
  },
  setup() {
    const { toggleSearchSidebar } = useUiState();
    return {
      toggleSearchSidebar,
    };
  },
});
</script>

<template>
  <div>
    <div class="sf-header">
      <div class="sf-header__wrapper">
        <header
          ref="header"
          class="sf-header__header"
        >
          <SfButton
            class="sf-button--text sf-header__search"
            @click="toggleSearchSidebar"
          >
            <span class="sf-search-bar__icon">
              <SfIcon
                color="white"
                size="30px"
                icon="search"
              />
            </span>
          </SfButton>
          <SfLink link="/">
            <SfImage
              src="/logo.svg"
              :width="250"
              :height="100"
              alt="pokemon"
              class="sf-header__logo"
            />
          </SfLink>
        </header>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

.sf-header {
  --header-padding: var(--spacer-sm);
  @include for-desktop {
    --header-padding: 0;
  }
  &__logo-image {
    height: 100%;
  }
  ::v-deep &__wrapper {
    border-radius: 10px;
    background: transparent;
  }
  // ::v-deep &__search {
  //   --search-bar-display: flex;
  //   --header-search-flex: 1;
  //   padding: 0 20px;
  // }
}

.header-on-top {
  z-index: 2;
}
.nav-item {
  --header-navigation-item-margin: 0 var(--spacer-base);
  .sf-header-navigation-item__item--mobile {
    display: none;
  }
}
.cart-badge {
  position: absolute;
  bottom: 40%;
  left: 40%;
}
::v-deep .sf-image {
  object-fit: fill;
}

.sf-header__search {
  --search-bar-display: none;
  flex: 0 0 100%;
  margin: var(--spacer-xs) 0;
}
</style>
