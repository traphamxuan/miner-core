import { Component, createComponents } from "./components"
import { Engine, createCoreEngine } from "./core"
import {
  RawPlanet,
  RawDeposit,
  RawShuttle,
  RawResource,
  RawMachine,
  RawRecipe,
  Planet,
  Resource,
  Deposit,
  Shuttle,
  Recipe,
  Machine,
  ShuttleD,
  MachineR,
  initStatic,
  TStaticData,
  deinitStatic,
} from "./entities"

export type GameData = {
  planet: RawPlanet,
  deposits: RawDeposit[],
  shuttles: RawShuttle[],
  resources: RawResource[],
  machines: RawMachine[],
  recipes: RawRecipe[],
}

export class Game {
  readonly engine: Engine
  readonly component: Component
  constructor() {
    this.engine = createCoreEngine()
    this.component = createComponents(this.engine)
  }

  init(sData: TStaticData) {
    initStatic(sData)
  }
  deinit() {
    deinitStatic()
  }
  
  load(rawData: GameData): Error | null {
    const pService = this.component.planet.service
    const wService = this.component.warehouse.service
    const mService = this.component.miner.service
    const fService = this.component.factory.service
    const mInternal = this.component.miner.internal
    const fInternal = this.component.factory.internal

    if (pService.planet) {
      if (pService.planet.id != rawData.planet.id) {
        return new Error('Exist planet is working. Remove the old one first!!!')
      }
      return null
    }
  
    const p = pService.load(rawData.planet.id)
    if (p instanceof Error) {
      pService.addPlanet(new Planet(rawData.planet))
      pService.load(rawData.planet.id)
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
  
  unload() {
    // TODO: Do the last looping
    this.engine.loop.reset()
    this.component.miner.service.reset()
    this.component.factory.service.reset()
    this.component.warehouse.service.reset()
    this.component.planet.service.unload()
  }
}

export * from './entities'
export { Component, TStaticData }