import { StaticShuttle } from "./static";
import { Deposit, TDeposit } from "./Deposit";
import { TStaticShuttle } from "./static/Shuttle";
import { RawResourceAmount, ResourceAmount } from "./common/ResourceAmount";

export type RawShuttle = {
  id          :string
  pid     :string
  ssid   :string
  did?  :string

  power       :number
  capacity    :number
  position    :Position
  isReturned  :boolean
  load        :RawResourceAmount[]
  syncedAt   :number
}

export type TShuttle = {
  id          :string
  planetId     :string

  capacity    :number
  position    :number
  isReturned  :boolean
  speed       :number
  load        :ResourceAmount[]
  syncedAt   :number
  deposit?    :TDeposit
  base        : TStaticShuttle
}

export class Shuttle {
  id          :string
  planetId     :string

  capacity    :number
  position    :number
  isReturned  :boolean
  speed       :number
  load        :ResourceAmount[]
  syncedAt   :number
  deposit?    :Deposit
  base        : StaticShuttle

  constructor(data: RawShuttle, userDeposits: Deposit[]) {
    const sShuttle = StaticShuttle.SHUTTLES.getOne(data.ssid)
    if (!sShuttle) { throw new Error(`Cannot find static shuttle`) }
    this.base = sShuttle
    this.id = data.id
    this.planetId = data.pid
    this.deposit = data.did ? userDeposits.find(d => d.id == data.did) : undefined

    this.capacity = data.capacity
    this.position = data.position.y
    this.isReturned = data.isReturned
    this.speed = data.power
    this.load = !data.load ? [] : data.load.map(res => new ResourceAmount(res))
    this.syncedAt = data.syncedAt
  }

  static initFromStatic(planetId: string, sShuttle: StaticShuttle, lastedUpdatedAt: number): Shuttle {
    return new Shuttle({
      id: Math.ceil(performance.now() * 1_000_000).toString(32),
      pid: planetId,
      ssid   :sShuttle.id,
      did   :undefined,
    
      capacity    :sShuttle.capacity,
      position    :{ y: 0, x: 0 },
      isReturned  :false,
      power       :sShuttle.power,
      load        :[],
      syncedAt   :lastedUpdatedAt
    }, [])
  }

  toRaw(): RawShuttle {
    return {
      id          : this.id,
      pid     : this.planetId,
      ssid   : this.base.id,
      did   : this.deposit?.id,
    
      capacity    : this.capacity,
      position: { x: 0, y: this.position },
      isReturned  : this.isReturned,
      power       : this.speed,
      load        : this.load.map(res => ({ srid: res.base.id, amount: res.amount.toString() })),
      syncedAt   : this.syncedAt,
    }
  }

  sync(ts: number) {
    if (ts < this.syncedAt) return
    const distance = this.deposit?.base.position.y || 0
    if (distance <= 0) return

    const timeDiff = (ts - this.syncedAt) / 1000
    const totalMovement = timeDiff * this.speed
    const circle = Math.floor(totalMovement / (distance * 2))
    const diffMove = totalMovement - circle * distance * 2
    let position = this.position
    let isReturned = this.isReturned
    if (isReturned) {
      position -= diffMove
      if (position <= 0) {
        isReturned = false
        position = -position
      }
    } else {
      position += diffMove
      if (position >= distance) {
        isReturned = true
        position = 2 * distance - position
      }
    }

    this.isReturned = isReturned
    this.position = position
    this.syncedAt = ts
  }
}

export type ShuttleD = Shuttle & { deposit: Deposit }
