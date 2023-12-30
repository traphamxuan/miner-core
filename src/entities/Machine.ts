
import { StaticMachine } from "./static"
import { Recipe, TRecipe } from "./Recipe"
import { TStaticMachine } from "./static/Machine"

export type RawMachine = {
  pid: string
  smid: string
  sreid?: string

  progress: number
  isRun: boolean
  power: number
  syncedAt: number
}

export type TMachine = {
  pid: string
  isRun: boolean
  power: number
  recipe?: TRecipe
  progress: number
  syncedAt: number
  base: TStaticMachine
}

export class Machine {
  planetId: string
  isRun: boolean
  power: number
  recipe?: Recipe
  progress: number
  syncedAt: number
  base: StaticMachine

  constructor(data: RawMachine, recipe?: Recipe, staticMachine?: StaticMachine) {
    const sMachine = staticMachine || StaticMachine.MACHINES.getOne(data.smid)
    if (!sMachine) throw new Error('Cannot create new machine')
    this.planetId = data.pid
    this.base = sMachine
    this.recipe = (data.sreid && data.sreid == recipe?.base.id) ? recipe : undefined

    this.isRun = data.isRun
    this.power = data.power
    this.progress = data.progress
    this.syncedAt = data.syncedAt
  }

  toRaw(): RawMachine {
    return {
      pid: this.planetId,

      smid: this.base.id,
      sreid: this.recipe?.base.id,
      isRun: this.isRun,
      power: this.power,
      progress: this.progress,
      syncedAt: this.syncedAt
    }
  }

  static initFromStatic(pid: string, sMachine: StaticMachine, syncedAt: number): Machine {
    return new Machine({
      pid,
      smid: sMachine.id,
      isRun: false,
      power: sMachine.power,
      progress: 0,
      syncedAt
    }, undefined, sMachine)
  }

  sync(ts: number): Machine {
    if (ts < this.syncedAt) return this
    if (this.recipe && this.isRun) {
      this.progress -= this.power * (ts - this.syncedAt) / 1000
      while (this.progress < 0) this.progress += this.recipe.cost
    } else {
      this.progress = this.recipe?.cost || 0
    }
    this.syncedAt = ts
    return this
  }
}

export type MachineR = Machine & { recipe: Recipe }
