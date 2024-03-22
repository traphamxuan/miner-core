import { ActionCommand } from "./common/enum"
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
  ResourceAmount,
} from "./entities"

export type GameData = RawPlanet & {
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
  deinit() {
    this.getService('static').deinit()
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

  async runAsync(ts: number, msPeriod = 100, onProgress?: (ts: number) => boolean): Promise<number> {
    let tick = 0
    while (tick < ts) {
      tick = await new Promise(ok => setTimeout(() => {
        ok(this.engine.loop.run(ts, msPeriod * 1000))
      }, msPeriod))
      if (onProgress && !onProgress(tick)) {
        return tick
      }
    }
    return tick
  }

  load(rawData: GameData) {
    const pService = this.getService('planet')
    const wService = this.getService('warehouse')
    const mService = this.getService('miner')
    const fService = this.getService('factory')
    const sService = this.getService('static')
    const mInternal = this.component.internal.miner
    const fInternal = this.component.internal.factory

    if (pService.planet) {
      if (pService.planet.id != rawData.id) {
        throw new Error('Exist planet is working. Remove the old one first!!!')
      }
      return
    }

    pService.load(rawData)

    rawData.resources.forEach(r => {
      const sResource = sService.getOne('resource', r.srid)
      if (!sResource) throw new Error(`Resource ${r.srid} not found`)
      wService.addResource(new Resource(r, sResource))
    })
    rawData.deposits.forEach(d => {
      const sDeposit = sService.getOne('deposit', d.sdid)
      if (!sDeposit) throw new Error(`Deposit ${d.sdid} not found`)
      mService.addDeposit(new Deposit(d, sDeposit))
    })
    rawData.shuttles.forEach(s => {
      const sShuttle = sService.getOne('shuttle', s.ssid)
      if (!sShuttle) throw new Error(`Shuttle ${s.ssid} not found`)
      const load = s.load.map(res => {
        const sResource = sService.getOne('resource', res.srid)
        if (!sResource) throw new Error(`Resource ${res.srid} not found`)
        return new ResourceAmount(res, sResource)
      })
      const deposit = s.sdid ? mService.Deposit(s.sdid) : undefined
      mService.addShuttle(new Shuttle(s, sShuttle, load, deposit))
    })
    rawData.recipes.forEach(r => {
      const sRecipe = sService.getOne('recipe', r.sreid)
      if (!sRecipe) throw new Error(`Recipe ${r.sreid} not found`)
      fService.addRecipe(new Recipe(r, sRecipe))
    })
    rawData.machines.forEach(m => {
      const sMachine = sService.getOne('machine', m.smid)
      if (!sMachine) throw new Error(`Machine ${m.smid} not found`)
      const recipe = m.sreid ? fService.Recipe(m.sreid) : undefined
      fService.addMachine(new Machine(m, sMachine, recipe))
    })

    mService.Shuttles().forEach(shuttle => shuttle.deposit && mInternal.publishShuttleEvent(shuttle.base.id).catch(err => console.warn(err.message)))
    fService.Machines().forEach(machine => machine.recipe && fInternal.publishMachineEvent(machine.base.id).catch(err => console.warn(err.message)))
  }

  loadInput(inputs: Action[]): Promise<Resource | Deposit | Shuttle | Recipe | Machine>[] {
    const promises: Promise<Resource | Deposit | Shuttle | Recipe | Machine>[] = []
    const { factory, miner, warehouse } = this.component.input
    for (const act of inputs) {
      switch (act.target as keyof StaticObject) {
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
      ...this.component.service.planet.planet.toRaw(),
      deposits: this.component.service.miner.Deposits().map(m => m.toRaw()),
      shuttles: this.component.service.miner.Shuttles().map(m => m.toRaw()),
      resources: this.component.service.warehouse.Resources().map(r => r.toRaw()),
      machines: this.component.service.factory.Machines().map(f => f.toRaw()),
      recipes: this.component.service.factory.Recipes().map(f => f.toRaw()),
    }
  }
}

export * from './entities'
export { Component, TStaticData, ActionCommand }