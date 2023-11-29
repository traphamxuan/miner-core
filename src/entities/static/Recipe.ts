import { QuickAccessStore } from '../../common/services/QuickAccessStore'
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
  static readonly RECIPES: QuickAccessStore<StaticRecipe> = new QuickAccessStore()
  readonly id: string
  readonly target: StaticResource
  readonly cost: number
  readonly price: bigint
  readonly ingredients: ResourceAmount[]

  constructor(data: RawStaticRecipe) {
    const target = StaticResource.RESOURCES.getOne(data.name)
    if (!target) {
      throw new Error('Cant find resource for initial recipe')
    }
    this.id = data.id

    this.target = target
    this.cost = data.cost
    this.price = BigInt(data.price)
    this.ingredients = data.ingredients.reduce<ResourceAmount[]>((acc, cur) => {
      const resource = StaticResource.RESOURCES.getOne(cur.srid)
      if (resource) {
        acc.push(new ResourceAmount({
          srid: cur.srid,
          amount: cur.amount
        }))
      }
      return acc
    }, [])
  }
}

