import { StaticResource } from "./static"
import { TStaticResource } from "./static/Resource"

export type RawResource = {
  id: string
  pid: string
  srid: string
  amount: string
  syncedAt: number
}

export type TResource = {
  id: string
  planetId: string
  amount: bigint
  syncedAt: number
  readonly base: TStaticResource
}
export class Resource implements TResource {
  id: string
  planetId: string
  amount: bigint
  syncedAt: number
  base: TStaticResource

  constructor(raw: RawResource, sResource?: TStaticResource) {
    const base = sResource || StaticResource.RESOURCES.getOne(raw.srid)
    if (!base) {
      throw new Error(`Cannot create Resource`)
    }
    this.id = raw.id
    this.planetId = raw.pid
    this.base = base
    this.amount = BigInt(raw.amount)
    this.syncedAt = raw.syncedAt
  }


  toRaw(): RawResource {
    return {
      id: this.id,
      pid: this.planetId,
      srid: this.base.id,
      amount: this.amount.toString(),
      syncedAt: this.syncedAt,
    }
  }
}