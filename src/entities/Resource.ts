import { TStaticResource } from "./static"

export type RawResource = {
  pid: string
  srid: string
  amount: string
  syncedAt: number
}

export type TResource = {
  planetId: string
  amount: bigint
  syncedAt: number
  readonly base: TStaticResource
}
export class Resource implements TResource {
  planetId: string
  amount: bigint
  syncedAt: number
  base: TStaticResource

  constructor(raw: RawResource, base: TStaticResource) {
    this.planetId = raw.pid
    this.base = base
    this.amount = BigInt(raw.amount)
    this.syncedAt = raw.syncedAt
  }


  toRaw(): RawResource {
    return {
      pid: this.planetId,
      srid: this.base.id,
      amount: this.amount.toString(),
      syncedAt: this.syncedAt,
    }
  }
}