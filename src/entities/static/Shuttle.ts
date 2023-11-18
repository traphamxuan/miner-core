import { QuickAccessStore } from "../../common/services/QuickAccessStore";
import { StaticDeposit, TStaticDeposit } from "./Deposit";

export type RawStaticShuttle = {
  id: string
  name: string
  power: number
  capacity: number
  price: string
  deposit?: string
}

export type TStaticShuttle = {
  id: string
  name: string
  power: number
  capacity: number
  deposit?: TStaticDeposit
  ores: any;
}

export class StaticShuttle {
  static readonly SHUTTLES: QuickAccessStore<StaticShuttle> = new QuickAccessStore()
  readonly id: string
  readonly name: string
  readonly power: number
  readonly capacity: number
  readonly price: bigint
  readonly deposit?: StaticDeposit
  readonly ores: any;

  toRaw(): RawStaticShuttle {
    return {
      id: this.id,
      name: this.name,
      power: this.power,
      capacity: this.capacity,
      price: this.price.toString(),
      deposit: this.deposit?.name
    }
  }

  constructor(data: RawStaticShuttle) {
    this.id = data.id
    this.name = data.name
    this.power = data.power
    this.capacity = data.capacity
    this.price = BigInt(data.price)
    if (data.deposit) {
      this.deposit = StaticDeposit.DEPOSITS.getStores().find(d => d.name === data.deposit)
    }
    return this
  }
}
