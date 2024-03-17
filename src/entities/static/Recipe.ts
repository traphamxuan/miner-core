import { ResourceAmount } from '../common/ResourceAmount'
import { StaticResource, TStaticResource } from './Resource'

export type RawStaticRecipe = {
  id: string
  name: string
  cost: number
  price: string
  ingredients: { srid: string; srName: string; amount: string }[]
}

export type TStaticRecipe = {
  id: string
  target: TStaticResource
  cost: number
  price: bigint
  ingredients: {
    resource: TStaticResource
    amount: number
  }[]
}

export class StaticRecipe {
  readonly id: string
  readonly target: StaticResource
  readonly cost: number
  readonly price: bigint
  readonly ingredients: ResourceAmount[]

  constructor(data: RawStaticRecipe, target: StaticResource, ingredients: StaticRecipe['ingredients']) {
    this.id = data.id

    this.target = target
    this.cost = data.cost
    this.price = BigInt(data.price)
    this.ingredients = ingredients
  }
}

