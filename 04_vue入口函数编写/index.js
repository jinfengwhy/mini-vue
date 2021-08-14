
function createApp(rootComponent) {
  return {
    mount(selector) {
      let isMounted = false
      let oldVnode = null
      watchEffect(() => {
        if (!isMounted) {
          oldVnode = rootComponent.render()
          mount(oldVnode, document.querySelector(selector))
          isMounted = true
        } else {
          const newVNode = rootComponent.render()
          patch(oldVnode, newVNode)
          oldVnode = newVNode
        }
      })
    }
  }
}