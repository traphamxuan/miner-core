import { StaticRecipe } from './static'
import { TStaticRecipe } from './static/Recipe'

export type RawRecipe = {
  pid   :string
  sreid    :string
  cost        :number
  syncedAt: number
}

export type TRecipe = {
  planetId: string
  cost: number
  syncedAt: number
  base: TStaticRecipe
}

export class Recipe {
  planetId: string
  cost: number
  syncedAt: number
  base: StaticRecipe

  constructor(data: RawRecipe, staticRecipe?: StaticRecipe) {
    const sRecipe = staticRecipe || StaticRecipe.RECIPES.getOne(data.sreid)
    if (!sRecipe) throw new Error(`Cannot create new Recipe`)
    this.base = sRecipe
    this.planetId = data.pid
    this.cost = data.cost
    this.syncedAt = data.syncedAt
  }
  static initFromStatic(planetId: string, sRecipe: StaticRecipe, ts: number): Recipe {
    return new Recipe({
      pid: planetId,
      sreid: sRecipe.id,
      cost: sRecipe.cost,
      syncedAt: ts,
    }, sRecipe)
  }
  toRaw(): RawRecipe {
    return {
      pid: this.planetId,
      sreid: this.base.id,
      cost: this.cost,
      syncedAt: this.syncedAt,
    }
  }

}
