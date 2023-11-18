import { RawStaticDeposit, RawStaticMachine, RawStaticRecipe, RawStaticResource, RawStaticShuttle, TStaticData } from "../../entities/static";
import { StaticRepository } from "./static.service";
import * as data from '../../static/static-data.json'

export class LocalStatic implements StaticRepository {
  private readonly data: TStaticData
  constructor() {
    this.data = data
  }
  async getAll(): Promise<TStaticData> {
    return {
      resources: await this.getResources(),
      deposits: await this.getDeposits(),
      shuttles: await this.getShuttles(),
      recipes: await this.getRecipes(),
      machines: await this.getMachines(),
    }
  }
  async getResources(): Promise<RawStaticResource[]> {
    return this.data.resources
  }

  async getDeposits(): Promise<RawStaticDeposit[]> {
    return this.data.deposits
  }

  async getShuttles(): Promise<RawStaticShuttle[]> {
    return this.data.shuttles
  }

  async getRecipes(): Promise<RawStaticRecipe[]> {
    return this.data.recipes
  }

  async getMachines(): Promise<RawStaticMachine[]> {
    return this.data.machines
  }
}
