import type { ComputedRef, Ref } from 'vue'

export type NullUndefinedAble<T> = T | null | undefined



export interface UseReturn {
  pause: () => void
  resume: () => void
  use: UseDragDropContext['use']
  exposed: any
}

export interface EventReturn {
  off: () => void
}

export interface DrapDropEventsCallback {
  onEnd: (event: MouseEvent) => void
  onMove: (event: MouseEvent) => void
  onStart: (event: MouseEvent) => void
  onDragging: (event: MouseEvent) => void
}

export interface UseDragDropContext {
  use: (plugin: DragDropPlugin) => UseReturn
  useDragging: () => Ref<boolean>
  pause: () => void
  resume: () => void
  onEnd: (fn: DrapDropEventsCallback['onEnd']) => EventReturn
  onMove: (fn: DrapDropEventsCallback['onMove']) => EventReturn
  onStart: (fn: DrapDropEventsCallback['onStart']) => EventReturn
  onDragging: (fn: DrapDropEventsCallback['onDragging']) => EventReturn
  castEnhancedMouseEvent: (event: MouseEvent, iframe?: HTMLIFrameElement | undefined) => MouseEvent
}

export interface DragDropPluginCtx {
  context: UseDragDropContext
  expose: <T>(data: T) => void
}

export type DragDropPlugin = (ctx: DragDropPluginCtx) => any


