import { QuickAccessStore } from '../../common/services/QuickAccessStore'

export type RawStaticResource = {
  id: string
  name: string
  category: string
  value: string
  weight: number
}

export type TStaticResource = {
  readonly id: string
  readonly name: string
  readonly category: string
  readonly value: bigint
  readonly weight: number
}

export class StaticResource {
  static readonly RESOURCES: QuickAccessStore<StaticResource> = new QuickAccessStore()
  readonly id: string
  readonly name: string
  readonly category: string
  readonly value: bigint
  readonly weight: number

  constructor(data: RawStaticResource) {
    this.id = data.id
    this.name = data.name
    this.category = data.category
    this.value = BigInt(data.value)
    this.weight = data.weight
  }

  toRaw(): RawStaticResource {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      weight: this.weight,
      value: this.value.toString()
    }
  }
}
