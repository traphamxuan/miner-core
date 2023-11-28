import { SyncService, TRenderAction } from "../../core/SyncProcessor"
import { FactoryService } from "./factory.service"
import { syncProcessor } from "../../core"

export class FactoryRender implements SyncService {
  readonly id = 'factory-render'
  constructor(private factoryService: FactoryService) { }
  sync(ts: number) {
    this.factoryService.Machines().forEach(machine => machine.syncedAt < ts && machine.sync(ts))
  }

  register(callback: TRenderAction, uid = 'default') { return syncProcessor.register(this, callback, uid) }
  unregister(uid?: string) { syncProcessor.unregister(this, uid) }
}
