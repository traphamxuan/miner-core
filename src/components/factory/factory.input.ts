import { Recipe, Machine, MachineR } from '../../entities'
import { StaticRecipe, StaticMachine } from '../../entities/static'
import { FactoryInternalEvent } from './factory.internal'
import { FactoryService } from './factory.service'
import { BaseInputEvent } from '../../common/interfaces/BaseInputEvent'
import { Engine } from '@/core'

export class FactoryInputManagement extends BaseInputEvent {

  constructor(
    engine: Engine,
    private factoryService: FactoryService,
    private factoryInternal: FactoryInternalEvent
  ) {
    super(engine.input)
  }

  requestNewMachine(sMachine: StaticMachine): Promise<Machine> {
    return this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error('Request is skipped'))
        return
      }
      if (err) {
        failed(err)
        return
      }
      const result = this.factoryService.addNewMachine(sMachine, ts)
      if (result instanceof Error) {
        failed(result)
        return
      }
      ok(result)
    })
  }

  requestNewRecipe(sRecipe: StaticRecipe): Promise<Recipe> {
    return this.makeRequest((ok, failed) => (err, _, isSkip) => {
      if (isSkip) {
        failed(new Error('Request is skipped'))
        return
      }
      if (err) {
        failed(err)
        return
      }
      const result = this.factoryService.addNewRecipe(sRecipe)
      if (result instanceof Error) {
        failed(result)
        return
      }
      ok(result)
    })
  }

  upMachinePower(machine: Machine): Promise<Machine> {
    return this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error('Request is skipped'))
        return
      }
      if (err) {
        failed(err)
        return
      }
      machine.power *= 1.2
      machine.syncedAt = ts
      machine.recipe && this.factoryInternal.publishMachineEvent(machine as MachineR)
      ok(machine)
    })
  }
  setMachineRecipe({ machine, recipe }: { machine: Machine, recipe?: Recipe }): Promise<Machine> {
    return this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error('Request is skipped'))
        return
      }
      if (err) {
        failed(err)
        return
      }
      if (machine.recipe?.base.id === recipe?.base.id) {
        return
      }
      if (machine.recipe) {
        this.factoryInternal.unpublishMachineEvent(machine as MachineR)
      }
      this.factoryService.setMachineRecipe(machine, ts, recipe)
      if (machine.recipe) {
        this.factoryInternal.publishMachineEvent(machine as MachineR)
      }
      ok(machine)
    })
  }
}
