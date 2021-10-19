import { reactive, computed } from '@nuxtjs/composition-api';

const state = reactive({
  isSearchSidebarOpen: false,
});

export const useUiState = () => {
  const isSearchSidebarOpen = computed(() => state.isSearchSidebarOpen);
  const toggleSearchSidebar = () => {
    state.isSearchSidebarOpen = !state.isSearchSidebarOpen;
  };

  return {
    isSearchSidebarOpen,
    toggleSearchSidebar,
  };
};
