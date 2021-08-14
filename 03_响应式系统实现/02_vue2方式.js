class Dep {
  constructor() {
    this.subscribers = new Set()
  }

  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect)
    }
  }

  notify() {
    this.subscribers.forEach(effect => effect())
  }
}

// 定义数据结构
const targetMap = new WeakMap()
function getDep(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Dep()
    depsMap.set(key, dep)
  }
  return dep
}

// 收集依赖
let activeEffect = null
function watchEffect(effect) {
  activeEffect = effect
  effect()
  activeEffect = null
}

// 定义响应式
function reactive(raw) {
  Object.keys(raw).forEach(key => {
    let value = raw[key]
    const dep = getDep(raw, key)
    Object.defineProperty(raw, key, {
      get() {
        dep.depend()
        return value
      },
      set(newVal) {
        value = newVal
        dep.notify()
      }
    })
  })
  return raw
}

// 测试代码
const person = reactive({
  counter: 10,
  height: 188
})

watchEffect(() => {
  console.log('effect1 counter: ', person.counter * 2);
})

watchEffect(() => {
  console.log('effect2 counter: ', person.counter * person.counter);
})

watchEffect(() => {
  console.log('effect3 height: ', person.height);
})

watchEffect(() => {
  console.log('effect4 counter,height: ', person.counter, person.height);
})

console.log(`----------------`);

// person.counter = 15
person.height = 178