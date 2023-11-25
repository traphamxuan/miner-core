import { StaticResource } from "../static"

export type RawOre = {
  srid: string
  amount: string
}

export class Ore {
  id: string
  amount: number
  readonly base: StaticResource

  constructor(raw: RawOre, sRes?: StaticResource) {
    this.id = raw.srid
    this.amount = Number(raw.amount) || 0
    const base = sRes || StaticResource.RESOURCES.getOne(raw.srid)
    if (!base) throw new Error(`Cannot create Ore`)
    this.base = base
  }

  toRaw(): RawOre {
    return {
      srid: this.id,
      amount: this.amount.toString(),
    }
  }
}