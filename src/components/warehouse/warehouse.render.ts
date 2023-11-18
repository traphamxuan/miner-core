import { SyncService } from "../../core/SyncProcessor"
import { WarehouseService } from "./warehouse.service"
import { syncProcessor } from "../../core"

export class WarehouseRender implements SyncService {
  constructor(private warehouseService: WarehouseService) {}
  sync(ts: number) {
    this.warehouseService.Resources().forEach(resource => resource.syncedAt < ts && (resource.syncedAt = ts))
  }

  register(callback?: (ts: number) => void) { syncProcessor.register(this.warehouseService.id, this, callback) }
  unregister() { syncProcessor.unregister(this.warehouseService.id) }
}
