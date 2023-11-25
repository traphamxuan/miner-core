export class SubEvent<T extends Record<string, (id: string, ...args: any[]) => void>> {
  private subscribers: Record<string, { action: Record<string, T> }>

  constructor() {
    this.subscribers = {}
  }

  reset() {
    this.subscribers = {}
  }

  registerChange(id: string, key = '*', action: T) {
    let sub = this.subscribers[id]
    if (!sub) {
      sub = { action: {} }
      this.subscribers[id] = sub
    }
    sub.action[key] = action
  }
  unregisterChange(id: string, uId?: string) {
    if (typeof uId !== 'string') {
      delete this.subscribers[id]
    } else {
      const sub = this.subscribers[id]
      if (sub) {
        delete sub.action[uId]
      }
    }
  }

  dispatchEvent(id: string, actionKey: keyof T, ...args: any[]) {
    const sub = this.subscribers[id]
    sub && Object
      .keys(sub.action)
      .forEach(key => {
        actionKey in sub.action[key] && sub.action[key][actionKey](id, ...args)
        }
      )
  }
}