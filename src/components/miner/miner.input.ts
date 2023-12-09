import { Deposit, Shuttle, ShuttleD } from '../../entities'
import { StaticDeposit, StaticShuttle } from '../../entities/static'
import { MinerInternalEvent } from './miner.internal'
import { MinerService } from './miner.service'
import { BaseInputEvent } from '../../common/interfaces/BaseInputEvent'
import type { Engine } from '@/core'

export class MinerInputManagement extends BaseInputEvent {
  constructor(
    engine: Engine,
    private minerService: MinerService,
    private minerInternal: MinerInternalEvent
  ) {
    super(engine.input)
  }

  get id(): string { return this.minerService.id + '-input' }

  requestSetDeposit(shuttle: Shuttle, deposit?: Deposit): Promise<Shuttle> {
    return this.makeRequest((ok, failed) => (err, ts) => {
      if (err) {
        failed(err)
        return
      }
      shuttle.deposit = deposit
      deposit && this.minerInternal.publishShuttleEvent(shuttle as ShuttleD)
      ok(shuttle)
    })
  }

  requestNewShuttle(sShuttle: StaticShuttle, createdAt = 0): Promise<Shuttle> {
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

  requestNewDeposit(sDeposit: StaticDeposit, createdAt = 0): Promise<Deposit> {
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

  upDepositRate(deposit: Deposit): Promise<Deposit> {
    return this.makeRequest((ok, failed) => (err, ts) => {
      if (err) {
        failed(err)
        return
      }
      deposit.rate *= 1.2
      ok(deposit)
    })
  }

  upShuttleSpeed(shuttle: Shuttle): Promise<Shuttle> {
    return this.makeRequest((ok, failed) => (err, ts) => {
      if (err) {
        failed(err)
        return
      }
      shuttle.speed *= 1.2
      shuttle.deposit && this.minerInternal.publishShuttleEvent(shuttle as ShuttleD)
      ok(shuttle)
    })
  }
  upShuttleCapacity(shuttle: Shuttle): Promise<Shuttle> {
    return this.makeRequest((ok, failed) => (err, ts) => {
      if (err) {
        failed(err)
        return
      }
      shuttle.capacity = Math.floor(shuttle.capacity * 1.2)
      shuttle.deposit && this.minerInternal.publishShuttleEvent(shuttle as ShuttleD)
      ok(shuttle)
    })
  }
}
