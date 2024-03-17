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
  publishMachineEvent(machine: MachineR): Promise<Machine> {
    const recipe = machine.recipe
    if (!machine.isRun) {
      machine.isRun = this.warehouseService.take(recipe.base.ingredients)
    }
  
    if (machine.isRun) {
      const nextTs = machine.syncedAt + machine.progress / machine.power * 1_000

      return this.makeRequest('run-' + machine.base.id, nextTs, (ok, failed) => (err, ts, isSkip) => {
        if (isSkip) {
          failed(new Error(`Skip publishMachineEvent ${machine.base.id}`))
          return
        }
        if (err) {
          failed(err)
          return
        }
        machine.sync(ts)
        this.factoryService.completeProduct(machine, ts)
        this.publishMachineEvent(machine)
          .catch(err => console.warn(err.message))
        ok(machine)
      }, true)
    } else {
      return new Promise<Machine>(ok => {
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
                  this.publishMachineEvent(machine)
                    .catch(err => console.warn(err.message))
                  ok(machine)
                  this.stopWaitingRecipeRequirements(machine)
                }
              }
            }
          })
        })
      })
    }
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
    return this.makeRequest('create-machine-' + sMachine.id, timestamp, (ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip createMachine ${sMachine.id}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      ts = ts < timestamp ? timestamp : ts
      const machine = this.factoryService.addNewMachine(sMachine, ts)
      if (machine instanceof Error) {
        failed(machine)
        return
      }
      ok(machine)
    })
  }

  async createRecipe(sRecipe: StaticRecipe, timestamp: number): Promise<Recipe> {
    const recipe = this.factoryService.Recipe(sRecipe.id)
    if (recipe) {
      console.warn(`Recipe ${sRecipe.id} already exists`)
      return recipe
    }
    return this.makeRequest('create-recipe-' + sRecipe.id, timestamp, (ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip createRecipe ${sRecipe.id}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      ts = ts < timestamp ? timestamp : ts
      const recipe = this.factoryService.addNewRecipe(sRecipe, ts)
      if (recipe instanceof Error) {
        failed(recipe)
        return
      }
      ok(recipe)
    })
  }

  async setMachineRecipe(sMachineId: string, timestamp: number, sRecipeId?: string): Promise<Machine> {
    return this.makeRequest('set-recipe-' + sMachineId, timestamp, (ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip setMachineRecipe ${sMachineId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      const machine = this.factoryService.Machine(sMachineId)
      if (!machine) {
        failed(new Error(`Invalid machine ID ${sMachineId}`))
        return
      }
      const recipe = sRecipeId ? this.factoryService.Recipe(sRecipeId) : undefined
      ts = ts < timestamp ? timestamp : ts
      machine.sync(ts)
      if (machine.recipe?.base.id === recipe?.base.id) {
        ok(machine)
        return
      }
      if (machine.recipe) {
        this.unpublishMachineEvent(machine)
      }
      this.factoryService.setMachineRecipe(machine, ts, recipe)
      if (machine.recipe) {
        this.publishMachineEvent(machine as MachineR)
          .catch(err => console.warn(err.message))
      }
      ok(machine)
    })
  }

  async upMachinePower(sMachineId: string, timestamp: number): Promise<Machine> {
    return this.makeRequest('up-power-' + sMachineId, timestamp, (ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip upMachinePower ${sMachineId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      const machine = this.factoryService.Machine(sMachineId)
      if (!machine) {
        failed(new Error(`Invalid machine ID ${sMachineId}`))
        return
      }
      machine.sync(ts)
      if (machine.recipe) {
        this.unpublishMachineEvent(machine)
      }
      machine.power *= 1.2
      machine.syncedAt = ts
      machine.recipe && this.publishMachineEvent(machine as MachineR).catch(err => console.warn(err.message))
      ok(machine)
    })
  }

  private stopWaitingRecipeRequirements(machine: Machine) {
    const recipe = machine.recipe
    const uid = this.getWaitingRecipeUID(machine.base.id)
    recipe?.base.ingredients.forEach(unIngre => this.warehouseService.unregisterChanges(unIngre.id, uid))
  }
}
