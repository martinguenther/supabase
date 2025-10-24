import { Button } from 'ui'
import { debugModeStore } from './debugModeStore'

export const DebugModeToast = () => {
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
    <div className="flex flex-col gap-2">
      <p>Debug Mode is On</p>
      <Button onClick={handleDisableDebugMode}>Disable</Button>
    </div>
  )
}
