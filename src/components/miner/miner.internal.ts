import { ShuttleD } from "../../entities";
import { MinerService } from "./miner.service";
import { BaseInternalEvent } from "../../common/interfaces/BaseInternalEvent";
import type { Engine } from "@/core";

export class MinerInternalEvent extends BaseInternalEvent{
  constructor(
    engine: Engine,
    private minerService: MinerService,
  ) {
    super(engine.internal)
  }

  get id(): string { return this.minerService.id + '-internal' }

  updateMinerID(shuttleID: string, newShuttleID: string) {
    this.updateRequest(shuttleID, newShuttleID)
  }

  publishShuttleEvent(shuttle: ShuttleD): Promise<ShuttleD> {
    let ts: number
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
      })
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
}
