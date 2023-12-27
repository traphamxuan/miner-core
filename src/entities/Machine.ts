
import { StaticMachine } from "./static"
import { Recipe, TRecipe } from "./Recipe"
import { TStaticMachine } from "./static/Machine"

export type RawMachine = {
  id: string
  pid: string
  smid: string
  sreid?: string

  progress: number
  isRun: boolean
  power: number
  syncedAt: number
}

export type TMachine = {
  id: string
  pid: string
  isRun: boolean
  power: number
  recipe?: TRecipe
  progress: number
  syncedAt: number
  base: TStaticMachine
}

export class Machine {
  id: string
  planetId: string
  isRun: boolean
  power: number
  recipe?: Recipe
  progress: number
  syncedAt: number
  base: StaticMachine

  constructor(data: RawMachine, userRecipes: Recipe[], staticMachine?: StaticMachine) {
    const sMachine = staticMachine || StaticMachine.MACHINES.getOne(data.smid)
    if (!sMachine) throw new Error('Cannot create new machine')
    this.id = data.id
    this.planetId = data.pid
    this.base = sMachine
    this.recipe = data.sreid ? userRecipes.find(r => r.base.id == data.sreid) : undefined

    this.isRun = data.isRun
    this.power = data.power
    this.progress = data.progress
    this.syncedAt = data.syncedAt
  }

  toRaw(): RawMachine {
    return {
      id: this.id,
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
      id: Math.ceil(performance.now() * 1_000_000).toString(32),
      pid,
      smid: sMachine.id,
      isRun: false,
      power: sMachine.power,
      progress: 0,
      syncedAt
    }, [], sMachine)
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
