import { SyncProcessor } from "../core"
import { MinerService } from "../pool"


export class MinerRender implements SyncService {
  readonly id = 'miner-render'
  
  constructor(private syncProcessor: SyncProcessor, private minerService: MinerService) {}
  sync(ts: number) {
    this.minerService.Deposits().forEach(deposit => deposit.sync(ts))
    this.minerService.Shuttles().forEach(shuttle => shuttle.sync(ts))
  }

  register(callback: TRenderAction, uid?: string) { return this.syncProcessor.register(this, callback, uid) }
  unregister(uid?: string) { this.syncProcessor.unregister(this, uid) }
}
