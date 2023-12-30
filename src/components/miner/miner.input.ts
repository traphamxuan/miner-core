import { Deposit, Shuttle, ShuttleD } from '../../entities'
import { StaticDeposit, StaticShuttle } from '../../entities/static'
import { MinerInternalEvent } from './miner.internal'
import { MinerService } from './miner.service'
import { BaseInputEvent } from '../../common/interfaces/BaseInputEvent'
import type { Engine } from '../../core'

export class MinerInputManagement extends BaseInputEvent {
  constructor(
    engine: Engine,
    private minerService: MinerService,
    private minerInternal: MinerInternalEvent
  ) {
    super(engine.input)
  }

  get id(): string { return this.minerService.id + '-input' }

  requestSetDeposit(sShuttleId: string, sDepositId?: string): Promise<Shuttle> {
    const shuttle = this.minerService.Shuttle(sShuttleId)
    if (!shuttle) {
      throw new Error('Invalid shuttle ID')
    }
    const deposit = sDepositId ? this.minerService.Deposit(sDepositId) : undefined
    return this.makeRequest((ok, failed) => (err, ts) => {
      if (err) {
        failed(err)
        return
      }
      shuttle.sync(ts)
      deposit?.sync(ts)
      shuttle.deposit = deposit
      deposit && this.minerInternal.publishShuttleEvent(shuttle as ShuttleD)
      ok(shuttle)
    })
  }

  requestNewShuttle(sShuttleId: string, createdAt = 0): Promise<Shuttle> {
    const sShuttle = StaticShuttle.SHUTTLES.getOne(sShuttleId)
    if (!sShuttle) {
      throw new Error('Invalid static shuttle ID')
    }
    return this.makeRequest((ok, failed) => (err, ts) => {
      if (err) {
        failed(err)
        return
      }
      ts = ts < createdAt ? createdAt : ts
      const shuttle = this.minerService.addNewShuttle(sShuttle, ts)
      if (shuttle instanceof Error) {
        failed(shuttle)
        return
      }
      ok(shuttle)
    })
  }

  requestNewDeposit(sDepositId: string, createdAt = 0): Promise<Deposit> {
    const sDeposit = StaticDeposit.DEPOSITS.getOne(sDepositId)
    if (!sDeposit) {
      throw new Error('Invalid deposit id')
    }
    return this.makeRequest((ok, failed) => (err, ts) => {
      if (err) {
        failed(err)
        return
      }
      ts = ts < createdAt ? createdAt : ts
      const deposit = this.minerService.addNewDeposit(sDeposit, ts)
      if (deposit instanceof Error) {
        failed(deposit)
        return
      }
      ok(deposit)
    })
  }

  upDepositRate(sDepositId: string): Promise<Deposit> {
    const deposit = this.minerService.Deposit(sDepositId)
    if (!deposit) {
      throw new Error('Invalid Deposit ID')
    }
    return this.makeRequest((ok, failed) => (err, ts) => {
      if (err) {
        failed(err)
        return
      }
      deposit.sync(ts)
      deposit.rate *= 1.2
      ok(deposit)
    })
  }

  upShuttleSpeed(sShuttleId: string): Promise<Shuttle> {
    const shuttle = this.minerService.Shuttle(sShuttleId)
    if (!shuttle) {
      throw new Error('Invalid Deposit ID')
    }
    return this.makeRequest((ok, failed) => (err, ts) => {
      if (err) {
        failed(err)
        return
      }
      shuttle.sync(ts)
      shuttle.speed *= 1.2
      shuttle.deposit && this.minerInternal.publishShuttleEvent(shuttle as ShuttleD)
      ok(shuttle)
    })
  }
  upShuttleCapacity(sShuttleId: string): Promise<Shuttle> {
    const shuttle = this.minerService.Shuttle(sShuttleId)
    if (!shuttle) {
      throw new Error('Invalid Deposit ID')
    }
    return this.makeRequest((ok, failed) => (err, ts) => {
      if (err) {
        failed(err)
        return
      }
      shuttle.sync(ts)
      shuttle.capacity = Math.floor(shuttle.capacity * 1.2)
      shuttle.deposit && this.minerInternal.publishShuttleEvent(shuttle as ShuttleD)
      ok(shuttle)
    })
  }
}
