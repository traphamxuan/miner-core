
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
  private power: number
  recipe?: Recipe
  progress: number
  syncedAt: number
  speed: number
  base: StaticMachine

  constructor(data: RawMachine, sMachine: StaticMachine, recipe?: Recipe) {
    if (!sMachine) throw new Error('Cannot create new machine')
    this.planetId = data.pid
    this.base = sMachine

    this.isRun = data.isRun
    this.power = data.power
    this.syncedAt = data.syncedAt
    this.speed = this.power

    this.setRecipe(recipe)
    this.progress = data.progress
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
    }, sMachine)
  }

  sync(ts: number) {
    if (ts < this.syncedAt) return this
    if (this.recipe) {
      if (this.isRun) {
        this.progress -= this.speed * (ts - this.syncedAt) / 1000
        while (this.progress < 0) this.progress += this.recipe.cost
      }
    } else {
      this.progress = 0
    }
    this.syncedAt = ts
  }

  getNextEventAt(): number {
    return this.syncedAt + this.progress / this.speed * 1_000
  }

  upgradeSpeed() {
    this.power *= 1.2
    this.normalizeSpeed()
  }

  setRecipe(recipe?: Recipe) {
    this.recipe = recipe
    this.progress = recipe?.cost || 0
    this.normalizeSpeed()
  }

  private normalizeSpeed() {
    this.speed = this.power
    if (this.recipe) {
      if ((this.recipe.base.cost || 0) * 10 < this.speed) {
        this.speed = (this.recipe?.base.cost || 0 ) * 10
      }
    }
  }
}

export type MachineR = Machine & { recipe: Recipe }
