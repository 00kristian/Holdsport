import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * REGLER STORE
 * Tracks which rules tab is active (generelle / burger).
 * This lets the NavBar dropdown set the active tab,
 * and ReglerView reads it — a simple but real example
 * of cross-component state via Pinia.
 */
export const useReglerStore = defineStore('regler', () => {
  const activeTab = ref('generelle') // 'generelle' | 'burger'

  function setTab(tab) {
    activeTab.value = tab
  }

  return { activeTab, setTab }
})
