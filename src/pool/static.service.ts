import { QuickAccessStore } from "../common/services/QuickAccessStore";
import { ResourceAmount, StaticDeposit, StaticMachine, StaticRecipe, StaticResource, StaticShuttle, TStaticData } from "../entities";

export class StaticService {
  private data: StaticObject
  constructor() {
    this.data = {
      resource: new QuickAccessStore(),
      deposit: new QuickAccessStore(),
      shuttle: new QuickAccessStore(),
      recipe: new QuickAccessStore(),
      machine: new QuickAccessStore()
    }
  }

  get id() { return `static-` }

  init(staticData: TStaticData) {
    staticData.resources.forEach(raw => {
      const staticData = new StaticResource(raw)
      this.data.resource.add(staticData, [raw.id, raw.name])
    })
    staticData.deposits.forEach(raw => {
      const ores = raw.ores.map(ore => {
        const resource = this.data.resource.getOne(ore.srid)
        if (!resource) throw new Error(`Resource ${ore.srid} not found`)
        return { resource, ratio: ore.ratio }
      })
      const staticData = new StaticDeposit(raw, ores)
      this.data.deposit.add(staticData, [raw.id, raw.name])
    })
    staticData.shuttles.forEach(raw => {
      const staticData = new StaticShuttle(raw)
      this.data.shuttle.add(staticData, [raw.id, raw.name])
    })
    staticData.recipes.forEach(raw => {
      const target = this.data.resource.getOne(raw.name)
      if (!target) throw new Error(`Resource ${raw.name} not found`)
      const ingredients = raw.ingredients.map(ingredient => {
        const resource = this.data.resource.getOne(ingredient.srid)
        if (!resource) throw new Error(`Resource ${ingredient.srid} not found`)
        return new ResourceAmount({ srid: ingredient.srid, amount: ingredient.amount }, resource)
      })
      const staticData = new StaticRecipe(raw, target, ingredients)
      this.data.recipe.add(staticData, [raw.id, raw.name])
    })
    staticData.machines.forEach(raw => {
      const staticData = new StaticMachine(raw)
      this.data.machine.add(staticData, [raw.id, raw.name])
    })
  }

  getOne<T extends keyof StaticObject>(target: T, key: string): StaticObject[T]['Type'] | undefined {
    return this.data[target].getOne(key);
  }

  getMany<T extends keyof StaticObject>(target: T): StaticObject[T]['Type'][] {
    return this.data[target].getStores();
  }

  deinit() {
    this.data.resource.reset()
    this.data.deposit.reset()
    this.data.shuttle.reset()
    this.data.recipe.reset()
    this.data.machine.reset()
  }
}
