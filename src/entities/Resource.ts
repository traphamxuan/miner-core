import { Accelerator } from './Accelerator'
import type { TAccelerator } from './Accelerator'
import { BaseEntity } from '../common/BaseEntity'

export type TResource = {
  name: string
  category: string
  quantity: number
  value: number
  cost: number
  accelerators: TAccelerator[]
  ingres: { item: string, quantity: number }[]
}

export class Resource extends BaseEntity {
  totalCost: number
  quantity: number
  ingres: { src: Resource, quantity: number }[]
  totalAce: Accelerator
  accelerators: Accelerator[]
  constructor(public name: string, public category: string, private _value = 0, private _cost = 0) {
    super()
    this.totalCost = _cost
    this.quantity = 0
    this.totalAce = new Accelerator(1, 1)
    this.accelerators = []
    this.ingres = []
  }

  toPlainObject = (): TResource => ({
    name: this.name,
    category: this.category,
    quantity: this.quantity,
    value: this._value,
    cost: this._cost,
    accelerators: this.accelerators,
    ingres: this.ingres.map(ingre => ({ quantity: ingre.quantity, item: ingre.src.name })),
  })
  
  get value() { return this._value * this.totalAce.value }
  set value(value: number) { this._value = value / this.totalAce.value }

  get cost() { return this._cost * this.totalAce.cost }
  set cost(cost: number) { this._cost = cost / this.totalAce.cost }
}