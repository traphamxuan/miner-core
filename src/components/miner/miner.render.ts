import { SyncService } from "../../core/SyncProcessor"
import { MinerService } from "./miner.service"
import { syncProcessor } from "../../core"

export class MinerRender implements SyncService {
  constructor(private minerService: MinerService) { }
  sync(ts: number) {
    this.minerService.Deposits().forEach(deposit => deposit.syncedAt < ts && deposit.sync(ts))
    this.minerService.Shuttles().forEach(shuttle => shuttle.syncedAt < ts && shuttle.sync(ts))
  }

  register(callback?: (ts: number) => void) {
    syncProcessor.register(this.minerService.id, this, callback)
  }
  unregister() { syncProcessor.unregister(this.minerService.id) }
}
