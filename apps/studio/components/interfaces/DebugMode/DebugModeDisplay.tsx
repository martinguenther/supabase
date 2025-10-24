import { motion, useMotionValue } from 'framer-motion'
import { useEffect, useMemo, useRef, type ReactNode } from 'react'

import { Button, cn } from 'ui'

const PANEL_MARGIN = 16

type Position = {
  x: number
  y: number
}

type PanelAnchor = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
type ResolvedMargins = Record<'top' | 'right' | 'bottom' | 'left', number>
type MarginConfig = Partial<ResolvedMargins>

const resolveMargins = (margins?: MarginConfig): ResolvedMargins => ({
  top: margins?.top ?? PANEL_MARGIN,
  right: margins?.right ?? PANEL_MARGIN,
  bottom: margins?.bottom ?? PANEL_MARGIN,
  left: margins?.left ?? PANEL_MARGIN,
})

const getAnchorPositionStyles = (anchor: PanelAnchor, margins: ResolvedMargins) => {
  return {
    ...(anchor.includes('top') ? { top: margins.top } : { bottom: margins.bottom }),
    ...(anchor.includes('left') ? { left: margins.left } : { right: margins.right }),
  }
}

const clampToViewport = (
  element: HTMLElement,
  anchor: PanelAnchor,
  margins: ResolvedMargins,
  position: Position
) => {
  if (typeof window === 'undefined') {
    return { x: position.x, y: position.y }
  }
  if (!element) {
    return { x: position.x, y: position.y }
  }

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const width = element.offsetWidth
  const height = element.offsetHeight

  const adjustedRightMargin = viewportWidth - width - margins.right
  const adjustedBottomMargin = viewportHeight - height - margins.bottom

  const isAlignedRight = anchor.includes('right')
  const isAlignedBottom = anchor.includes('bottom')
  const baseLeft = isAlignedRight ? adjustedRightMargin : margins.left
  const baseTop = isAlignedBottom ? adjustedBottomMargin : margins.top

  const minLeft = margins.left
  const maxLeft = Math.max(margins.left, adjustedRightMargin)
  const minTop = margins.top
  const maxTop = Math.max(margins.top, adjustedBottomMargin)

  const candidateLeft = baseLeft + position.x
  const candidateTop = baseTop + position.y
  const clampedLeft = Math.min(Math.max(candidateLeft, minLeft), maxLeft)
  const clampedTop = Math.min(Math.max(candidateTop, minTop), maxTop)

  return {
    x: clampedLeft - baseLeft,
    y: clampedTop - baseTop,
  }
}

type DraggableWrapperProps = {
  className?: string
  anchor?: PanelAnchor
  margins?: MarginConfig
  children: ReactNode
}

const DraggableWrapper = ({
  className,
  anchor = 'top-right',
  margins,
  children,
}: DraggableWrapperProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const resolvedMargins = useMemo(() => resolveMargins(margins), [margins])
  const anchorPositionStyles = useMemo(
    () => getAnchorPositionStyles(anchor, resolvedMargins),
    [anchor, resolvedMargins]
  )

  const handleDragEnd = () => {
    if (!wrapperRef.current) return

    const clampedPosition = clampToViewport(wrapperRef.current, anchor, resolvedMargins, {
      x: x.get(),
      y: y.get(),
    })
    requestAnimationFrame(() => {
      x.set(clampedPosition.x)
      y.set(clampedPosition.y)
    })
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      if (!wrapperRef.current) return

      const clamped = clampToViewport(wrapperRef.current, anchor, resolvedMargins, {
        x: x.get(),
        y: y.get(),
      })
      x.set(clamped.x)
      y.set(clamped.y)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [x, y, anchor, resolvedMargins])

  return (
    <motion.div
      ref={wrapperRef}
      drag
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{ x, y, ...anchorPositionStyles }}
      className={cn('fixed cursor-move', className)}
    >
      {children}
    </motion.div>
  )
}

type DebugModeDisplayProps = {
  onClose: () => void
}

export const DebugModeDisplay = ({ onClose }: DebugModeDisplayProps) => {
  return (
    <DraggableWrapper anchor="top-right">
      <div className={cn('border rounded-lg bg', 'px-6 py-4', 'flex flex-col gap-2')}>
        <p>Debug Mode is On</p>
        <Button onClick={onClose}>Disable</Button>
      </div>
    </DraggableWrapper>
  )
}
