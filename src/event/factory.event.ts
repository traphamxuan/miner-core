import { WarehouseService, FactoryService, StaticService } from "../pool";
import { Machine, MachineR, Recipe, StaticMachine, StaticRecipe } from "../entities";
import { BaseEvent } from "./BaseEvent";
import { EventProcessor } from "./event";

export class FactoryInternalEvent extends BaseEvent{
  constructor(
    event: EventProcessor,
    private sService: StaticService,
    private fService: FactoryService,
    private wService: WarehouseService,
  ) {
    super(event)
  }

  get id(): string { return this.fService.id + '-internal' }
  private getWaitingRecipeUID(machineId: string) { return `internal-${this.id}-${machineId}` }

  // FOR PUBLIC CALL
  publishMachineEvent(machineId: string): Promise<Machine> {
    const machine = this.fService.Machine(machineId)
    if (!machine) {
      throw new Error(`Invalid machine ID ${machineId}`)
    }
    if (!machine.recipe) {
      throw new Error(`Machine ${machineId} has no recipe`)
    }
    const recipe = machine.recipe
    if (!machine.isRun) {
      machine.isRun = this.wService.take(recipe.base.ingredients)
    }
  
    if (machine.isRun) {
      const nextTs = machine.getNextEventAt()
      return this.makeRequest('run-' + machineId, nextTs, (ok, failed) => (ts, isSkip) => {
        if (isSkip) {
          failed(new Error(`Skip publishMachineEvent ${machineId}`))
          return -1
        }
        const machine = this.fService.Machine(machineId)
        if (!machine) {
          failed(new Error(`Invalid machine ID ${machineId}`))
          return -1
        }
        if (!machine.recipe) {
          failed(new Error(`Machine ${machineId} has no recipe`))
          return -1
        }
        machine.sync(ts)
        this.fService.completeProduct(machine, ts)
        machine.isRun = this.wService.take(recipe.base.ingredients)
        ok(machine)
        if (machine.isRun) {
          return machine.getNextEventAt()
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
  async createMachine(sMachineId: string, timestamp: number): Promise<Machine> {
    const machine = this.fService.Machine(sMachineId)
    if (machine) {
      return machine
    }
    const sMachine = this.sService.getOne('machine', sMachineId)
    if (!sMachine) {
      throw new Error(`Invalid static machine ID ${sMachineId}`)
    }
    return this.makeRequest('create-machine-' + sMachineId, timestamp, (ok, failed) => (ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip createMachine ${sMachineId}`))
        return -1
      }
      ts = ts < timestamp ? timestamp : ts
      const machine = this.fService.addNewMachine(sMachine, ts)
      if (machine instanceof Error) {
        failed(machine)
        return -1
      }
      ok(machine)
      return 0
    })
  }

  async createRecipe(sRecipeId: string, timestamp: number): Promise<Recipe> {
    const recipe = this.fService.Recipe(sRecipeId)
    if (recipe) {
      console.warn(`Recipe ${sRecipeId} already exists`)
      return recipe
    }
    const sRecipe = this.sService.getOne('recipe', sRecipeId)
    if (!sRecipe) {
      throw new Error(`Invalid static recipe ID ${sRecipeId}`)
    }
    return this.makeRequest('create-recipe-' + sRecipeId, timestamp, (ok, failed) => (ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip createRecipe ${sRecipeId}`))
        return -1
      }
      ts = ts < timestamp ? timestamp : ts
      const recipe = this.fService.addNewRecipe(sRecipe, ts)
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
      const machine = this.fService.Machine(sMachineId)
      if (!machine) {
        failed(new Error(`Invalid machine ID ${sMachineId}`))
        return -1
      }
      if (machine.syncedAt > ts) {
        failed(new Error(`Invalid timestamp ${ts} for setMachineRecipe machine ${sMachineId}`))
        return -1
      }
      const recipe = sRecipeId ? this.fService.Recipe(sRecipeId) : undefined
      ts = ts < timestamp ? timestamp : ts
      machine.sync(ts)
      if (machine.recipe?.base.id === recipe?.base.id) {
        ok(machine)
        return 0
      }
      if (machine.recipe) {
        this.unpublishMachineEvent(machine)
      }
      this.fService.setMachineRecipe(machine, ts, recipe)
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
      const machine = this.fService.Machine(sMachineId)
      if (!machine) {
        failed(new Error(`Invalid machine ID ${sMachineId}`))
        return -1
      }
      if (machine.syncedAt > ts) {
        failed(new Error(`Invalid timestamp ${ts} for upMachinePower machine ${sMachineId} at ${machine.syncedAt}`))
        return -1
      }
      machine.sync(ts)
      if (machine.recipe) {
        this.unpublishMachineEvent(machine)
      }
      machine.upgradeSpeed()
      machine.recipe && this.publishMachineEvent(sMachineId).catch(err => console.warn(err.message))
      ok(machine)
      return 0
    })
  }

  private stopWaitingRecipeRequirements(machine: Machine) {
    const recipe = machine.recipe
    const uid = this.getWaitingRecipeUID(machine.base.id)
    recipe?.base.ingredients.forEach(unIngre => this.wService.unregisterChanges(unIngre.id, uid))
  }

  private waitingRecipeRequirements(machine: MachineR) {
    const recipe = machine.recipe
    const recipeUID = this.getWaitingRecipeUID(machine.base.id)
    recipe.base.ingredients.forEach(ingre => {
      this.wService.registerChange(ingre.id, recipeUID, {
        onIncrease: (resourceId, _, resource, ts) => {
          if (machine.isRun) {
            this.stopWaitingRecipeRequirements(machine)
            return
          }
          if (resource.amount >= ingre.amount) {
            machine.isRun = this.wService.take(recipe.base.ingredients)
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
