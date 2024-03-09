import { type MaybeRefOrGetter, computed, ref, toValue, unref, watch } from 'vue'
import type { AnyFn } from '@123fang-dnd/shared'
import type { DragDropPlugin, UseDragDropContext } from '../types'
import { createEventHook, tryOnScopeDispose } from '@123fang-dnd/shared'

import { Scope } from './scope'

interface UseDragDropOptions {
  frames?: Array<MaybeRefOrGetter<HTMLIFrameElement | undefined>>
}

function noop() {
  return undefined
}

export function useDragDrop(options: UseDragDropOptions = {}): UseDragDropContext {
  const {
    frames,
  } = options
  const scope = new Scope()
  const isDraggingRef = ref(false)

  const { on: onEnd, trigger: dispatchEndEvent } = createEventHook()
  const { on: onMove, trigger: dispatchMoveEvent } = createEventHook()
  const { on: onStart, trigger: dispatchStartEvent } = createEventHook()
  const { on: onDragging, trigger: dispatchDraggingEvent } = createEventHook()


  function handleMouseDown(event: MouseEvent, iframe?: HTMLIFrameElement) {
    if (!scope.active) return
    isDraggingRef.value = true
    dispatchStartEvent(event)
    dispatchDraggingEvent(event)
    
  }

  function handleMouseMove(event: MouseEvent, iframe?: HTMLIFrameElement) {
    if (!scope.active) return
    if (!unref(isDraggingRef)) return
    dispatchMoveEvent(event)
    dispatchDraggingEvent(event)
    
  }

  function handleMouseUp(event: MouseEvent, iframe?: HTMLIFrameElement) {
    if (!scope.active) return
    if (!unref(isDraggingRef)) return
    isDraggingRef.value = false
    dispatchEndEvent(event)
    
  }


  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup',handleMouseUp)
  
  const cleanups: [] = []
  let watchStopHandler = noop


  const stop = () => {
    cleanups.forEach(fn => fn())
    cleanups.length = 0
    watchStopHandler()
  }

  function use( UseDragDropContext, DragDropPlugin) {}

  const context: UseDragDropContext = {
    onEnd,
    onMove,
    onStart,
    onDragging,
    use(plugin: DragDropPlugin) {
      return use(context, plugin)!
    },
    pause() {
      return scope.pause()
    },
    resume() {
      return scope.resume()
    },
  }

  tryOnScopeDispose(stop)

  return context
}
