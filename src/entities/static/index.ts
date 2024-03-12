

import { StaticDeposit, RawStaticDeposit } from "./Deposit"
import { StaticMachine, RawStaticMachine } from './Machine'
import { StaticRecipe, RawStaticRecipe } from './Recipe'
import { StaticResource, RawStaticResource } from './Resource'
import { StaticShuttle, RawStaticShuttle } from './Shuttle'

export type TStaticData = {
  resources: RawStaticResource[]
  deposits: RawStaticDeposit[]
  shuttles: RawStaticShuttle[]
  recipes: RawStaticRecipe[]
  machines: RawStaticMachine[]
}

export function initStatic(staticData: TStaticData) {
  staticData.resources.forEach(raw => {
    const staticData = new StaticResource(raw)
    StaticResource.RESOURCES.add(staticData, [raw.id, raw.name])
  })
  staticData.deposits.forEach(raw => {
    const staticData = new StaticDeposit(raw)
    StaticDeposit.DEPOSITS.add(staticData, [raw.id, raw.name])
  })
  staticData.shuttles.forEach(raw => {
    const staticData = new StaticShuttle(raw)
    StaticShuttle.SHUTTLES.add(staticData, [raw.id, raw.name])
  })
  staticData.recipes.forEach(raw => {
    const staticData = new StaticRecipe(raw)
    StaticRecipe.RECIPES.add(staticData, [raw.id, raw.name])
  })
  staticData.machines.forEach(raw => {
    const staticData = new StaticMachine(raw)
    StaticMachine.MACHINES.add(staticData, [raw.id, raw.name])
  })
}

export function deinitStatic() {
  StaticResource.RESOURCES.reset()
  StaticDeposit.DEPOSITS.reset()
  StaticShuttle.SHUTTLES.reset()
  StaticRecipe.RECIPES.reset()
  StaticMachine.MACHINES.reset()
}

export * from './Accelerator'
export * from './Machine'
export * from './Resource'
export * from './Shuttle'
export * from './Deposit'
export * from './Recipe'