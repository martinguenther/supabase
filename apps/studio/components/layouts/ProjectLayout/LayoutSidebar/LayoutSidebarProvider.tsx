import { useRouter } from 'next/router'
import { PropsWithChildren, useEffect } from 'react'
import { useRegisterSidebar, useSidebarManagerSnapshot } from 'state/sidebar-manager-state'
import { AIAssistant } from 'components/ui/AIAssistantPanel/AIAssistant'
import { EditorPanel } from 'components/ui/EditorPanel/EditorPanel'
import { AdvisorPanel } from 'components/ui/AdvisorPanel/AdvisorPanel'
import { useSelectedProjectQuery } from 'hooks/misc/useSelectedProject'
import { useSelectedOrganizationQuery } from 'hooks/misc/useSelectedOrganization'
import { useSendEventMutation } from 'data/telemetry/send-event-mutation'

export const SIDEBAR_KEYS = {
  AI_ASSISTANT: 'ai-assistant',
  EDITOR_PANEL: 'editor-panel',
  ADVISOR_PANEL: 'advisor-panel',
} as const

export const LayoutSidebarProvider = ({ children }: PropsWithChildren) => {
  const { data: project } = useSelectedProjectQuery()
  const { data: org } = useSelectedOrganizationQuery()
  const { mutate: sendEvent } = useSendEventMutation()

  useRegisterSidebar(SIDEBAR_KEYS.AI_ASSISTANT, () => <AIAssistant />, {}, 'i')
  useRegisterSidebar(SIDEBAR_KEYS.EDITOR_PANEL, () => <EditorPanel />, {}, 'e')
  useRegisterSidebar(SIDEBAR_KEYS.ADVISOR_PANEL, () => <AdvisorPanel />)

  const router = useRouter()
  const { openSidebar, activeSidebar } = useSidebarManagerSnapshot()

  useEffect(() => {
    if (activeSidebar) {
      // add event tracking
      sendEvent({
        action: 'sidebar_opened',
        properties: {
          sidebar: activeSidebar.id as (typeof SIDEBAR_KEYS)[keyof typeof SIDEBAR_KEYS],
        },
        groups: {
          project: project?.ref ?? 'Unknown',
          organization: org?.slug ?? 'Unknown',
        },
      })
    }
  }, [activeSidebar])

  // Handle sidebar URL parameter
  useEffect(() => {
    if (!router.isReady) return

    const sidebarParam = router.query.sidebar
    if (typeof sidebarParam === 'string') {
      openSidebar(sidebarParam)
    }
  }, [router.isReady, router.query.sidebar, openSidebar])

  return <>{children}</>
}
