import { Recipe, Machine } from '../../entities'
import { FactoryInternalEvent } from './factory.internal'
import { BaseInputEvent } from '../../common/interfaces/BaseInputEvent'
import { Engine } from '../../core'
import { StaticService } from '../static/static.service'

export class FactoryInputManagement extends BaseInputEvent {

  constructor(
    engine: Engine,
    private sService: StaticService,
    private factoryInternal: FactoryInternalEvent
  ) {
    super(engine.input)
  }

  requestNewMachine(sMachineId: string, timestamp?: number): Promise<Machine> {
    const sMachine = this.sService.getOne('machine', sMachineId)
    if (!sMachine) {
      throw new Error(`Invalid static machine ID ${sMachineId}`)
    }
    return timestamp ? this.factoryInternal.createMachine(sMachine, timestamp)
    : this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip createMachine ${sMachineId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      this.factoryInternal.createMachine(sMachine, ts)
        .then(machine => ok(machine))
        .catch(err => failed(err))
    })
  }

  requestNewRecipe(sRecipeId: string, timestamp?: number): Promise<Recipe> {
    const sRecipe = this.sService.getOne('recipe', sRecipeId)
    if (!sRecipe) {
      throw new Error(`Invalid static recipe ID ${sRecipeId}`)
    }
    return timestamp ? this.factoryInternal.createRecipe(sRecipe, timestamp)
    : this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip createRecipe ${sRecipeId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      this.factoryInternal.createRecipe(sRecipe, ts)
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
