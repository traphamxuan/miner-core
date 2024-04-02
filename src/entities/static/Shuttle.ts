import { StaticDeposit, TStaticDeposit } from "./Deposit";

export type RawStaticShuttle = {
  id: string
  name: string
  power: number
  capacity: number
  price: string
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
  readonly id: string
  readonly name: string
  readonly power: number
  readonly capacity: number
  readonly price: bigint
  readonly ores: any;

  constructor(data: RawStaticShuttle) {
    this.id = data.id
    this.name = data.name
    this.power = data.power
    this.capacity = data.capacity
    this.price = BigInt(data.price)
    return this
  }
}
