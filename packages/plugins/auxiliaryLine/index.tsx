import type { DragDropPluginCtx, DrapDropEventsCallback, EnhancedMouseEvent, MaybeBoolOrFuncOrString } from '@123fang-dnd/core'
import type { CSSProperties, VNodeChild } from 'vue'
import { computed, ref, unref } from 'vue'
import { getBoundingClientRect, isBool, isFunc,isString } from '@123fang-dnd/shared'
import { calculateLayout, calculateXLocation, calculateYLocation, getMouseAfterElement, getMouseBeforeElement, isElementNode, isInThresholdRange, numberToPx } from './helpers'
import { type AuxiliaryLineLocation, DirectionEnum, LayoutEnum } from './types'

const buildInMethods: Required<Pick<AuxiliaryLinePluginOptions, 'getElementChildrenAndContainer' | 'getTargetElementByEvent' | 'onRender'>> = {
  onRender(location, style) {
    if (!location || location.direction === DirectionEnum.IN) return null
    return <div style={style}></div>
  },
  getTargetElementByEvent: event => event.target!,
  getElementChildrenAndContainer: (element, inThresholdRange) => {
    if (inThresholdRange) {
      return {
        container: element,
        children: Array.from(element.childNodes).filter(isElementNode) as HTMLElement[],
      }
    }

    return {
      container: element.parentElement!,
      children: Array.from(element.parentElement!.childNodes).filter(isElementNode) as HTMLElement[],
    }
  },
}

interface AuxiliaryLinePluginOptions {
  thresholdSize?: number
  auxiliaryLineSize?: number
  onEnd?: DrapDropEventsCallback['onEnd']
  onMove?: DrapDropEventsCallback['onMove']
  onStart?: DrapDropEventsCallback['onStart']
  getTargetElementByEvent?: (event: EnhancedMouseEvent) => HTMLElement
  showAuxiliaryLine?: MaybeBoolOrFuncOrString<(event: EnhancedMouseEvent) => boolean>
  onRender?: (location: AuxiliaryLineLocation | undefined, style: Record<string, any>) => VNodeChild
  getElementChildrenAndContainer?: (element: HTMLElement, inThresholdRange: boolean) => { children: HTMLElement[]; container: HTMLElement },
}

export function auxiliaryLinePlugin(options: AuxiliaryLinePluginOptions = {}) {
  return function ({ context }: DragDropPluginCtx) {
    const {
      onEnd,
      onMove,
      onStart,
      thresholdSize = 8,
      auxiliaryLineSize = 2,
      showAuxiliaryLine = true,
      onRender = buildInMethods.onRender,
      getTargetElementByEvent = buildInMethods.getTargetElementByEvent,
      getElementChildrenAndContainer = buildInMethods.getElementChildrenAndContainer,
    } = options

    const auxiliaryLineLocationRef = ref<AuxiliaryLineLocation>()

    let showAuxiliaryLineClassName:string = ''
    function getShowAuxiliaryLine(event: EnhancedMouseEvent) {
      if (isBool(showAuxiliaryLine)) return showAuxiliaryLine
      if (isFunc(showAuxiliaryLine)) return showAuxiliaryLine(event)
      // showAuxiliaryLineClassName 为字符串表示只按css类名来显示辅助线
      if (isString(showAuxiliaryLine)) {
        showAuxiliaryLineClassName = showAuxiliaryLine
        return !!event.target?.classList?.contains?.(showAuxiliaryLineClassName)
      }
      return true
    }

    function calculateAuxiliaryLineLocation(event: EnhancedMouseEvent): AuxiliaryLineLocation | undefined {
      const element = getTargetElementByEvent(event) // event.target
      const inThresholdRange = isInThresholdRange(element, event, thresholdSize) // 是否在element元素的 thresholdSize 内部（thresholdSize）
      const { container, children } = getElementChildrenAndContainer(element, inThresholdRange)

      
      if (children.length <= 0) {// 没有children的情况
        return {
          event,
          element,
          direction: DirectionEnum.IN,
        }
      }

      const firstElement = children[0]
      /** start **/
      // showAuxiliaryLineClassName 表示只按css类名来显示辅助线，
      // 这里处理子元素，如果子元素没有这个css类名，就不计算。
      if (showAuxiliaryLineClassName && !firstElement?.classList?.contains(showAuxiliaryLineClassName)) return
      /** end **/
      const layout = calculateLayout(firstElement, container)
      let afterMouseElement = getMouseAfterElement(children, event, layout)
      let beforeMouseElement = getMouseBeforeElement(children, event, layout)

      if (!afterMouseElement) afterMouseElement = beforeMouseElement
      if (!beforeMouseElement) beforeMouseElement = afterMouseElement

      return layout === LayoutEnum.HORIZONTAL
        ? calculateXLocation(beforeMouseElement!, afterMouseElement!, event)
        : calculateYLocation(beforeMouseElement!, afterMouseElement!, event)
    }

    context.onStart((event) => {
      // onStart?.(event)
    })

    context.onMove((event) => {
      if (!getShowAuxiliaryLine(event)) return
      const auxiliaryLineLocation = calculateAuxiliaryLineLocation(event)
      if (!auxiliaryLineLocation) return
      auxiliaryLineLocationRef.value = auxiliaryLineLocation
      // onMove?.(event)
    })

    context.onEnd((event) => {
      // onEnd?.(event)
      auxiliaryLineLocationRef.value = undefined
    })

    const styleGetter = computed(() => {
      const location = unref(auxiliaryLineLocationRef)
      const basicStyle: CSSProperties = {
        position: 'fixed',
        background: '#0071e7',
        pointerEvents: 'none',
        zIndex: 'auto',
      }

      if (location && location.direction !== DirectionEnum.IN) {
        const { direction, element, event } = location
        let { left, top, right, bottom, width, height } = getBoundingClientRect(element)

        if (event.inIframe) {
          const { left: offsetLeft, top: offsetTop } = getBoundingClientRect(event.iframe)
          left += offsetLeft
          right += offsetLeft
          top += offsetTop
          bottom += offsetTop
        }

        const rectStyle = {
          [DirectionEnum.LEFT]: { width: numberToPx(auxiliaryLineSize) },
          [DirectionEnum.TOP]: { height: numberToPx(auxiliaryLineSize) },
          [DirectionEnum.RIGHT]: { width: numberToPx(auxiliaryLineSize), left: numberToPx(right) },
          [DirectionEnum.BOTTOM]: { height: numberToPx(auxiliaryLineSize), top: numberToPx(bottom) },
        }[direction]

        return {
          ...{
            left: numberToPx(left),
            top: numberToPx(top),
            width: numberToPx(width),
            height: numberToPx(height),
            ...rectStyle,
          },
          ...basicStyle,
        }
      }

      return basicStyle
    })

    return () => {
      const style = unref(styleGetter)
      const location = unref(auxiliaryLineLocationRef)
      return onRender(location, style)
    }
  }
}
