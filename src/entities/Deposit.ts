import { Ore, RawOre } from './common/Ore'
import { TResource } from './Resource'
import { ResourceAmount, TResourceAmount } from './common/ResourceAmount'
import { StaticDeposit } from './static'
import { TStaticDeposit } from './static/Deposit'

export type RawDeposit = {
  id          :string
  pid    :string
  sdid   :string

  ores :  RawOre[]
  rate        :number
  syncedAt   :number
}

export type TDeposit = {
  id          :string
  pid     :string
  oreStorages :Ore[]
  rate        :number
  syncedAt   :number
  base       : TStaticDeposit
  totalOres   : number
}

export class Deposit {
  id          :string
  planetId     :string
  oreStorages :Ore[]
  rate        :number
  syncedAt   :number
  base       : StaticDeposit
  totalOres   : number

  constructor(data: RawDeposit, sDeposit?: StaticDeposit) {
    const base = sDeposit || StaticDeposit.DEPOSITS.getOne(data.sdid)
    if (!base) throw new Error(`Unable to create new Deposit`)
    this.base = base
    this.id = data.id
    this.planetId = data.pid
    this.totalOres = 0

    this.oreStorages = data.ores.map(ore => {
      const nore = new Ore(ore)
      this.totalOres += nore.amount
      return nore
  }) || []
    this.rate = data.rate
    this.syncedAt = data.syncedAt
  }

  static initFromStatic(planetId: string, base: StaticDeposit, syncedAt: number): Deposit {
    return new Deposit({
      id: new Date().getTime().toString(32),
      pid: planetId,
      rate: base.rate,
      sdid: base.id,
      ores: base.ores.map(ore => ({
        srid: ore.resource.id,
        amount: '0'
      })),
      syncedAt,
    }, base)
  }

  toRaw(): RawDeposit {
    return {
      id: this.id,
      ores: this.oreStorages.map(ore => ({
        srid: ore.id,
        amount: ore.amount.toString()
      })),
      rate: this.rate,

      pid    : this.planetId,
      sdid   : this.base.id,

      syncedAt   : this.syncedAt
    }
  }


  sync(ts: number): Deposit {
    if (ts <= this.syncedAt) return this
    const timeDiff = (ts - this.syncedAt)/1000
    let totalOres = 0
    this.oreStorages.forEach(ore => {
      const bOre = this.base.ores.find(bo => bo.resource.id == ore.base.id)
      if (!bOre) {
        console.error('Cannot find base Ore. Skip sync', ore)
        return this
      }
      const changes = timeDiff * bOre.ratio * this.rate / 100
      ore.amount += changes
      totalOres += changes
    })
    this.totalOres += totalOres
    this.syncedAt = ts
    return this
  }

  withdrawOres(capacity: number): ResourceAmount[] {
    const result: ResourceAmount[] = []
    for (let i = 0; i < this.base.ores.length && capacity > 0; i++) {
      const oreAtTs = this.oreStorages[i]
      const amount = Math.floor(oreAtTs.amount)
      const resource = new ResourceAmount({ srid: oreAtTs.base.id, amount: "0" }, oreAtTs.base)
      if (capacity > oreAtTs.amount) {
        resource.amount = BigInt(amount)
        capacity -= amount
        oreAtTs.amount -= amount
      } else if (capacity > 0) {
        resource.amount = BigInt(capacity)
        oreAtTs.amount -= capacity
        capacity = 0
      }
      this.totalOres = this.totalOres - Number(resource.amount)
      result.push(resource)
    }
    return result
  }
}

type DepositResource = Pick<TResource, 'base'> & { amount: number }
