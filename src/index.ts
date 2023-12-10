import { Component, createComponents } from "./components"
import { Engine, createCoreEngine } from "./core"
import {
  RawPlanet,
  RawDeposit,
  RawShuttle,
  RawResource,
  RawMachine,
  RawRecipe,
  Resource,
  Deposit,
  Shuttle,
  Recipe,
  Machine,
  ShuttleD,
  MachineR,
  TStaticData,
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
  private readonly engine: Engine
  private readonly component: Component
  constructor() {
    this.engine = createCoreEngine()
    this.component = createComponents(this.engine)
  }

  getService<T extends keyof Component['service']>(type: T): Component['service'][T] {
    return this.component.service[type]
  }

  getRender<T extends keyof Component['render']>(type: T): Component['render'][T] {
    return this.component.render[type]
  }

  getInput<T extends keyof Component['input']>(type: T): Component['input'][T] {
    return this.component.input[type]
  }

  start(elapseTs: number, startTs: number) {
    this.engine.loop.start(elapseTs, startTs)
  }
  run(ts: number) {
    this.engine.loop.run(ts)
  }
  
  load(rawData: GameData): Error | null {
    const pService = this.component.service.planet
    const wService = this.component.service.warehouse
    const mService = this.component.service.miner
    const fService = this.component.service.factory
    const mInternal = this.component.internal.miner
    const fInternal = this.component.internal.factory

    if (pService.planet) {
      if (pService.planet.id != rawData.planet.id) {
        return new Error('Exist planet is working. Remove the old one first!!!')
      }
      return null
    }
  
    const p = pService.load(rawData.planet)
   
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
    this.component.service.miner.reset()
    this.component.service.factory.reset()
    this.component.service.warehouse.reset()
    this.component.service.planet.unload()
  }
}

export * from './entities'
export { Component, TStaticData }