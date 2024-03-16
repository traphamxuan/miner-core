import { Deposit, Shuttle } from '../../entities'
import { StaticDeposit, StaticShuttle } from '../../entities/static'
import { MinerInternalEvent } from './miner.internal'
import { MinerService } from './miner.service'
import { BaseInputEvent } from '../../common/interfaces/BaseInputEvent'
import type { Engine } from '../../core'
import { StaticService } from '../static/static.service'

export class MinerInputManagement extends BaseInputEvent {
  constructor(
    engine: Engine,
    private minerService: MinerService,
    private minerInternal: MinerInternalEvent,
    private sService: StaticService,
  ) {
    super(engine.input)
  }

  get id(): string { return this.minerService.id + '-input' }

  requestSetDeposit(sShuttleId: string, sDepositId?: string, timestamp?: number): Promise<Shuttle> {
    return timestamp ? this.minerInternal.setShuttleDeposit(sShuttleId, timestamp, sDepositId)
    : this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip setShuttleDeposit ${sShuttleId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      this.minerInternal.setShuttleDeposit(sShuttleId, ts, sDepositId)
        .then(shuttle => ok(shuttle))
        .catch(err => failed(err))
    })
  }

  requestNewShuttle(sShuttleId: string, timestamp?: number): Promise<Shuttle> {
    const sShuttle = this.sService.getOne('shuttle', sShuttleId)
    if (!sShuttle) {
      throw new Error('Invalid static shuttle ID')
    }
    return timestamp ? this.minerInternal.createShuttle(sShuttle, timestamp)
    : this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip createShuttle ${sShuttleId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      this.minerInternal.createShuttle(sShuttle, ts)
        .then(shuttle => ok(shuttle))
        .catch(err => failed(err))
    })
  }

  requestNewDeposit(sDepositId: string, timestamp?: number): Promise<Deposit> {
    const sDeposit = this.sService.getOne('deposit', sDepositId)
    if (!sDeposit) {
      throw new Error(`Invalid static deposit ID ${sDepositId}`)
    }
    return timestamp ? this.minerInternal.createDeposit(sDeposit, timestamp)
    : this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip createDeposit ${sDepositId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      this.minerInternal.createDeposit(sDeposit, ts)
        .then(deposit => ok(deposit))
        .catch(err => failed(err))
    })
  }

  upDepositRate(sDepositId: string, timestamp?: number): Promise<Deposit> {
    return timestamp ? this.minerInternal.upDepositRate(sDepositId, timestamp)
    : this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip upDepositRate ${sDepositId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      this.minerInternal.upDepositRate(sDepositId, ts)
        .then(deposit => ok(deposit))
        .catch(err => failed(err))
    })
  }

  upShuttleSpeed(sShuttleId: string, timestamp?: number): Promise<Shuttle> {
    return timestamp ? this.minerInternal.upShuttleSpeed(sShuttleId, timestamp)
    : this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip upShuttleSpeed ${sShuttleId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      this.minerInternal.upShuttleSpeed(sShuttleId, ts)
        .then(shuttle => ok(shuttle))
        .catch(err => failed(err))
    })
  }

  upShuttleCapacity(sShuttleId: string, timestamp?: number): Promise<Shuttle> {
    return timestamp ? this.minerInternal.upShuttleCapacity(sShuttleId, timestamp)
    : this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip upShuttleCapacity ${sShuttleId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      this.minerInternal.upShuttleCapacity(sShuttleId, ts)
        .then(shuttle => ok(shuttle))
        .catch(err => failed(err))
    })
  }
}
