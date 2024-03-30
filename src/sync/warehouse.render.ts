import { SyncProcessor, SyncService, TRenderAction } from "./sync"
import { WarehouseService } from "../pool"

export class WarehouseRender implements SyncService {
  readonly id = 'warehouse-render'
  constructor(private syncProcessor: SyncProcessor, private warehouseService: WarehouseService) {}
  sync(ts: number) {
    this.warehouseService.Resources().forEach(resource => resource.syncedAt < ts && (resource.syncedAt = ts))
  }

  register(callback: TRenderAction, uid?: string) { return this.syncProcessor.register(this, callback, uid) }
  unregister(uid?: string) { this.syncProcessor.unregister(this, uid) }
}
