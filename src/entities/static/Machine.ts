import { QuickAccessStore } from "../../common/services/QuickAccessStore"
import { StaticRecipe } from "./Recipe"

export type RawStaticMachine = {
  id: string
  name: string
  power: number
  price: string
}

export type TStaticMachine = {
  id: string
  name: string
  power: number
  price: bigint
  recipe?: StaticRecipe
}

export class StaticMachine implements TStaticMachine {
  static readonly MACHINES: QuickAccessStore<StaticMachine> = new QuickAccessStore()
  readonly id: string
  readonly name: string
  readonly power: number
  readonly price: bigint
  readonly recipe?: StaticRecipe

  constructor(data: RawStaticMachine) {
    this.id = data.id
    this.name = data.name
    this.power = data.power
    this.price = BigInt(data.price)
  }
}
