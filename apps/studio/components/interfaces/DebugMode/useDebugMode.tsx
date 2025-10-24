import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import {
  DEBUG_MODE_KEYS,
  debugModeStore,
  useIsDebugModeEnabled,
  type DebugModeKey,
} from './debugModeStore'
import { DebugModeToast } from './DebugModeToast'

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

const useInitDebugModeFromUrl = () => {
  useEffect(() => {
    const debugMode = new URLSearchParams(window.location.search).get('debug')
    if (!debugMode) return

    const enabledKeys = parseDebugMode(debugMode)
    if (enabledKeys.length > 0) {
      debugModeStore.enableKeys(enabledKeys)
    }
  }, [])
}

export const useDebugMode = () => {
  useInitDebugModeFromUrl()
  const isEnabled = useIsDebugModeEnabled()

  const toastRef = useRef<string | number | null>(null)

  useEffect(() => {
    if (isEnabled && !toastRef.current) {
      toastRef.current = toast(<DebugModeToast />, {
        id: 'debug-mode-toast',
        duration: Infinity,
      })
    } else if (!isEnabled && toastRef.current) {
      toast.dismiss(toastRef.current)
      toastRef.current = null
    }
  }, [isEnabled])
}
