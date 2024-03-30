import { ActionCommand } from "./common/enum"
import { Loop } from "./core/loop"
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
  TStaticData,
  ResourceAmount,
} from "./entities"
import { createEvents } from "./event"
import { creatInputs } from "./input"
import { createPool } from "./pool"
import { createSync } from "./sync"

type PlanetData = RawPlanet & {
  deposits: RawDeposit[]
  shuttles: RawShuttle[]
  resources: RawResource[]
  machines: RawMachine[]
  recipes: RawRecipe[]
}

type GameData = {
  planet: PlanetData
  static: TStaticData
}

type Action = {
  target: string
  command: ActionCommand
  params: string[]
  createdAt: number
}

type Component = {
  service: ReturnType<typeof createPool>
  render: Omit<ReturnType<typeof createSync>, 'sync'>,
  input: Omit<ReturnType<typeof creatInputs>, 'input'>,
  event: Omit<ReturnType<typeof createEvents>, 'event'>,
}

class Game {
  private readonly engine: Loop
  private readonly component: Component
  constructor() {
    const services = createPool()
    const { event: eventProc, ...events } = createEvents(services.static, services.miner, services.factory, services.warehouse)
    const { input: inputProc, ...inputs } = creatInputs(events.miner, events.factory, events.warehouse)
    const { sync: syncProc, ...syncs } = createSync(services.factory, services.miner, services.warehouse)
    this.engine = new Loop(inputProc, eventProc, syncProc)
    this.component = {
      service: services,
      render: syncs,
      input: inputs,
      event: events,
    }
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
    return this.engine.run(ts, limit)
  }

  async runAsync(ts: number, msPeriod = 100, onProgress?: (ts: number) => boolean): Promise<number> {
    let tick = 0
    while (tick < ts) {
      tick = await new Promise(ok => setTimeout(() => {
        ok(this.engine.run(ts, msPeriod * 1000))
      }, msPeriod))
      if (onProgress && !onProgress(tick)) {
        return tick
      }
    }
    return tick
  }

  load(rawData: PlanetData) {
    const pService = this.getService('planet')
    const wService = this.getService('warehouse')
    const mService = this.getService('miner')
    const fService = this.getService('factory')
    const sService = this.getService('static')
    const mEvent = this.component.event.miner
    const fEvent = this.component.event.factory

    if (pService.planet) {
      if (pService.planet.id != rawData.id) {
        throw new Error('Exist planet is working. Remove the old one first!!!')
      }
      return
    }

    pService.load(rawData)

    rawData.resources.forEach(r => {
      if (wService.Resource(r.srid)) return
      const sResource = sService.getOne('resource', r.srid)
      if (!sResource) throw new Error(`Resource ${r.srid} not found`)
      wService.addResource(new Resource(r, sResource))
    })
    rawData.deposits.forEach(d => {
      if (mService.Deposit(d.sdid)) return
      const sDeposit = sService.getOne('deposit', d.sdid)
      if (!sDeposit) throw new Error(`Deposit ${d.sdid} not found`)
      mService.addDeposit(new Deposit(d, sDeposit))
    })
    rawData.shuttles.forEach(s => {
      if (mService.Shuttle(s.ssid)) return
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
      if (fService.Recipe(r.sreid)) return
      const sRecipe = sService.getOne('recipe', r.sreid)
      if (!sRecipe) throw new Error(`Recipe ${r.sreid} not found`)
      fService.addRecipe(new Recipe(r, sRecipe))
    })
    rawData.machines.forEach(m => {
      if (fService.Machine(m.smid)) return
      const sMachine = sService.getOne('machine', m.smid)
      if (!sMachine) throw new Error(`Machine ${m.smid} not found`)
      const recipe = m.sreid ? fService.Recipe(m.sreid) : undefined
      fService.addMachine(new Machine(m, sMachine, recipe))
    })

    mService.Shuttles().forEach(shuttle => shuttle.deposit && mEvent.publishShuttleEvent(shuttle.base.id).catch(err => console.warn(err.message)))
    fService.Machines().forEach(machine => machine.recipe && fEvent.publishMachineEvent(machine.base.id).catch(err => console.warn(err.message)))
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
    this.engine.reset()
    this.component.service.miner.reset()
    this.component.service.factory.reset()
    this.component.service.warehouse.reset()
    this.component.service.planet.unload()
  }

  toRaw(): PlanetData | undefined {
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
export { PlanetData, GameData, Action }
export { Game }
