import { defineComponent, onMounted, ref, render, useSlots } from 'vue'

const isStyleTag = (el?: HTMLElement | Element) => el && el.tagName === 'STYLE'

export function iframeStyleSync(iframeWindow: Window) {
  function copyHeadStyleToIframeHead(resource?: Element) {
    const headChildList = window.document.head.children
    const iframeHead = iframeWindow.document.head

    if (headChildList && iframeHead) {
      if (resource && isStyleTag(resource)) {
        iframeHead.appendChild(resource.cloneNode(true))
        return
      }

      for (let i = 0; i < headChildList.length; i++) {
        const resource = headChildList[i]

        if (isStyleTag(resource)) {
          iframeHead.appendChild(resource.cloneNode(true))
        }
      }
    }
  }

  function watchHeadStyleAdded(fn: (nodes: NodeList) => void) {
    const observer = new MutationObserver((mutationList) => {
      mutationList.forEach((mutation) => {
        const addedNodes = mutation.addedNodes
        if (addedNodes.length > 0) {
          fn && fn(addedNodes)
        }
      })
    })

    observer.observe(window.document.head, {
      childList: true,
      attributeFilter: ['style'],
    })
  }

  function copy() {
    copyHeadStyleToIframeHead()
    watchHeadStyleAdded((resources) => {
      resources.forEach((resource: any) => copyHeadStyleToIframeHead(resource))
    })
  }

  copy()
}

export const IframeContainer = defineComponent({
  props: ['showTitle'],
  setup(props) {
    const slots = useSlots() // 拿到传入的slot内容
    const iframeElRef = ref<HTMLIFrameElement>()

    const renderSlots = () => {
      return Object.keys(slots).map((slotName) => {
        return (slots as any)[slotName]()
      })
    }

    onMounted(() => {
      const body = iframeElRef.value!.contentDocument!.body // 拿到iframe的body
      const vnode = <div>
        {props.showTitle !== false && <h1>Iframe容器...</h1>}
        {renderSlots()}
      </div>

      render(vnode, body) // 把这个是vnode渲染成dom,然后插入body中。
    })

    return () => {
      // 这种方法没有跨域的问题！
      return <iframe ref={iframeElRef} width='400px' height='300px'></iframe>
    }
  },
})
