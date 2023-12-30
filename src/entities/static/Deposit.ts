import { QuickAccessStore } from "../../common/services/QuickAccessStore";
import { Position } from "../common";
import { StaticResource, TStaticResource } from "./Resource";

export type RawStaticDeposit = {
  id: string
  name: string
  icon?: string
  rate: number
  price: string
  position: Position
  ores: { srid: string, srName: string, ratio: number }[]
}

export type TStaticDeposit = {
  id: string
  name: string
  icon?: string
  rate: number
  price: bigint
  position: Position
  ores: { resource: TStaticResource, ratio: number }[]
}

export class StaticDeposit {
  static readonly DEPOSITS: QuickAccessStore<StaticDeposit> = new QuickAccessStore()
  readonly id: string
  readonly name: string
  readonly icon?: string
  readonly rate: number
  readonly price: bigint
  readonly position: Position
  readonly ores: { resource: StaticResource, ratio: number }[]

  constructor(rawData: RawStaticDeposit) {
    this.id = rawData.id
    this.name = rawData.name
    this.icon = rawData.icon
    this.rate = rawData.rate
    this.price = BigInt(rawData.price)
    this.position = rawData.position
    this.ores = rawData.ores.reduce<{ resource: StaticResource, ratio: number }[]>((acc, cur) => {
      const resource = StaticResource.RESOURCES.getOne(cur.srid)
      if (resource) {
        acc.push({ resource, ratio: cur.ratio })
      }
      return acc
    }, [])
  }
}
