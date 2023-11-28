import { SyncService, TRenderAction } from "../../core/SyncProcessor"
import { WarehouseService } from "./warehouse.service"
import { syncProcessor } from "../../core"

export class WarehouseRender implements SyncService {
  readonly id = 'warehouse-render'
  constructor(private warehouseService: WarehouseService) { }
  sync(ts: number) {
    this.warehouseService.Resources().forEach(resource => resource.syncedAt < ts && (resource.syncedAt = ts))
  }

  register(callback: TRenderAction, uid = 'default') { return syncProcessor.register(this, callback, uid) }
  unregister(uid?: string) { syncProcessor.unregister(this, uid) }
}
