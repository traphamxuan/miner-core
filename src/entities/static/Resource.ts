export type RawStaticResource = {
  id: string
  name: string
  icon?: string
  category: string
  value: string
  weight: number
}

export type TStaticResource = {
  readonly id: string
  readonly name: string
  readonly icon?: string
  readonly category: string
  readonly value: bigint
  readonly weight: number
}

export class StaticResource {
  readonly id: string
  readonly name: string
  readonly icon?: string
  readonly category: string
  readonly value: bigint
  readonly weight: number

  constructor(data: RawStaticResource) {
    this.id = data.id
    this.name = data.name
    this.icon = data.icon
    this.category = data.category
    this.value = BigInt(data.value)
    this.weight = data.weight
  }
}
