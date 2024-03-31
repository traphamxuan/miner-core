import { SyncProcessor } from "../core"
import { FactoryService } from "../pool"

export class FactoryRender implements SyncService {
  readonly id = 'factory-render'
  constructor(private syncProcessor: SyncProcessor, private factoryService: FactoryService) {}
  sync(ts: number) {
    this.factoryService.Machines().forEach(machine => machine.syncedAt < ts && machine.sync(ts))
  }

  register(callback: TRenderAction, uid?: string) { return this.syncProcessor.register(this, callback, uid) }
  unregister(uid?: string) { this.syncProcessor.unregister(this, uid) }
}
