import {
  StaticDeposit,
  StaticMachine,
  StaticRecipe,
  StaticResource,
  StaticShuttle,
  RawStaticDeposit,
  RawStaticMachine,
  RawStaticRecipe,
  RawStaticResource,
  RawStaticShuttle,
  TStaticData
} from "../../entities/static";

export interface StaticRepository {
  getResources(): Promise<RawStaticResource[]>
  getDeposits(): Promise<RawStaticDeposit[]>
  getShuttles(): Promise<RawStaticShuttle[]>
  getRecipes(): Promise<RawStaticRecipe[]>
  getMachines(): Promise<RawStaticMachine[]>
  getAll(): Promise<TStaticData>
}

export class StaticService {
  constructor(private staticRepo: StaticRepository) { }

  async loadAll(): Promise<void> {
    const staticData = await this.staticRepo.getAll()
    this.initStatic(staticData)
  }

  initStatic(staticData: TStaticData) {
    staticData.resources.forEach(raw => {
      const staticData = new StaticResource(raw)
      StaticResource.RESOURCES.add(staticData, [raw.name, raw.id])
    })
    staticData.deposits.forEach(raw => {
      const staticData = new StaticDeposit(raw)
      StaticDeposit.DEPOSITS.add(staticData, [raw.name, raw.id])
    })
    staticData.shuttles.forEach(raw => {
      const staticData = new StaticShuttle(raw)
      StaticShuttle.SHUTTLES.add(staticData, [raw.name, raw.id])
    })
    staticData.recipes.forEach(raw => {
      const staticData = new StaticRecipe(raw)
      StaticRecipe.RECIPES.add(staticData, [raw.name, raw.id])
    })
    staticData.machines.forEach(raw => {
      const staticData = new StaticMachine(raw)
      StaticMachine.MACHINES.add(staticData, [raw.name, raw.id])
    })
  }
}
