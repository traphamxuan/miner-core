

import { RawStaticDeposit } from "./Deposit"
import { RawStaticMachine } from './Machine'
import { RawStaticRecipe } from './Recipe'
import { RawStaticResource } from './Resource'
import { RawStaticShuttle } from './Shuttle'

export type TStaticData = {
  resources: RawStaticResource[]
  deposits: RawStaticDeposit[]
  shuttles: RawStaticShuttle[]
  recipes: RawStaticRecipe[]
  machines: RawStaticMachine[]
}

export * from './Accelerator'
export * from './Machine'
export * from './Resource'
export * from './Shuttle'
export * from './Deposit'
export * from './Recipe'