import { Machine, Recipe, TResourceAmount } from "../../entities"
import { WarehouseService } from "../warehouse/warehouse.service"
import { QuickAccessStore } from "../../common/services/QuickAccessStore"
import type { StaticMachine, StaticRecipe } from "../../entities/static"
import { PlanetService } from "../planet/planet.service"

export class FactoryService {

  private recipes: QuickAccessStore<Recipe>
  private machines: QuickAccessStore<Machine>

  constructor(
    private planetService: PlanetService,
    private warehouseService: WarehouseService
  ) {
    this.recipes = new QuickAccessStore()
    this.machines = new QuickAccessStore()
  }
  get id() { return `factory-${this.planetService.planet?.id}` }
  Recipes() { return this.recipes.getStores() }
  Recipe(id: string) { return this.recipes.getOne(id) }
  Machines() { return this.machines.getStores() }
  Machine(id: string) { return this.machines.getOne(id) }

  addRecipe(recipe: Recipe) {
    this.recipes.add(recipe, [recipe.base.id, recipe.base.target.name])
  }
  addMachine(machine: Machine) {
    this.machines.add(machine, [machine.base.id, machine.base.name])
  }

  addNewRecipe(sRecipe: StaticRecipe, ts: number): Recipe | Error {
    const planet = this.planetService.planet
    if (!planet) {
      return new Error('Planet is not loaded')
    }
    let recipe = this.recipes.getOne(sRecipe.id)
    if (recipe) {
      return recipe
    }
    if (!planet.checkMoney(sRecipe.price)) {
      return new Error('Not enough money')
    }
    planet.withdrawMoney(sRecipe.price)
    recipe = Recipe.initFromStatic(planet.id, sRecipe, ts)

    this.addRecipe(recipe)
    recipe.base.ingredients.forEach(ingre => this.warehouseService.addNew(ingre.id))
    this.warehouseService.addNew(recipe.base.target.id)
    return recipe
  }

  addNewMachine(sMachine: StaticMachine, createdAt: number): Machine | Error {
    const planet = this.planetService.planet
    if (!planet) {
      return new Error('Planet is not loaded')
    }
    let machine = this.machines.getOne(sMachine.id)
    if (machine) {
      return machine
    }
    if (!planet.checkMoney(sMachine.price)) {
      return new Error('Not enough money')
    }
    planet.withdrawMoney(sMachine.price)
    machine = Machine.initFromStatic(planet.id, sMachine, createdAt)
    this.addMachine(machine)
    return machine
  }

  reset() {
    this.machines.reset()
    this.recipes.reset()
  }

  completeProduct(machine: Machine, timestamp: number): TResourceAmount | null {
    if (machine.recipe) {
      const sRes = machine.recipe.base.target
      const resource: TResourceAmount = { id: sRes.id, base: sRes, amount: 1n }
      this.warehouseService.put([{
        id: sRes.id,
        amount: 1n,
        base: sRes,
      }], timestamp)
      machine.isRun = false
      machine.progress = machine.recipe.cost
      return resource
    }
    return null
  }

  // produreProduct(machine: Machine) {
  //   if(machine.recipe) {
  //     const recipe = machine.recipe
  //     machine.isRunning = this.checkRecipeRequirement(recipe)
  //     if (machine.isRunning) {
  //       recipe.base.ingredients.forEach(ingre => this.warehouseService.take({
  //         id: ingre.resource.id,
  //         amount: BigInt(ingre.amount)
  //       }))
  //       machine.progress = recipe.cost
  //     }
  //   }
  // }

  setMachineRecipe(machine: Machine, ts: number, recipe?: Recipe): Machine {
    if (machine.recipe?.base.id == recipe?.base.id) return machine
    this.unsetRecipe(machine, ts)
    if (recipe) {
      this.setRecipe(machine, recipe, ts)
    }
    return machine
  }

  private setRecipe(machine: Machine, recipe: Recipe, ts: number): Machine {
    machine.setRecipe(recipe)
    machine.isRun = this.warehouseService.take(recipe.base.ingredients)
    machine.syncedAt = ts
    return machine
  }

  private unsetRecipe(machine: Machine, ts: number): Machine {
    machine.syncedAt = ts
    if (!machine.recipe) return machine
    const recipe = machine.recipe
    if (machine.isRun) {
      this.warehouseService.put(recipe.base.ingredients, ts)
      machine.isRun = false
    }
    machine.setRecipe(recipe)
    return machine
  }

  sync(ts: number) {
    this.machines.getStores().forEach(machine => machine.sync(ts))
  }
}
