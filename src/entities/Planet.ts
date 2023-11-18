export type RawPlanet = {
  id: string
  name: string
  money: string
  uid: string
  // isFactory: boolean
  startedAt: number
}

export type TPlanet = {
  id: string
  name: string
  money: bigint
  startedAt: number
  // isFactory: boolean
  userId: string
}

export class Planet {
  id: string
  name: string
  money: bigint
  startedAt: number
  // isFactory: boolean
  userId: string

  toRaw(): RawPlanet {
    return {
      id: this.id,
      name: this.name,
      // // isFactory: this.isFactory,
      uid: this.userId,
      startedAt: this.startedAt,
      money: this.money.toString()
    }
  }

  constructor(data: RawPlanet) {
    this.id = data.id,
    this.name = data.name
    this.money = BigInt(data.money)
    // // this.isFactory = data.isFactory
    this.userId = data.uid
    this.startedAt = data.startedAt
    return this
  }

  get Money() { return this.money }

  checkMoney(amount: bigint) {
    return this.money >= amount
  }

  withdrawMoney(amount: bigint) {
    this.money -= amount
  }
}
