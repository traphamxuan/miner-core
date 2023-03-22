import { Resource } from '../entities'

type SubCallback = (src: Resource, quantity: number) => void

export class Warehouse {
  properties: { src: Resource, quantity: number }[]
  subcribers: SubCallback[]
  constructor() {
    this.properties = []
    this.subcribers = []
  }

  onChange(cb: SubCallback) {
    this.subcribers.push(cb)
  }

  deposit(item: string, quantity: number) {}
  withdraw(item: string, quantity: number) {}
}
