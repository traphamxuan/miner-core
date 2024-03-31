import type { Deposit, Shuttle } from '../entities'
import { MinerInternalEvent } from '../event'
import { BaseInputEvent } from './BaseInputEvent'
import { InputProcessor } from '../core'

export class MinerInputManagement extends BaseInputEvent {
  constructor(
    input: InputProcessor,
    private minerInternal: MinerInternalEvent,
  ) {
    super(input)
  }

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
    return timestamp ? this.minerInternal.createShuttle(sShuttleId, timestamp)
    : this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip createShuttle ${sShuttleId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      this.minerInternal.createShuttle(sShuttleId, ts)
        .then(shuttle => ok(shuttle))
        .catch(err => failed(err))
    })
  }

  requestNewDeposit(sDepositId: string, timestamp?: number): Promise<Deposit> {
    return timestamp ? this.minerInternal.createDeposit(sDepositId, timestamp)
    : this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip createDeposit ${sDepositId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      this.minerInternal.createDeposit(sDepositId, ts)
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
