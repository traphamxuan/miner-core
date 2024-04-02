import type { Recipe, Machine } from '../entities'
import { FactoryInternalEvent } from '../event'
import { BaseInputEvent } from './BaseInputEvent'
import { InputProcessor } from '../core'

export class FactoryInputManagement extends BaseInputEvent {

  constructor(
    input: InputProcessor,
    private factoryInternal: FactoryInternalEvent
  ) {
    super(input)
  }

  requestNewMachine(sMachineId: string, timestamp?: number): Promise<Machine> {
    return timestamp ? this.factoryInternal.createMachine(sMachineId, timestamp)
    : this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip createMachine ${sMachineId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      this.factoryInternal.createMachine(sMachineId, ts)
        .then(machine => ok(machine))
        .catch(err => failed(err))
    })
  }

  requestNewRecipe(sRecipeId: string, timestamp?: number): Promise<Recipe> {
    return timestamp ? this.factoryInternal.createRecipe(sRecipeId, timestamp)
    : this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip createRecipe ${sRecipeId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      this.factoryInternal.createRecipe(sRecipeId, ts)
        .then(recipe => ok(recipe))
        .catch(err => failed(err))
    })
  }

  upMachinePower(sMachineId: string, timestamp?: number): Promise<Machine> {
    return timestamp ? this.factoryInternal.upMachinePower(sMachineId, timestamp)
    : this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip upMachinePower ${sMachineId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      this.factoryInternal.upMachinePower(sMachineId, ts)
        .then(machine => ok(machine))
        .catch(err => failed(err))
    })
  }
  setMachineRecipe(sMachineId: string, sRecipeId?: string, timestamp?: number): Promise<Machine> {
    return timestamp ? this.factoryInternal.setMachineRecipe(sMachineId, timestamp, sRecipeId)
    : this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip setMachineRecipe ${sMachineId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      this.factoryInternal.setMachineRecipe(sMachineId, ts, sRecipeId)
        .then(machine => ok(machine))
        .catch(err => failed(err))
    })
  }
}
