import { StaticResource } from "../static"

export type RawResourceAmount = {
  srid: string
  amount: string
}

export type TResourceAmount = {
  id: string
  amount: bigint
  readonly base: StaticResource
}

export class ResourceAmount implements TResourceAmount {
  id: string
  amount: bigint
  readonly base: StaticResource

  constructor(raw: RawResourceAmount, sRes?: StaticResource) {
    this.id = raw.srid
    this.amount = BigInt(raw.amount) || 0n
    const base = sRes || StaticResource.RESOURCES.getOne(raw.srid)
    if (!base) throw new Error(`Cannot create ResourceAmount`)
    this.base = base
  }

  toRaw(): RawResourceAmount {
    return {
      srid: this.id,
      amount: this.amount.toString(),
    }
  }
}
