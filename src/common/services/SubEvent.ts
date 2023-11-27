export class SubEvent<T extends Record<string, (id: string, ...args: any[]) => void>> {
  private subscribers: Record<string, { action: Record<string, T> }>
  private uniqueIdx: number

  constructor() {
    this.subscribers = {}
    this.uniqueIdx = new Date().getTime()
  }

  reset() {
    this.subscribers = {}
  }

  registerChange(id: string, key: string | undefined, action: T): () => void {
    let sub = this.subscribers[id]
    if (!sub) {
      sub = { action: {} }
      this.subscribers[id] = sub
    }
    if (!key) {
      key = (this.uniqueIdx++).toString(32)
    }
    sub.action[key] = action
    return () => {
      this.unregisterChange(id, key)
    }
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