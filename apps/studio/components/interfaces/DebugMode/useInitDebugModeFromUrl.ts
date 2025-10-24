import { useEffect } from 'react'

import { DEBUG_MODE_KEYS, debugModeStore, type DebugModeKey } from './debugModeStore'

const isDebugModeKey = (key: string): key is DebugModeKey => {
  return (DEBUG_MODE_KEYS as readonly string[]).includes(key)
}

const parseDebugMode = (queryValue: string): readonly DebugModeKey[] => {
  if (queryValue === 'false') return []
  if (queryValue === 'true') return DEBUG_MODE_KEYS

  const keys = queryValue
    .split(',')
    .map((k) => k.trim())
    .filter(isDebugModeKey)
  return keys
}

export const useInitDebugModeFromUrl = () => {
  useEffect(() => {
    const debugMode = new URLSearchParams(window.location.search).get('debug')
    if (!debugMode) return

    const enabledKeys = parseDebugMode(debugMode)
    if (enabledKeys.length > 0) {
      debugModeStore.enableKeys(enabledKeys)
    }
  }, [])
}
