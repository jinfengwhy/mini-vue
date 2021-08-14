const h = (tag, props, children) => {
  // h函数返回一个vnode，也就是一个javascript对象，即{}
  // vnode -> javascript对象 -> {}
  return {
    tag,
    props,
    children
  }
}

const mount = (vnode, container) => {
  // 1, 创建node节点 vnode -> 真实node
  const el = vnode.el = document.createElement(vnode.tag)

  // 2, 处理props
  if (vnode.props) {
    for(let key in vnode.props) {
      const value = vnode.props[key]
      if (key.startsWith('on')) { // 绑定的是一个事件
        el.addEventListener(key.slice(2).toLowerCase(), value)
      } else { // 绑定的是简单的键值对
        el.setAttribute(key, value)
      }
    }
  }

  // 3, 处理children
  if (typeof vnode.children === 'string') { // 字符串
    el.textContent = vnode.children
  } else { // 数组
    vnode.children.forEach(item => {
      mount(item, el)
    })
  }

  // 4, 挂载dom
  container.appendChild(el)
}

const patch = (n1, n2) => {
  // n1 旧节点 n2 新节点
  // 情况一：新旧节点类型不一致
  if (n2.tag !== n1.tag) {
    const n1ElParent = n1.el.parentElement
    n1ElParent.removeChild(n1.el)
    mount(n2, n1ElParent)
  } else { // 情况二：新旧节点类型一致
    const el = n2.el = n1.el
    // 1. 处理props
    const n1Props = n1.props || {}
    const n2Props = n2.props || {}
    for (let key in n2Props) { // 1.1 处理新节点上的props
      const oldValue = n1Props[key]
      const newValue = n2Props[key]
      if (newValue !== oldValue) {
        if (key.startsWith('on')) {
          el.addEventListener(key.slice(2).toLowerCase(), newValue)
        } else {
          el.setAttribute(key, newValue)
        }
      }
    }
    for (let key in n1Props) { // 1.2 处理旧节点上的props
      const oldValue = n1Props[key]
      if (key.startsWith('on')) {
        el.removeEventListener(key.slice(2).toLowerCase(), oldValue)
      } else if (!(key in n2Props)) {
        el.removeAttribute(key)
      }
    }
    // 2. 处理children
    const n1Children = n1.children || []
    const n2Children = n2.children || []
    if (typeof n2.children === 'string') { // 2.1 新节点的children是字符串类型
      if (typeof n1.children === 'string') {
        if (n2.children !== n1.children) {
          el.textContent = n2.children
        }
      } else {
        el.innerHTML = n2.children
      }
    } else { // 2.2 新节点的children是数组类型
      if (typeof n1.children === 'string') {
        el.textContent = ''
        n2.children.forEach(vn => mount(vn, el))
      } else {
        const n1Length = n1Children.length
        const n2Length = n2Children.length
        const commonLength = Math.min(n1Length, n2Length)
        for (let i = 0; i < commonLength; i++) {
          patch(n1Children[i], n2Children[i])
        }
        if (n1Length > n2Length) {
          n1Children.slice(commonLength).forEach(vn => {
            el.removeChild(vn.el)
          })
        }
        if (n2Length > n1Length) {
          n2Children.slice(commonLength).forEach(vn => {
            mount(vn, el)
          })
        }
      }
    }
  }
}