<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import AppHeader from '@/components/AppHeader.vue';
import SearchSidebar from '@/components/SearchSidebar.vue';

export default defineComponent({
  components: {
    AppHeader,
    SearchSidebar,
  },
  setup() {

  },
});
</script>

<template>
  <div class="app">
    <AppHeader />
    <Nuxt />
    <SearchSidebar />
  </div>
</template>
<style lang="scss">
@import "~@storefront-ui/vue/styles";

html {
  background-color: #dc0a2d;
}
body {
  margin: 0;
}

.app {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 70%;
    margin: 0 auto;
  }
}
</style>
