import { ActionCommand, Component, createComponents } from "./components"
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
  initStatic,
} from "./entities"

export type GameData = {
  planet: RawPlanet
  deposits: RawDeposit[]
  shuttles: RawShuttle[]
  resources: RawResource[]
  machines: RawMachine[]
  recipes: RawRecipe[]
}

export type Action = {
  target: string
  command: ActionCommand
  params: string[]
  createdAt: number
}

export class Game {
  private readonly engine: Engine
  private readonly component: Component
  constructor() {
    this.engine = createCoreEngine()
    this.component = createComponents(this.engine)
  }

  init(data: TStaticData) {
    this.getService('static').init(data)
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

  run(ts: number, limit?: number): number {
    return this.engine.loop.run(ts, limit)
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
    rawData.shuttles.forEach(s => mService.addShuttle(new Shuttle(s, s.sdid ? mService.Deposit(s.sdid) : undefined)))
    rawData.recipes.forEach(r => fService.addRecipe(new Recipe(r)))
    rawData.machines.forEach(m => fService.addMachine(new Machine(m, m.sreid ? fService.Recipe(m.sreid) : undefined)))

    mService.Shuttles().forEach(shuttle => shuttle.deposit && mInternal.publishShuttleEvent(shuttle as ShuttleD))
    fService.Machines().forEach(machine => machine.recipe && fInternal.publishMachineEvent(machine as MachineR))
    return null
  }

  loadInput(inputs: Action[]): Promise<Resource | Deposit | Shuttle | Recipe | Machine>[] {
    const promises: Promise<Resource | Deposit | Shuttle | Recipe | Machine>[] = []
    const { factory, miner, warehouse } = this.component.input
    for (const act of inputs) {
      switch (act.target) {
        case 'resource':
          if (act.command == ActionCommand.SELL && act.params.length == 2) {
            promises.push(warehouse.requestSellResource(act.params[0], BigInt(act.params[1]), act.createdAt))
          }
          break;
        case 'deposit':
          if (act.command == ActionCommand.BUY && act.params.length == 1) {
            promises.push(miner.requestNewDeposit(act.params[0], act.createdAt))
          } else if (act.command == ActionCommand.UP_POW && act.params.length == 1) {
            promises.push(miner.upDepositRate(act.params[0], act.createdAt))
          }
          break;
        case 'shuttle':
          if (act.command == ActionCommand.BUY && act.params.length == 1) {
            promises.push(miner.requestNewShuttle(act.params[0], act.createdAt))
          } else if (act.command == ActionCommand.SET && act.params.length == 2) {
            promises.push(miner.requestSetDeposit(act.params[0], act.params[1], act.createdAt))
          } else if (act.command == ActionCommand.UP_CAP && act.params.length == 1) {
            promises.push(miner.upShuttleCapacity(act.params[0], act.createdAt))
          } else if (act.command == ActionCommand.UP_POW && act.params.length == 1) {
            promises.push(miner.upShuttleSpeed(act.params[0], act.createdAt))
          }
          break;
        case 'recipe':
          if (act.command == ActionCommand.BUY && act.params.length == 1) {
            promises.push(factory.requestNewRecipe(act.params[0], act.createdAt))
          }
          break;
        case 'machine':
          if (act.command == ActionCommand.SET && act.params.length == 2) {
            promises.push(factory.setMachineRecipe(act.params[0], act.params[1], act.createdAt))
          } else if (act.command == ActionCommand.UP_POW && act.params.length == 1) {
            promises.push(factory.upMachinePower(act.params[0], act.createdAt))
          } else if (act.command == ActionCommand.BUY && act.params.length == 1) {
            promises.push(factory.requestNewMachine(act.params[0], act.createdAt))
          }
          break;
      }
    }
    return promises
  }

  unload() {
    this.engine.loop.reset()
    this.component.service.miner.reset()
    this.component.service.factory.reset()
    this.component.service.warehouse.reset()
    this.component.service.planet.unload()
  }

  toRaw(): GameData | undefined {
    if (!this.component.service.planet.planet) {
      return undefined
    }
    return {
      planet: this.component.service.planet.planet.toRaw(),
      deposits: this.component.service.miner.Deposits().map(m => m.toRaw()),
      shuttles: this.component.service.miner.Shuttles().map(m => m.toRaw()),
      resources: this.component.service.warehouse.Resources().map(r => r.toRaw()),
      machines: this.component.service.factory.Machines().map(f => f.toRaw()),
      recipes: this.component.service.factory.Recipes().map(f => f.toRaw()),
    }
  }
}

export * from './entities'
export { Component, TStaticData }