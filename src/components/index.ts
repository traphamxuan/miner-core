import { gameLoop } from '../core'
import { RawDeposit, RawShuttle, RawResource, RawMachine, RawRecipe, Resource, Deposit, Shuttle, Recipe, Machine, ShuttleD, MachineR } from '../entities'
import { fService, fInternal } from './factory'
import { mService, mInternal } from './miner'
import { pService } from './planet'
import { wService } from './warehouse'

export * from './planet'
export * from './factory'
export * from './miner'
export * from './warehouse'
export * from './static'


export type TotalPlanetRawData = {
  deposits: RawDeposit[],
  shuttles: RawShuttle[],
  resources: RawResource[],
  machines: RawMachine[],
  recipes: RawRecipe[],
}

export function loadPlanet(planetId: string, rawData: TotalPlanetRawData): Error | null {
  if (pService.planet) {
    if (pService.planet.id != planetId) {
      return new Error('Exist planet is working. Remove the old one first!!!')
    }
    return null
  }

  const planet = pService.load(planetId)
  if (planet instanceof Error) {
    return planet
  }
  rawData.resources.forEach(r => wService.addResource(new Resource(r)))
  rawData.deposits.forEach(d => mService.addDeposit(new Deposit(d)))
  rawData.shuttles.forEach(s => mService.addShuttle(new Shuttle(s, mService.Deposits())))
  rawData.recipes.forEach(r => fService.addRecipe(new Recipe(r)))
  rawData.machines.forEach(m => fService.addMachine(new Machine(m, fService.Recipes())))

  mService.Shuttles().forEach(shuttle => shuttle.deposit && mInternal.publishShuttleEvent(shuttle as ShuttleD))
  fService.Machines().forEach(machine => machine.recipe && fInternal.publishMachineEvent(machine as MachineR))
  return null
}

export function unloadPlanet() {
  // TODO: Do the last looping
  gameLoop.reset()
  mService.reset()
  fService.reset()
  wService.reset()
  pService.unload()
}
