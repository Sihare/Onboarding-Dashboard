import { ref, watch } from 'vue'

/**
  * @param {string} key    
 * @param {*}      defaultValue  
 */
export function useLocalStorage(key, defaultValue) {
  
  let stored = null
  try {
    const raw = localStorage.getItem(key)
    if (raw !== null) stored = JSON.parse(raw)
  } catch {
    stored = null
  }

  const state = ref(stored !== null ? stored : defaultValue)
 
  watch(
    state,
    val => {
      try {
        localStorage.setItem(key, JSON.stringify(val))
      } catch {   }
    },
    { deep: true }
  )

  return state
}
 
export function clearAppStorage() {
  Object.keys(localStorage)
    .filter(k => k.startsWith('onboard_'))
    .forEach(k => localStorage.removeItem(k))
}
