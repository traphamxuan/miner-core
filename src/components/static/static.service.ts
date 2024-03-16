import { QuickAccessStore } from "src/common/services/QuickAccessStore";
import { StaticDeposit, StaticMachine, StaticRecipe, StaticResource, StaticShuttle, TStaticData } from "../../entities";

type StaticObject = {
  resource: QuickAccessStore<StaticResource>
  deposit: QuickAccessStore<StaticDeposit>
  shuttle: QuickAccessStore<StaticShuttle>
  recipe: QuickAccessStore<StaticRecipe>
  machine: QuickAccessStore<StaticMachine>
}

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
      const staticData = new StaticDeposit(raw)
      this.data.deposit.add(staticData, [raw.id, raw.name])
    })
    staticData.shuttles.forEach(raw => {
      const staticData = new StaticShuttle(raw)
      this.data.shuttle.add(staticData, [raw.id, raw.name])
    })
    staticData.recipes.forEach(raw => {
      const staticData = new StaticRecipe(raw)
      this.data.recipe.add(staticData, [raw.id, raw.name])
    })
    staticData.machines.forEach(raw => {
      const staticData = new StaticMachine(raw)
      this.data.machine.add(staticData, [raw.id, raw.name])
    })
  }

  getOne<T extends keyof StaticObject>(target: T, key: string): StaticObject[T]['aData'][0] | undefined {
    return this.data[target].getOne(key);
  }

  getMany<T extends keyof StaticObject>(target: T): StaticObject[T]['aData'] {
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
