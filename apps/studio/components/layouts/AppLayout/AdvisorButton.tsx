import { Lightbulb } from 'lucide-react'

import { useParams } from 'common'
import { ButtonTooltip } from 'components/ui/ButtonTooltip'
import { useProjectLintsQuery } from 'data/lint/lint-query'
import { useSidebarManagerSnapshot } from 'state/sidebar-manager-state'
import { SIDEBAR_KEYS } from 'components/layouts/ProjectLayout/LayoutSidebar/LayoutSidebarProvider'
import { cn } from 'ui'

export const AdvisorButton = () => {
  const { ref: projectRef } = useParams()
  const { toggleSidebar, activeSidebar } = useSidebarManagerSnapshot()
  const { data: lints } = useProjectLintsQuery({ projectRef })

  const hasCriticalIssues = Array.isArray(lints) && lints.some((lint) => lint.level === 'ERROR')

  const isOpen = activeSidebar?.id === SIDEBAR_KEYS.ADVISOR_PANEL

  const handleClick = () => {
    toggleSidebar(SIDEBAR_KEYS.ADVISOR_PANEL)
  }

  return (
    <div className="relative">
      <ButtonTooltip
        type="outline"
        size="tiny"
        id="advisor-center-trigger"
        className={cn(
          'rounded-full w-[32px] h-[32px] flex items-center justify-center p-0 group',
          isOpen && 'bg-foreground text-background'
        )}
        onClick={handleClick}
        tooltip={{
          content: {
            text: 'Advisor Center',
          },
        }}
      >
        <Lightbulb
          size={16}
          strokeWidth={1.5}
          className={cn(
            'text-foreground-light group-hover:text-foreground',
            isOpen && 'text-background group-hover:text-background'
          )}
        />
      </ButtonTooltip>
      {hasCriticalIssues && (
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-destructive" />
      )}
    </div>
  )
}
