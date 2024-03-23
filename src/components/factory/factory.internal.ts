import { Machine, MachineR, Recipe, StaticMachine, StaticRecipe } from "../../entities";
import { WarehouseService } from "../warehouse";
import { FactoryService } from "./factory.service";
import { BaseInternalEvent } from "../../common/interfaces/BaseInternalEvent";
import { Engine } from "../../core";

export class FactoryInternalEvent extends BaseInternalEvent{
  constructor(
    engine: Pick<Engine, 'internal'>,
    private factoryService: FactoryService,
    private warehouseService: WarehouseService,
  ) {
    super(engine.internal)
  }

  get id(): string { return this.factoryService.id + '-internal' }
  private getWaitingRecipeUID(machineId: string) { return `internal-${this.id}-${machineId}` }

  // FOR PUBLIC CALL
  publishMachineEvent(machineId: string): Promise<Machine> {
    const machine = this.factoryService.Machine(machineId)
    if (!machine) {
      throw new Error(`Invalid machine ID ${machineId}`)
    }
    if (!machine.recipe) {
      throw new Error(`Machine ${machineId} has no recipe`)
    }
    const recipe = machine.recipe
    if (!machine.isRun) {
      machine.isRun = this.warehouseService.take(recipe.base.ingredients)
    }
  
    if (machine.isRun) {
      const nextTs = machine.syncedAt + machine.progress / machine.power * 1_000

      return this.makeRequest('run-' + machineId, nextTs, (ok, failed) => (ts, isSkip) => {
        if (isSkip) {
          failed(new Error(`Skip publishMachineEvent ${machineId}`))
          return -1
        }
        const machine = this.factoryService.Machine(machineId)
        if (!machine) {
          failed(new Error(`Invalid machine ID ${machineId}`))
          return -1
        }
        if (!machine.recipe) {
          failed(new Error(`Machine ${machineId} has no recipe`))
          return -1
        }
        machine.sync(ts)
        this.factoryService.completeProduct(machine, ts)
        machine.isRun = this.warehouseService.take(recipe.base.ingredients)
        ok(machine)
        if (machine.isRun) {
          return ts + machine.progress / machine.power * 1_000
        }
        this.waitingRecipeRequirements(machine as MachineR)
        return 0
      }, 'continuous')
    }
    this.waitingRecipeRequirements(machine as MachineR)
    return new Promise<Machine>(ok => {
      ok(machine)
    })
  }

  unpublishMachineEvent(machine: Machine) {
    this.stopWaitingRecipeRequirements(machine)
    this.removeRequest(`run-${machine.base.id}`)
  }

  // FOR INTERNAL CALL
  async createMachine(sMachine: StaticMachine, timestamp: number): Promise<Machine> {
    const machine = this.factoryService.Machine(sMachine.id)
    if (machine) {
      return machine
    }
    return this.makeRequest('create-machine-' + sMachine.id, timestamp, (ok, failed) => (ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip createMachine ${sMachine.id}`))
        return -1
      }
      ts = ts < timestamp ? timestamp : ts
      const machine = this.factoryService.addNewMachine(sMachine, ts)
      if (machine instanceof Error) {
        failed(machine)
        return -1
      }
      ok(machine)
      return 0
    })
  }

  async createRecipe(sRecipe: StaticRecipe, timestamp: number): Promise<Recipe> {
    const recipe = this.factoryService.Recipe(sRecipe.id)
    if (recipe) {
      console.warn(`Recipe ${sRecipe.id} already exists`)
      return recipe
    }
    return this.makeRequest('create-recipe-' + sRecipe.id, timestamp, (ok, failed) => (ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip createRecipe ${sRecipe.id}`))
        return -1
      }
      ts = ts < timestamp ? timestamp : ts
      const recipe = this.factoryService.addNewRecipe(sRecipe, ts)
      if (recipe instanceof Error) {
        failed(recipe)
        return -1
      }
      ok(recipe)
      return 0
    })
  }

  async setMachineRecipe(sMachineId: string, timestamp: number, sRecipeId?: string): Promise<Machine> {
    return this.makeRequest('set-recipe-' + sMachineId, timestamp, (ok, failed) => (ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip setMachineRecipe ${sMachineId}`))
        return -1
      }
      const machine = this.factoryService.Machine(sMachineId)
      if (!machine) {
        failed(new Error(`Invalid machine ID ${sMachineId}`))
        return -1
      }
      const recipe = sRecipeId ? this.factoryService.Recipe(sRecipeId) : undefined
      ts = ts < timestamp ? timestamp : ts
      machine.sync(ts)
      if (machine.recipe?.base.id === recipe?.base.id) {
        ok(machine)
        return 0
      }
      if (machine.recipe) {
        this.unpublishMachineEvent(machine)
      }
      this.factoryService.setMachineRecipe(machine, ts, recipe)
      if (machine.recipe) {
        this.publishMachineEvent(sMachineId)
          .catch(err => console.warn(err.message))
      }
      ok(machine)
      return 0
    })
  }

  async upMachinePower(sMachineId: string, timestamp: number): Promise<Machine> {
    return this.makeRequest('up-power-' + sMachineId, timestamp, (ok, failed) => (ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip upMachinePower ${sMachineId}`))
        return -1
      }
      const machine = this.factoryService.Machine(sMachineId)
      if (!machine) {
        failed(new Error(`Invalid machine ID ${sMachineId}`))
        return -1
      }
      machine.sync(ts)
      if (machine.recipe) {
        this.unpublishMachineEvent(machine)
      }
      machine.power *= 1.2
      machine.syncedAt = ts
      machine.recipe && this.publishMachineEvent(sMachineId).catch(err => console.warn(err.message))
      ok(machine)
      return 0
    })
  }

  private stopWaitingRecipeRequirements(machine: Machine) {
    const recipe = machine.recipe
    const uid = this.getWaitingRecipeUID(machine.base.id)
    recipe?.base.ingredients.forEach(unIngre => this.warehouseService.unregisterChanges(unIngre.id, uid))
  }

  private waitingRecipeRequirements(machine: MachineR) {
    const recipe = machine.recipe
    const recipeUID = this.getWaitingRecipeUID(machine.base.id)
    recipe.base.ingredients.forEach(ingre => {
      this.warehouseService.registerChange(ingre.id, recipeUID, {
        onIncrease: (resourceId, _, resource, ts) => {
          if (machine.isRun) {
            this.stopWaitingRecipeRequirements(machine)
            return
          }
          if (resource.amount >= ingre.amount) {
            machine.isRun = this.warehouseService.take(recipe.base.ingredients)
            machine.syncedAt = ts
            if (machine.isRun) {
              this.publishMachineEvent(machine.base.id)
                .catch(err => console.warn(err.message))
              this.stopWaitingRecipeRequirements(machine)
            }
          }
        }
      })
    })
  }
}
