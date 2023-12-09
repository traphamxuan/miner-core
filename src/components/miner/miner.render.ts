import { Engine } from "@/core"
import { SyncProcessor, SyncService, TRenderAction } from "../../core/SyncProcessor"
import { MinerService } from "./miner.service"


export class MinerRender implements SyncService {
  readonly id = 'miner-render'
  private syncProcessor: SyncProcessor
  constructor(engine: Engine, private minerService: MinerService) {
    this.syncProcessor = engine.sync
  }
  sync(ts: number) {
    this.minerService.Deposits().forEach(deposit => deposit.syncedAt < ts && deposit.sync(ts))
    this.minerService.Shuttles().forEach(shuttle => shuttle.syncedAt < ts && shuttle.sync(ts))
  }

  register(callback: TRenderAction, uid?: string) { return this.syncProcessor.register(this, callback, uid) }
  unregister(uid?: string) { this.syncProcessor.unregister(this, uid) }
}
