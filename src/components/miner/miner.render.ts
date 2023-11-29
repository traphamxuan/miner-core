import { syncProcessor } from "../../core"
import { SyncService, TRenderAction } from "../../core/SyncProcessor"
import { MinerService } from "./miner.service"


export class MinerRender implements SyncService {
  readonly id = 'miner-render'
  constructor(private minerService: MinerService) {
  }
  sync(ts: number) {
    this.minerService.Deposits().forEach(deposit => deposit.syncedAt < ts && deposit.sync(ts))
    this.minerService.Shuttles().forEach(shuttle => shuttle.syncedAt < ts && shuttle.sync(ts))
  }

  register(callback: TRenderAction, uid?: string) { return syncProcessor.register(this, callback, uid) }
  unregister(uid?: string) { syncProcessor.unregister(this, uid) }
}
