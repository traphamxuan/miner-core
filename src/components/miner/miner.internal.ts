import { Deposit, Shuttle, ShuttleD, StaticDeposit, StaticShuttle } from "../../entities";
import { MinerService } from "./miner.service";
import { BaseInternalEvent } from "../../common/interfaces/BaseInternalEvent";
import type { Engine } from "../../core";

export class MinerInternalEvent extends BaseInternalEvent{
  constructor(
    engine: Engine,
    private minerService: MinerService,
  ) {
    super(engine.internal)
  }

  get id(): string { return this.minerService.id + '-internal' }

  async createShuttle(sShuttle: StaticShuttle, createdAt: number): Promise<Shuttle> {
    const shuttle = this.minerService.Shuttle(sShuttle.id)
    if (shuttle) {
      return shuttle
    }
    return this.makeRequest('create-shuttle-' + sShuttle.id, createdAt, (ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip createShuttle ${sShuttle.id}`))
        return
      }
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

  async createDeposit(sDeposit: StaticDeposit, timestamp: number): Promise<Deposit> {
    const deposit = this.minerService.Deposit(sDeposit.id)
    if (deposit) {
      return deposit
    }
    return this.makeRequest('create-deposit-' + sDeposit.id, timestamp, (ok, failed) => (err, ts, isSKip) => {
      if (isSKip) {
        failed(new Error(`Skip createDeposit ${sDeposit.id}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      ts = ts < timestamp ? timestamp : ts
      const deposit = this.minerService.addNewDeposit(sDeposit, ts)
      if (deposit instanceof Error) {
        failed(deposit)
        return
      }
      ok(deposit)
    })
  }

  async setShuttleDeposit(sShuttleId: string, timestamp: number, sDepositId?: string): Promise<Shuttle> {
    return this.makeRequest('set-deposit-' + sShuttleId + sDepositId, timestamp, (ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip setShuttleDeposit ${sShuttleId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      const shuttle = this.minerService.Shuttle(sShuttleId)
      if (!shuttle) {
        failed(new Error(`Invalid shuttle ID ${sShuttleId}`))
        return
      }
      const deposit = sDepositId ? this.minerService.Deposit(sDepositId) : undefined
      ts = ts < timestamp ? timestamp : ts
      shuttle.sync(ts)
      shuttle.deposit = deposit
      if (shuttle.deposit) {
        shuttle.deposit.sync(ts)
        this.publishShuttleEvent(shuttle as ShuttleD)
      } else {
        this.unPublishShuttleEvent(shuttle.base.id)
      }
      ok(shuttle)
    })
  }

  async upDepositRate(sDepositId: string, timestamp: number): Promise<Deposit> {
    return this.makeRequest('up-deposit-rate-' + sDepositId, timestamp, (ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip upDepositRate ${sDepositId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      const deposit = this.minerService.Deposit(sDepositId)
      if (!deposit) {
        failed(new Error(`Invalid deposit ID ${sDepositId}`))
        return
      }
      deposit.sync(ts)
      deposit.rate *= 1.2
      ok(deposit)
    })
  }

  async upShuttleSpeed(sShuttleId: string, timestamp: number): Promise<Shuttle> {
    return this.makeRequest('up-shuttle-speed-' + sShuttleId, timestamp, (ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip upShuttleSpeed ${sShuttleId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      const shuttle = this.minerService.Shuttle(sShuttleId)
      if (!shuttle) {
        failed(new Error(`Invalid shuttle ID ${sShuttleId}`))
        return
      }
      shuttle.sync(ts)
      shuttle.speed *= 1.2
      shuttle.deposit && this.publishShuttleEvent(shuttle as ShuttleD)
      ok(shuttle)
    })
  }

  async upShuttleCapacity(sShuttleId: string, timestamp: number): Promise<Shuttle> {
    return this.makeRequest('up-shuttle-capacity-' + sShuttleId, timestamp, (ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip upShuttleCapacity ${sShuttleId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      const shuttle = this.minerService.Shuttle(sShuttleId)
      if (!shuttle) {
        failed(new Error(`Invalid shuttle ID ${sShuttleId}`))
        return
      }
      shuttle.sync(ts)
      shuttle.capacity = Math.floor(shuttle.capacity * 1.2)
      shuttle.deposit && this.publishShuttleEvent(shuttle as ShuttleD)
      ok(shuttle)
    })
  }

  publishShuttleEvent(shuttle: ShuttleD): Promise<ShuttleD> {
    let ts: number
    this.unPublishShuttleEvent(shuttle.base.id)
    if (shuttle.isReturned) {
      ts = shuttle.syncedAt + shuttle.position / shuttle.speed * 1000
      return this.makeRequest('unload-' + shuttle.base.id, ts, (ok, failed) => (err, _, isSkip) => {
        if (isSkip) {
          return
        }
        if (err) {
          failed(err)
          return
        }
        shuttle.deposit.sync(ts)
        shuttle.sync(ts)
        this.minerService.unloadShuttleResources(shuttle)
        this.publishShuttleEvent(shuttle)
        ok(shuttle)
      }, true)
    }

    ts = shuttle.syncedAt + (shuttle.deposit.base.position.y - shuttle.position) / shuttle.speed * 1000
    return this.makeRequest('load-' + shuttle.base.id, ts, (ok, failed) => (err, _, isSkip) => {
      if (isSkip) {
        return
      }
      if (err) {
        failed(err)
        return
      }
      shuttle.deposit.sync(ts)
      shuttle.sync(ts)
      this.minerService.loadShuttleResources(shuttle)
      this.publishShuttleEvent(shuttle)
      ok(shuttle)
    })
  }

  unPublishShuttleEvent(sShuttleId: string) {
    this.removeRequest('load-' + sShuttleId)
    this.removeRequest('unload-' + sShuttleId)
  }
}
