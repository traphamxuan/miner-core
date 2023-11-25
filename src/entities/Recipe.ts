import { StaticRecipe } from './static'
import { TStaticRecipe } from './static/Recipe'

export type RawRecipe = {
  id          :string
  pid   :string
  sreid    :string
  cost        :number
  syncedAt: number
}

export type TRecipe = {
  id: string
  planetId: string
  cost: number
  syncedAt: number
  base: TStaticRecipe
}

export class Recipe {
  id: string
  planetId: string
  cost: number
  syncedAt: number
  base: StaticRecipe

  constructor(data: RawRecipe, staticRecipe?: StaticRecipe) {
    const sRecipe = staticRecipe || StaticRecipe.RECIPES.getOne(data.sreid)
    if (!sRecipe) throw new Error(`Cannot create new Recipe`)
    this.id = data.id
    this.base = sRecipe
    this.planetId = data.pid
    this.cost = data.cost
    this.syncedAt = data.syncedAt
  }
  static initFromStatic(planetId: string, sRecipe: StaticRecipe): Recipe {
    return new Recipe({
      id: Math.ceil(performance.now() * 1_000_000).toString(32),
      pid: planetId,
      sreid: sRecipe.id,
      cost: sRecipe.cost,
      syncedAt: 0,
    }, sRecipe)
  }
  toRaw(): RawRecipe {
    return {
      id: this.id,
      pid: this.planetId,
      sreid: this.base.id,
      cost: this.cost,
      syncedAt: this.syncedAt,
    }
  }

}
