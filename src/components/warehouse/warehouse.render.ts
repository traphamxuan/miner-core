import { Engine } from "../../core"
import { SyncProcessor, SyncService, TRenderAction } from "../../core/SyncProcessor"
import { WarehouseService } from "./warehouse.service"

export class WarehouseRender implements SyncService {
  readonly id = 'warehouse-render'
  private syncProcessor: SyncProcessor
  constructor(engine: Engine, private warehouseService: WarehouseService) {
    this.syncProcessor = engine.sync
  }
  sync(ts: number) {
    this.warehouseService.Resources().forEach(resource => resource.syncedAt < ts && (resource.syncedAt = ts))
  }

  register(callback: TRenderAction, uid?: string) { return this.syncProcessor.register(this, callback, uid) }
  unregister(uid?: string) { this.syncProcessor.unregister(this, uid) }
}
