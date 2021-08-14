class Dep {
  constructor() {
    this.subscribers = new Set()
  }

  addEffect(effect) {
    this.subscribers.add(effect)
  }

  notify() {
    this.subscribers.forEach(effect => effect())
  }
}


// 测试代码
const person = {
  counter: 10
}

function dobuleCounter() {
  console.log(person.counter * 2);
}

function powerCounter() {
  console.log(person.counter * person.counter);
}

const dep = new Dep()
dep.addEffect(dobuleCounter)
dep.addEffect(powerCounter)

person.counter = 15
dep.notify()