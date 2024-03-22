import { StaticShuttle } from "./static";
import { Deposit, TDeposit } from "./Deposit";
import { TStaticShuttle } from "./static/Shuttle";
import { RawResourceAmount, ResourceAmount } from "./common/ResourceAmount";

export type RawShuttle = {
  pid     :string
  ssid   :string
  sdid?  :string

  power       :number
  capacity    :number
  position    :Position
  isReturned  :boolean
  load        :RawResourceAmount[]
  syncedAt   :number
}

export type TShuttle = {
  planetId     :string

  capacity    :number
  position    :number
  isReturned  :boolean
  speed       :number
  load        :ResourceAmount[]
  syncedAt    :number
  deposit?    :TDeposit
  base        : TStaticShuttle
}

export class Shuttle {
  planetId     :string

  capacity    :number
  position    :number
  isReturned  :boolean
  speed       :number
  load        :ResourceAmount[]
  syncedAt   :number
  deposit?    :Deposit
  base        : StaticShuttle

  constructor(data: RawShuttle, sShuttle: StaticShuttle, load: ResourceAmount[], deposit?: Deposit) {
    if (!sShuttle) { throw new Error(`Cannot find static shuttle`) }
    this.base = sShuttle
    this.planetId = data.pid

    this.capacity = data.capacity
    this.position = data.position.y
    this.isReturned = data.isReturned
    this.speed = data.power
    this.load = load
    this.syncedAt = data.syncedAt

    this.deposit = (data.sdid && data.sdid == deposit?.base.id) ? deposit : undefined
  }

  static initFromStatic(planetId: string, sShuttle: StaticShuttle, lastedUpdatedAt: number): Shuttle {
    return new Shuttle({
      pid: planetId,
      ssid   :sShuttle.id,
    
      capacity    :sShuttle.capacity,
      position    :{ y: 0, x: 0 },
      isReturned  :false,
      power       :sShuttle.power,
      load        :[],
      syncedAt   :lastedUpdatedAt
    }, sShuttle, [])
  }

  toRaw(): RawShuttle {
    return {
      pid     : this.planetId,
      ssid   : this.base.id,
      sdid   : this.deposit?.base.id,
    
      capacity    : this.capacity,
      position: { x: 0, y: this.position },
      isReturned  : this.isReturned,
      power       : this.speed,
      load        : this.load.map(res => ({ srid: res.base.id, amount: res.amount.toString() })),
      syncedAt   : this.syncedAt,
    }
  }

  sync(ts: number): Shuttle {
    if (ts < this.syncedAt) return this
    const distance = this.deposit?.base.position.y || 0
    if (distance <= 0) return this

    const timeDiff = (ts - this.syncedAt) / 1000
    const totalMovement = timeDiff * this.speed
    const circle = Math.floor(totalMovement / (distance * 2))
    const diffMove = totalMovement - circle * distance * 2
    let position = this.position
    let isReturned = this.isReturned
    if (isReturned) {
      position -= diffMove
      if (position <= 0) {
        position = -position
      }
    } else {
      position += diffMove
      if (position >= distance) {
        position = 2 * distance - position
      }
    }

    this.position = position
    this.syncedAt = ts
    return this
  }
}

export type ShuttleD = Shuttle & { deposit: Deposit }
