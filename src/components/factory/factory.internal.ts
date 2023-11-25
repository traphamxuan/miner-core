import { MachineR } from "../../entities";
import { WarehouseService } from "../warehouse";
import { FactoryService } from "./factory.service";
import { BaseInternalEvent } from "../../common/interfaces/BaseInternalEvent";
import { GlobalTick } from "../../core";

export class FactoryInternalEvent extends BaseInternalEvent{
  private idx = 0
  constructor(
    private factoryService: FactoryService,
    private warehouseService: WarehouseService,
  ) {
    super()
  }

  get id(): string { return this.factoryService.id + '-internal' }
  private getWaitingRecipeUID(machineId: string) { return `internal-${this.id}-${machineId}` }

  // FOR PUBLIC CALL
  publishMachineEvent(machine: MachineR) {
    const recipe = machine.recipe
    if (!machine.isRun) {
      machine.isRun = this.warehouseService.take(recipe.base.ingredients)
    }
  
    if (machine.isRun) {
      const nextTs = machine.syncedAt + machine.progress / machine.power * 1_000
      // console.log('nextTs', nextTs, machine)
      // const result = this.makeRequest<MachineR>('run-' + machine.id, nextTs, (ok, failed) => (err: Error, ts: number, isSkip: boolean) => {
      //   if (isSkip) {
      //     console.warn('Skip process')
      //     ok(machine)
      //     return
      //   }
      //   if (err) {
      //     failed(err)
      //     return
      //   }
      //   // console.log(`Process at ${ts} / ${machine.syncedAt} ${this.idx++}`, machine)
      //   machine.sync(ts)
      //   this.factoryService.completeProduct(machine)
      //   this.publishMachineEvent(machine)
      //   ok(machine)
      // })

      this.makeEvent('run-' + machine.id, nextTs, (err, ts, isSkip) => {
        // console.log(`In process`, err, ts, isSkip, machine)
        if (isSkip) {
          console.warn('Skip process')
          return
        }
        if (err) {
          return
        }
        // console.log(`Process at ${ts} / ${machine.syncedAt} ${this.idx++}`, machine)
        machine.sync(ts)
        this.factoryService.completeProduct(machine)
        this.publishMachineEvent(machine)
      })
    } else {
      const recipeUID = this.getWaitingRecipeUID(machine.id)
      recipe.base.ingredients.forEach(ingre => {
        this.warehouseService.registerChange(ingre.id, recipeUID, {
          onIncrease: (resourceId, _, resource) => {
            if (machine.isRun) {
              this.stopWaitingRecipeRequirements(machine)
              return
            }
            if (resource.amount >= ingre.amount) {
              machine.isRun = this.warehouseService.take(recipe.base.ingredients)
              machine.syncedAt = GlobalTick()
              if (machine.isRun) {
                this.publishMachineEvent(machine)
                this.stopWaitingRecipeRequirements(machine)
              }
            }
          }
        })
      })
    }
  }

  unpublishMachineEvent(machine: MachineR) {
    this.stopWaitingRecipeRequirements(machine)
    this.removeRequest(machine.id)
  }

  private stopWaitingRecipeRequirements(machine: MachineR) {
    const recipe = machine.recipe
    const uid = this.getWaitingRecipeUID(machine.id)
    recipe.base.ingredients.forEach(unIngre => this.warehouseService.unregisterChanges(unIngre.id, uid))
  }

  updateMachineID(id: string, machineID: string) {
    this.updateRequest(id, machineID)
  }
}
