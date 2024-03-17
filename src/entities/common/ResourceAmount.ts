import { StaticResource } from "../static/Resource"

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

  constructor(raw: RawResourceAmount, base: StaticResource) {
    this.id = raw.srid
    this.amount = BigInt(raw.amount) || 0n
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
