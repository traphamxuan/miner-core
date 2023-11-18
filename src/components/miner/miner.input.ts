import { Deposit, Shuttle, ShuttleD } from '../../entities'
import { StaticDeposit, StaticShuttle } from '../../entities/static'
import { MinerInternalEvent } from './miner.internal'
import { MinerService } from './miner.service'
import { BaseInputEvent } from '../../common/interfaces/BaseInputEvent'

export class MinerInputManagement extends BaseInputEvent {
  constructor(
    private minerService: MinerService,
    private minerInternal: MinerInternalEvent
  ) {
    super()
  }

  get id(): string { return this.minerService.id + '-input' }

  requestNewMiner(sShuttle: StaticShuttle, sDeposit: StaticDeposit): Promise<{ shuttle: Shuttle, deposit: Deposit }> {
    return this.makeRequest((ok, failed) => (err, ts) => {
      if (err) {
        failed(err)
        return
      }
      const result = this.minerService.addNewMine(sShuttle, sDeposit, ts)
      if (result instanceof Error) {
        failed(result)
        return
      }
      result.shuttle.deposit && this.minerInternal.publishShuttleEvent(result.shuttle as ShuttleD)
      ok(result)
    })
  }

  updateMinerID(shuttle: Shuttle, shuttleID: string, deposit: Deposit, depositId: string): Promise<{ shuttle: Shuttle, deposit: Deposit }> {
    return this.makeRequest((ok, failed) => (err, ts) => {
      if (err) {
        failed(err)
        return
      }
      this.minerService.updateMinerID(shuttle.id, shuttleID, deposit.id, depositId)
      this.minerInternal.updateMinerID(shuttle.id, shuttleID)
      ok({ shuttle, deposit })
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
