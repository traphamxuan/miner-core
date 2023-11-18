export * from './Accelerator'
export * from './Machine'
export * from './Resource'
export * from './Shuttle'
export * from './Deposit'
export * from './Recipe'

export type TStaticData = {
  resources: RawStaticResource[]
  deposits: RawStaticDeposit[]
  shuttles: RawStaticShuttle[]
  recipes: RawStaticRecipe[]
  machines: RawStaticMachine[]
}

import {
  StaticDeposit,
  StaticMachine,
  StaticRecipe,
  StaticResource,
  StaticShuttle,
  RawStaticDeposit,
  RawStaticMachine,
  RawStaticRecipe,
  RawStaticResource,
  RawStaticShuttle
} from "../../entities/static";

export function initStatic(staticData: TStaticData) {
  staticData.resources.forEach(raw => {
    const staticData = new StaticResource(raw)
    StaticResource.RESOURCES.add(staticData, [raw.name])
  })
  staticData.deposits.forEach(raw => {
    const staticData = new StaticDeposit(raw)
    StaticDeposit.DEPOSITS.add(staticData, [raw.name])
  })
  staticData.shuttles.forEach(raw => {
    const staticData = new StaticShuttle(raw)
    StaticShuttle.SHUTTLES.add(staticData, [raw.name])
  })
  staticData.recipes.forEach(raw => {
    const staticData = new StaticRecipe(raw)
    StaticRecipe.RECIPES.add(staticData, [raw.name])
  })
  staticData.machines.forEach(raw => {
    const staticData = new StaticMachine(raw)
    StaticMachine.MACHINES.add(staticData, [raw.name])
  })
}

export function deinitStatic() {
  StaticResource.RESOURCES.reset()
  StaticDeposit.DEPOSITS.reset()
  StaticShuttle.SHUTTLES.reset()
  StaticRecipe.RECIPES.reset()
  StaticMachine.MACHINES.reset()
}
