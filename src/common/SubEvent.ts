export class SubEvent<T extends Record<string, (id: string, ...args: unknown[]) => void>> {
  private subscribers: {
    id: string,
    action: Record<string, T>
  }[]

  constructor() {
    this.subscribers = []
  }

  registerChange(id: string, key: string, action: T) {
    let sub = this.subscribers.find(s => s.id === id)
    if (!sub) {
      sub = { id, action: {} }
      this.subscribers.push(sub)
    }
    sub.action = {
      ...sub.action,
      [key]: action
    }
  }
  unregisterChange(id: string, uId?: string) {
    if (typeof uId !== 'string') {
      this.subscribers.filter(s => s.id !== id)
    } else {
      const sub = this.subscribers.find(s => s.id === id)
      if (sub) {
        delete sub.action[uId]
      }
    }
  }

  dispatchEvent(id: string, actionKey: keyof T, ...args: unknown[]) {
    const sub = this.subscribers.find(s => s.id === id)
    sub && Object
      .keys(sub.action)
      .forEach(key => {
        actionKey in sub.action[key] && sub.action[key][actionKey](id, ...args)
      }
      )
  }
}