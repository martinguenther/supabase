import { Suspense, lazy } from 'react'

import { debugModeStore, useIsDebugModeEnabled } from './debugModeStore'
import { useInitDebugModeFromUrl } from './useInitDebugModeFromUrl'

const DebugModeDisplay = lazy(() =>
  import('./DebugModeDisplay').then((mod) => ({ default: mod.DebugModeDisplay }))
)

export const DebugMode = () => {
  useInitDebugModeFromUrl()
  const isEnabled = useIsDebugModeEnabled()

  if (!isEnabled) return null

  const handleDisableDebugMode = () => {
    debugModeStore.disableAll()

    const params = new URLSearchParams(window.location.search)
    params.delete('debug')
    const newUrl =
      window.location.pathname +
      (params.toString() ? `?${params.toString()}` : '') +
      window.location.hash
    window.history.replaceState({}, '', newUrl)
  }

  return (
    <Suspense fallback={null}>
      <DebugModeDisplay onClose={handleDisableDebugMode} />
    </Suspense>
  )
}
