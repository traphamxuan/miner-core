import { Deposit, Shuttle, ShuttleD } from "../entities";
import { MinerService, StaticService } from "../pool";
import { BaseEvent } from "./BaseEvent";
import { EventProcessor } from "../core";

export class MinerInternalEvent extends BaseEvent{
  constructor(
    event: EventProcessor,
    private sService: StaticService,
    private minerService: MinerService,
  ) {
    super(event)
  }

  get id(): string { return this.minerService.id + '-internal' }

  async createShuttle(sShuttleId: string, createdAt: number): Promise<Shuttle> {
    const shuttle = this.minerService.Shuttle(sShuttleId)
    if (shuttle) {
      return shuttle
    }
    const sShuttle = this.sService.getOne('shuttle', sShuttleId)
    if (!sShuttle) {
      throw new Error(`Invalid shuttle ID ${sShuttleId}`)
    }
    return this.makeRequest('create-shuttle-' + sShuttle.id, createdAt, (ok, failed) => (ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip createShuttle ${sShuttle.id}`))
        return -1
      }
      ts = ts < createdAt ? createdAt : ts
      const shuttle = this.minerService.addNewShuttle(sShuttle, ts)
      if (shuttle instanceof Error) {
        failed(shuttle)
        return -1
      }
      ok(shuttle)
      return -1
    })
  }

  async createDeposit(sDepositId: string, timestamp: number): Promise<Deposit> {
    const deposit = this.minerService.Deposit(sDepositId)
    if (deposit) {
      return deposit
    }
    const sDeposit = this.sService.getOne('deposit', sDepositId)
    if (!sDeposit) {
      throw new Error(`Invalid deposit ID ${sDepositId}`)
    }
    return this.makeRequest('create-deposit-' + sDepositId, timestamp, (ok, failed) => (ts, isSKip) => {
      if (isSKip) {
        failed(new Error(`Skip createDeposit ${sDepositId}`))
        return -1
      }
      ts = ts < timestamp ? timestamp : ts
      const deposit = this.minerService.addNewDeposit(sDeposit, ts)
      if (deposit instanceof Error) {
        failed(deposit)
        return -1
      }
      ok(deposit)
      return 0
    })
  }

  async setShuttleDeposit(sShuttleId: string, timestamp: number, sDepositId?: string): Promise<Shuttle> {
    return this.makeRequest('set-deposit-' + sShuttleId + sDepositId, timestamp, (ok, failed) => (ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip setShuttleDeposit ${sShuttleId}`))
        return -1 
      }
      const shuttle = this.minerService.Shuttle(sShuttleId)
      if (!shuttle) {
        failed(new Error(`Invalid shuttle ID ${sShuttleId}`))
        return -1 
      }
      if (shuttle.syncedAt > ts) {
        failed(new Error(`Invalid timestamp ${ts} for setShuttleDeposit shuttle ${sShuttleId}`))
        return -1
      }
      const deposit = sDepositId ? this.minerService.Deposit(sDepositId) : undefined
      ts = ts < timestamp ? timestamp : ts
      shuttle.sync(ts)
      shuttle.setDeposit(deposit)
      if (shuttle.deposit) {
        shuttle.deposit.sync(ts)
        this.publishShuttleEvent(sShuttleId).catch(err => console.warn(err.message))
      } else {
        this.unPublishShuttleEvent(shuttle.base.id)
      }
      ok(shuttle)
      return 0
    })
  }

  async upDepositRate(sDepositId: string, timestamp: number): Promise<Deposit> {
    return this.makeRequest('up-deposit-rate-' + sDepositId, timestamp, (ok, failed) => (ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip upDepositRate ${sDepositId}`))
        return 0
      }
      const deposit = this.minerService.Deposit(sDepositId)
      if (!deposit) {
        failed(new Error(`Invalid deposit ID ${sDepositId}`))
        return 0
      }
      if (deposit.syncedAt > ts) {
        failed(new Error(`Invalid timestamp ${ts} for upDepositRate deposit ${sDepositId}`))
        return 0
      }
      deposit.sync(ts)
      deposit.rate *= 1.2
      ok(deposit)
      return 0 
    })
  }

  async upShuttleSpeed(sShuttleId: string, timestamp: number): Promise<Shuttle> {
    return this.makeRequest('up-shuttle-speed-' + sShuttleId, timestamp, (ok, failed) => (ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip upShuttleSpeed ${sShuttleId}`))
        return 0
      }
      const shuttle = this.minerService.Shuttle(sShuttleId)
      if (!shuttle) {
        failed(new Error(`Invalid shuttle ID ${sShuttleId}`))
        return 0
      }
      if (shuttle.syncedAt > ts) {
        failed(new Error(`Invalid timestamp ${ts} for upShuttleSpeed shuttle ${sShuttleId} at ${shuttle.syncedAt}`))
        return 0
      }
      shuttle.sync(ts)
      shuttle.upgradeSpeed()
      shuttle.deposit && this.publishShuttleEvent(sShuttleId).catch(err => console.warn(err.message))
      ok(shuttle)
      return 0
    })
  }

  async upShuttleCapacity(sShuttleId: string, timestamp: number): Promise<Shuttle> {
    return this.makeRequest('up-shuttle-capacity-' + sShuttleId, timestamp, (ok, failed) => (ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip upShuttleCapacity ${sShuttleId}`))
        return 0
      }
      const shuttle = this.minerService.Shuttle(sShuttleId)
      if (!shuttle) {
        failed(new Error(`Invalid shuttle ID ${sShuttleId}`))
        return 0
      }
      if (shuttle.syncedAt > ts) {
        failed(new Error(`Invalid timestamp ${ts} for upShuttleCapacity shuttle ${sShuttleId}`))
        return 0
      }
      shuttle.sync(ts)
      shuttle.capacity = Math.floor(shuttle.capacity * 1.2)
      shuttle.deposit && this.publishShuttleEvent(sShuttleId).catch(err => console.warn(err.message))
      ok(shuttle)
      return 0
    })
  }

  publishShuttleEvent(sShuttleId: string): Promise<ShuttleD> {
    this.unPublishShuttleEvent(sShuttleId)
    const shuttle = this.minerService.Shuttle(sShuttleId)
    if (!shuttle) {
      throw new Error(`Invalid shuttle ID ${sShuttleId}`)
    }
    if (!shuttle.deposit) {
      throw new Error(`Invalid shuttle deposit ${sShuttleId}`)
    }
    const nextTs = shuttle.getNextEventAt()

    return this.makeRequest('shuttle-touch-' + sShuttleId, nextTs, (ok, failed) => (ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip unload ${sShuttleId}`))
        return -1
      }
      const shuttle = this.minerService.Shuttle(sShuttleId)
      if (!shuttle) {
        failed(new Error(`Invalid shuttle ID ${sShuttleId}`))
        return -1
      }
      if (!shuttle.deposit) {
        failed(new Error(`Invalid shuttle deposit ${sShuttleId}`))
        return -1
      }
      shuttle.deposit.sync(ts)
      shuttle.sync(ts)
      if (shuttle.isReturned) {
        this.minerService.unloadShuttleResources(shuttle, ts)
      } else {
        this.minerService.loadShuttleResources(shuttle)
      }
      ok(shuttle as ShuttleD)
      return shuttle.getNextEventAt()
    }, 'continuous')
  }

  unPublishShuttleEvent(sShuttleId: string) {
    this.removeRequest('load-' + sShuttleId)
    this.removeRequest('unload-' + sShuttleId)
  }
}
