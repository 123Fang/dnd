import type { EnhancedMouseEvent } from '@123fang-dnd/core'

export enum DirectionEnum {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  IN = 'IN',
}

export interface AuxiliaryLineLocation {
  event: EnhancedMouseEvent
  element: HTMLElement
  direction: `${DirectionEnum}`
}

export enum LayoutEnum {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL',
}
