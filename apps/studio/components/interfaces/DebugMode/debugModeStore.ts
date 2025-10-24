import { proxy, useSnapshot } from 'valtio'

export const DEBUG_MODE_KEYS = ['localStorage', 'snippets'] as const
export type DebugModeKey = (typeof DEBUG_MODE_KEYS)[number]

type IDebugModeStore = {
  // INTERNAL STATES
  // ===============
  _enabled: DebugModeKey[]

  // ACCESSORS
  // =========
  isEnabled(keys?: DebugModeKey | DebugModeKey[]): boolean

  // API
  // ===
  enableAll(): void
  disableAll(): void
  enableKeys(keys: DebugModeKey | readonly DebugModeKey[]): void
  disableKeys(keys: DebugModeKey | DebugModeKey[]): void
  replaceEnabledKeys(keys: DebugModeKey | DebugModeKey[]): void
}

export const debugModeStore = proxy<IDebugModeStore>({
  // Tried using a proxySet but doesn't seem to work; there is something odd
  // going on with useSnapshot subscriptions to proxySet changes
  _enabled: [],
  isEnabled(keys?: DebugModeKey | DebugModeKey[]): boolean {
    if (debugModeStore._enabled.length === 0) return false

    if (!keys) return true

    const keysArray = Array.isArray(keys) ? keys : [keys]
    return keysArray.some((key) => debugModeStore._enabled.includes(key))
  },
  enableAll(): void {
    debugModeStore._enabled = [...DEBUG_MODE_KEYS]
  },
  disableAll(): void {
    debugModeStore._enabled = []
  },
  enableKeys(keys: DebugModeKey | readonly DebugModeKey[]): void {
    if (Array.isArray(keys) && keys.length === 0) return

    const keysArray = Array.isArray(keys) ? keys : [keys]
    const keysToAdd = keysArray.filter((key) => !debugModeStore._enabled.includes(key))
    debugModeStore._enabled = [...debugModeStore._enabled, ...keysToAdd]
  },
  disableKeys(keys: DebugModeKey | DebugModeKey[]): void {
    const keysArray = Array.isArray(keys) ? keys : [keys]
    debugModeStore._enabled = debugModeStore._enabled.filter((key) => !keysArray.includes(key))
  },
  replaceEnabledKeys(keys: DebugModeKey | DebugModeKey[]): void {
    debugModeStore._enabled = Array.isArray(keys) ? [...keys] : [keys]
  },
})

export const useIsDebugModeEnabled = () => {
  const snap = useSnapshot(debugModeStore)
  return snap._enabled.length > 0
}
